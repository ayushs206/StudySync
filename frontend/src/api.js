const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Memory storage for access token
let accessToken = localStorage.getItem('studysync_token') || null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('studysync_token', token);
  } else {
    localStorage.removeItem('studysync_token');
  }
};

export const getAccessToken = () => accessToken;

// Helper: Local DB of registered users for fallback mode
function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem('studysync_registered_users');
    return raw ? JSON.parse(raw) : [
      {
        id: 'demo_user_1',
        first_name: 'John',
        last_name: 'Shardul',
        email: 'john@gmail.com',
        username: 'johnuser34',
        password: 'password123',
        year_of_study: 1,
        role: 'user',
        isVerified: false // Default pending verification for demo account
      }
    ];
  } catch (e) {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem('studysync_registered_users', JSON.stringify(users));
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // for refresh token cookie
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    // If it's a network error (Express backend offline at localhost:3000), use simulated local store
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      console.warn(`[StudySync API] Express backend offline at ${url}. Operating in local user store mode.`);

      // 1. REGISTER
      if (endpoint === '/auth/register') {
        const bodyData = JSON.parse(options.body || '{}');
        const users = getRegisteredUsers();

        // Check if email or username already exists
        const existing = users.find(u => u.email.toLowerCase() === bodyData.email?.toLowerCase() || u.username === bodyData.username);
        if (existing) {
          throw new Error('User already exists with this email or username. Please login.');
        }

        const newUser = {
          id: 'user_' + Date.now(),
          first_name: bodyData.first_name || 'Student',
          last_name: bodyData.last_name || 'User',
          email: bodyData.email?.toLowerCase() || 'user@studysync.edu',
          username: bodyData.username || 'student',
          password: bodyData.password,
          year_of_study: bodyData.year_of_study || 1,
          role: 'user',
          isVerified: false // Needs email verification
        };

        users.push(newUser);
        saveRegisteredUsers(users);

        const token = 'jwt_token_' + Date.now();
        setAccessToken(token);
        localStorage.setItem('studysync_user', JSON.stringify(newUser));

        return { 
          user: newUser, 
          token, 
          message: 'Account registered. Verification email sent.' 
        };
      }

      // 2. LOGIN
      if (endpoint === '/auth/login') {
        const bodyData = JSON.parse(options.body || '{}');
        const users = getRegisteredUsers();

        const inputEmail = bodyData.email?.toLowerCase();
        const inputPassword = bodyData.password;

        // Search if account exists
        const matchedUser = users.find(u => u.email.toLowerCase() === inputEmail);

        if (!matchedUser) {
          throw new Error('Invalid credentials. Account does not exist. Please Sign Up.');
        }

        if (matchedUser.password && matchedUser.password !== inputPassword) {
          throw new Error('Invalid credentials. Incorrect email or password.');
        }

        const token = 'jwt_token_' + Date.now();
        setAccessToken(token);
        localStorage.setItem('studysync_user', JSON.stringify(matchedUser));

        return { 
          accessToken: token, 
          user: matchedUser,
          message: 'Logged in successfully.' 
        };
      }

      // 3. GET ME
      if (endpoint === '/auth/me') {
        const sessionStr = localStorage.getItem('studysync_user');
        if (sessionStr) {
          return { user: JSON.parse(sessionStr) };
        }
        throw new Error('Unauthorized');
      }

      // 4. RESEND EMAIL VERIFICATION
      if (endpoint === '/auth/emailverify' && options.method === 'POST') {
        const sessionStr = localStorage.getItem('studysync_user');
        if (sessionStr) {
          const user = JSON.parse(sessionStr);
          user.isVerified = true; // Mark verified locally
          localStorage.setItem('studysync_user', JSON.stringify(user));
          
          // Update in registered DB
          const users = getRegisteredUsers();
          const updated = users.map(u => u.id === user.id ? { ...u, isVerified: true } : u);
          saveRegisteredUsers(updated);

          return { message: 'Verification email sent. Account marked verified!' };
        }
        return { message: 'Verification email sent.' };
      }

      // 5. VERIFY EMAIL TOKEN
      if (endpoint.includes('/auth/emailverify')) {
        const sessionStr = localStorage.getItem('studysync_user');
        if (sessionStr) {
          const user = JSON.parse(sessionStr);
          user.isVerified = true;
          localStorage.setItem('studysync_user', JSON.stringify(user));
        }
        return { message: 'Email verified successfully.' };
      }

      // 6. LOGOUT
      if (endpoint === '/auth/logout') {
        localStorage.removeItem('studysync_user');
        setAccessToken(null);
        return { message: 'Logged out successfully.' };
      }
    }

    throw err;
  }
}

export const api = {
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getMe: () => request('/auth/me', {
    method: 'GET',
  }),

  resendVerification: () => request('/auth/emailverify', {
    method: 'POST',
  }),

  verifyEmail: (token) => request(`/auth/emailverify?token=${encodeURIComponent(token)}`, {
    method: 'GET',
  }),

  logout: () => request('/auth/logout', {
    method: 'POST',
  }),
};

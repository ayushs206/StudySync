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

    // If the server refreshed the token (sent in Authorization header), save it
    const authHeader = response.headers.get('Authorization') || response.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const newToken = authHeader.substring(7);
      setAccessToken(newToken);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('StudySync backend server is offline or unreachable. Please ensure the Express server is running.');
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

  forgotPassword: (email) => request('/auth/forgot_password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  resetPassword: (token, newPassword) => request(`/auth/reset_password?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    body: JSON.stringify({ new_password: newPassword }),
  }),
};

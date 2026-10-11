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

  getTasks: () => request('/tasks', {
    method: 'GET',
  }),

  createTask: (taskData) => request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  
  updateTask: (taskId, taskData) => request(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(taskData),
  }),
  getTaskbyId: (taskId) => request(`/tasks/${taskId}`, {
    method: 'GET',
  }),
  deleteTask: (taskId) => request(`/tasks/${taskId}`, {
    method: 'DELETE',
  }),

  forgotPassword: (email) => request('/auth/forgot_password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  resetPassword: (token, newPassword) => request(`/auth/reset_password?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    body: JSON.stringify({ new_password: newPassword }),
  }),

  //NOTES
  createNote: (noteData) => request('/notes', {
    method: 'POST',
    body: JSON.stringify(noteData),
  }),
  getNotes: () => request('/notes', {
    method: 'GET',
  }),
  getNoteById: (noteId) => request(`/notes/${noteId}`, {
    method: 'GET',
  }), 
  updateNote: (noteId, noteData) => request(`/notes/${noteId}`, {
    method: 'PATCH',
    body: JSON.stringify(noteData),
  }),
  deleteNote: (noteId) => request(`/notes/${noteId}`, {
    method: 'DELETE',
  }),
  // TIMETABLE & ATTENDANCE
  getBatches: () => request('/attendance/batches', {
    method: 'GET',
  }),
  getElectives: (batch) => request(`/attendance/electives${batch ? `?batch=${encodeURIComponent(batch)}` : ''}`, {
    method: 'GET',
  }),
  selectBatch: (batchData) => request('/attendance/batch', {
    method: 'POST',
    body: JSON.stringify(batchData),
  }),
  getTodayTimetable: (date) => request(`/attendance/timetable${date ? `/${date}` : ''}`, {
    method: 'GET',
  }),
  getWeeklyTimetable: () => request('/attendance/weekly', {
    method: 'GET',
  }),
  markAttendance: (attendanceData) => request('/attendance/mark', {
    method: 'POST',
    body: JSON.stringify(attendanceData),
  }),
  getAttendanceStats: () => request('/attendance/stats', {
    method: 'GET',
  }),

  // SUBJECTS
  getSubjects: () => request('/subjects', {
    method: 'GET',
  }),
  createSubject: (subjectData) => request('/subjects', {
    method: 'POST',
    body: JSON.stringify(subjectData),
  }),
  updateSubject: (id, subjectData) => request(`/subjects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(subjectData),
  }),
  deleteSubject: (id) => request(`/subjects/${id}`, {
    method: 'DELETE',
  }),

  // USER
  updateUser: (userData) => request('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  createEvent:(eventData)=>request('/events',{
    method:'POST',
    body: JSON.stringify(eventData),
  }),
  getEvents:()=>request('/events',{
    method:'GET',
  }),
  getEventById:(eventId)=>request(`/events/${eventId}`,{
    method:'GET',
  }),
  updateEvent:(eventId,eventData)=>request(`/events/${eventId}`,{
    method:'PATCH',
    body: JSON.stringify(eventData),
  }),
  deleteEvent:(eventId)=>request(`/events/${eventId}`,{
    method:'DELETE',
  }),
  
};

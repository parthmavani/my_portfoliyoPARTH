const BASE_URL = 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const registerUser = (userData) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }).then(res => res.json());

export const loginUser = (userData) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }).then(res => res.json());

export const getMe = () =>
  fetch(`${BASE_URL}/auth/me`, {
    headers: getAuthHeaders()
  }).then(res => {
    if (res.status === 401) throw new Error('Unauthorized');
    return res.json();
  });

export const getTasks = () => 
  fetch(`${BASE_URL}/tasks`, { headers: getAuthHeaders() }).then(res => {
    if (res.status === 401) throw new Error('Unauthorized');
    return res.json();
  });

export const createTask = (task) => 
  fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(task)
  }).then(res => {
    if (res.status === 401) throw new Error('Unauthorized');
    return res.json();
  });

export const updateTask = (id, task) =>
  fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(task)
  }).then(res => {
    if (res.status === 401) throw new Error('Unauthorized');
    return res.json();
  });

export const deleteTask = (id) =>
  fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  }).then(res => {
    if (res.status === 401) throw new Error('Unauthorized');
    return res.json();
  });

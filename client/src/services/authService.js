const API_URL = import.meta.env.VITE_API_URL + '/auth/';

const login = async (email, password) => {
  const response = await fetch(`${API_URL}login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  if (data.token) {
    localStorage.setItem('adminToken', JSON.stringify(data));
  }

  return data;
};

const logout = () => {
  localStorage.removeItem('adminToken');
};

const getMe = async (token) => {
  const response = await fetch(`${API_URL}me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  return response.json();
};

const authService = {
  login,
  logout,
  getMe,
};

export default authService;

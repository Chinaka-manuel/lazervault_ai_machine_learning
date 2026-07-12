import api from './api';

export const authApi = {
  register: (payload: any) => api.post('/auth/register', payload),
  login: (payload: any) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  social: (payload: any) => api.post('/auth/social', payload),
  updateProfile: (payload: any) => api.patch('/profile', payload),
};

import api from './api';

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  users: (params: Record<string, any> = {}) => api.get('/admin/users', { params }),
  createUser: (payload: any) => api.post('/admin/users', payload),
  updateUser: (id: string, payload: any) => api.put(`/admin/users/${id}`, payload),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  products: (params: Record<string, any> = {}) => api.get('/admin/products', { params }),
  orders: (params: Record<string, any> = {}) => api.get('/admin/orders', { params }),
  coupons: () => api.get('/admin/coupons'),
  createCoupon: (payload: any) => api.post('/admin/coupons', payload),
  announce: (payload: any) => api.post('/admin/announcements', payload),
  analytics: (days = 30) => api.get('/analytics/overview', { params: { days } }),
};

export const instructorApi = {
  analytics: () => api.get('/analytics/instructor'),
  createProduct: (payload: any) => api.post('/products', payload),
  categories: () => api.get('/categories'),
};

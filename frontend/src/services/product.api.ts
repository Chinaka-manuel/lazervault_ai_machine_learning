import api from './api';

export const productApi = {
  list: (params: Record<string, any> = {}) =>
    api.get('/products', { params }),
  featured: () => api.get('/products/featured'),
  detail: (id: string) => api.get(`/products/${id}`),
  create: (payload: any) => api.post('/products', payload),
  update: (id: string, payload: any) => api.put(`/products/${id}`, payload),
  remove: (id: string) => api.delete(`/products/${id}`),
  categories: () => api.get('/categories'),
  reviews: (id: string) => api.get(`/products/${id}/reviews`),
  addReview: (id: string, payload: any) => api.post(`/products/${id}/reviews`, payload),
};

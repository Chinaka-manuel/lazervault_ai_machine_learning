import api from './api';

export const commerceApi = {
  getCart: () => api.get('/cart'),
  addToCart: (productId: string, quantity = 1) => api.post('/cart', { productId, quantity }),
  removeFromCart: (id: string) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (code: string) => api.post('/cart/coupon', { code }),
  getWishlist: () => api.get('/wishlist'),
  toggleWishlist: (productId: string) => api.post('/wishlist', { productId }),
  createOrder: (payload: any) => api.post('/orders', payload),
  myOrders: (params: Record<string, any> = {}) => api.get('/orders', { params }),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  verifyPayment: (reference: string) => api.get('/payments/verify', { params: { reference } }),
  myDownloads: () => api.get('/downloads'),
  requestDownload: (id: string) => api.get(`/downloads/${id}`),
};

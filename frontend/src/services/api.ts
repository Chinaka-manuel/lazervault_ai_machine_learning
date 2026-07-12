import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    if (error.response?.status >= 500) {
      toast.error(message);
    }
    return Promise.reject(new Error(message));
  },
);

export default api;

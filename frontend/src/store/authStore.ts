import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  bio?: string;
  isEmailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  clear: () => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,
      setAuth: (user, token) => set({ user, token }),
      updateUser: (user) => set({ user }),
      clear: () => set({ user: null, token: null }),
      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, loading: false });
        } catch {
          set({ user: null, token: null, loading: false });
        }
      },
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          /* ignore */
        }
        set({ user: null, token: null });
      },
    }),
    { name: 'lazervault-auth', partialize: (s) => ({ user: s.user, token: s.token }) },
  ),
);

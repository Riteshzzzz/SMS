import { create } from 'zustand';
import api from '@/lib/api';
interface AuthState { isAuthenticated: boolean; login: (u: string, p: string) => Promise<void>; logout: () => void; }
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('access_token') : false,
  login: async (username, password) => { const r = await api.post('/auth/login/', { username, password }); localStorage.setItem('access_token', r.data.access); localStorage.setItem('refresh_token', r.data.refresh); set({ isAuthenticated: true }); },
  logout: () => { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); set({ isAuthenticated: false }); },
}));

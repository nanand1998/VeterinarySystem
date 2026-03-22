import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // Basic user info
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  setAuth: (user, token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    set({ user, token, role });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ user: null, token: null, role: null });
  }
}));

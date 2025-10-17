import { create } from 'zustand';

const getInitialAuthState = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  const storedUser = window.localStorage.getItem('annotator:user');
  const storedToken = window.localStorage.getItem('annotator:token');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null
  };
};

const useAuthStore = create((set) => ({
  ...getInitialAuthState(),
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('annotator:user', JSON.stringify(user));
      window.localStorage.setItem('annotator:token', token);
    }

    set({ user, token });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('annotator:user');
      window.localStorage.removeItem('annotator:token');
    }

    set({ user: null, token: null });
  }
}));

export default useAuthStore;

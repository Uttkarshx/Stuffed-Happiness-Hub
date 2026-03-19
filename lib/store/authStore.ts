import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../types';
import { loginUser, signupUser, getMe } from '../api';

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const maybeError = error as { response?: { data?: { message?: string } } };
    if (maybeError.response?.data?.message) {
      return maybeError.response.data.message;
    }
  }
  return fallback;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateProfile: (name: string) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginUser(email, password);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = getApiErrorMessage(error, 'Login failed. Please try again.');
          set({
            error: message,
            isLoading: false,
          });
          throw new Error(message);
        }
      },

      signup: async (name: string, email: string, phone: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await signupUser(name, email, phone, password);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = getApiErrorMessage(error, 'Signup failed. Please try again.');

          set({
            error: message,
            isLoading: false,
          });
          throw new Error(message);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      updateProfile: (name: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, name },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await getMe();
          set({
            user: response.user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Auth token validation failed:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      isAdmin: () => {
        return get().user?.role === 'admin';
      },
    }),
    {
      name: 'auth-store',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

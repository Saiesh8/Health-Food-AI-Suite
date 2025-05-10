import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock validation
          if (email === "test@example.com" && password === "password") {
            const user: User = {
              id: "1",
              email,
              name: "Test User",
              preferences: {
                dietType: "non-vegetarian",
                weightGoal: "maintain",
                allergies: [],
                healthConditions: [],
              },
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ error: "Invalid email or password", isLoading: false });
          }
        } catch (error) {
          set({ error: "Login failed. Please try again.", isLoading: false });
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const user: User = {
            id: Date.now().toString(),
            email,
            name,
            preferences: {
              dietType: "non-vegetarian",
              weightGoal: "maintain",
              allergies: [],
              healthConditions: [],
            },
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: "Signup failed. Please try again.", isLoading: false });
        }
      },

      logout: () => {
        // Clear all auth state
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

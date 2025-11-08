// lib/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// Важливо: Припускаємо, що User - це тип, який повертає API,
// і він є підмножиною або ідентичний AuthUser.
// Якщо AuthUser - це User | null, ми його замінимо.
import { User } from '@/types/user';

// Ми повинні дозволити стану бути User або null
// Якщо у вас немає окремого типу AuthUser, використовуйте User
interface AuthState {
  isAuthenticated: boolean;
  // ВИПРАВЛЕНО: user має бути User | null
  user: User | null; 
}

interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  // ВИПРАВЛЕНО: setUser має приймати User, не AuthUser
  setUser: (user: User) => void; 
}

// Об'єднуємо інтерфейси
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // СТАН
      // ВИПРАВЛЕНО: user має бути null за замовчуванням
      user: null, 
      isAuthenticated: false,

      // ДІЇ
      login: (user) =>
        set({
          user: user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null, // має бути null
          isAuthenticated: false,
        }),
      
      // ВИПРАВЛЕНО:setUser має правильно оновлювати user
      setUser: (user) => set({ user: user }),
      
      // ВИДАЛЕНО: setIsAuthenticated, оскільки воно керується login/logout
    }),
    {
      // КОНФІГУРАЦІЯ PERSIST
      name: 'auth-storage',
      // ВАЖЛИВО: Явно вказуємо storage для Next.js
      storage: createJSONStorage(() => localStorage), 
      // Додатково: Обмежуємо поля для збереження (гарна практика)
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
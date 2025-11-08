// src/components/AuthNavigation/AuthNavigation.tsx
'use client'; 

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore'; // Ваш Zustand store
import { logout as apiLogout } from '@/lib/api/clientApi'; // Функція виходу з API
import css from './AuthNavigation.module.css'; // Ваш файл стилів

export default function AuthNavigation() {
  // Отримуємо стан та дії зі стору
  const { isAuthenticated, user, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Викликаємо API для видалення cookie на бекенді
      await apiLogout();
      
    } catch (error) {
      console.error('Logout failed on API side:', error);
      // Продовжуємо, навіть якщо API-вихід не вдався (наприклад, через відсутність мережі),
      // щоб очистити локальний стан.
    } finally {
      // 2. Очищуємо локальний стан Zustand
      storeLogout(); 
      // 3. Редірект на сторінку входу
      router.push('/sign-in'); 
    }
  };

  // --- 1. АВТОРИЗОВАНИЙ СТАН ---
  if (isAuthenticated && user) {
    return (
      <nav className={css.navigationItem}>
        {/* ПОСИЛАННЯ НА ПРОФІЛЬ: Використовуйте Link і переконайтеся, що href="/profile" */}
        <Link href="/profile" className={css.userEmail}> 
          {/* Відображаємо email, як ви і бачили */}
          {user.email}
        </Link>
        <button 
          onClick={handleLogout} 
          className={css.logoutButton}
          type="button"
        >
          Log Out
        </button>
      </nav>
    );
  }

  // --- 2. НЕАВТОРИЗОВАНИЙ СТАН ---
  return (
    <nav className={css.navigationItem}>
      <Link href="/sign-in" className={css.navigationLink}>
        Login
      </Link>
      <Link
        href="/sign-up"
        className={css.navigationLink}
        style={{ marginLeft: '1rem' }}
      >
        Sign up
      </Link>
    </nav>
  );
}
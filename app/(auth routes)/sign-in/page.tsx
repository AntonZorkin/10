'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/clientApi'; // Ваша функція входу
import { useAuthStore } from '@/lib/store/authStore'; // Ваш Zustand store
import Link from 'next/link';
import css from './SignInPage.module.css';

export default function SignInPage() {
  const router = useRouter();
  const authLogin = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData);
      authLogin(user);

      // --- ВИПРАВЛЕННЯ: АГРЕСИВНИЙ РЕДІРЕКТ З ОНОВЛЕННЯМ РОУТЕРА ---
      
      // 1. Примусове оновлення маршрутизатора Next.js.
      // Це змушує Next.js виконати запит до Middleware з новими cookie.
      router.refresh(); 

      // 2. Агресивний перехід через 50 мс.
      // Це дає час для обробки `router.refresh()` і гарантує, що сторінка 
      // Профілю завантажиться, якщо Middleware її дозволив.
      setTimeout(() => {
        // Ми використовуємо window.location.href, тому що він є найбільш
        // надійним способом ініціювати повне оновлення сторінки з редіректом.
        window.location.href = '/profile';
      }, 50); 
      
    } catch (err: any) {
      // Обробка помилок
      const errorMessage =
        err.response?.data?.message ||
        'Помилка входу. Перевірте email та пароль.';
      setError(errorMessage);
      setLoading(false); 
    } 
  };

  return (
    <main className={css.mainContent}>
      <div className={css.form}>
        <h1 className={css.formTitle}>Sign In</h1>

        <form onSubmit={handleSubmit}>
          {/* Поле Email */}
          <div className={css.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              className={css.input}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Поле Password */}
          <div className={css.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              className={css.input}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Відображення помилки */}
          {error && <p className={css.error}>{error}</p>}

          <div
            className={css.actions}
            style={{ justifyContent: 'center', marginTop: '16px' }}
          >
            <button type="submit" className={css.submitButton} disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          Don't have an account?{' '}
          <Link href="/sign-up" className={css.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
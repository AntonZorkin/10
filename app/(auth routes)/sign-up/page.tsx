// app/(auth routes)/sign-up/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import css from './SignUpPage.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

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
      const user = await register(formData);
      login(user);
      router.push('/profile');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.form}>
        <h1 className={css.formTitle}>Sign Up</h1>

        <form onSubmit={handleSubmit}>
          {/* Поле Username */}
          {/* <div className={css.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              className={css.input}
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div> */}
 
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

          <div className={css.actions}>
            <button
              type="submit"
              className={css.submitButton}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className={css.signupText}>
          Already have an account?{' '}
          <Link href="/sign-in" className={css.link}>
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

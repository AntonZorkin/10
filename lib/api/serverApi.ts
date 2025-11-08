// lib/api/serverApi.ts (ВИПРАВЛЕНО)

import { cookies } from 'next/headers'; // Функція для взаємодії з cookies на сервері
import axios from 'axios';
// Припускаємо, що api - це ваш інстанс axios, який ви використовуєте
import { api } from './api';
import { User } from '@/types/user';

// ... (інші функції та імпорти)

// Функція для отримання даних користувача
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/users/me');
    return response.data;
  } catch (error) {
    const isAuthError =
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403);

    // --- КЛЮЧОВЕ ВИПРАВЛЕННЯ ---
    if (isAuthError) {
      // 1. Якщо токен недійсний/прострочений (401/403), видаляємо cookie.
      // Це перериває цикл, оскільки наступний запит до middleware не знайде токен.
      try {
        (await cookies()).delete('accessToken');
        console.log('Deleted expired accessToken cookie.');
      } catch (cookieError) {
        // Ловимо помилку, якщо cookies().delete не може бути викликаний у цьому контексті
        console.error(
          'Failed to delete accessToken cookie on server side.',
          cookieError,
        );
      }

      // 2. Викидаємо помилку, щоб ProfilePage міг її зловити
      // і примусово перенаправити користувача на сторінку входу.
      throw new Error('Unauthorized or Forbidden due to Invalid Token.');
    }
    // ----------------------------

    throw error;
  }
};

// ... (інші функції)

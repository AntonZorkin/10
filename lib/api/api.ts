// lib/api/api.ts

import axios from 'axios';

// 1. ПЕРЕВІРКА: Отримуємо базовий URL з env.local
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

export const api = axios.create({
  baseURL: BASE_URL,

  // withCredentials: true, 

  timeout: 10000, 
});
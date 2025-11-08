// src/components/Header/Header.tsx
'use client'; 

import Link from 'next/link';
import css from './Header.module.css';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import { useAuthStore } from '@/lib/store/authStore'; // Імпортуємо стор

export default function Header() {
  const { isAuthenticated } = useAuthStore(); // Отримуємо стан авторизації

  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          
          {/* --- ВИПРАВЛЕННЯ: УМОВНЕ ВІДОБРАЖЕННЯ NOTES --- */}
          {isAuthenticated && (
            <li>
              <Link href="/notes/filter/all">Notes</Link>
            </li>
          )}
          {/* ------------------------------------------- */}
        </ul>
      </nav>
      <AuthNavigation /> 
    </header>
  );
}
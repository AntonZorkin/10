'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User } from '@/types/user'; 
import { useAuthStore } from '@/lib/store/authStore';
import { patchUser } from '@/lib/api/clientApi'; 
import css from './EditProfilePage.module.css';


interface EditProfileFormProps {
  initialUser: User;
}

export default function EditProfileForm({ initialUser }: EditProfileFormProps) {
  const router = useRouter();
  const { setUser } = useAuthStore();
  
  const [username, setUsername] = useState(initialUser.username);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = () => {
    router.push('/profile');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (username === initialUser.username) {
      setError('Username was not changed.');
      setLoading(false);
      return;
    }

    try {
      const updatedUser = await patchUser({ username });     
      setUser(updatedUser);       
      router.push('/profile');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        
        {/* Аватар (без можливості редагування) */}
        <Image
          src={initialUser.avatar}
          alt={`Аватар ${initialUser.username}`}
          width={120}
          height={120}
          className={css.avatar}
        />

        {error && <p className={css.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={css.profileInfo}>
          {/* Поле Username (редаговане) */}
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username</label>
            <input
              className={css.input}
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Email (нередагований) */}
          <div className={css.usernameWrapper}>
            <label>Email</label>
            <p>{initialUser.email}</p> 
          </div>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button 
              type="button" 
              onClick={handleCancel} 
              className={css.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
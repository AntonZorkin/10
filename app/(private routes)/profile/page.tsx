// app/(private routes)/profile/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';


export default async function ProfilePage() {
  let user: Awaited<ReturnType<typeof getCurrentUser>>;

  try {

    user = await getCurrentUser();
  } catch (error) {

    console.error("Failed to fetch user in ProfilePage, token likely invalid or expired. Redirecting to sign-in.", error);

    redirect('/sign-in');
  }

  if (!user) {
    redirect('/sign-in');
  }
  
  const avatarSize = 128;
  const userUsername = user.username || 'Користувач NoteHub';

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile / {userUsername}</h1>
          <Link href="/profile/edit" className={css.editButton}>
            edit
          </Link>
        </div>

        {/* 3. Відображення аватара за допомогою next/Image */}
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar} // Припускаємо, що avatar - це URL
            alt="User Avatar"
            width={avatarSize}
            height={avatarSize}
            className={css.avatar}
          />
        </div>

        {/* 4. Відображення інформації */}
        <div className={css.profileInfo}>
          <div className={css.infoGroup}>
            <label className={css.infoLabel}>Username:</label>
            <p className={css.infoValue}>{userUsername}</p>
          </div>
          <div className={css.infoGroup}>
            <label className={css.infoLabel}>Email:</label>
            <p className={css.infoValue}>{user.email}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
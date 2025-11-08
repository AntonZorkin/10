import Link from 'next/link';
import css from './page.module.css'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | NoteHub',
  description: 'The page you’re looking for doesn’t exist or was moved. Go back to the homepage',

  openGraph: {
    title: `404 — Page Not Found | NoteHub`,
    description: 'The page you’re looking for doesn’t exist or was moved. Go back to the homepage',
    url: `https://08-zustand-nine-gamma.vercel.app/`,
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: `NoteHub image`,
      },
    ],
    type: 'website',
  },
};

const NotFound = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/">Go back home</Link>
    </div>
  );
};

export default NotFound;

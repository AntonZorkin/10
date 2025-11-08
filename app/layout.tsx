import './globals.css';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import { Metadata } from 'next';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
});


export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Service for creating and storing notes',

  openGraph: {
    title: `NoteHub`,
    description: 'Service for creating and storing notes',
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

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          <main className="content">
            {children}
            {modal}
          </main>
          <Footer />
          <Toaster position="top-center" />
        </TanStackProvider>
      </body>
    </html>
  );
}

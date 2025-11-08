import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug?.[0] ?? 'all';
  const label = filter === 'all' ? 'All notes' : `Tag: ${filter}`;
  
  const description = filter === 'all'
    ? 'Browse all your saved notes in one place.'
    : `Browse notes tagged with "${filter}".`;
  
  return {
    title: `NoteHub — ${label}`,
    description,
    openGraph: {
      title: `NoteHub — ${label}`,
      description,
      url: `https://08-zustand-nine-gamma.vercel.app/notes/filter/${filter}`,
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
}

const INITIAL_PAGE = 1;
const INITIAL_PER_PAGE = 12;
const INITIAL_SEARCH = '';

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0]?.toLowerCase() === 'all' ? undefined : slug?.[0];

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['notes', INITIAL_PAGE, INITIAL_PER_PAGE, INITIAL_SEARCH, tag],
      queryFn: () =>
        fetchNotes({
          page: INITIAL_PAGE,
          perPage: INITIAL_PER_PAGE,
          search: INITIAL_SEARCH,
          tag,
        }),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Could not fetch the list of notes. ${message}`);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        tag={tag}
      />
    </HydrationBoundary>
  );
}

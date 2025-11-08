import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({params,}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  const title = note?.title?.trim() || 'Note';
  const description = ((note?.content ?? '').trim()).slice(0, 100);
  return {
    title: `Note: ${title}`,
    description,
    openGraph: {
      title: `Note: ${title}`,
      description,
      url: `https://08-zustand-nine-gamma.vercel.app/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
    },
  };
}

const NoteDetails = async ({ params }: PageProps) => {
  const queryClient = new QueryClient();

  const { id } = await params;

  try {
    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Could not fetch the note. ${message}`);
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};
export default NoteDetails;

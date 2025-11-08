'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import { useRouter } from 'next/navigation';
import css from './NotePreview.module.css';

type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false
  });

  if (isLoading) return <Modal>Loading note...</Modal>;
  if (isError || !note)
    return <Modal>Error loading note. Try again later.</Modal>;

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        {note.tag && <p className={css.tag}>Tag: {note.tag}</p>}
        {note.createdAt && (
          <p className={css.date}>
            Created: {new Date(note.createdAt).toLocaleString()}
          </p>
        )}
        <button className={css.backBtn} type='button' onClick={() => router.back()}>
          Close
        </button>
      </div>
    </Modal>
  );
}

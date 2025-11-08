'use client';
import css from './NotesPage.module.css';
import { useState, useEffect } from 'react';
import { fetchNotes, type NotesHttpResponse } from '@/lib/api';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { useDebounce } from 'use-debounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface NotesClientProps {
  tag?: string;
}

const INITIAL_PAGE = 1;
const PER_PAGE = 12;
const INITIAL_SEARCH = '';

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [searchNote, setSearchNote] = useState(INITIAL_SEARCH);
  const [debouncedSearch] = useDebounce(searchNote, 500);

  useEffect(() => {
    setCurrentPage(INITIAL_PAGE);
  }, [tag]);

  const { data, isLoading, isError } = useQuery<NotesHttpResponse>({
    queryKey: ['notes', currentPage, debouncedSearch, tag, PER_PAGE],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: PER_PAGE,
        search: debouncedSearch.trim(),
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const handleChange = (query: string) => {
    setCurrentPage(INITIAL_PAGE);
    setSearchNote(query);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchNote} onChange={handleChange} />

        {notes.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {notes.length > 0 && <NoteList notes={notes} />}
      {!isLoading && !isError && notes.length === 0 && (
        <p className={css.empty}>No notes found.</p>
      )}
    </div>
  );
}

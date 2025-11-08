import axios from 'axios';
import type { NewNote, Note } from '@/types/note';

export interface NotesHttpResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<NotesHttpResponse> => {
  const params:FetchNotesParams={
    page,
    perPage,
    search,
};
    if (tag && tag !== 'All') {
    params.tag = tag;
  }
  const response = await axios.get<NotesHttpResponse>(
    `https://notehub-public.goit.study/api/notes`,
    {
      params,
      headers: { Authorization: `Bearer ${myKey}` },
    },
  );
  const data = response.data;

  return data;
};
export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response = await axios.post<Note>(
    `https://notehub-public.goit.study/api/notes`,
    newNote,
    {
      headers: { Authorization: `Bearer ${myKey}` },
    },
  );
  const data = response.data;

  return data;
};
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: { Authorization: `Bearer ${myKey}` },
    },
  );
  const data = response.data;

  return data;
};
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: { Authorization: `Bearer ${myKey}` },
    },
  );
  const data = response.data;

  return data;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const getCategories = async () => {
  const res = await axios<Category[]>('/categories');
  return res.data;
};

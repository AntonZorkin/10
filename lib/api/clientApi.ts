// lib/api/clientApi.ts
import { api } from './api';
import { NewNote, Note } from '@/types/note';
import { User } from '@/types/user';

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface NotesHttpResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export const register = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const patchUser = async (data: { username: string }): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};

export const fetchNotes = async (
  { page, perPage, search, tag }: FetchNotesParams,
  headers?: Record<string, string>,
): Promise<NotesHttpResponse> => {
  const params: FetchNotesParams = {
    page,
    perPage,
    search,
  };

  if (tag && tag !== 'All') {
    params.tag = tag;
  }

  const response = await api.get<NotesHttpResponse>('/notes', {
    params,
    headers,
  });

  return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response = await api.post<Note>('/notes', newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>('/categories');
  return res.data;
};

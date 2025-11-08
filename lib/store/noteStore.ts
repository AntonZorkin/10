import { NewNote } from '@/types/note';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DraftProp = {
  draft: NewNote;
  setDraft: (note: NewNote) => void;
  clearDraft: () => void;
};

const initialDraft: NewNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<DraftProp>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);

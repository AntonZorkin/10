'use client';

import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import type { NewNote, Note } from '../../types/note';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';

const NoteForm = ({}) => {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<Note, AxiosError, NewNote>({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft()
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note added');
      router.back();
    },

    onError: (err) => {
      const msg =
        (err.response?.data as { message?: string })?.message ||
        err.message ||
        'Something went wrong';
      toast.error(msg);
    },
  });

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (formData: FormData) => {
    const title = (formData.get('title') as string).trim();
    const content = (formData.get('content') as string).trim();
    const tag = formData.get('tag') as NewNote['tag'];
    if (title.length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }

    mutate({ title, content, tag });
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <fieldset disabled={isPending}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            defaultValue={draft?.title} onChange={handleChange}
            className={css.input}
            required
            minLength={3}
            maxLength={50}
            placeholder="Enter title…"
            autoFocus
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            defaultValue={draft?.content} onChange={handleChange}
            rows={8}
            className={css.textarea}
            placeholder="Optional text…"
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <select
            id="tag"
            name="tag"
            defaultValue={draft?.tag} onChange={handleChange}
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>
      </fieldset>

      <div className={css.actions}>
        <button
          onClick={handleCancel}
          type="button"
          className={css.cancelButton}
          disabled={isPending}
        >
          Cancel
        </button>

        {isPending && <Loader />}

        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;

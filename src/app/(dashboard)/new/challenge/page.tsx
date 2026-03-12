'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CHALLENGE_STATUSES, STATUS_CONFIG } from '@/lib/constants';

export default function NewChallengePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('mapping');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be signed in.');
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('challenges').insert({
      title,
      description,
      status,
      created_by: user.id,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push('/challenges');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">New Challenge</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border-light rounded-[var(--radius-lg)] p-6 flex flex-col gap-4"
      >
        <Input
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name this design challenge"
          required
        />
        <Textarea
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the challenge, its scope, and what you hope to achieve..."
          className="min-h-[160px]"
          required
        />
        <Select
          id="status"
          label="Starting Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={CHALLENGE_STATUSES.map((s) => ({
            value: s,
            label: STATUS_CONFIG[s].label,
          }))}
        />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-[var(--radius-sm)]">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Challenge'}
          </Button>
        </div>
      </form>
    </div>
  );
}

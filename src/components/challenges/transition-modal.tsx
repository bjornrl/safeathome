'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { STATUS_CONFIG } from '@/lib/constants';
import type { ChallengeStatus } from '@/lib/types/database';

interface TransitionModalProps {
  challengeId: string;
  fromStatus: ChallengeStatus;
  toStatus: ChallengeStatus;
  open: boolean;
  onClose: () => void;
  onTransitioned: () => void;
}

export function TransitionModal({
  challengeId,
  fromStatus,
  toStatus,
  open,
  onClose,
  onTransitioned,
}: TransitionModalProps) {
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const fromConfig = STATUS_CONFIG[fromStatus];
  const toConfig = STATUS_CONFIG[toStatus];
  const isAdvancing = Object.keys(STATUS_CONFIG).indexOf(toStatus) > Object.keys(STATUS_CONFIG).indexOf(fromStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError('Please write a summary of this stage before transitioning.');
      return;
    }
    setError('');
    setSubmitting(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Insert transition record
    const { error: transitionError } = await supabase
      .from('challenge_transitions')
      .insert({
        challenge_id: challengeId,
        from_status: fromStatus,
        to_status: toStatus,
        summary: summary.trim(),
        transitioned_by: user.id,
      });

    if (transitionError) {
      setError(transitionError.message);
      setSubmitting(false);
      return;
    }

    // Update challenge status
    const { error: updateError } = await supabase
      .from('challenges')
      .update({ status: toStatus })
      .eq('id', challengeId);

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSummary('');
    onTransitioned();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border-light shadow-xl w-full max-w-lg">
          <form onSubmit={handleSubmit}>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold">Stage Transition</h2>
                <button type="button" onClick={onClose} className="text-text-muted hover:text-text text-xl cursor-pointer">&times;</button>
              </div>

              {/* Transition direction */}
              <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-surface-alt">
                <span
                  className="px-2.5 py-1 text-xs font-medium rounded-[var(--radius-sm)]"
                  style={{ color: fromConfig.color, backgroundColor: fromConfig.bg }}
                >
                  {fromConfig.label}
                </span>
                <span className="text-text-muted">→</span>
                <span
                  className="px-2.5 py-1 text-xs font-medium rounded-[var(--radius-sm)]"
                  style={{ color: toConfig.color, backgroundColor: toConfig.bg }}
                >
                  {toConfig.label}
                </span>
              </div>

              <Textarea
                id="summary"
                label={`Summary of the ${fromConfig.label} stage`}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={`What was learned, produced, or decided during ${fromConfig.label}? This becomes part of the challenge's history.`}
                className="min-h-[140px]"
                required
              />

              {!isAdvancing && (
                <p className="text-xs text-text-muted bg-surface-alt p-2 rounded-[var(--radius-sm)]">
                  Moving back to a previous stage. Please explain why this is needed in your summary.
                </p>
              )}

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-[var(--radius-sm)]">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-border-light">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Transitioning...' : `Move to ${toConfig.label}`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

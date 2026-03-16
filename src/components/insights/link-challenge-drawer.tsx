'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { STATUS_CONFIG } from '@/lib/constants';
import type { Challenge } from '@/lib/types/database';

interface LinkChallengeDrawerProps {
  insightId: string;
  linkedChallengeIds: string[];
  open: boolean;
  onClose: () => void;
  onLinked: () => void;
}

export function LinkChallengeDrawer({
  insightId,
  linkedChallengeIds,
  open,
  onClose,
  onLinked,
}: LinkChallengeDrawerProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchChallenges = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setChallenges(data);
      setLoading(false);
    };
    fetchChallenges();
    setSelected(new Set());
    setSearch('');
  }, [open]);

  const filtered = challenges.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    if (linkedChallengeIds.includes(id)) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleLink = async () => {
    if (selected.size === 0) return;
    setSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const rows = Array.from(selected).map((challenge_id) => ({
      challenge_id,
      insight_id: insightId,
      linked_by: user.id,
    }));

    await supabase.from('challenge_insights').insert(rows);
    setSubmitting(false);
    onLinked();
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface border-l border-border z-50 flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border-light">
          <h2 className="font-heading text-lg font-semibold">Link to Challenge</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text text-xl cursor-pointer">&times;</button>
        </div>

        <div className="p-4 border-b border-border-light">
          <Input
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {loading ? (
            <p className="text-sm text-text-muted text-center py-4">Loading challenges...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">No challenges found.</p>
          ) : (
            filtered.map((challenge) => {
              const isLinked = linkedChallengeIds.includes(challenge.id);
              const isSelected = selected.has(challenge.id);
              const config = STATUS_CONFIG[challenge.status];
              return (
                <button
                  key={challenge.id}
                  onClick={() => toggleSelect(challenge.id)}
                  disabled={isLinked}
                  className={`w-full text-left p-3 rounded-[var(--radius-md)] border transition-colors cursor-pointer ${
                    isLinked
                      ? 'bg-surface-alt border-border-light opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'border-accent bg-accent/5'
                      : 'border-border-light hover:border-border bg-surface'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-4 h-4 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center ${
                      isLinked || isSelected ? 'bg-accent border-accent' : 'border-border'
                    }`}>
                      {(isLinked || isSelected) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{challenge.title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge color={config.color} bg={config.bg}>{config.label}</Badge>
                      </div>
                      {isLinked && <p className="text-xs text-text-light mt-1">Already linked</p>}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {selected.size > 0 && (
          <div className="p-4 border-t border-border-light">
            <Button onClick={handleLink} disabled={submitting} className="w-full">
              {submitting ? 'Linking...' : `Link to ${selected.size} Challenge${selected.size > 1 ? 's' : ''}`}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { STATUS_CONFIG } from '@/lib/constants';
import type { ChallengeStatus, ChallengeTransitionWithAuthor } from '@/lib/types/database';

interface TransitionTimelineProps {
  challengeId: string;
  currentStatus: ChallengeStatus;
  refreshKey?: number;
}

export function TransitionTimeline({ challengeId, currentStatus, refreshKey }: TransitionTimelineProps) {
  const [transitions, setTransitions] = useState<ChallengeTransitionWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransitions = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('challenge_transitions')
        .select('*, profiles!challenge_transitions_transitioned_by_fkey(full_name)')
        .eq('challenge_id', challengeId)
        .order('created_at', { ascending: true });

      if (data) {
        const mapped = data.map((t) => {
          const profile = t.profiles as unknown as { full_name: string | null } | null;
          return {
            ...t,
            profiles: undefined,
            author_name: profile?.full_name ?? null,
          };
        });
        setTransitions(mapped);
      }
      setLoading(false);
    };
    fetchTransitions();
  }, [challengeId, refreshKey]);

  if (loading) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-heading text-lg font-semibold">Stage History</h3>

      {transitions.length === 0 ? (
        <p className="text-sm text-text-muted p-3 bg-surface-alt rounded-[var(--radius-md)]">
          No stage transitions yet. This challenge is in {STATUS_CONFIG[currentStatus].label}.
        </p>
      ) : (
        <div className="relative flex flex-col gap-0">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border-light" />

          {transitions.map((t, i) => {
            const toConfig = STATUS_CONFIG[t.to_status];
            const fromConfig = t.from_status ? STATUS_CONFIG[t.from_status] : null;
            return (
              <div key={t.id} className="relative flex gap-3 pb-4 last:pb-0">
                {/* Dot */}
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center z-10 border-2 border-surface"
                  style={{ backgroundColor: toConfig.color }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 bg-surface-alt rounded-[var(--radius-md)] p-3 border border-border-light">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {fromConfig && (
                      <>
                        <span
                          className="px-2 py-0.5 text-[10px] font-medium rounded-[var(--radius-sm)]"
                          style={{ color: fromConfig.color, backgroundColor: fromConfig.bg }}
                        >
                          {fromConfig.label}
                        </span>
                        <span className="text-text-light text-xs">→</span>
                      </>
                    )}
                    <span
                      className="px-2 py-0.5 text-[10px] font-medium rounded-[var(--radius-sm)]"
                      style={{ color: toConfig.color, backgroundColor: toConfig.bg }}
                    >
                      {toConfig.label}
                    </span>
                  </div>

                  <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">
                    {t.summary}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-xs text-text-light">
                    <span>{t.author_name ?? 'Unknown'}</span>
                    <span>·</span>
                    <span>
                      {new Date(t.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

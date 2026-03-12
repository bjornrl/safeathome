'use client';

import { CHALLENGE_STATUSES, STATUS_CONFIG } from '@/lib/constants';
import type { ChallengeWithDetails, ChallengeStatus } from '@/lib/types/database';

interface PipelineProps {
  challenges: ChallengeWithDetails[];
}

export function ChallengePipeline({ challenges }: PipelineProps) {
  const counts = CHALLENGE_STATUSES.reduce(
    (acc, status) => {
      acc[status] = challenges.filter((c) => c.status === status).length;
      return acc;
    },
    {} as Record<ChallengeStatus, number>
  );

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {CHALLENGE_STATUSES.map((status, i) => {
        const config = STATUS_CONFIG[status];
        return (
          <div key={status} className="flex items-center gap-1">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] min-w-[120px]"
              style={{ backgroundColor: config.bg }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm font-medium" style={{ color: config.color }}>
                {config.label}
              </span>
              <span
                className="ml-auto text-sm font-semibold"
                style={{ color: config.color }}
              >
                {counts[status]}
              </span>
            </div>
            {i < CHALLENGE_STATUSES.length - 1 && (
              <span className="text-text-light text-xs flex-shrink-0">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

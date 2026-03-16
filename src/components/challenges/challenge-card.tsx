'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { STATUS_CONFIG, CHALLENGE_STATUSES } from '@/lib/constants';
import type { ChallengeWithDetails } from '@/lib/types/database';

export function ChallengeCard({ challenge }: { challenge: ChallengeWithDetails }) {
  const router = useRouter();
  const config = STATUS_CONFIG[challenge.status];
  const currentIndex = CHALLENGE_STATUSES.indexOf(challenge.status);

  return (
    <Card onClick={() => router.push(`/challenges/${challenge.id}`)} className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Badge color={config.color} bg={config.bg}>
          {config.label}
        </Badge>
        {/* Stage dots */}
        <div className="flex items-center gap-1">
          {CHALLENGE_STATUSES.map((s, i) => {
            const sConfig = STATUS_CONFIG[s];
            return (
              <div
                key={s}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i <= currentIndex ? sConfig.color : '#E8E4DB',
                }}
                title={sConfig.label}
              />
            );
          })}
        </div>
      </div>
      <h3 className="font-heading text-base font-semibold text-text leading-snug">
        {challenge.title}
      </h3>
      <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
        {challenge.description}
      </p>
      <div className="flex items-center gap-3 text-xs text-text-light mt-auto pt-2 border-t border-border-light">
        <span>{challenge.participant_count} participants</span>
        <span>{challenge.insight_count} insights</span>
        <span className="ml-auto">
          {new Date(challenge.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
      </div>
    </Card>
  );
}

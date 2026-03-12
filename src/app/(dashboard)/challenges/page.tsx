'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChallengePipeline } from '@/components/challenges/challenge-pipeline';
import { ChallengeCard } from '@/components/challenges/challenge-card';
import type { ChallengeWithDetails } from '@/lib/types/database';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('challenges')
        .select(
          '*, profiles!challenges_created_by_fkey(full_name, institution), challenge_participants(count), challenge_insights(count), comments(count)'
        )
        .order('created_at', { ascending: false });

      if (data) {
        const mapped: ChallengeWithDetails[] = data.map((row) => {
          const profile = row.profiles as unknown as { full_name: string | null; institution: string | null } | null;
          const participantsAgg = row.challenge_participants as unknown as { count: number }[];
          const insightsAgg = row.challenge_insights as unknown as { count: number }[];
          const commentsAgg = row.comments as unknown as { count: number }[];
          return {
            ...row,
            profiles: undefined,
            challenge_participants: undefined,
            challenge_insights: undefined,
            comments: undefined,
            creator_name: profile?.full_name ?? null,
            creator_institution: profile?.institution as ChallengeWithDetails['creator_institution'] ?? null,
            participant_count: participantsAgg?.[0]?.count ?? 0,
            insight_count: insightsAgg?.[0]?.count ?? 0,
            comment_count: commentsAgg?.[0]?.count ?? 0,
          };
        });
        setChallenges(mapped);
      }
      setLoading(false);
    };
    fetchChallenges();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">Design Challenges</h1>

      <ChallengePipeline challenges={challenges} />

      {loading ? (
        <p className="text-sm text-text-muted py-8 text-center">Loading challenges...</p>
      ) : challenges.length === 0 ? (
        <p className="text-sm text-text-muted py-8 text-center">
          No challenges yet. Create the first one.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
}

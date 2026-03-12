'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CommentThread } from '@/components/comments/comment-thread';
import { STATUS_CONFIG } from '@/lib/constants';
import type { ChallengeWithDetails, Insight, Profile } from '@/lib/types/database';

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeWithDetails | null>(null);
  const [linkedInsights, setLinkedInsights] = useState<Insight[]>([]);
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);

      // Fetch challenge
      const { data: challengeData } = await supabase
        .from('challenges')
        .select(
          '*, profiles!challenges_created_by_fkey(full_name, institution), challenge_participants(count), challenge_insights(count), comments(count)'
        )
        .eq('id', id)
        .single();

      if (challengeData) {
        const profile = challengeData.profiles as unknown as { full_name: string | null; institution: string | null } | null;
        const participantsAgg = challengeData.challenge_participants as unknown as { count: number }[];
        const insightsAgg = challengeData.challenge_insights as unknown as { count: number }[];
        const commentsAgg = challengeData.comments as unknown as { count: number }[];
        setChallenge({
          ...challengeData,
          profiles: undefined,
          challenge_participants: undefined,
          challenge_insights: undefined,
          comments: undefined,
          creator_name: profile?.full_name ?? null,
          creator_institution: profile?.institution as ChallengeWithDetails['creator_institution'] ?? null,
          participant_count: participantsAgg?.[0]?.count ?? 0,
          insight_count: insightsAgg?.[0]?.count ?? 0,
          comment_count: commentsAgg?.[0]?.count ?? 0,
        });
      }

      // Fetch linked insights
      const { data: links } = await supabase
        .from('challenge_insights')
        .select('insight_id, insights(*)')
        .eq('challenge_id', id);

      if (links) {
        setLinkedInsights(
          links
            .map((l) => l.insights as unknown as Insight)
            .filter(Boolean)
        );
      }

      // Fetch participants
      const { data: parts } = await supabase
        .from('challenge_participants')
        .select('user_id, profiles(*)')
        .eq('challenge_id', id);

      if (parts) {
        const profiles = parts.map((p) => p.profiles as unknown as Profile).filter(Boolean);
        setParticipants(profiles);
        if (user) {
          setIsParticipant(parts.some((p) => p.user_id === user.id));
        }
      }

      setLoading(false);
    };
    fetch();
  }, [id]);

  const toggleJoin = async () => {
    if (!currentUserId) return;
    const supabase = createClient();
    if (isParticipant) {
      await supabase
        .from('challenge_participants')
        .delete()
        .eq('challenge_id', id)
        .eq('user_id', currentUserId);
      setIsParticipant(false);
      setParticipants(participants.filter((p) => p.id !== currentUserId));
    } else {
      await supabase
        .from('challenge_participants')
        .insert({ challenge_id: id, user_id: currentUserId });
      setIsParticipant(true);
      // Re-fetch participant profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserId)
        .single();
      if (data) setParticipants([...participants, data]);
    }
  };

  if (loading) {
    return <p className="text-sm text-text-muted py-8 text-center">Loading...</p>;
  }

  if (!challenge) {
    return <p className="text-sm text-text-muted py-8 text-center">Challenge not found.</p>;
  }

  const statusConfig = STATUS_CONFIG[challenge.status];

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-text-muted hover:text-text transition-colors self-start cursor-pointer"
      >
        ← Back
      </button>

      <div className="bg-surface border border-border-light rounded-[var(--radius-lg)] p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Badge color={statusConfig.color} bg={statusConfig.bg}>
              {statusConfig.label}
            </Badge>
            <h1 className="font-heading text-2xl font-bold">{challenge.title}</h1>
          </div>
          <Button
            variant={isParticipant ? 'secondary' : 'primary'}
            size="sm"
            onClick={toggleJoin}
          >
            {isParticipant ? 'Leave' : 'Join'}
          </Button>
        </div>

        <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">
          {challenge.description}
        </p>

        <div className="text-xs text-text-light pt-2 border-t border-border-light">
          Created by {challenge.creator_name}
          {challenge.creator_institution && ` · ${challenge.creator_institution}`}
          {' · '}
          {new Date(challenge.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Participants */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-lg font-semibold">
          Participants ({participants.length})
        </h3>
        {participants.length === 0 ? (
          <p className="text-sm text-text-muted">No participants yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {participants.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-surface-alt rounded-full"
              >
                <span className="w-5 h-5 rounded-full bg-accent-light text-accent text-xs flex items-center justify-center font-semibold">
                  {p.full_name?.charAt(0)?.toUpperCase() || '?'}
                </span>
                {p.full_name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Linked Insights */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-lg font-semibold">
          Linked Insights ({linkedInsights.length})
        </h3>
        {linkedInsights.length === 0 ? (
          <p className="text-sm text-text-muted">No insights linked yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {linkedInsights.map((insight) => (
              <Card
                key={insight.id}
                onClick={() => router.push(`/insights/${insight.id}`)}
                className="!p-3"
              >
                <h4 className="text-sm font-medium text-text">{insight.title}</h4>
                <p className="text-xs text-text-muted line-clamp-1 mt-1">{insight.body}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CommentThread challengeId={id} />
    </div>
  );
}

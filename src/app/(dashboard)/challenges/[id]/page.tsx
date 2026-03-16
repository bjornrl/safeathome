'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DotBadge, Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CommentThread } from '@/components/comments/comment-thread';
import { LinkInsightDrawer } from '@/components/challenges/link-insight-drawer';
import { PipelineStepper } from '@/components/challenges/pipeline-stepper';
import { TransitionModal } from '@/components/challenges/transition-modal';
import { TransitionTimeline } from '@/components/challenges/transition-timeline';
import { STATUS_CONFIG, WP_CONFIG, MATERIAL_TYPE_LABELS, CHALLENGE_STATUSES } from '@/lib/constants';
import type { ChallengeWithDetails, Insight, Profile, ChallengeStatus } from '@/lib/types/database';

interface LinkedInsightWithAuthor extends Insight {
  author_name: string | null;
}

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeWithDetails | null>(null);
  const [linkedInsights, setLinkedInsights] = useState<LinkedInsightWithAuthor[]>([]);
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<ChallengeStatus | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id ?? null);

    // Fetch challenge
    const { data: challengeData } = await supabase
      .from('challenges')
      .select(
        '*, profiles!challenges_created_by_fkey(full_name, institution), challenge_participants(count), challenge_insights(count), comments(count), challenge_transitions(count)'
      )
      .eq('id', id)
      .single();

    if (challengeData) {
      const profile = challengeData.profiles as unknown as { full_name: string | null; institution: string | null } | null;
      const participantsAgg = challengeData.challenge_participants as unknown as { count: number }[];
      const insightsAgg = challengeData.challenge_insights as unknown as { count: number }[];
      const commentsAgg = challengeData.comments as unknown as { count: number }[];
      const transitionsAgg = challengeData.challenge_transitions as unknown as { count: number }[];
      setChallenge({
        ...challengeData,
        profiles: undefined,
        challenge_participants: undefined,
        challenge_insights: undefined,
        comments: undefined,
        challenge_transitions: undefined,
        creator_name: profile?.full_name ?? null,
        creator_institution: profile?.institution as ChallengeWithDetails['creator_institution'] ?? null,
        participant_count: participantsAgg?.[0]?.count ?? 0,
        insight_count: insightsAgg?.[0]?.count ?? 0,
        comment_count: commentsAgg?.[0]?.count ?? 0,
        transition_count: transitionsAgg?.[0]?.count ?? 0,
      });
    }

    // Fetch linked insights with author info
    const { data: links } = await supabase
      .from('challenge_insights')
      .select('insight_id, insights(*, profiles!insights_author_id_fkey(full_name))')
      .eq('challenge_id', id);

    if (links) {
      const mapped = links
        .map((l) => {
          const insight = l.insights as unknown as Insight & { profiles: { full_name: string | null } | null };
          if (!insight) return null;
          return {
            ...insight,
            author_name: insight.profiles?.full_name ?? null,
            profiles: undefined,
          } as LinkedInsightWithAuthor;
        })
        .filter(Boolean) as LinkedInsightWithAuthor[];
      setLinkedInsights(mapped);
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
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserId)
        .single();
      if (data) setParticipants([...participants, data]);
    }
  };

  const unlinkInsight = async (insightId: string) => {
    const supabase = createClient();
    await supabase
      .from('challenge_insights')
      .delete()
      .eq('challenge_id', id)
      .eq('insight_id', insightId);
    setLinkedInsights(linkedInsights.filter((i) => i.id !== insightId));
  };

  const handleTransitioned = () => {
    setRefreshKey((k) => k + 1);
    fetchData();
  };

  if (loading) {
    return <p className="text-sm text-text-muted py-8 text-center">Loading...</p>;
  }

  if (!challenge) {
    return <p className="text-sm text-text-muted py-8 text-center">Challenge not found.</p>;
  }

  const currentIndex = CHALLENGE_STATUSES.indexOf(challenge.status);

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
          <h1 className="font-heading text-2xl font-bold">{challenge.title}</h1>
          <Button
            variant={isParticipant ? 'secondary' : 'primary'}
            size="sm"
            onClick={toggleJoin}
          >
            {isParticipant ? 'Leave' : 'Join'}
          </Button>
        </div>

        {/* Pipeline Stepper */}
        <PipelineStepper
          currentStatus={challenge.status}
          onAdvance={() => setTransitionTarget(CHALLENGE_STATUSES[currentIndex + 1])}
          onRetreat={() => setTransitionTarget(CHALLENGE_STATUSES[currentIndex - 1])}
        />

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

      {/* Stage History Timeline */}
      <TransitionTimeline
        challengeId={id}
        currentStatus={challenge.status}
        refreshKey={refreshKey}
      />

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
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold">
            Linked Insights ({linkedInsights.length})
          </h3>
          <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(true)}>
            Link Insight
          </Button>
        </div>
        {linkedInsights.length === 0 ? (
          <p className="text-sm text-text-muted">No insights linked yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {linkedInsights.map((insight) => {
              const wpConfig = insight.work_package ? WP_CONFIG[insight.work_package] : null;
              return (
                <div
                  key={insight.id}
                  className="bg-surface border border-border-light rounded-[var(--radius-md)] p-3 flex items-start gap-3"
                >
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => router.push(`/insights/${insight.id}`)}
                  >
                    <h4 className="text-sm font-medium text-text">{insight.title}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {wpConfig && (
                        <DotBadge dot={wpConfig.dot} bg={wpConfig.bg}>
                          {insight.work_package}
                        </DotBadge>
                      )}
                      {insight.field_site && (
                        <Badge bg="#EDE9E0" color="#7A756B">{insight.field_site}</Badge>
                      )}
                      {insight.material_type && (
                        <Badge bg="#EDE9E0" color="#7A756B">{MATERIAL_TYPE_LABELS[insight.material_type]}</Badge>
                      )}
                    </div>
                    {insight.author_name && (
                      <p className="text-xs text-text-light mt-1">by {insight.author_name}</p>
                    )}
                  </div>
                  <button
                    onClick={() => unlinkInsight(insight.id)}
                    className="text-xs text-text-light hover:text-red-500 cursor-pointer transition-colors flex-shrink-0 px-2 py-1"
                    title="Unlink insight"
                  >
                    Unlink
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CommentThread challengeId={id} />

      {/* Link Insight Drawer */}
      <LinkInsightDrawer
        challengeId={id}
        linkedInsightIds={linkedInsights.map((i) => i.id)}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLinked={() => fetchData()}
      />

      {/* Transition Modal */}
      {transitionTarget && (
        <TransitionModal
          challengeId={id}
          fromStatus={challenge.status}
          toStatus={transitionTarget}
          open={!!transitionTarget}
          onClose={() => setTransitionTarget(null)}
          onTransitioned={handleTransitioned}
        />
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DotBadge, Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommentThread } from '@/components/comments/comment-thread';
import { WP_CONFIG, MATERIAL_TYPE_LABELS } from '@/lib/constants';
import type { InsightWithDetails } from '@/lib/types/database';

export default function InsightDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [insight, setInsight] = useState<InsightWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);

      const { data } = await supabase
        .from('insights')
        .select('*, profiles!insights_author_id_fkey(full_name, institution), comments(count)')
        .eq('id', id)
        .single();

      if (data) {
        const profile = data.profiles as unknown as { full_name: string | null; institution: string | null } | null;
        const commentAgg = data.comments as unknown as { count: number }[];
        setInsight({
          ...data,
          profiles: undefined,
          comments: undefined,
          author_name: profile?.full_name ?? null,
          author_institution: profile?.institution as InsightWithDetails['author_institution'] ?? null,
          comment_count: commentAgg?.[0]?.count ?? 0,
        });
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const toggleFlag = async () => {
    if (!insight || !currentUserId) return;
    const supabase = createClient();
    const newFlagged = !insight.flagged_for_design;
    await supabase
      .from('insights')
      .update({
        flagged_for_design: newFlagged,
        flagged_by: newFlagged ? currentUserId : null,
        flagged_at: newFlagged ? new Date().toISOString() : null,
      })
      .eq('id', id);

    setInsight({
      ...insight,
      flagged_for_design: newFlagged,
      flagged_by: newFlagged ? currentUserId : null,
      flagged_at: newFlagged ? new Date().toISOString() : null,
    });
  };

  if (loading) {
    return <p className="text-sm text-text-muted py-8 text-center">Loading...</p>;
  }

  if (!insight) {
    return <p className="text-sm text-text-muted py-8 text-center">Insight not found.</p>;
  }

  const wpConfig = insight.work_package ? WP_CONFIG[insight.work_package] : null;

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
          <h1 className="font-heading text-2xl font-bold">{insight.title}</h1>
          <Button
            variant={insight.flagged_for_design ? 'primary' : 'secondary'}
            size="sm"
            onClick={toggleFlag}
          >
            ⚑ {insight.flagged_for_design ? 'Flagged' : 'Flag for design'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {wpConfig && (
            <DotBadge dot={wpConfig.dot} bg={wpConfig.bg}>
              {wpConfig.label}
            </DotBadge>
          )}
          {insight.field_site && (
            <Badge bg="#EDE9E0" color="#7A756B">
              {insight.field_site}
            </Badge>
          )}
          {insight.material_type && (
            <Badge bg="#EDE9E0" color="#7A756B">
              {MATERIAL_TYPE_LABELS[insight.material_type]}
            </Badge>
          )}
        </div>

        <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{insight.body}</p>

        {insight.tags && insight.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {insight.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-surface-alt text-text-muted rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-xs text-text-light pt-2 border-t border-border-light">
          by {insight.author_name}
          {insight.author_institution && ` · ${insight.author_institution}`}
          {' · '}
          {new Date(insight.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </div>
      </div>

      <CommentThread insightId={id} />
    </div>
  );
}

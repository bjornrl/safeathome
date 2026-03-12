'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import type { CommentWithAuthor } from '@/lib/types/database';

interface CommentThreadProps {
  insightId?: string;
  challengeId?: string;
}

export function CommentThread({ insightId, challengeId }: CommentThreadProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from('comments')
      .select('*, profiles!comments_author_id_fkey(full_name, institution)')
      .order('created_at', { ascending: true });

    if (insightId) query = query.eq('insight_id', insightId);
    if (challengeId) query = query.eq('challenge_id', challengeId);

    const { data } = await query;
    if (data) {
      const mapped: CommentWithAuthor[] = data.map((c) => {
        const profile = c.profiles as unknown as { full_name: string | null; institution: string | null } | null;
        return {
          ...c,
          profiles: undefined,
          author_name: profile?.full_name ?? null,
          author_institution: profile?.institution as CommentWithAuthor['author_institution'] ?? null,
        };
      });
      setComments(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insightId, challengeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('comments').insert({
      body: body.trim(),
      author_id: user.id,
      insight_id: insightId || null,
      challenge_id: challengeId || null,
    });

    setBody('');
    setSubmitting(false);
    fetchComments();
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-heading text-lg font-semibold">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {loading ? (
        <p className="text-sm text-text-muted">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-text-muted">No comments yet. Start the conversation.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-surface-alt rounded-[var(--radius-md)] p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-text">{comment.author_name}</span>
                {comment.author_institution && (
                  <span className="text-xs text-text-light">· {comment.author_institution}</span>
                )}
                <span className="text-xs text-text-light ml-auto">
                  {new Date(comment.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-text leading-relaxed">{comment.body}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[80px]"
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={submitting || !body.trim()}>
            {submitting ? 'Posting...' : 'Post comment'}
          </Button>
        </div>
      </form>
    </div>
  );
}

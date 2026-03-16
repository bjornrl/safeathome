'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DotBadge, Badge } from '@/components/ui/badge';
import { CHALLENGE_STATUSES, STATUS_CONFIG, WP_CONFIG, MATERIAL_TYPE_LABELS } from '@/lib/constants';
import type { Insight } from '@/lib/types/database';

export default function NewChallengePageWrapper() {
  return (
    <Suspense fallback={<p className="text-sm text-text-muted py-8 text-center">Loading...</p>}>
      <NewChallengePage />
    </Suspense>
  );
}

function NewChallengePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromInsightId = searchParams.get('from_insight');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('mapping');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Source insights linking
  const [selectedInsights, setSelectedInsights] = useState<Insight[]>([]);
  const [insightSearch, setInsightSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Insight[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Pre-populate from query param
  useEffect(() => {
    if (fromInsightId) {
      const fetchInsight = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from('insights')
          .select('*')
          .eq('id', fromInsightId)
          .single();
        if (data) setSelectedInsights([data]);
      };
      fetchInsight();
    }
  }, [fromInsightId]);

  const searchInsights = async (query: string) => {
    setInsightSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('insights')
      .select('*')
      .ilike('title', `%${query}%`)
      .limit(10);
    if (data) {
      setSearchResults(data.filter((i) => !selectedInsights.some((s) => s.id === i.id)));
    }
    setSearching(false);
  };

  const addInsight = (insight: Insight) => {
    setSelectedInsights([...selectedInsights, insight]);
    setSearchResults(searchResults.filter((r) => r.id !== insight.id));
    setInsightSearch('');
  };

  const removeInsight = (id: string) => {
    setSelectedInsights(selectedInsights.filter((i) => i.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be signed in.');
      setSubmitting(false);
      return;
    }

    const { data: challenge, error: insertError } = await supabase
      .from('challenges')
      .insert({
        title,
        description,
        status,
        created_by: user.id,
      })
      .select('id')
      .single();

    if (insertError || !challenge) {
      setError(insertError?.message ?? 'Failed to create challenge.');
      setSubmitting(false);
      return;
    }

    // Link source insights
    if (selectedInsights.length > 0) {
      const rows = selectedInsights.map((insight) => ({
        challenge_id: challenge.id,
        insight_id: insight.id,
        linked_by: user.id,
      }));
      await supabase.from('challenge_insights').insert(rows);
    }

    router.push(`/challenges/${challenge.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">New Challenge</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border-light rounded-[var(--radius-lg)] p-6 flex flex-col gap-4"
      >
        <Input
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name this design challenge"
          required
        />
        <Textarea
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the challenge, its scope, and what you hope to achieve..."
          className="min-h-[160px]"
          required
        />
        <Select
          id="status"
          label="Starting Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={CHALLENGE_STATUSES.map((s) => ({
            value: s,
            label: STATUS_CONFIG[s].label,
          }))}
        />

        {/* Source Insights */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text">
            Source Insights <span className="text-text-light font-normal">(optional)</span>
          </label>

          {selectedInsights.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {selectedInsights.map((insight) => {
                const wpConfig = insight.work_package ? WP_CONFIG[insight.work_package] : null;
                return (
                  <div
                    key={insight.id}
                    className="flex items-center gap-2 p-2 bg-surface-alt rounded-[var(--radius-sm)] border border-border-light"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{insight.title}</p>
                      <div className="flex gap-1 mt-0.5">
                        {wpConfig && (
                          <DotBadge dot={wpConfig.dot} bg={wpConfig.bg}>
                            {insight.work_package}
                          </DotBadge>
                        )}
                        {insight.field_site && (
                          <Badge bg="#EDE9E0" color="#7A756B">{insight.field_site}</Badge>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInsight(insight.id)}
                      className="text-xs text-text-light hover:text-red-500 cursor-pointer px-1"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {!showSearch ? (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="text-sm text-accent hover:underline cursor-pointer self-start"
            >
              + Add source insight
            </button>
          ) : (
            <div className="relative">
              <Input
                placeholder="Search insights by title..."
                value={insightSearch}
                onChange={(e) => searchInsights(e.target.value)}
                autoFocus
              />
              {(searchResults.length > 0 || searching) && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border-light rounded-[var(--radius-md)] shadow-lg z-10 max-h-48 overflow-y-auto">
                  {searching ? (
                    <p className="text-xs text-text-muted p-3">Searching...</p>
                  ) : (
                    searchResults.map((insight) => (
                      <button
                        key={insight.id}
                        type="button"
                        onClick={() => addInsight(insight)}
                        className="w-full text-left p-2 hover:bg-surface-alt text-sm text-text cursor-pointer border-b border-border-light last:border-0"
                      >
                        {insight.title}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-[var(--radius-sm)]">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Challenge'}
          </Button>
        </div>
      </form>
    </div>
  );
}

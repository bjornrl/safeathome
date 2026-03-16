'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DotBadge, Badge } from '@/components/ui/badge';
import { WP_CONFIG, MATERIAL_TYPE_LABELS, WORK_PACKAGES, FIELD_SITES } from '@/lib/constants';
import type { Insight, WorkPackage, FieldSite } from '@/lib/types/database';

interface LinkInsightDrawerProps {
  challengeId: string;
  linkedInsightIds: string[];
  open: boolean;
  onClose: () => void;
  onLinked: () => void;
}

export function LinkInsightDrawer({
  challengeId,
  linkedInsightIds,
  open,
  onClose,
  onLinked,
}: LinkInsightDrawerProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [wpFilter, setWpFilter] = useState<WorkPackage | null>(null);
  const [siteFilter, setSiteFilter] = useState<FieldSite | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchInsights = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('insights')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setInsights(data);
      setLoading(false);
    };
    fetchInsights();
    setSelected(new Set());
    setSearch('');
    setWpFilter(null);
    setSiteFilter(null);
  }, [open]);

  const filtered = insights.filter((i) => {
    if (wpFilter && i.work_package !== wpFilter) return false;
    if (siteFilter && i.field_site !== siteFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchesTitle = i.title.toLowerCase().includes(q);
      const matchesTags = i.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesTags) return false;
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    if (linkedInsightIds.includes(id)) return;
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

    const rows = Array.from(selected).map((insight_id) => ({
      challenge_id: challengeId,
      insight_id,
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
          <h2 className="font-heading text-lg font-semibold">Link Insights</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text text-xl cursor-pointer">&times;</button>
        </div>

        <div className="p-4 flex flex-col gap-3 border-b border-border-light">
          <Input
            placeholder="Search by title or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-1.5">
            {WORK_PACKAGES.map((wp) => (
              <button
                key={wp}
                onClick={() => setWpFilter(wpFilter === wp ? null : wp)}
                className={`px-2 py-0.5 text-xs rounded-full border cursor-pointer transition-colors ${
                  wpFilter === wp
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-light text-text-muted hover:border-border'
                }`}
              >
                {wp}
              </button>
            ))}
            {FIELD_SITES.map((site) => (
              <button
                key={site}
                onClick={() => setSiteFilter(siteFilter === site ? null : site)}
                className={`px-2 py-0.5 text-xs rounded-full border cursor-pointer transition-colors ${
                  siteFilter === site
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-light text-text-muted hover:border-border'
                }`}
              >
                {site}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {loading ? (
            <p className="text-sm text-text-muted text-center py-4">Loading insights...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">No insights found.</p>
          ) : (
            filtered.map((insight) => {
              const isLinked = linkedInsightIds.includes(insight.id);
              const isSelected = selected.has(insight.id);
              const wpConfig = insight.work_package ? WP_CONFIG[insight.work_package] : null;
              return (
                <button
                  key={insight.id}
                  onClick={() => toggleSelect(insight.id)}
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
                      <p className="text-sm font-medium text-text truncate">{insight.title}</p>
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
              {submitting ? 'Linking...' : `Link ${selected.size} Insight${selected.size > 1 ? 's' : ''}`}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

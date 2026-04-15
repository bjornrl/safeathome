'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { InsightCard } from '@/components/insights/insight-card';
import { InsightFilters } from '@/components/insights/insight-filters';
import type { InsightWithDetails, WorkPackage, FieldSite } from '@/lib/types/database';

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWP, setSelectedWP] = useState<WorkPackage | null>(null);
  const [selectedSite, setSelectedSite] = useState<FieldSite | null>(null);
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('insights')
        .select('*, profiles!insights_author_id_fkey(full_name, institution), comments(count), attachments(count)')
        .order('created_at', { ascending: false });

      if (data) {
        const mapped: InsightWithDetails[] = data.map((row) => {
          const profile = row.profiles as unknown as { full_name: string | null; institution: string | null } | null;
          const commentAgg = row.comments as unknown as { count: number }[];
          const attachmentAgg = row.attachments as unknown as { count: number }[];
          return {
            ...row,
            profiles: undefined,
            comments: undefined,
            attachments: undefined,
            author_name: profile?.full_name ?? null,
            author_institution: profile?.institution as InsightWithDetails['author_institution'] ?? null,
            comment_count: commentAgg?.[0]?.count ?? 0,
            attachment_count: attachmentAgg?.[0]?.count ?? 0,
          };
        });
        setInsights(mapped);
      }
      setLoading(false);
    };
    fetchInsights();
  }, []);

  const filtered = insights.filter((i) => {
    if (selectedWP && i.work_package !== selectedWP) return false;
    if (selectedSite && i.field_site !== selectedSite) return false;
    if (flaggedOnly && !i.flagged_for_design) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchesTitle = i.title.toLowerCase().includes(q);
      const matchesBody = i.body.toLowerCase().includes(q);
      const matchesTags = i.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesBody && !matchesTags) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Research Insights</h1>
        <span className="text-sm text-text-muted">{filtered.length} insights</span>
      </div>

      <InsightFilters
        selectedWP={selectedWP}
        setSelectedWP={setSelectedWP}
        selectedSite={selectedSite}
        setSelectedSite={setSelectedSite}
        flaggedOnly={flaggedOnly}
        setFlaggedOnly={setFlaggedOnly}
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <p className="text-sm text-text-muted py-8 text-center">Loading insights...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-text-muted py-8 text-center">
          No insights found. Try adjusting your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { DotBadge, Badge } from '@/components/ui/badge';
import { WP_CONFIG, MATERIAL_TYPE_LABELS } from '@/lib/constants';
import type { InsightWithDetails } from '@/lib/types/database';

export function InsightCard({ insight }: { insight: InsightWithDetails }) {
  const router = useRouter();
  const wpConfig = insight.work_package ? WP_CONFIG[insight.work_package] : null;

  return (
    <Card onClick={() => router.push(`/insights/${insight.id}`)} className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-base font-semibold text-text leading-snug line-clamp-2">
          {insight.title}
        </h3>
        {insight.flagged_for_design && (
          <span className="text-accent flex-shrink-0" title="Flagged for design">
            ⚑
          </span>
        )}
      </div>
      <p className="text-sm text-text-muted line-clamp-3 leading-relaxed">{insight.body}</p>
      <div className="flex flex-wrap gap-1.5">
        {wpConfig && (
          <DotBadge dot={wpConfig.dot} bg={wpConfig.bg}>
            {insight.work_package}
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
      <div className="flex items-center justify-between text-xs text-text-light mt-auto pt-2 border-t border-border-light">
        <span>
          {insight.author_name}
          {insight.author_institution && ` · ${insight.author_institution}`}
        </span>
        <span className="flex items-center gap-2">
          {insight.attachment_count > 0 && (
            <span className="flex items-center gap-0.5" title={`${insight.attachment_count} attachment${insight.attachment_count > 1 ? 's' : ''}`}>
              📎 {insight.attachment_count}
            </span>
          )}
          {insight.comment_count > 0 && <span>{insight.comment_count} comments</span>}
        </span>
      </div>
    </Card>
  );
}

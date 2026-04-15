'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SEED_STORIES, FRICTIONS, FRICTION_MAP } from '@/lib/map-data';
import type { FrictionType, StoryNode } from '@/lib/map-data';

const SCALE_LABELS: Record<string, string> = {
  micro: 'Micro — Inside the home',
  meso: 'Meso — The neighborhood',
  macro: 'Macro — The city',
};

export function InsightsList() {
  const [activeFriction, setActiveFriction] = useState<FrictionType | null>(null);
  const [activeScale, setActiveScale] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = SEED_STORIES.filter((story) => {
    if (activeFriction && story.friction !== activeFriction) return false;
    if (activeScale && story.scale !== activeScale) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !story.title.toLowerCase().includes(q) &&
        !story.summary.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const hasFilters = activeFriction || activeScale || search;

  return (
    <div className="mt-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
        <input
          type="text"
          placeholder="Search stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 text-sm font-body bg-surface border border-border-light rounded-[var(--radius-sm)] text-text placeholder:text-text-light focus:outline-none focus:border-accent"
        />

        <div className="flex flex-wrap gap-1.5">
          {FRICTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFriction(activeFriction === f.id ? null : f.id)}
              className={`inline-flex items-center gap-1.5 text-xs font-body font-medium px-2.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                activeFriction === f.id
                  ? 'border-transparent text-white'
                  : 'border-border-light text-text-muted hover:border-border'
              }`}
              style={
                activeFriction === f.id
                  ? { backgroundColor: f.color }
                  : undefined
              }
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: f.color,
                  display: activeFriction === f.id ? 'none' : undefined,
                }}
              />
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          {(['micro', 'meso', 'macro'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveScale(activeScale === s ? null : s)}
              className={`text-xs font-body font-medium px-2.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                activeScale === s
                  ? 'border-accent bg-accent-light text-accent'
                  : 'border-border-light text-text-muted hover:border-border'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={() => {
              setActiveFriction(null);
              setActiveScale(null);
              setSearch('');
            }}
            className="text-xs font-body text-text-muted hover:text-accent transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-sm font-body text-text-muted mb-4">
        {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-sm font-heading text-text-muted py-12 text-center">
          No stories match your filters.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}

function StoryCard({ story }: { story: StoryNode }) {
  const friction = FRICTION_MAP[story.friction];

  return (
    <article className="bg-surface border border-border-light rounded-[var(--radius-md)] p-5 hover:border-border transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-body font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: friction.color + '18', color: friction.color }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: friction.color }}
              />
              {friction.label}
            </span>
            <span className="text-xs font-body text-text-light uppercase tracking-wide">
              {SCALE_LABELS[story.scale] ?? story.scale}
            </span>
          </div>

          <h3 className="font-heading text-lg font-semibold text-text leading-snug">
            {story.title}
          </h3>

          <p className="mt-2 font-heading text-sm text-text-muted leading-relaxed">
            {story.summary}
          </p>

          {story.qualities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {story.qualities.map((q) => (
                <span
                  key={q}
                  className="text-xs font-body font-medium bg-surface-alt text-text-light px-2 py-0.5 rounded-full"
                >
                  {q.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/explore?story=${story.id}`}
          className="shrink-0 text-xs font-body font-medium text-text-muted hover:text-accent transition-colors mt-1"
          title="View on map"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-light hover:text-accent transition-colors">
            <circle cx="9" cy="9" r="7" />
            <path d="M9 5v4l2.5 2.5" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

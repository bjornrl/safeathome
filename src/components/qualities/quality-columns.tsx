'use client';

import Link from 'next/link';
import { QUALITIES, SEED_STORIES, FRICTION_MAP } from '@/lib/map-data';
import type { QualityType } from '@/lib/map-data';

function getStoriesForQuality(quality: QualityType) {
  return SEED_STORIES.filter((s) => s.qualities.includes(quality));
}

export function QualityColumns() {
  return (
    <>
      {/* Desktop: horizontal scroll */}
      <div className="hidden md:block overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
        <div className="inline-flex gap-4" style={{ minWidth: 'max-content' }}>
          {QUALITIES.map((quality) => {
            const stories = getStoriesForQuality(quality.id);
            return (
              <div
                key={quality.id}
                className="w-80 shrink-0 snap-start"
              >
                {/* Column header */}
                <div className="sticky top-0 bg-canvas pb-3 z-10">
                  <span
                    className="inline-block text-sm font-body font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: quality.color }}
                  >
                    {quality.label}
                  </span>
                  <p className="mt-2 text-xs font-body text-text-muted">
                    {quality.description}
                  </p>
                  <p className="mt-1 text-xs font-body text-text-light">
                    {stories.length} {stories.length === 1 ? 'story' : 'stories'}
                  </p>
                </div>

                {/* Story cards */}
                <div className="space-y-3">
                  {stories.map((story) => {
                    const friction = FRICTION_MAP[story.friction];
                    return (
                      <Link
                        key={story.id}
                        href={`/story/${story.id}`}
                        className="block bg-surface border border-border-light rounded-[var(--radius-md)] p-4 hover:border-border transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="inline-flex items-center gap-1 text-xs font-body font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: friction.color + '18', color: friction.color }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: friction.color }}
                            />
                            {friction.label}
                          </span>
                          <span className="text-xs font-body text-text-light">
                            {story.scale}
                          </span>
                        </div>
                        <h3 className="font-heading text-sm font-semibold text-text leading-snug">
                          {story.title}
                        </h3>
                        <p className="mt-1 text-xs font-heading text-text-muted line-clamp-2">
                          {story.summary}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: stacked vertically */}
      <div className="md:hidden space-y-8">
        {QUALITIES.map((quality) => {
          const stories = getStoriesForQuality(quality.id);
          return (
            <div key={quality.id}>
              <div className="mb-3">
                <span
                  className="inline-block text-sm font-body font-semibold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: quality.color }}
                >
                  {quality.label}
                </span>
                <p className="mt-2 text-xs font-body text-text-muted">
                  {quality.description}
                </p>
                <p className="mt-1 text-xs font-body text-text-light">
                  {stories.length} {stories.length === 1 ? 'story' : 'stories'}
                </p>
              </div>
              <div className="space-y-3">
                {stories.map((story) => {
                  const friction = FRICTION_MAP[story.friction];
                  return (
                    <Link
                      key={story.id}
                      href={`/story/${story.id}`}
                      className="block bg-surface border border-border-light rounded-[var(--radius-md)] p-4 hover:border-border transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-body font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: friction.color + '18', color: friction.color }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: friction.color }}
                          />
                          {friction.label}
                        </span>
                        <span className="text-xs font-body text-text-light">
                          {story.scale}
                        </span>
                      </div>
                      <h3 className="font-heading text-sm font-semibold text-text leading-snug">
                        {story.title}
                      </h3>
                      <p className="mt-1 text-xs font-heading text-text-muted line-clamp-2">
                        {story.summary}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

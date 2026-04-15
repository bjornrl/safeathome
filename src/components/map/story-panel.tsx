'use client';

import type { StoryNode } from '@/lib/map-data';
import { FRICTION_MAP } from '@/lib/map-data';

interface StoryPanelProps {
  story: StoryNode | null;
  onClose: () => void;
}

export function StoryPanel({ story, onClose }: StoryPanelProps) {
  if (!story) return null;

  const friction = FRICTION_MAP[story.friction];

  return (
    <div className="absolute top-0 right-0 bottom-0 z-10 w-full sm:w-96 bg-surface/95 backdrop-blur-sm border-l border-border-light shadow-lg overflow-y-auto animate-slide-in">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-body font-semibold px-2 py-1 rounded-full"
              style={{ backgroundColor: friction.color + '18', color: friction.color }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: friction.color }}
              />
              {friction.label}
            </span>
            <span className="ml-2 text-xs font-body text-text-light uppercase tracking-wide">
              {story.scale}
            </span>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-text-muted hover:text-text hover:bg-surface-alt transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <h2 className="font-heading text-xl font-semibold text-text leading-snug">
          {story.title}
        </h2>

        <p className="mt-4 font-heading text-sm text-text leading-relaxed">
          {story.summary}
        </p>

        {story.qualities.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wide mb-2">
              Qualities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {story.qualities.map((q) => (
                <span
                  key={q}
                  className="text-xs font-body font-medium bg-surface-alt text-text-muted px-2 py-1 rounded-full border border-border-light"
                >
                  {q.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {story.connections.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wide mb-2">
              Connected stories
            </p>
            <p className="text-xs font-body text-text-light">
              {story.connections.length} linked {story.connections.length === 1 ? 'story' : 'stories'} on the map
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

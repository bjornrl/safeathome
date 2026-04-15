'use client';

import { FRICTIONS, QUALITIES } from '@/lib/map-data';
import type { FrictionType, QualityType } from '@/lib/map-data';

interface FilterPanelProps {
  open: boolean;
  activeFrictions: Set<FrictionType>;
  activeQualities: Set<QualityType>;
  onToggleFriction: (id: FrictionType) => void;
  onToggleQuality: (id: QualityType) => void;
  onClear: () => void;
}

export function FilterPanel({
  open,
  activeFrictions,
  activeQualities,
  onToggleFriction,
  onToggleQuality,
  onClear,
}: FilterPanelProps) {
  if (!open) return null;

  const hasFilters = activeFrictions.size > 0 || activeQualities.size > 0;

  return (
    <div className="absolute top-16 left-4 z-10 w-72 bg-surface/95 backdrop-blur-sm border border-border-light rounded-[var(--radius-lg)] shadow-lg overflow-y-auto max-h-[calc(100vh-6rem)]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-body font-semibold text-text">Filters</h3>
          {hasFilters && (
            <button
              onClick={onClear}
              className="text-xs font-body text-text-muted hover:text-accent transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="mb-5">
          <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wide mb-2">
            Frictions
          </p>
          <div className="space-y-1">
            {FRICTIONS.map((f) => {
              const active = activeFrictions.has(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => onToggleFriction(f.id)}
                  className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-[var(--radius-sm)] text-sm font-body transition-colors cursor-pointer ${
                    active
                      ? 'bg-accent-light font-medium'
                      : 'text-text-muted hover:bg-surface-alt'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: f.color, opacity: active ? 1 : 0.5 }}
                  />
                  <span className={active ? 'text-text' : ''}>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wide mb-2">
            Qualities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUALITIES.map((q) => {
              const active = activeQualities.has(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => onToggleQuality(q.id)}
                  className={`text-xs font-body px-2 py-1 rounded-full border transition-colors cursor-pointer ${
                    active
                      ? 'border-accent bg-accent-light text-accent font-medium'
                      : 'border-border-light text-text-muted hover:border-border'
                  }`}
                >
                  {q.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

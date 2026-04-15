'use client';

import Link from 'next/link';
import { SEED_SOLUTIONS, SOLUTION_STAGES, FRICTION_MAP, STORY_MAP } from '@/lib/map-data';
import type { SolutionStage } from '@/lib/map-data';

export function SolutionsList() {
  const stageCounts = SOLUTION_STAGES.map((stage) => ({
    ...stage,
    count: SEED_SOLUTIONS.filter((s) => s.stage === stage.id).length,
  }));

  return (
    <div className="mt-10">
      {/* Pipeline */}
      <div className="bg-surface border border-border-light rounded-[var(--radius-lg)] p-5 mb-10">
        <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wide mb-4">
          Pipeline
        </p>
        <div className="flex items-center gap-2 overflow-x-auto">
          {stageCounts.map((stage, i) => (
            <div key={stage.id} className="flex items-center gap-2">
              <div className="flex flex-col items-center min-w-[80px]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-body font-bold text-sm"
                  style={{ backgroundColor: stage.color }}
                >
                  {stage.count}
                </div>
                <span className="mt-1.5 text-xs font-body font-medium text-text-muted text-center">
                  {stage.label}
                </span>
              </div>
              {i < stageCounts.length - 1 && (
                <div className="w-8 h-px bg-border shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {SEED_SOLUTIONS.map((solution) => {
          const stageConfig = SOLUTION_STAGES.find((s) => s.id === solution.stage)!;
          return (
            <article
              key={solution.id}
              className="bg-surface border border-border-light rounded-[var(--radius-md)] p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-body font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: stageConfig.color }}
                >
                  {stageConfig.label}
                </span>
              </div>

              <h3 className="font-heading text-lg font-semibold text-text leading-snug">
                {solution.title}
              </h3>

              <p className="mt-2 text-sm font-heading text-text-muted leading-relaxed">
                {solution.description}
              </p>

              {solution.outcome && (
                <div className="mt-3 bg-success-light border border-success/20 rounded-[var(--radius-sm)] px-3 py-2">
                  <p className="text-xs font-body font-semibold text-success mb-0.5">Outcome</p>
                  <p className="text-xs font-heading text-text-muted">{solution.outcome}</p>
                </div>
              )}

              {/* Frictions addressed */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {solution.frictions.map((fId) => {
                  const f = FRICTION_MAP[fId];
                  return (
                    <span
                      key={fId}
                      className="inline-flex items-center gap-1 text-xs font-body font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: f.color + '18', color: f.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: f.color }} />
                      {f.label}
                    </span>
                  );
                })}
              </div>

              {/* Source stories */}
              {solution.source_stories.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border-light">
                  <p className="text-xs font-body text-text-light mb-1.5">Based on:</p>
                  <div className="flex flex-col gap-1">
                    {solution.source_stories.map((sid) => {
                      const story = STORY_MAP[sid];
                      if (!story) return null;
                      return (
                        <Link
                          key={sid}
                          href={`/story/${sid}`}
                          className="text-xs font-heading text-text-muted hover:text-accent transition-colors"
                        >
                          {story.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

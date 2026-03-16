'use client';

import { CHALLENGE_STATUSES, STATUS_CONFIG } from '@/lib/constants';
import type { ChallengeStatus } from '@/lib/types/database';

interface PipelineStepperProps {
  currentStatus: ChallengeStatus;
  onAdvance: () => void;
  onRetreat: () => void;
}

export function PipelineStepper({ currentStatus, onAdvance, onRetreat }: PipelineStepperProps) {
  const currentIndex = CHALLENGE_STATUSES.indexOf(currentStatus);
  const hasNext = currentIndex < CHALLENGE_STATUSES.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Stepper visualization */}
      <div className="flex items-center gap-0">
        {CHALLENGE_STATUSES.map((status, i) => {
          const config = STATUS_CONFIG[status];
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          return (
            <div key={status} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                    isCurrent
                      ? 'border-current text-white'
                      : isCompleted
                      ? 'border-current text-white'
                      : 'border-border-light text-text-light bg-surface'
                  }`}
                  style={
                    isCurrent || isCompleted
                      ? { backgroundColor: config.color, borderColor: config.color }
                      : undefined
                  }
                >
                  {isCompleted ? (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 text-center leading-tight ${
                    isCurrent ? 'font-semibold' : isFuture ? 'text-text-light' : 'text-text-muted'
                  }`}
                  style={isCurrent ? { color: config.color } : undefined}
                >
                  {config.label}
                </span>
              </div>
              {i < CHALLENGE_STATUSES.length - 1 && (
                <div
                  className={`h-0.5 flex-shrink-0 w-full -mt-4 ${
                    i < currentIndex ? 'bg-accent' : 'bg-border-light'
                  }`}
                  style={i < currentIndex ? { backgroundColor: STATUS_CONFIG[CHALLENGE_STATUSES[i + 1]].color } : undefined}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 justify-end">
        {hasPrev && (
          <button
            onClick={onRetreat}
            className="text-xs text-text-muted hover:text-text cursor-pointer transition-colors"
          >
            Move back to {STATUS_CONFIG[CHALLENGE_STATUSES[currentIndex - 1]].label}
          </button>
        )}
        {hasNext && (
          <button
            onClick={onAdvance}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-[var(--radius-md)] bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer"
          >
            Advance to {STATUS_CONFIG[CHALLENGE_STATUSES[currentIndex + 1]].label} →
          </button>
        )}
      </div>
    </div>
  );
}

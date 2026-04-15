'use client';

import Link from 'next/link';

interface ExploreNavProps {
  onToggleFilter?: () => void;
  filterOpen?: boolean;
}

export function ExploreNav({ onToggleFilter, filterOpen }: ExploreNavProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            href="/"
            className="flex items-center gap-2 bg-surface/90 backdrop-blur-sm border border-border-light rounded-[var(--radius-md)] px-3 py-2 text-sm font-body font-medium text-text-muted hover:text-text transition-colors shadow-sm"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 14l-6-6 6-6" />
            </svg>
            safe@home
          </Link>
        </div>
        {onToggleFilter && (
          <button
            onClick={onToggleFilter}
            className={`pointer-events-auto flex items-center gap-2 bg-surface/90 backdrop-blur-sm border border-border-light rounded-[var(--radius-md)] px-3 py-2 text-sm font-body font-medium transition-colors shadow-sm cursor-pointer ${
              filterOpen ? 'text-accent' : 'text-text-muted hover:text-text'
            }`}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 4h12M4 8h8M6 12h4" />
            </svg>
            Filters
          </button>
        )}
      </div>
    </header>
  );
}

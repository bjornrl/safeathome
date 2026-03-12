'use client';

import { WORK_PACKAGES, FIELD_SITES, WP_CONFIG } from '@/lib/constants';
import type { WorkPackage, FieldSite } from '@/lib/types/database';

interface InsightFiltersProps {
  selectedWP: WorkPackage | null;
  setSelectedWP: (wp: WorkPackage | null) => void;
  selectedSite: FieldSite | null;
  setSelectedSite: (site: FieldSite | null) => void;
  flaggedOnly: boolean;
  setFlaggedOnly: (flagged: boolean) => void;
  search: string;
  setSearch: (s: string) => void;
}

export function InsightFilters({
  selectedWP,
  setSelectedWP,
  selectedSite,
  setSelectedSite,
  flaggedOnly,
  setFlaggedOnly,
  search,
  setSearch,
}: InsightFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search insights..."
          className="w-full sm:w-64 px-3 py-2 text-sm bg-surface border border-border rounded-[var(--radius-md)] text-text placeholder:text-text-light focus:outline-none focus:border-accent transition-colors"
        />
        <button
          onClick={() => setFlaggedOnly(!flaggedOnly)}
          className={`px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] border transition-colors cursor-pointer ${
            flaggedOnly
              ? 'bg-accent-light border-accent text-accent'
              : 'border-border text-text-muted hover:border-border hover:bg-surface-alt'
          }`}
        >
          ⚑ Design-flagged
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-text-muted self-center mr-1">WP:</span>
        <PillButton active={selectedWP === null} onClick={() => setSelectedWP(null)}>
          All
        </PillButton>
        {WORK_PACKAGES.map((wp) => (
          <PillButton
            key={wp}
            active={selectedWP === wp}
            onClick={() => setSelectedWP(wp)}
            dotColor={WP_CONFIG[wp].dot}
          >
            {wp}
          </PillButton>
        ))}
        <span className="text-xs font-medium text-text-muted self-center ml-3 mr-1">Site:</span>
        <PillButton active={selectedSite === null} onClick={() => setSelectedSite(null)}>
          All
        </PillButton>
        {FIELD_SITES.map((site) => (
          <PillButton
            key={site}
            active={selectedSite === site}
            onClick={() => setSelectedSite(site)}
          >
            {site}
          </PillButton>
        ))}
      </div>
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dotColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
        active
          ? 'bg-accent-light border-accent text-accent'
          : 'border-border-light text-text-muted hover:border-border hover:bg-surface-alt'
      }`}
    >
      {dotColor && (
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
      )}
      {children}
    </button>
  );
}

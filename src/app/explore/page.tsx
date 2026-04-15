import { Suspense } from 'react';
import { ExploreMap } from '@/components/map/explore-map';

export const metadata = {
  title: 'Explore — safe@home',
  description: 'Explore stories of care, technology, and migration on an interactive map.',
};

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-canvas flex items-center justify-center">
        <p className="text-sm font-body text-text-muted">Loading map...</p>
      </div>
    }>
      <ExploreMap />
    </Suspense>
  );
}

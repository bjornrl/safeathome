'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SEED_STORIES, FRICTION_MAP } from '@/lib/map-data';
import type { StoryNode, FrictionType, QualityType } from '@/lib/map-data';
import { ExploreNav } from '@/components/layout/explore-nav';
import { StoryPanel } from './story-panel';
import { FilterPanel } from './filter-panel';

export function ExploreMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const searchParams = useSearchParams();
  const initialFriction = searchParams.get('friction') as FrictionType | null;

  const [selectedStory, setSelectedStory] = useState<StoryNode | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFrictions, setActiveFrictions] = useState<Set<FrictionType>>(
    initialFriction ? new Set([initialFriction]) : new Set()
  );
  const [activeQualities, setActiveQualities] = useState<Set<QualityType>>(new Set());

  const filteredStories = SEED_STORIES.filter((story) => {
    if (activeFrictions.size > 0 && !activeFrictions.has(story.friction)) return false;
    if (activeQualities.size > 0 && !story.qualities.some((q) => activeQualities.has(q))) return false;
    return true;
  });

  const handleToggleFriction = useCallback((id: FrictionType) => {
    setActiveFrictions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleQuality = useCallback((id: QualityType) => {
    setActiveQualities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFrictions(new Set());
    setActiveQualities(new Set());
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [10.82, 59.91],
      zoom: 12,
      pitch: 30,
      maxPitch: 60,
    });

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers and lines when filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Wait for map style to load
    const update = () => {
      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Remove old connection lines source/layer
      if (map.getLayer('connection-lines')) map.removeLayer('connection-lines');
      if (map.getSource('connections')) map.removeSource('connections');

      const filteredIds = new Set(filteredStories.map((s) => s.id));

      // Add markers
      filteredStories.forEach((story) => {
        const friction = FRICTION_MAP[story.friction];

        const el = document.createElement('div');
        el.style.width = '18px';
        el.style.height = '18px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = friction.color;
        el.style.border = '2.5px solid white';
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)';
        el.style.cursor = 'pointer';
        el.style.transition = 'width 0.15s ease, height 0.15s ease, margin 0.15s ease';

        el.addEventListener('mouseenter', () => {
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.margin = '-3px 0 0 -3px';
        });
        el.addEventListener('mouseleave', () => {
          el.style.width = '18px';
          el.style.height = '18px';
          el.style.margin = '0';
        });

        el.addEventListener('click', () => {
          setSelectedStory(story);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([story.lng, story.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Build connection lines
      const lines: GeoJSON.Feature<GeoJSON.LineString>[] = [];
      const seen = new Set<string>();

      filteredStories.forEach((story) => {
        story.connections.forEach((targetId) => {
          if (!filteredIds.has(targetId)) return;
          const key = [story.id, targetId].sort().join('-');
          if (seen.has(key)) return;
          seen.add(key);

          const target = SEED_STORIES.find((s) => s.id === targetId);
          if (!target) return;

          lines.push({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [story.lng, story.lat],
                [target.lng, target.lat],
              ],
            },
          });
        });
      });

      map.addSource('connections', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: lines },
      });

      map.addLayer({
        id: 'connection-lines',
        type: 'line',
        source: 'connections',
        paint: {
          'line-color': '#A09A8E',
          'line-width': 1.5,
          'line-opacity': 0.4,
          'line-dasharray': [4, 3],
        },
      });
    };

    if (map.isStyleLoaded()) {
      update();
    } else {
      map.on('load', update);
    }
  }, [filteredStories]);

  return (
    <div className="relative w-full h-screen">
      <ExploreNav
        onToggleFilter={() => setFilterOpen(!filterOpen)}
        filterOpen={filterOpen}
      />

      <FilterPanel
        open={filterOpen}
        activeFrictions={activeFrictions}
        activeQualities={activeQualities}
        onToggleFriction={handleToggleFriction}
        onToggleQuality={handleToggleQuality}
        onClear={handleClearFilters}
      />

      <div ref={mapContainer} className="w-full h-full" />

      <StoryPanel story={selectedStory} onClose={() => setSelectedStory(null)} />
    </div>
  );
}

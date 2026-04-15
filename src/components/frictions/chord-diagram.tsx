'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import Link from 'next/link';
import { FRICTIONS, FRICTION_MAP, SEED_STORIES } from '@/lib/map-data';
import type { FrictionType, StoryNode } from '@/lib/map-data';

// Build a co-occurrence matrix: how many stories share friction pair (i, j)
function buildMatrix(): number[][] {
  const n = FRICTIONS.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));

  // Each story has ONE friction, but stories are connected.
  // Co-occurrence = stories connected to each other with different frictions.
  // Actually, let's count: for each pair of frictions, how many connection edges exist
  // between a story of friction A and a story of friction B.
  const frictionIndex = new Map(FRICTIONS.map((f, i) => [f.id, i]));

  SEED_STORIES.forEach((story) => {
    const i = frictionIndex.get(story.friction)!;
    story.connections.forEach((connId) => {
      const target = SEED_STORIES.find((s) => s.id === connId);
      if (!target) return;
      const j = frictionIndex.get(target.friction)!;
      if (i !== j) {
        matrix[i][j] += 1;
      }
    });
  });

  // Make symmetric and add self-links (story count per friction) for segment size
  for (let i = 0; i < n; i++) {
    matrix[i][i] = SEED_STORIES.filter((s) => s.friction === FRICTIONS[i].id).length;
    for (let j = i + 1; j < n; j++) {
      const avg = Math.max(matrix[i][j], matrix[j][i]);
      matrix[i][j] = avg;
      matrix[j][i] = avg;
    }
  }

  return matrix;
}

function getStoriesForFriction(friction: FrictionType): StoryNode[] {
  return SEED_STORIES.filter((s) => s.friction === friction);
}

function getStoriesForPair(a: FrictionType, b: FrictionType): StoryNode[] {
  const aStories = new Set(
    SEED_STORIES.filter((s) => s.friction === a).flatMap((s) => [s.id, ...s.connections])
  );
  const bStories = SEED_STORIES.filter((s) => s.friction === b);
  // Stories of type B that are connected to stories of type A
  const connected = bStories.filter((s) =>
    aStories.has(s.id) || s.connections.some((c) => {
      const cs = SEED_STORIES.find((x) => x.id === c);
      return cs && cs.friction === a;
    })
  );
  // Plus stories of type A connected to type B
  const aConnected = SEED_STORIES.filter(
    (s) => s.friction === a && s.connections.some((c) => {
      const cs = SEED_STORIES.find((x) => x.id === c);
      return cs && cs.friction === b;
    })
  );
  const ids = new Set([...connected.map((s) => s.id), ...aConnected.map((s) => s.id)]);
  return SEED_STORIES.filter((s) => ids.has(s.id));
}

interface Selection {
  type: 'friction' | 'pair';
  friction?: FrictionType;
  frictionA?: FrictionType;
  frictionB?: FrictionType;
}

export function ChordDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);

  const matrix = useRef(buildMatrix()).current;

  const selectedStories = selection
    ? selection.type === 'friction'
      ? getStoriesForFriction(selection.friction!)
      : getStoriesForPair(selection.frictionA!, selection.frictionB!)
    : null;

  const drawChord = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const container = svg.parentElement!;
    const size = Math.min(container.clientWidth, 500);
    const outerRadius = size / 2 - 40;
    const innerRadius = outerRadius - 20;

    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));

    d3.select(svg).selectAll('*').remove();

    const g = d3.select(svg)
      .append('g')
      .attr('transform', `translate(${size / 2},${size / 2})`);

    const chord = d3.chord()
      .padAngle(0.06)
      .sortSubgroups(d3.descending);

    const chords = chord(matrix);

    const arc = d3.arc<d3.ChordGroup>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3.ribbon<d3.Chord, d3.ChordSubgroup>()
      .radius(innerRadius);

    // Draw ribbons (chords)
    g.append('g')
      .selectAll('path')
      .data(chords.filter((d) => d.source.index !== d.target.index))
      .join('path')
      .attr('d', ribbon as unknown as string)
      .attr('fill', (d) => FRICTIONS[d.source.index].color)
      .attr('fill-opacity', (d) => {
        if (hoveredGroup !== null) {
          return d.source.index === hoveredGroup || d.target.index === hoveredGroup ? 0.6 : 0.05;
        }
        return 0.35;
      })
      .attr('stroke', 'none')
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        setSelection({
          type: 'pair',
          frictionA: FRICTIONS[d.source.index].id,
          frictionB: FRICTIONS[d.target.index].id,
        });
      });

    // Draw group arcs
    const groupG = g.append('g')
      .selectAll('g')
      .data(chords.groups)
      .join('g');

    groupG.append('path')
      .attr('d', arc as unknown as string)
      .attr('fill', (d) => FRICTIONS[d.index].color)
      .attr('fill-opacity', (d) => {
        if (hoveredGroup !== null) {
          return d.index === hoveredGroup ? 1 : 0.3;
        }
        return 0.85;
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => setHoveredGroup(d.index))
      .on('mouseleave', () => setHoveredGroup(null))
      .on('click', (_, d) => {
        setSelection({ type: 'friction', friction: FRICTIONS[d.index].id });
      });

    // Labels
    groupG.append('text')
      .each((d) => { (d as unknown as { angle: number }).angle = (d.startAngle + d.endAngle) / 2; })
      .attr('dy', '0.35em')
      .attr('transform', (d) => {
        const a = (d as unknown as { angle: number }).angle;
        const rotate = (a * 180) / Math.PI - 90;
        const flip = a > Math.PI;
        return `rotate(${rotate}) translate(${outerRadius + 12}) ${flip ? 'rotate(180)' : ''}`;
      })
      .attr('text-anchor', (d) => {
        const a = (d as unknown as { angle: number }).angle;
        return a > Math.PI ? 'end' : 'start';
      })
      .attr('font-family', 'var(--font-body), system-ui, sans-serif')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', (d) => {
        if (hoveredGroup !== null) {
          return d.index === hoveredGroup ? FRICTIONS[d.index].color : '#A09A8E';
        }
        return '#2C2A25';
      })
      .text((d) => FRICTIONS[d.index].label);
  }, [matrix, hoveredGroup]);

  useEffect(() => {
    drawChord();
    const handleResize = () => drawChord();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawChord]);

  return (
    <div>
      {/* Diagram */}
      <div className="flex justify-center">
        <div className="w-full max-w-[500px]">
          <svg ref={svgRef} className="w-full" />
        </div>
      </div>

      {/* Legend / selection info */}
      <div className="mt-6 text-center">
        {selection ? (
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              {selection.type === 'friction' ? (
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-body font-semibold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: FRICTION_MAP[selection.friction!].color }}
                >
                  {FRICTION_MAP[selection.friction!].label}
                </span>
              ) : (
                <>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-body font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: FRICTION_MAP[selection.frictionA!].color }}
                  >
                    {FRICTION_MAP[selection.frictionA!].label}
                  </span>
                  <span className="text-text-muted text-sm">&</span>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-body font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: FRICTION_MAP[selection.frictionB!].color }}
                  >
                    {FRICTION_MAP[selection.frictionB!].label}
                  </span>
                </>
              )}
              <button
                onClick={() => setSelection(null)}
                className="text-xs font-body text-text-muted hover:text-accent ml-2 cursor-pointer"
              >
                Clear
              </button>
            </div>
            <p className="text-sm text-text-muted font-body">
              {selectedStories?.length} {selectedStories?.length === 1 ? 'story' : 'stories'}
            </p>
          </div>
        ) : (
          <p className="text-sm text-text-muted font-body">
            Click a segment to filter by friction, or click an arc to see shared stories
          </p>
        )}
      </div>

      {/* Story results */}
      <div className="mt-8 space-y-3">
        {(selectedStories ?? SEED_STORIES).map((story) => {
          const friction = FRICTION_MAP[story.friction];
          return (
            <Link
              key={story.id}
              href={`/story/${story.id}`}
              className="block bg-surface border border-border-light rounded-[var(--radius-md)] p-4 hover:border-border transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: friction.color }}
                />
                <span className="text-xs font-body font-semibold" style={{ color: friction.color }}>
                  {friction.label}
                </span>
                <span className="text-xs font-body text-text-light uppercase tracking-wide">
                  {story.scale}
                </span>
              </div>
              <h3 className="font-heading text-base font-semibold text-text">{story.title}</h3>
              <p className="mt-1 text-sm font-heading text-text-muted line-clamp-2">{story.summary}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

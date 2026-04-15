import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PublicNav } from '@/components/layout/public-nav';
import {
  SEED_STORIES,
  STORY_MAP,
  FRICTION_MAP,
  QUALITY_MAP,
  SEED_SOLUTIONS,
  SOLUTION_STAGES,
} from '@/lib/map-data';

export function generateStaticParams() {
  return SEED_STORIES.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  // We need to resolve the promise synchronously for metadata, so we use a workaround
  return params.then(({ id }) => {
    const story = STORY_MAP[id];
    if (!story) return { title: 'Story not found — safe@home' };
    return {
      title: `${story.title} — safe@home`,
      description: story.summary,
    };
  });
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = STORY_MAP[id];
  if (!story) notFound();

  const friction = FRICTION_MAP[story.friction];

  const connectedStories = story.connections
    .map((cid) => STORY_MAP[cid])
    .filter(Boolean);

  const linkedSolutions = SEED_SOLUTIONS.filter(
    (sol) => sol.source_stories.includes(story.id) || sol.frictions.includes(story.friction)
  );

  const scaleLabels: Record<string, string> = {
    micro: 'Micro — Inside the home',
    meso: 'Meso — The neighborhood',
    macro: 'Macro — The city',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm font-body text-text-muted mb-8">
            <Link href="/insights" className="hover:text-accent transition-colors">
              Insights
            </Link>
            <span>/</span>
            <span className="text-text">{story.title}</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 text-sm font-body font-semibold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: friction.color }}
            >
              {friction.label}
            </span>
            <span className="text-sm font-body text-text-light">
              {scaleLabels[story.scale]}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text leading-tight">
            {story.title}
          </h1>

          <p className="mt-6 text-base sm:text-lg font-heading text-text leading-relaxed">
            {story.summary}
          </p>

          {/* Friction detail */}
          <div className="mt-8 bg-surface border border-border-light rounded-[var(--radius-md)] p-5">
            <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wide mb-2">
              Care friction
            </p>
            <div className="flex items-start gap-3">
              <span
                className="w-3 h-3 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: friction.color }}
              />
              <div>
                <p className="font-body font-semibold text-sm text-text">{friction.label}</p>
                <p className="text-sm font-heading text-text-muted">{friction.description}</p>
              </div>
            </div>
          </div>

          {/* Qualities */}
          {story.qualities.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wide mb-3">
                Care qualities present
              </p>
              <div className="space-y-2">
                {story.qualities.map((qId) => {
                  const q = QUALITY_MAP[qId];
                  return (
                    <div key={qId} className="flex items-start gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: q.color }}
                      />
                      <div>
                        <span className="text-sm font-body font-medium text-text">{q.label}</span>
                        <span className="text-sm font-heading text-text-muted ml-2">{q.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Connected stories */}
          {connectedStories.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wide mb-3">
                Connected stories
              </p>
              <div className="space-y-2">
                {connectedStories.map((cs) => {
                  const cf = FRICTION_MAP[cs.friction];
                  return (
                    <Link
                      key={cs.id}
                      href={`/story/${cs.id}`}
                      className="flex items-center gap-3 bg-surface border border-border-light rounded-[var(--radius-sm)] p-3 hover:border-border transition-colors"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cf.color }}
                      />
                      <div>
                        <span className="text-sm font-heading font-semibold text-text">{cs.title}</span>
                        <span className="text-xs font-body text-text-light ml-2">{cf.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map link */}
          <div className="mt-8">
            <Link
              href={`/explore?story=${story.id}`}
              className="inline-flex items-center gap-2 text-sm font-body font-medium text-accent hover:text-accent-hover transition-colors"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="6" />
                <path d="M8 4v4l2.5 2.5" />
              </svg>
              View on map
            </Link>
          </div>

          {/* Design responses */}
          {linkedSolutions.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border-light">
              <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wide mb-4">
                Design responses
              </p>
              <div className="space-y-3">
                {linkedSolutions.map((sol) => {
                  const stageConfig = SOLUTION_STAGES.find((s) => s.id === sol.stage)!;
                  return (
                    <Link
                      key={sol.id}
                      href="/solutions"
                      className="block bg-surface border border-border-light rounded-[var(--radius-md)] p-4 hover:border-border transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-xs font-body font-semibold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: stageConfig.color }}
                        >
                          {stageConfig.label}
                        </span>
                      </div>
                      <h3 className="font-heading text-base font-semibold text-text">
                        {sol.title}
                      </h3>
                      <p className="mt-1 text-sm font-heading text-text-muted line-clamp-2">
                        {sol.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

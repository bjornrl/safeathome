import { PublicNav } from '@/components/layout/public-nav';
import { InsightsList } from '@/components/insights/insights-list';

export const metadata = {
  title: 'Insights — safe@home',
  description: 'Stories of care, technology, and migration from the SAFE@HOME research project.',
};

export default function PublicInsightsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text">
            Insights
          </h1>
          <p className="mt-3 font-heading text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl">
            Stories from the field — each one captures a moment where care systems,
            technology, and migration intersect in the lives of aging immigrants.
          </p>
          <InsightsList />
        </div>
      </main>
    </div>
  );
}

import { PublicNav } from '@/components/layout/public-nav';
import { QualityColumns } from '@/components/qualities/quality-columns';

export const metadata = {
  title: 'Care Qualities — safe@home',
  description: 'How aging immigrants actually live, cope, and sustain care across borders.',
};

export default function QualitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text">
              Care qualities
            </h1>
            <p className="mt-2 text-lg font-heading text-text-muted italic">
              How people actually live and cope
            </p>
            <p className="mt-4 text-base font-heading text-text leading-relaxed">
              These describe the realities, strategies, and strengths of aging immigrants and their
              families. Stories appear in every column where a quality is present &mdash; the
              repetition reveals how tightly woven these experiences are.
            </p>
          </div>
          <div className="mt-10">
            <QualityColumns />
          </div>
        </div>
      </main>
    </div>
  );
}

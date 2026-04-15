import { PublicNav } from '@/components/layout/public-nav';
import { SolutionsList } from '@/components/solutions/solutions-list';

export const metadata = {
  title: 'Design Responses — safe@home',
  description: 'From observation to intervention — design responses to care frictions.',
};

export default function SolutionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text">
            Design responses
          </h1>
          <p className="mt-2 text-lg font-heading text-text-muted italic">
            From observation to intervention
          </p>
          <p className="mt-4 text-base font-heading text-text leading-relaxed max-w-2xl">
            When the research reveals a friction, the design team responds. These are the
            interventions being developed, tested, and refined &mdash; tracing the journey from
            field observation to practical solution.
          </p>
          <SolutionsList />
        </div>
      </main>
    </div>
  );
}

import { PublicNav } from '@/components/layout/public-nav';
import { ChordDiagram } from '@/components/frictions/chord-diagram';

export const metadata = {
  title: 'Care Frictions — safe@home',
  description: 'How seven systemic care frictions interrelate across stories of aging immigrants.',
};

export default function FrictionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text">
            Care frictions
          </h1>
          <p className="mt-2 text-lg font-heading text-text-muted italic">
            Seven ways the system collides with reality
          </p>
          <p className="mt-4 text-base font-heading text-text leading-relaxed max-w-2xl">
            Care frictions are the points where institutional logic rubs against lived experience.
            The diagram below shows how these frictions co-occur across stories &mdash; connected
            arcs reveal which systemic mechanisms tend to appear together, exposing deeper patterns
            in how the system fails.
          </p>
          <div className="mt-10">
            <ChordDiagram />
          </div>
        </div>
      </main>
    </div>
  );
}

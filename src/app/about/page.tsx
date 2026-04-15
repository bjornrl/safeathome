import { PublicNav } from '@/components/layout/public-nav';

export const metadata = {
  title: 'About — safe@home',
  description: 'About the SAFE@HOME research project.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text">
            About the project
          </h1>
          <div className="mt-8 space-y-5 font-heading text-base sm:text-lg text-text leading-relaxed">
            <p>
              SAFE@HOME (2026&ndash;2029) is a collaborative research project investigating how
              Norway&apos;s homecare services can be adapted for aging immigrants. The project brings
              together researchers from OsloMet, University of Oslo, and Durham University, alongside
              the design studio Comte Bureau and three municipal partners.
            </p>
            <p>
              Using ethnographic methods and participatory design, we work across three field sites
              &mdash; Alna and S&oslash;ndre Nordstrand in Oslo, and Skien in Telemark &mdash; to
              understand how care technologies, institutional practices, and transnational family
              networks shape the experience of aging in place.
            </p>
            <p>
              This platform is both a research tool and a public-facing resource. It maps the stories,
              frictions, and qualities that emerge from our fieldwork, making visible the gap between
              policy intentions and lived realities.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

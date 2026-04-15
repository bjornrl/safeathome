import Link from 'next/link';
import { PublicNav } from '@/components/layout/public-nav';
import { FRICTIONS, QUALITIES } from '@/lib/map-data';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-text leading-tight">
            safe@home
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-heading text-text-muted italic">
            Technologies of care for aging migrants
          </p>
          <p className="mt-8 text-base sm:text-lg font-heading text-text leading-relaxed max-w-2xl mx-auto">
            What happens when Norway&apos;s homecare reform meets the reality of transnational
            households? This platform maps the experiences of aging immigrants navigating care,
            technology, and belonging across three scales&nbsp;&mdash; from the intimacy of a bedroom
            to the policies that shape a city.
          </p>
          <div className="mt-10">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-body font-semibold text-base px-6 py-3 rounded-[var(--radius-md)] transition-colors shadow-sm"
            >
              Explore the map
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Four ways to explore */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 bg-surface">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-text text-center mb-10">
              Four ways to explore
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: '/explore', title: 'Explore the map', desc: 'Navigate from bedroom to city hall', color: '#3A8A7D', icon: 'M3 7l6-4 6 4 6-4v12l-6 4-6-4-6 4z' },
                { href: '/frictions', title: 'Care frictions', desc: 'How systemic mechanisms interrelate', color: '#9B59B6', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM8 12a4 4 0 108 0 4 4 0 00-8 0' },
                { href: '/qualities', title: 'Care qualities', desc: 'How people actually live and cope', color: '#5B6AAF', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z' },
                { href: '/solutions', title: 'Design solutions', desc: 'From observation to intervention', color: '#2D6A4F', icon: 'M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-canvas border border-border-light rounded-[var(--radius-lg)] p-5 hover:border-border transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center mb-4"
                    style={{ backgroundColor: item.color + '18' }}
                  >
                    <svg width="20" height="20" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="font-body font-semibold text-sm text-text group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-heading text-text-muted">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About the project */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 bg-surface">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-text">
              A research platform for the Bo Trygt Hjemme reform
            </h2>
            <div className="mt-8 space-y-5 text-base sm:text-lg font-heading text-text leading-relaxed">
              <p>
                SAFE@HOME is a collaborative research project (2026&ndash;2029) between OsloMet,
                University of Oslo, Durham University, Comte Bureau, and three municipalities &mdash;
                Alna and S&oslash;ndre Nordstrand in Oslo, and Skien in Telemark. The project
                investigates how homecare services can be adapted for Norway&apos;s growing aging
                immigrant population.
              </p>
              <p>
                As Norway implements the Bo Trygt Hjemme reform, promising more personalized care at
                home, questions arise about whose homes, whose norms, and whose technologies are
                centered. SAFE@HOME uses ethnographic research and co-design methods to surface the
                experiences that standard metrics miss.
              </p>
              <p>
                The project is organized into four interconnected work packages, each examining a
                different dimension of how care, technology, and migration intersect:
              </p>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {[
                { wp: 'WP1', title: 'Homes & Communities', desc: 'How material spaces and social dynamics shape homecare', color: '#C45D3E', bg: '#FDF0EC' },
                { wp: 'WP2', title: 'Health & Care Institutions', desc: 'What barriers and enablers shape service access', color: '#3A8A7D', bg: '#E6F3F1' },
                { wp: 'WP3', title: 'Transnational Contexts', desc: 'How cross-border ties affect aging in place', color: '#5B6AAF', bg: '#ECEEF7' },
                { wp: 'WP4', title: 'Innovation & Design', desc: 'Co-creating practical solutions with users and municipalities', color: '#A08620', bg: '#FFF8E6' },
              ].map((item) => (
                <div
                  key={item.wp}
                  className="rounded-[var(--radius-md)] border border-border-light p-5"
                  style={{ backgroundColor: item.bg }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-body font-semibold text-text-muted">{item.wp}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-text">{item.title}</h3>
                  <p className="mt-1 text-sm font-heading text-text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Three scales */}
        <section className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-text">
              From bedroom to city hall
            </h2>
            <p className="mt-4 text-base sm:text-lg font-heading text-text-muted leading-relaxed">
              The map lets you move across three interconnected scales of care. Zoom in to see how a
              sensor on a nightstand connects to a policy written in a municipal office.
            </p>
            <div className="mt-10 space-y-6">
              {[
                { scale: 'Micro', place: 'Inside the home', desc: 'Where care technologies meet daily life &mdash; the bedroom, the kitchen, the prayer rug beside the fall sensor.' },
                { scale: 'Meso', place: 'The neighborhood', desc: 'Where services interact with people &mdash; the health center, the community gathering, the grandson translating at the pharmacy.' },
                { scale: 'Macro', place: 'The city', desc: 'Where policies ripple into households &mdash; reform documents, municipal budgets, the gap between intention and lived reality.' },
              ].map((item) => (
                <div key={item.scale} className="flex gap-5 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-[var(--radius-md)] bg-surface-alt border border-border-light flex items-center justify-center">
                    <span className="text-sm font-body font-bold text-text-muted">
                      {item.scale.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-text">
                      {item.scale}: {item.place}
                    </h3>
                    <p
                      className="mt-1 text-sm sm:text-base font-heading text-text-muted leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.desc }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Frictions */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 bg-surface">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-text">
              Seven ways the system collides with reality
            </h2>
            <p className="mt-4 text-base font-heading text-text-muted leading-relaxed">
              Care frictions are the points where institutional logic rubs against lived experience.
              Each marks a place where the system could work differently.
            </p>
            <div className="mt-10 grid sm:grid-cols-2 gap-3">
              {FRICTIONS.map((f) => (
                <Link
                  key={f.id}
                  href={`/explore?friction=${f.id}`}
                  className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border-light bg-canvas hover:bg-surface-alt p-4 transition-colors group"
                >
                  <span
                    className="shrink-0 w-3 h-3 rounded-full mt-1"
                    style={{ backgroundColor: f.color }}
                  />
                  <div>
                    <span className="font-body font-semibold text-sm text-text group-hover:text-accent transition-colors">
                      {f.label}
                    </span>
                    <p className="text-sm font-heading text-text-muted mt-0.5">{f.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Qualities */}
        <section className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-text">
              How people actually live and cope
            </h2>
            <p className="mt-4 text-base font-heading text-text-muted leading-relaxed">
              These describe the realities, strategies, and strengths of aging immigrants and their
              families &mdash; the ways people sustain care and connection despite systemic friction.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {QUALITIES.map((q) => (
                <span
                  key={q.id}
                  className="inline-block rounded-full border border-border-light bg-surface px-4 py-2 text-sm font-body font-medium text-text-muted"
                  title={q.description}
                >
                  {q.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 bg-surface-alt text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-text">
              Ready to explore?
            </h2>
            <p className="mt-3 text-base font-heading text-text-muted">
              Navigate stories of care, technology, and migration on an interactive map.
            </p>
            <div className="mt-8">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-body font-semibold text-base px-6 py-3 rounded-[var(--radius-md)] transition-colors shadow-sm"
              >
                Open the map
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-body">
              <Link href="/about" className="text-text-muted hover:text-accent transition-colors">
                About the project
              </Link>
              <span className="text-border">|</span>
              <Link href="/reading-room" className="text-text-muted hover:text-accent transition-colors">
                Reading Room
              </Link>
              <span className="text-border">|</span>
              <Link href="/for-municipalities" className="text-text-muted hover:text-accent transition-colors">
                For Municipalities
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-12 border-t border-border-light">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-body font-semibold text-text-muted mb-4">Project partners</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-body text-text-muted">
              <span>OsloMet</span>
              <span>University of Oslo</span>
              <span>Durham University</span>
              <span>Comte Bureau</span>
            </div>
            <p className="text-sm font-body font-semibold text-text-muted mt-6 mb-4">
              Municipality partners
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-body text-text-muted">
              <span>Alna District</span>
              <span>S&oslash;ndre Nordstrand</span>
              <span>Skien Municipality</span>
            </div>
            <p className="mt-8 text-xs text-text-light">
              &copy; 2026 SAFE@HOME Research Project
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

import { PublicNav } from '@/components/layout/public-nav';

export const metadata = {
  title: 'For Municipalities — safe@home',
  description: 'Resources and findings for municipal partners in the SAFE@HOME project.',
};

export default function ForMunicipalitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text">
            For Municipalities
          </h1>
          <p className="mt-6 font-heading text-base sm:text-lg text-text-muted leading-relaxed">
            This section will contain practical resources, toolkits, and findings tailored for
            municipal partners working to adapt homecare services for aging immigrants. Coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}

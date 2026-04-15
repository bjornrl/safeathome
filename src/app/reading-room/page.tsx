import { PublicNav } from '@/components/layout/public-nav';

export const metadata = {
  title: 'Reading Room — safe@home',
  description: 'Publications, working papers, and resources from the SAFE@HOME project.',
};

export default function ReadingRoomPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text">
            Reading Room
          </h1>
          <p className="mt-6 font-heading text-base sm:text-lg text-text-muted leading-relaxed">
            Publications, working papers, and resources from the SAFE@HOME project will be collected
            here as the research progresses. Check back soon.
          </p>
        </div>
      </main>
    </div>
  );
}

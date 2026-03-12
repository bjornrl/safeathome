'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { Profile } from '@/lib/types/database';

const navItems = [
  { href: '/insights', label: 'Insights' },
  { href: '/challenges', label: 'Challenges' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          .then(({ data }) => setProfile(data));
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <header className="bg-surface border-b border-border-light sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/insights" className="font-heading text-lg font-semibold text-text">
            safe@home
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'bg-accent-light text-accent'
                    : 'text-text-muted hover:text-text hover:bg-surface-alt'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center text-xs font-semibold">
              {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
            </span>
            <span className="hidden sm:inline">{profile?.full_name || 'Loading...'}</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border-light rounded-[var(--radius-md)] shadow-lg py-1 z-40">
              <div className="px-3 py-2 border-b border-border-light">
                <p className="text-sm font-medium text-text">{profile?.full_name}</p>
                <p className="text-xs text-text-muted">{profile?.institution}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-alt transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/explore', label: 'Explore' },
  { href: '/frictions', label: 'Frictions' },
  { href: '/qualities', label: 'Qualities' },
  { href: '/insights', label: 'Insights' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/about', label: 'About' },
];

export function PublicNav() {
  const pathname = usePathname();

  return (
    <header className="bg-surface/80 backdrop-blur-sm border-b border-border-light sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-heading text-lg font-semibold text-text">
          safe@home
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-sm font-body font-medium rounded-[var(--radius-sm)] transition-colors ${
                pathname === item.href
                  ? 'bg-accent-light text-accent'
                  : 'text-text-muted hover:text-text hover:bg-surface-alt'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="sm:hidden text-text-muted hover:text-text"
          aria-label="Menu"
          onClick={() => {
            const el = document.getElementById('mobile-nav');
            el?.classList.toggle('hidden');
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <nav id="mobile-nav" className="hidden sm:hidden border-t border-border-light bg-surface px-4 pb-3 pt-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block py-2 text-sm font-body font-medium ${
              pathname === item.href ? 'text-accent' : 'text-text-muted'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

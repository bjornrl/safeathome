'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarItems = [
  { href: '/insights', label: 'Research Insights', icon: '◉' },
  { href: '/challenges', label: 'Design Challenges', icon: '◈' },
  { href: '/new/insight', label: 'New Insight', icon: '+' },
  { href: '/new/challenge', label: 'New Challenge', icon: '+' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-56 flex-col border-r border-border-light bg-surface py-4 px-3">
      <nav className="flex flex-col gap-0.5">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] transition-colors ${
              pathname.startsWith(item.href)
                ? 'bg-accent-light text-accent'
                : 'text-text-muted hover:text-text hover:bg-surface-alt'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

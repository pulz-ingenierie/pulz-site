'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/admin', label: 'Tableau de bord', exact: true, icon: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z' },
  { href: '/admin/references', label: 'Références', icon: 'M4 4h16v16H4zM4 9h16M9 9v11' },
  { href: '/admin/actualites', label: 'Actualités', icon: 'M4 5h16v14H4zM8 9h8M8 13h8M8 17h5' },
  { href: '/admin/messages', label: 'Messages', icon: 'M4 5h16v11H8l-4 4z' },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="adm-nav">
      {ITEMS.map((it) => {
        const active = it.exact ? path === it.href : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} className={active ? 'active' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d={it.icon} />
            </svg>
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

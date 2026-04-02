'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === '/auth' || pathname === '/dashboard') return null;

  return (
    <nav style={{
      padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: isScrolled ? 'rgba(var(--bg-rgb, 251, 250, 249), 0.9)' : 'var(--bg-color)',
      backdropFilter: isScrolled ? 'blur(12px)' : 'none',
      borderBottom: isScrolled ? '1px solid var(--border-color)' : '1px solid transparent',
      boxShadow: isScrolled ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1000,
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--text-main)' }}>autorepo</span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/auth" className="button button-outline" style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}>
            Sign in
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

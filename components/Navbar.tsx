'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth')
      .then(r => r.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleSignOut = async () => {
    await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ action: 'signout' }), headers: { 'Content-Type': 'application/json' } });
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/models', label: 'Models' },
    { href: '/configurator', label: 'Configure' },
    { href: '/booking', label: 'Test Drive' },
    { href: '/finance', label: 'Finance' },
    { href: '/news', label: 'News' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <div className="logo-oval">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2L13.5 8H20L14.5 12L16.5 18L11 14L5.5 18L7.5 12L2 8H8.5L11 2Z" fill="#C9A84C" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <span className="logo-text">Land Rover</span>
              <span className="logo-sub">Premium Dealership</span>
            </div>
          </Link>

          {/* Nav Links */}
          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {user.role === 'admin' && (
                  <Link href="/admin" className="btn btn-outline btn-sm">Admin</Link>
                )}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleSignOut} className="btn btn-ghost btn-sm">Sign Out</button>
              </div>
            ) : (
              <>
                <Link href="/auth/signin" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link href="/auth/signup" className="btn btn-gold btn-sm">Join Us</Link>
              </>
            )}
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button
          onClick={() => setMobileOpen(false)}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer' }}
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <div style={{ marginBottom: '2rem' }}>
          <span className="logo-text">Land Rover</span>
          <span className="logo-sub">Premium Dealership</span>
        </div>
        <ul className="mobile-menu-links">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="mobile-menu-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {user ? (
            <button onClick={handleSignOut} className="btn btn-outline">Sign Out</button>
          ) : (
            <>
              <Link href="/auth/signin" className="btn btn-outline" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/auth/signup" className="btn btn-gold" onClick={() => setMobileOpen(false)}>Join Us</Link>
            </>
          )}
        </div>
      </div>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998 }}
        />
      )}
    </>
  );
}

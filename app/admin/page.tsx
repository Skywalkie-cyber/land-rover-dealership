'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  cars: number;
  bookings: number;
  users: number;
  contacts: number;
  news: number;
  pendingBookings: number;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  carId: number | null;
  preferredDate: string;
  preferredTime: string;
  message: string | null;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'warning',
  confirmed: 'info',
  completed: 'success',
  cancelled: 'error',
};

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check admin access
    fetch('/api/auth')
      .then(r => r.json())
      .then(data => {
        if (!data.user || data.user.role !== 'admin') {
          router.push('/auth/signin');
        } else {
          loadData();
        }
      });
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/bookings'),
      ]);
      const statsData = await statsRes.json();
      const bookingsData = await bookingsRes.json();
      setStats(statsData.stats);
      setBookings(bookingsData.bookings || []);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch {
      alert('Failed to update booking');
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch {
      alert('Failed to delete booking');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--nav-height)' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <div style={{ paddingTop: 'var(--nav-height)', background: 'var(--surface-1)', borderBottom: '1px solid var(--border)', padding: `calc(var(--nav-height) + 2rem) 0 2rem` }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '0.5rem' }}>Administration</div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 300 }}>
                Admin <span style={{ color: 'var(--gold)' }}>Dashboard</span>
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/" className="btn btn-outline btn-sm">View Site</Link>
              <button onClick={loadData} className="btn btn-gold btn-sm">Refresh</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container section-sm">
        {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: '2.5rem' }}>
          {['overview', 'bookings', 'quick-links'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'quick-links' ? 'Quick Links' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            {/* Stats Grid */}
            <div className="grid-4" style={{ marginBottom: '3rem' }}>
              <div className="stat-card">
                <div className="stat-card-icon">🚗</div>
                <div className="stat-card-value">{stats.cars}</div>
                <div className="stat-card-label">Total Vehicles</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">📅</div>
                <div className="stat-card-value">{stats.bookings}</div>
                <div className="stat-card-label">Total Bookings</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">⏳</div>
                <div className="stat-card-value" style={{ color: 'var(--warning)' }}>{stats.pendingBookings}</div>
                <div className="stat-card-label">Pending Bookings</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">👥</div>
                <div className="stat-card-value">{stats.users}</div>
                <div className="stat-card-label">Registered Users</div>
              </div>
            </div>

            {/* Second row */}
            <div className="grid-3" style={{ marginBottom: '3rem' }}>
              <div className="stat-card">
                <div className="stat-card-icon">📰</div>
                <div className="stat-card-value">{stats.news}</div>
                <div className="stat-card-label">News Articles</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">✉️</div>
                <div className="stat-card-value">{stats.contacts}</div>
                <div className="stat-card-label">Contact Enquiries</div>
              </div>
              <div className="stat-card" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'var(--border-gold)' }}>
                <div className="stat-card-icon">💰</div>
                <div className="stat-card-value" style={{ color: 'var(--gold)' }}>Live</div>
                <div className="stat-card-label">Database Status</div>
              </div>
            </div>

            {/* Recent bookings preview */}
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '1.5rem' }}>
              Recent <span style={{ color: 'var(--gold)' }}>Bookings</span>
            </h2>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map(booking => (
                    <tr key={booking.id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{booking.name}</td>
                      <td>{booking.email}</td>
                      <td>{booking.preferredDate}</td>
                      <td>{booking.preferredTime}</td>
                      <td>
                        <span className={`badge badge-${statusColors[booking.status] || 'gold'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <select
                            value={booking.status}
                            onChange={e => updateBookingStatus(booking.id, e.target.value)}
                            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '2px', cursor: 'pointer' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300 }}>
                All <span style={{ color: 'var(--gold)' }}>Bookings</span>
              </h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {bookings.length} total bookings
              </span>
            </div>

            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                <p>No bookings yet.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td style={{ color: 'var(--text-muted)' }}>#{booking.id}</td>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{booking.name}</td>
                        <td>{booking.email}</td>
                        <td>{booking.phone}</td>
                        <td>{booking.preferredDate}</td>
                        <td>{booking.preferredTime}</td>
                        <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {booking.message || '—'}
                        </td>
                        <td>
                          <span className={`badge badge-${statusColors[booking.status] || 'gold'}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                              value={booking.status}
                              onChange={e => updateBookingStatus(booking.id, e.target.value)}
                              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '2px', cursor: 'pointer' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => deleteBooking(booking.id)}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Quick Links Tab */}
        {activeTab === 'quick-links' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '2rem' }}>
              Quick <span style={{ color: 'var(--gold)' }}>Links</span>
            </h2>
            <div className="grid-3">
              {[
                { title: 'View All Models', desc: 'Browse the full vehicle inventory', href: '/models', icon: '🚗' },
                { title: 'New Test Drive', desc: 'Book a test drive for a customer', href: '/booking', icon: '📅' },
                { title: 'View News', desc: 'See published news articles', href: '/news', icon: '📰' },
                { title: 'Contact Enquiries', desc: 'View customer contact forms', href: '/contact', icon: '✉️' },
                { title: 'Finance Calculator', desc: 'Calculate customer finance', href: '/finance', icon: '💰' },
                { title: 'Car Configurator', desc: 'Build a custom vehicle', href: '/configurator', icon: '⚙️' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: '1.75rem',
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(201,168,76,0.06)', border: '1px solid var(--border-gold)', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '1rem', color: 'var(--gold)' }}>
                Database Setup Instructions
              </h3>
              <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <p>1. Create a Neon PostgreSQL database at <strong style={{ color: 'var(--gold)' }}>neon.tech</strong></p>
                <p>2. Copy the connection string to <code style={{ color: 'var(--gold)' }}>.env.local</code> as <code>DATABASE_URL</code></p>
                <p>3. Run: <code style={{ color: 'var(--gold)' }}>npm run db:push</code> to create tables</p>
                <p>4. Run: <code style={{ color: 'var(--gold)' }}>npm run db:seed</code> to populate data</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

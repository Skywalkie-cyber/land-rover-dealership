import Link from 'next/link';
import CarCard from '@/components/CarCard';
import FeaturesGrid from '@/components/FeaturesGrid';
import NewsCard from '@/components/NewsCard';
import { STATIC_CARS, STATIC_NEWS } from '@/lib/data/static-data';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getFeaturedCars(): Promise<any[]> {
  try {
    const { db } = await import('@/lib/db');
    const { cars } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    const allCars = await db.select().from(cars).where(eq(cars.featured, true)).limit(4);
    if (allCars.length > 0) return allCars;
  } catch {
    // fall through to static data
  }
  return STATIC_CARS.filter(c => c.featured).slice(0, 4);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getLatestNews(): Promise<any[]> {
  try {
    const { db } = await import('@/lib/db');
    const { news } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    const latestNews = await db.select().from(news).where(eq(news.published, true)).limit(3);
    if (latestNews.length > 0) return latestNews;
  } catch {
    // fall through to static data
  }
  return STATIC_NEWS.slice(0, 3);
}



export default async function HomePage() {
  const featuredCars = await getFeaturedCars();
  const latestNews = await getLatestNews();

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div
            className="hero-bg-image"
            style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1208 30%, #0a0c0a 60%, #050505 100%)',
            }}
          />
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)',
          }} />
        </div>
        <div className="hero-overlay" />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              2024 Collection Now Available
            </div>
            <h1 className="hero-title">
              Above &amp; <span>Beyond</span><br />Every Horizon
            </h1>
            <p className="hero-description">
              Experience the extraordinary fusion of British luxury and unmatched capability. 
              Land Rover vehicles are crafted to inspire—wherever the road leads.
            </p>
            <div className="hero-actions">
              <Link href="/models" className="btn btn-gold btn-lg">
                Explore Models
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/booking" className="btn btn-outline btn-lg">
                Book Test Drive
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="hero-stats">
          <div className="hero-stats-inner">
            {[
              { number: '75+', label: 'Years of Innovation' },
              { number: '8', label: 'Iconic Models' },
              { number: '100+', label: 'Countries Worldwide' },
              { number: '∞', label: 'Adventures Await' },
            ].map(stat => (
              <div key={stat.label} className="hero-stat">
                <div className="hero-stat-number">{stat.number}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator">
          <div className="scroll-line" />
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Scroll
          </span>
        </div>
      </section>

      {/* Featured Models */}
      {featuredCars.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-label">Our Collection</div>
              <h2 className="section-title">
                Featured <span>Models</span>
              </h2>
              <p className="section-desc">
                Discover our handpicked selection of Land Rover vehicles—each one a masterpiece of engineering and design.
              </p>
            </div>
            <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {featuredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link href="/models" className="btn btn-outline btn-lg">
                View All Models
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Land Rover */}
      <section className="section" style={{ background: 'var(--surface-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header section-header-center">
            <div className="section-label">The Land Rover Promise</div>
            <h2 className="section-title">
              Why Choose <span>Land Rover</span>
            </h2>
            <p className="section-desc center">
              More than a vehicle—Land Rover is a commitment to excellence, adventure, and timeless sophistication.
            </p>
          </div>
          <FeaturesGrid />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-sm">
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.03) 100%)',
              border: '1px solid var(--border-gold)',
              borderRadius: '4px',
              padding: '4rem',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="section-label" style={{ marginBottom: '1rem' }}>Book Now</div>
              <h2 className="section-title">
                Experience the <span>Extraordinary</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1rem', lineHeight: '1.7' }}>
                Schedule a personal test drive and discover why Land Rover owners never look back.
                Our specialists are ready to guide you through every detail.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px' }}>
              <Link href="/booking" className="btn btn-gold btn-lg">
                Book Test Drive
              </Link>
              <Link href="/configurator" className="btn btn-outline btn-lg">
                Configure Yours
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div className="section-label">Latest News</div>
                <h2 className="section-title">
                  From the <span>World</span> of Land Rover
                </h2>
              </div>
              <Link href="/news" className="btn btn-ghost" style={{ whiteSpace: 'nowrap' }}>
                All Articles →
              </Link>
            </div>
            <div className="grid-3">
              {latestNews.map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dealer Info Banner */}
      <section className="section-sm" style={{ background: 'var(--black-rich)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '5rem', flexWrap: 'wrap', textAlign: 'center' }}>
            {[
              { icon: '📍', title: '15 Mayfair Boulevard', desc: 'London, W1K 5AF' },
              { icon: '📞', title: '+44 20 7946 0958', desc: 'Call us anytime' },
              { icon: '🕐', title: 'Mon–Fri: 9AM–7PM', desc: 'Sat: 9AM–5PM, Sun: 11AM–4PM' },
              { icon: '✉️', title: 'info@landrover-dealer.com', desc: 'Email us today' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.title}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

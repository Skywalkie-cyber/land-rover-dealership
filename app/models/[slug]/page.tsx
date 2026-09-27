import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { STATIC_CARS } from '@/lib/data/static-data';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
}

const colorMap: Record<string, string> = {
  'Santorini Black': '#1a1a1a',
  'Fuji White': '#f5f5f5',
  'Carpathian Grey': '#6b7280',
  'Portofino Blue': '#1d4ed8',
  'Firenze Red': '#991b1b',
  'Hakuba Silver': '#9ca3af',
  'Tasman Blue': '#2563eb',
  'Indus Silver': '#c0c0c0',
  'Silicon Silver': '#a0aec0',
  'Nolita Grey': '#4a5568',
  'Seoul Pearl Silver': '#d1d5db',
  'Phoenix Orange': '#ea580c',
  'Gondwana Stone': '#92400e',
  'Grasmere Green': '#166534',
  'Sedona Red': '#b91c1c',
  'Arroios Grey': '#374151',
  'Harrowgate Yellow': '#ca8a04',
  default: '#888888',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { db } = await import('@/lib/db');
    const { cars } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    const [car] = await db.select().from(cars).where(eq(cars.slug, slug)).limit(1);
    if (car) return { title: `${car.name} | Land Rover Dealership`, description: car.shortDesc };
  } catch { /* fall through */ }
  const car = STATIC_CARS.find(c => c.slug === slug);
  if (!car) return { title: 'Model Not Found' };
  return { title: `${car.name} | Land Rover Dealership`, description: car.shortDesc };
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let car: any = null;
  try {
    const { db } = await import('@/lib/db');
    const { cars } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(cars).where(eq(cars.slug, slug)).limit(1);
    car = result[0] || null;
  } catch { /* fall through */ }

  // Fallback to static data
  if (!car) {
    car = STATIC_CARS.find(c => c.slug === slug) || null;
  }

  if (!car) notFound();

  const specs = [
    { label: 'Engine', value: car.engine },
    { label: 'Horsepower', value: car.horsepower ? `${car.horsepower} hp` : null },
    { label: 'Torque', value: car.torque ? `${car.torque} Nm` : null },
    { label: '0-100 km/h', value: car.acceleration ? `${car.acceleration}s` : null },
    { label: 'Top Speed', value: car.topSpeed ? `${car.topSpeed} km/h` : null },
    { label: 'Electric Range', value: car.range ? `${car.range} km` : null },
    { label: 'Fuel Type', value: car.fuelType },
    { label: 'Transmission', value: car.transmission },
    { label: 'Seating', value: car.seating ? `${car.seating} Passengers` : null },
    { label: 'Year', value: car.year?.toString() },
  ].filter(s => s.value);

  const colors = Array.isArray(car.colors) ? car.colors : [];
  const features = Array.isArray(car.features) ? car.features : [];

  return (
    <>
      {/* Hero Banner */}
      <div
        style={{
          paddingTop: 'var(--nav-height)',
          background: 'linear-gradient(180deg, var(--surface-1) 0%, var(--black) 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div style={{ padding: '2rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>Home</Link>
            <span>/</span>
            <Link href="/models" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>Models</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{car.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', paddingBottom: '4rem', alignItems: 'center' }}>
            {/* Car Visual */}
            <div
              style={{
                height: '400px',
                background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {car.images && car.images.length > 0 ? (
                <Image
                  src={car.images[0]}
                  alt={car.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '8rem', opacity: 0.08, marginBottom: '-3rem' }}>🚙</div>
                    <svg viewBox="0 0 500 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '85%', opacity: 0.2 }}>
                      <path d="M80 170 C80 170 100 170 130 170 C160 170 175 115 220 100 C265 85 285 85 340 100 C385 115 405 170 425 170 C445 170 460 170 460 170 L460 195 C460 195 440 195 420 200 C400 205 385 210 360 210 C335 210 320 205 295 200 C270 195 240 195 215 200 C190 205 175 210 150 210 C125 210 110 205 90 200 C70 195 60 195 60 195 L60 170 Z" fill="white"/>
                      <circle cx="145" cy="205" r="32" fill="white" opacity="0.6"/>
                      <circle cx="375" cy="205" r="32" fill="white" opacity="0.6"/>
                      <path d="M160 125 L210 90 L310 90 L375 125" stroke="white" strokeWidth="4" fill="none"/>
                    </svg>
                    <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                      {car.name}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>
                {car.category} · {car.year}
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '1rem' }}>
                {car.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1rem' }}>
                {car.shortDesc}
              </p>

              {/* Key Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--surface-2)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                {car.horsepower && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)' }}>{car.horsepower}</div>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Horsepower</div>
                  </div>
                )}
                {car.acceleration && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)' }}>{car.acceleration}s</div>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>0-100 km/h</div>
                  </div>
                )}
                {car.range ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)' }}>{car.range}km</div>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Electric Range</div>
                  </div>
                ) : car.topSpeed ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)' }}>{car.topSpeed}</div>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Top Speed km/h</div>
                  </div>
                ) : null}
              </div>

              {/* Price & CTA */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Starting Price</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--gold)' }}>{formatPrice(car.price)}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href={`/booking?car=${car.id}`} className="btn btn-gold btn-lg">Book Test Drive</Link>
                <Link href={`/configurator?car=${car.slug}`} className="btn btn-outline btn-lg">Configure</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            {/* Description & Features */}
            <div>
              <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                About the <span>{car.name}</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '1.05rem', marginBottom: '2.5rem' }}>
                {car.description}
              </p>

              {/* Features */}
              {features.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '1.25rem' }}>
                    Key Features
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    {features.map((feature: string, i: number) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.875rem',
                          background: 'var(--surface-1)',
                          border: '1px solid var(--border)',
                          borderRadius: '2px',
                        }}
                      >
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {colors.length > 0 && (
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '1.25rem' }}>
                    Available Colours
                  </h3>
                  <div className="color-swatches">
                    {colors.map((color: string) => (
                      <div
                        key={color}
                        title={color}
                        className="color-swatch"
                        style={{ background: colorMap[color] || colorMap.default, border: '2px solid rgba(255,255,255,0.1)' }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {colors.map((color: string) => (
                      <span key={color} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', background: 'var(--surface-2)', borderRadius: '2px' }}>
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Full Specs */}
            <div>
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2rem', position: 'sticky', top: 'calc(var(--nav-height) + 1rem)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 400, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                  Full Specifications
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {specs.map((spec, i) => (
                    <div
                      key={spec.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0',
                        borderBottom: i < specs.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{spec.label}</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="divider" />

                <Link href={`/booking?car=${car.id}`} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                  Book Test Drive
                </Link>
                <Link href="/contact" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
                  Enquire Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

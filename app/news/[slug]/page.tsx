import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { STATIC_NEWS } from '@/lib/data/static-data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { db } = await import('@/lib/db');
    const { news } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    const [article] = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
    if (article) return { title: article.title, description: article.excerpt };
  } catch { /* fall through */ }
  const article = STATIC_NEWS.find(n => n.slug === slug);
  if (!article) return { title: 'Article Not Found' };
  return { title: article.title, description: article.excerpt };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let article: any = null;
  try {
    const { db } = await import('@/lib/db');
    const { news } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
    article = result[0] || null;
  } catch { /* fall through */ }

  if (!article) {
    article = STATIC_NEWS.find(n => n.slug === slug) || null;
  }

  if (!article) notFound();

  const date = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const paragraphs = article.content.split('\n\n').filter(Boolean);

  return (
    <>
      {/* Hero */}
      <div
        style={{
          paddingTop: 'var(--nav-height)',
          background: 'linear-gradient(180deg, var(--surface-1) 0%, var(--black) 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div style={{ padding: '2rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/news">News</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{article.category}</span>
          </div>

          <div style={{ padding: '2rem 0 4rem', maxWidth: '800px' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span className="badge badge-gold">{article.category}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{date}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '1.5rem' }}>
              {article.title}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div
        style={{
          height: '500px',
          background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '8rem',
          opacity: 0.2,
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        🚗
      </div>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '4rem', alignItems: 'start' }}>
            <article>
              {paragraphs.map((para: string, i: number) => (
                <p key={i} style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                  {para}
                </p>
              ))}

              <div className="divider-gold" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/news" className="btn btn-outline">
                  ← Back to News
                </Link>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link href="/booking" className="btn btn-gold">Book Test Drive</Link>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside>
              <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 1rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '1.25rem' }}>
                    Interested?
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                    Experience Land Rover first-hand. Our specialists are ready to guide you.
                  </p>
                  <Link href="/booking" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    Book Test Drive
                  </Link>
                  <Link href="/models" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                    Explore Models
                  </Link>
                </div>

                <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 400, marginBottom: '1rem' }}>
                    Article Details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Category</div>
                      <div style={{ color: 'var(--gold)', fontWeight: 500, marginTop: '0.2rem' }}>{article.category}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Published</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{date}</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

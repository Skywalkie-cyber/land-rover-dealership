'use client';

import { useState, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import type { News } from '@/lib/db/schema';

const categories = ['All', 'New Models', 'Adventures', 'Updates', 'Sustainability', 'Features'];

export default function NewsPage() {
  const [articles, setArticles] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    fetch('/api/news')
      .then(r => r.json())
      .then(data => {
        setArticles(data.news || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="page-header-inner">
            <div className="section-label">Latest Updates</div>
            <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Land Rover <span>News</span>
            </h1>
            <p className="section-desc" style={{ marginTop: '1rem' }}>
              Stay informed with the latest news, adventures, new model launches, 
              and innovations from the world of Land Rover.
            </p>
          </div>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          {/* Category Tabs */}
          <div className="tabs" style={{ marginBottom: '3rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📰</div>
              <p>No articles found in this category.</p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featured && (
                <div style={{ marginBottom: '3rem' }}>
                  <a href={`/news/${featured.slug}`} style={{ display: 'block' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        background: 'var(--surface-1)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* Image side */}
                      <div
                        style={{
                          height: '380px',
                          background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '6rem',
                          opacity: 0.3,
                          position: 'relative',
                        }}
                      >
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
                        🚗
                      </div>
                      {/* Content side */}
                      <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                          <span className="badge badge-gold">{featured.category}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(featured.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, lineHeight: 1.2, marginBottom: '1rem' }}>
                          {featured.title}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                          {featured.excerpt}
                        </p>
                        <span style={{ color: 'var(--gold)', fontSize: '0.875rem', fontWeight: 600 }}>
                          Read Full Story →
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {/* Article Grid */}
              {rest.length > 0 && (
                <div className="grid-3">
                  {rest.map(article => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

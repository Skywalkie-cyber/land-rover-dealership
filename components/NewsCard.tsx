import Link from 'next/link';
import type { News } from '@/lib/db/schema';

const categoryEmojis: Record<string, string> = {
  'New Models': '🚗',
  'Adventures': '🏔️',
  'Updates': '⚡',
  'Sustainability': '🌿',
  'Features': '✨',
  'Technology': '💻',
};

export default function NewsCard({ article }: { article: News }) {
  const emoji = categoryEmojis[article.category] || '📰';
  const date = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link href={`/news/${article.slug}`} style={{ display: 'block' }}>
      <article className="news-card">
        <div className="news-card-image">
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 60%)',
              }}
            />
            <span style={{ fontSize: '3.5rem', opacity: 0.3, position: 'relative', zIndex: 1 }}>{emoji}</span>
          </div>
        </div>
        <div className="news-card-body">
          <div className="news-card-category">{article.category}</div>
          <h3 className="news-card-title">{article.title}</h3>
          <p className="news-card-excerpt">{article.excerpt}</p>
          <div className="news-card-meta">
            <span>{date}</span>
            <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 500 }}>
              Read More →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

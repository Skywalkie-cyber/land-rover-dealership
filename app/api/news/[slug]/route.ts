import { NextRequest, NextResponse } from 'next/server';
import { STATIC_NEWS } from '@/lib/data/static-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try DB first
    try {
      const { db } = await import('@/lib/db');
      const { news } = await import('@/lib/db/schema');
      const { eq } = await import('drizzle-orm');
      const [article] = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
      if (article) return NextResponse.json({ article });
    } catch {
      // fall through
    }

    // Fallback to static data
    const article = STATIC_NEWS.find(n => n.slug === slug);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ article });
  } catch (error) {
    console.error('News article fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

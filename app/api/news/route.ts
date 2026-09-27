import { NextRequest, NextResponse } from 'next/server';
import { STATIC_NEWS } from '@/lib/data/static-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    // Try DB first
    try {
      const { db } = await import('@/lib/db');
      const { news } = await import('@/lib/db/schema');
      const { eq, desc } = await import('drizzle-orm');
      const allNews = await db
        .select()
        .from(news)
        .where(eq(news.published, true))
        .orderBy(desc(news.publishedAt));

      const filtered = category && category !== 'All'
        ? allNews.filter(n => n.category === category)
        : allNews;

      return NextResponse.json({ news: filtered });
    } catch {
      // fall through to static data
    }

    // Fallback to static data
    const filtered = category && category !== 'All'
      ? STATIC_NEWS.filter(n => n.category === category)
      : STATIC_NEWS;

    return NextResponse.json({ news: filtered });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json({ news: STATIC_NEWS });
  }
}

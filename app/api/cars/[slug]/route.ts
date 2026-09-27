import { NextRequest, NextResponse } from 'next/server';
import { STATIC_CARS } from '@/lib/data/static-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try DB first
    try {
      const { db } = await import('@/lib/db');
      const { cars } = await import('@/lib/db/schema');
      const { eq } = await import('drizzle-orm');
      const [car] = await db.select().from(cars).where(eq(cars.slug, slug)).limit(1);
      if (car) return NextResponse.json({ car });
    } catch {
      // fall through to static data
    }

    // Fallback to static data
    const car = STATIC_CARS.find(c => c.slug === slug);
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json({ car });
  } catch (error) {
    console.error('Car fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}

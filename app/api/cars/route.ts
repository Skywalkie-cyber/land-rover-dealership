import { NextRequest, NextResponse } from 'next/server';
import { STATIC_CARS } from '@/lib/data/static-data';

async function getCarsFromDB() {
  try {
    const { db } = await import('@/lib/db');
    const { cars } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    return await db.select().from(cars).where(eq(cars.available, true));
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    // Try DB first, fallback to static data
    const dbCars = await getCarsFromDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allCars: any[] = dbCars ?? (STATIC_CARS as unknown as any[]);

    let filtered = allCars;
    if (category && category !== 'All') {
      filtered = allCars.filter((c: { category: string }) => c.category === category);
    }
    if (featured === 'true') {
      filtered = allCars.filter((c: { featured: boolean }) => c.featured);
    }

    return NextResponse.json({ cars: filtered });
  } catch (error) {
    console.error('Cars fetch error:', error);
    return NextResponse.json({ cars: STATIC_CARS });
  }
}

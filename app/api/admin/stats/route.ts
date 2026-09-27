import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cars, bookings, users, contacts, news } from '@/lib/db/schema';
import { verifyToken } from '@/lib/auth';
import { count, eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const [carsCount] = await db.select({ count: count() }).from(cars);
    const [bookingsCount] = await db.select({ count: count() }).from(bookings);
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [contactsCount] = await db.select({ count: count() }).from(contacts);
    const [newsCount] = await db.select({ count: count() }).from(news);

    const pendingBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.status, 'pending'));

    const recentBookings = await db
      .select()
      .from(bookings)
      .orderBy(bookings.createdAt)
      .limit(5);

    return NextResponse.json({
      stats: {
        cars: carsCount.count,
        bookings: bookingsCount.count,
        users: usersCount.count,
        contacts: contactsCount.count,
        news: newsCount.count,
        pendingBookings: pendingBookings.length,
      },
      recentBookings,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

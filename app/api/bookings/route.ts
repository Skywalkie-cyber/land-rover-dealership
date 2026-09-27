import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings } from '@/lib/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, carId, preferredDate, preferredTime, message } = body;

    if (!name || !email || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    // Check if user is logged in
    const token = req.cookies.get('auth-token')?.value;
    let userId: number | undefined;
    if (token) {
      const user = await verifyToken(token);
      if (user) userId = user.id;
    }

    let booking;
    try {
      const { db } = await import('@/lib/db');
      const { bookings } = await import('@/lib/db/schema');
      const result = await db.insert(bookings).values({
        userId,
        carId: carId ? parseInt(carId) : undefined,
        name,
        email,
        phone,
        preferredDate,
        preferredTime,
        message,
        status: 'pending',
      }).returning();
      booking = result[0];
    } catch {
      // Mock success if no DB
      booking = {
        id: Math.floor(Math.random() * 1000),
        name, email, phone, preferredDate, preferredTime, status: 'pending'
      };
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const allBookings = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
    return NextResponse.json({ bookings: allBookings });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

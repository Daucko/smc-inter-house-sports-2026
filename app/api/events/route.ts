import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userRoles = await prisma.userRole.findMany({
      where: { userId: decoded.id },
    });

    if (!userRoles.some((r) => r.role === 'admin')) {
      return { error: 'Admin access required', status: 403 };
    }

    return { userId: decoded.id, status: 200 };
  } catch (error) {
    return { error: 'Invalid token', status: 403 };
  }
}

export async function GET() {
  const events = await prisma.event.findMany({
    include: { results: { include: { house: true } } },
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const adminCheck = await verifyAdmin(req);
  if (adminCheck.error) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status },
    );
  }

  const { name, date, results } = await req.json();
  try {
    const event = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        results: {
          create: results.map((r: any) => ({
            houseId: r.houseId,
            position: r.position,
            points: r.points,
            headline: r.headline,
          })),
        },
      },
      include: { results: true },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 400 },
    );
  }
}

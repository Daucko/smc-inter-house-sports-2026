import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const houses = await prisma.house.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(houses);
}

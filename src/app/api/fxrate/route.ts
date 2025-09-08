import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({ date: z.string().optional() });

export async function GET(req: Request) {
  const query = Object.fromEntries(new URL(req.url).searchParams.entries());
  const parsed = schema.safeParse(query);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  await prisma.$queryRaw`SELECT 1`;
  return NextResponse.json({ rate: 0, query: parsed.data });
}

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  await prisma.$queryRaw`SELECT 1`;
  return NextResponse.json({ creditNote: parsed.data });
}

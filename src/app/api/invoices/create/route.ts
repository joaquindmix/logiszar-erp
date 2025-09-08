import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const itemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  price: z.number().nonnegative(),
});

const schema = z.object({
  customerId: z.string(),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  await prisma.$queryRaw`SELECT 1`;
  return NextResponse.json({ invoice: parsed.data });
}

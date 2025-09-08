import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const paramsSchema = z.object({ id: z.string() });
const querySchema = z.object({ from: z.string().optional(), to: z.string().optional() });

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ errors: parsedParams.error.flatten() }, { status: 400 });
  }
  const query = Object.fromEntries(new URL(req.url).searchParams.entries());
  const parsedQuery = querySchema.safeParse(query);
  if (!parsedQuery.success) {
    return NextResponse.json({ errors: parsedQuery.error.flatten() }, { status: 400 });
  }
  await prisma.$queryRaw`SELECT 1`;
  return NextResponse.json({ ledger: [], params: parsedParams.data, query: parsedQuery.data });
}

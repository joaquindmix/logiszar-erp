import { NextRequest, NextResponse } from 'next/server';
import { createInvoice } from '@/lib/invoice';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const invoice = await createInvoice(body);
    return NextResponse.json(invoice, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

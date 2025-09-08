import { NextRequest, NextResponse } from 'next/server';
import { getFxRate } from '@/lib/fxrate';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fecha = searchParams.get('fecha');
  const overrideStr = searchParams.get('override');

  if (!fecha) {
    return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 });
  }

  const override = overrideStr ? parseFloat(overrideStr) : undefined;

  try {
    const rate = await getFxRate(fecha, override);
    return NextResponse.json({ tcOficial: rate.tcOficial, manual: !!rate.manual });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

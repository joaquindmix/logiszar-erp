import { NextRequest, NextResponse } from 'next/server';

// In-memory store simulating database tables
const products: Array<{ name: string; price: number }> = [];

// Template of expected CSV columns
const PRODUCT_TEMPLATE = ['name', 'price'];

function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1).map((line) => line.split(',').map((c) => c.trim()));
  return { headers, rows };
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }
  const confirm = formData.get('confirm') === 'true';

  const text = await file.text();
  const { headers, rows } = parseCSV(text);

  const valid = PRODUCT_TEMPLATE.every((c, i) => c === headers[i]);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid columns', expected: PRODUCT_TEMPLATE, received: headers }, { status: 400 });
  }

  const data = rows.map((r) => ({
    name: r[0] ?? '',
    price: Number(r[1] ?? 0),
  }));

  if (!confirm) {
    return NextResponse.json({ preview: data });
  }

  const snapshot = products.length;
  try {
    products.push(...data);
    return NextResponse.json({ inserted: data.length });
  } catch (error: unknown) {
    products.splice(snapshot);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Insert failed', message }, { status: 500 });
  }
}

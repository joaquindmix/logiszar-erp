import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const { to, pdfBase64 } = await req.json();
  const buffer = Buffer.from(pdfBase64, 'base64');

  await sendMail({
    to,
    subject: 'Remito',
    text: 'Adjunto PDF del remito.',
    attachments: [{ filename: 'remito.pdf', content: buffer }],
  });

  return NextResponse.json({ ok: true });
}

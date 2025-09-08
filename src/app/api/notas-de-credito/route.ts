import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const { to, pdfBase64 } = await req.json();
  const buffer = Buffer.from(pdfBase64, 'base64');

  await sendMail({
    to,
    subject: 'Nota de crédito',
    text: 'Adjunto PDF de la nota de crédito.',
    attachments: [{ filename: 'nota-de-credito.pdf', content: buffer }],
  });

  return NextResponse.json({ ok: true });
}

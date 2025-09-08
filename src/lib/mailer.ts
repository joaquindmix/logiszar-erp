import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendMailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: { filename: string; content: Buffer | string }[];
}

export async function sendMail(options: SendMailOptions) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    cc: 'administracion@logiszar.com',
    ...options,
  });
}

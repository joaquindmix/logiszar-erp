import fs from 'fs/promises';
import path from 'path';
import { getFxRate } from './fxrate';

export interface Invoice {
  id: number;
  date: string;
  currency: string;
  amount: number;
  tcUsd?: number;
  totalArs?: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const INV_FILE = path.join(DATA_DIR, 'invoices.json');

async function readInvoices(): Promise<Invoice[]> {
  try {
    const content = await fs.readFile(INV_FILE, 'utf8');
    return JSON.parse(content) as Invoice[];
  } catch {
    return [];
  }
}

async function writeInvoices(invoices: Invoice[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(INV_FILE, JSON.stringify(invoices, null, 2));
}

export async function createInvoice(data: {
  date: string;
  currency: string;
  amount: number;
}): Promise<Invoice> {
  const invoices = await readInvoices();
  const id = invoices.length + 1;
  const invoice: Invoice = { id, ...data };

  if (data.currency.toUpperCase() === 'USD') {
    const rate = await getFxRate(data.date);
    invoice.tcUsd = rate.tcOficial;
    invoice.totalArs = data.amount * rate.tcOficial;
  }

  invoices.push(invoice);
  await writeInvoices(invoices);
  return invoice;
}

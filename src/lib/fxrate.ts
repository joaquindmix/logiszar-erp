import fs from 'fs/promises';
import path from 'path';

export interface FxRate {
  date: string; // YYYY-MM-DD
  tcOficial: number;
  manual?: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const FX_FILE = path.join(DATA_DIR, 'fxrates.json');

async function readRates(): Promise<FxRate[]> {
  try {
    const content = await fs.readFile(FX_FILE, 'utf8');
    return JSON.parse(content) as FxRate[];
  } catch {
    return [];
  }
}

async function writeRates(rates: FxRate[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FX_FILE, JSON.stringify(rates, null, 2));
}

interface BcraResponse {
  value?: number;
  tc_oficial?: number;
  venta?: number;
}

async function fetchBcraRate(date: string): Promise<number> {
  const token = process.env.BCRA_TOKEN;
  const res = await fetch(`https://api.estadisticasbcra.com/usd_of/${date}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    throw new Error(`BCRA request failed with ${res.status}`);
  }
  const data: BcraResponse = await res.json();
  const value = data.value ?? data.tc_oficial ?? data.venta;
  if (typeof value !== 'number') {
    throw new Error('Invalid response from BCRA');
  }
  return value;
}

export async function getFxRate(date: string, override?: number): Promise<FxRate> {
  const rates = await readRates();
  const existing = rates.find((r) => r.date === date);

  if (typeof override === 'number') {
    const record: FxRate = { date, tcOficial: override, manual: true };
    if (existing) {
      Object.assign(existing, record);
    } else {
      rates.push(record);
    }
    await writeRates(rates);
    return record;
  }

  if (existing) {
    return existing;
  }

  const tcOficial = await fetchBcraRate(date);
  const record: FxRate = { date, tcOficial };
  rates.push(record);
  await writeRates(rates);
  return record;
}

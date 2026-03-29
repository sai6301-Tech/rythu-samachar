import { DATA_GOV_IN_API_KEY } from '@/constants/config';

const BASE =
  'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

const TELUGU_NAMES: Record<string, string> = {
  Rice: 'వరి',
  Wheat: 'గోధుమ',
  Cotton: 'పత్తి',
  Groundnut: 'వేరుశనగ',
  Maize: 'మొక్కజొన్న',
  Turmeric: 'పసుపు',
  Chilli: 'మిరప',
  Paddy: 'వడ్లు',
  Soybean: 'సోయాబీన్',
  Sunflower: 'పొద్దుతిరుగుడు',
};

export type MarketPrice = {
  cropName: string;
  cropNameTelugu: string;
  market: string;
  state: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  isTrendingUp: boolean;
};

function teluguFor(english: string): string {
  return TELUGU_NAMES[english] ?? english;
}

export async function getMarketPrices(state: string): Promise<MarketPrice[]> {
  try {
    const url = `${BASE}?api-key=${DATA_GOV_IN_API_KEY}&format=json&filters[state.keyword]=${encodeURIComponent(state)}&limit=20`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const records = (data.records ?? []) as Record<string, string>[];
    return records.map((r) => ({
      cropName: r.commodity ?? '',
      cropNameTelugu: teluguFor(r.commodity ?? ''),
      market: r.market ?? '',
      state: r.state ?? state,
      currentPrice: parseFloat(r.modal_price ?? '0') || 0,
      minPrice: parseFloat(r.min_price ?? '0') || 0,
      maxPrice: parseFloat(r.max_price ?? '0') || 0,
      isTrendingUp: true,
    }));
  } catch {
    return mockPrices(state);
  }
}

function mockPrices(state: string): MarketPrice[] {
  const rows: [string, string, string, number, number, number, boolean][] = [
    ['Paddy', 'వడ్లు', 'Warangal', 2250, 2100, 2350, true],
    ['Cotton', 'పత్తి', 'Karimnagar', 7800, 7500, 8100, true],
    ['Maize', 'మొక్కజొన్న', 'Nizamabad', 1850, 1700, 1950, false],
    ['Groundnut', 'వేరుశనగ', 'Kurnool', 5200, 5000, 5400, true],
    ['Chilli', 'మిరప', 'Guntur', 12500, 12000, 13000, true],
    ['Turmeric', 'పసుపు', 'Nizamabad', 8500, 8000, 9000, false],
    ['Soybean', 'సోయాబీన్', 'Adilabad', 3900, 3700, 4100, true],
    ['Sunflower', 'పొద్దుతిరుగుడు', 'Nalgonda', 4800, 4600, 5000, false],
  ];
  return rows.map(([cropName, cropTe, market, cur, min, max, up]) => ({
    cropName,
    cropNameTelugu: cropTe,
    market,
    state,
    currentPrice: cur,
    minPrice: min,
    maxPrice: max,
    isTrendingUp: up,
  }));
}

export const MARKET_STATES = [
  'Telangana',
  'Andhra Pradesh',
  'Karnataka',
  'Maharashtra',
  'Punjab',
] as const;

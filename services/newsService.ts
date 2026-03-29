import { NEWS_API_KEY } from '@/constants/config';

const BASE = 'https://newsapi.org/v2/everything';

/** NewsAPI “everything” has limited `language` codes; Telugu (te) is not supported. For Telugu UI we bias the query toward regional Indian agriculture coverage (articles are often still in English). */
const QUERY: Record<'en' | 'te', string> = {
  en: 'agriculture+farmers+india',
  te: '(agriculture+OR+farming+OR+crops+OR+kisan)+AND+(Telangana+OR+Andhra+Pradesh+OR+India)',
};

export type NewsArticle = {
  title: string;
  description: string;
  imageUrl: string | null;
  source: string;
  url: string;
  publishedAt: string;
};

export async function getAgriNews(lang: 'en' | 'te' = 'en'): Promise<NewsArticle[]> {
  try {
    const q = QUERY[lang];
    const url = `${BASE}?q=${q}&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const articles = (data.articles ?? []) as Record<string, unknown>[];
    return articles
      .filter((a) => a.title && a.title !== '[Removed]')
      .slice(0, 20)
      .map((a) => ({
        title: String(a.title ?? ''),
        description: String(a.description ?? 'Read more...'),
        imageUrl: (a.urlToImage as string) ?? null,
        source: String((a.source as { name?: string })?.name ?? 'Unknown'),
        url: String(a.url ?? ''),
        publishedAt: String(a.publishedAt ?? new Date().toISOString()),
      }));
  } catch {
    return mockNews();
  }
}

function mockNews(): NewsArticle[] {
  const now = new Date().toISOString();
  return [
    {
      title: 'Kharif Crop Season: Farmers Prepare for Sowing',
      description:
        'Farmers across Telangana and Andhra Pradesh are gearing up for the kharif season with increased support from state governments.',
      imageUrl: null,
      source: 'The Hindu',
      url: 'https://example.com',
      publishedAt: now,
    },
    {
      title: 'PM-KISAN: Next Installment Release Date Announced',
      description:
        'The government has announced the release of the next PM-KISAN installment. Eligible farmers will receive ₹2,000 directly to their bank accounts.',
      imageUrl: null,
      source: 'Economic Times',
      url: 'https://example.com',
      publishedAt: now,
    },
    {
      title: 'Monsoon Forecast: Good Rains Expected in South India',
      description:
        'IMD predicts above-normal rainfall for Telangana and Andhra Pradesh this monsoon season, which is expected to benefit paddy and cotton farmers.',
      imageUrl: null,
      source: 'Times of India',
      url: 'https://example.com',
      publishedAt: now,
    },
  ];
}

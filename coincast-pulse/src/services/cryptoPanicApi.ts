const API_BASE_URL = "https://cryptopanic.com/api/developer/v2/posts/";
const API_KEY = "8abe873a24e5f316c23274b7869ebebf12f2ae8b"; // TODO: move to env

export interface CryptoPanicPostRaw {
  id?: string | number;
  title?: string;
  description?: string;
  url?: string;
  source?: { title?: string; domain?: string; url?: string } | null;
  author?: string | null;
  published_at?: string; // ISO date
  image?: string | null;
  thumbnail?: string | null;
  sentiment?: string | null;
  panic_score?: number | null;
  currencies?: Array<{ code?: string; title?: string }> | null;
  [key: string]: any;
}

export interface CryptoPanicResponseRaw {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: CryptoPanicPostRaw[];
  // some variants might return { data: [...] }
  data?: CryptoPanicPostRaw[];
}

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string; // ISO
  image_url?: string;
  category?: string[];
}

function normalizePost(raw: CryptoPanicPostRaw): NewsItem {
  const link = raw.url || raw.source?.url || "";
  const img = raw.image || raw.thumbnail || undefined;
  const pub = raw.published_at || new Date().toISOString();
  const category: string[] = [];
  if (raw.source?.title) category.push(raw.source.title);
  if (raw.sentiment) category.push(raw.sentiment);

  return {
    id: String(raw.id ?? `${raw.title}-${pub}`),
    title: raw.title || "Untitled",
    link,
    description: raw.description || "",
    pubDate: pub,
    image_url: img || undefined,
    category,
  };
}

class CryptoPanicApiService {
  async fetchPosts(params: Record<string, string | number> = {}): Promise<{
    items: NewsItem[];
    next?: string | null;
  }> {
    const url = new URL(API_BASE_URL);
    url.searchParams.set("auth_token", API_KEY);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`CryptoPanic error ${res.status}: ${msg}`);
    }
    const data: CryptoPanicResponseRaw = await res.json();
    const list = (data.results ?? data.data ?? []).map(normalizePost);
    return { items: list, next: data.next ?? null };
  }

  async getLatest(page?: number | string) {
    const params: Record<string, string | number> = {};
    if (page !== undefined) params.page = page;
    return this.fetchPosts(params);
  }
}

export const cryptoPanicApi = new CryptoPanicApiService();
export default cryptoPanicApi;



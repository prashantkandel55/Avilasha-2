export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  amount: number;
  value?: number;
  change24h?: number;
  imageUrl?: string;
}

export interface PortfolioState {
  assets: Asset[];
  totalValue: number;
  totalChange24h: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

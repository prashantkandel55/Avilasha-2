export interface Wallet {
  id?: string;
  user_id?: string;
  address: string;
  name?: string;
  created_at?: string;
  balance?: string;
  network?: string;
}

export interface WalletState {
  wallets: Wallet[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

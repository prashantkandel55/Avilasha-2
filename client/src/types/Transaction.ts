export type TransactionType = 'send' | 'receive' | 'swap';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface Transaction {
  id: string;
  user_id: string;
  wallet: string;
  tx_hash: string;
  type: TransactionType;
  token_symbol: string;
  amount: number;
  fee?: number;
  timestamp: string;
  status: TransactionStatus;
  to_address?: string;
  from_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  filters: {
    type: TransactionType | 'all';
    wallet: string | 'all';
    token: string | 'all';
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

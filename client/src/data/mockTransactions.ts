import { Transaction } from '../types/Transaction';

// Generate a random Ethereum transaction hash
const generateTxHash = (): string => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Generate a random Ethereum address
const generateAddress = (): string => {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Get a date from X days ago
const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Mock wallet addresses
const wallets = [
  '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  '0x8C5fecdC472E27Bc447696F431E425D924a95dAE'
];

// Mock transaction data
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    user_id: 'user-id',
    wallet: wallets[0],
    tx_hash: generateTxHash(),
    type: 'receive',
    token_symbol: 'ETH',
    amount: 1.5,
    timestamp: getDaysAgo(1),
    status: 'confirmed',
    from_address: generateAddress(),
    to_address: wallets[0],
    created_at: getDaysAgo(1),
    updated_at: getDaysAgo(1)
  },
  {
    id: '2',
    user_id: 'user-id',
    wallet: wallets[0],
    tx_hash: generateTxHash(),
    type: 'send',
    token_symbol: 'ETH',
    amount: 0.5,
    fee: 0.002,
    timestamp: getDaysAgo(2),
    status: 'confirmed',
    from_address: wallets[0],
    to_address: generateAddress(),
    created_at: getDaysAgo(2),
    updated_at: getDaysAgo(2)
  },
  {
    id: '3',
    user_id: 'user-id',
    wallet: wallets[1],
    tx_hash: generateTxHash(),
    type: 'swap',
    token_symbol: 'ETH → USDT',
    amount: 0.75,
    fee: 0.003,
    timestamp: getDaysAgo(3),
    status: 'confirmed',
    from_address: wallets[1],
    to_address: wallets[1],
    notes: 'Swapped ETH for USDT on Uniswap',
    created_at: getDaysAgo(3),
    updated_at: getDaysAgo(3)
  },
  {
    id: '4',
    user_id: 'user-id',
    wallet: wallets[0],
    tx_hash: generateTxHash(),
    type: 'receive',
    token_symbol: 'BTC',
    amount: 0.05,
    timestamp: getDaysAgo(5),
    status: 'confirmed',
    from_address: generateAddress(),
    to_address: wallets[0],
    created_at: getDaysAgo(5),
    updated_at: getDaysAgo(5)
  },
  {
    id: '5',
    user_id: 'user-id',
    wallet: wallets[1],
    tx_hash: generateTxHash(),
    type: 'send',
    token_symbol: 'USDT',
    amount: 500,
    fee: 5,
    timestamp: getDaysAgo(7),
    status: 'confirmed',
    from_address: wallets[1],
    to_address: generateAddress(),
    created_at: getDaysAgo(7),
    updated_at: getDaysAgo(7)
  },
  {
    id: '6',
    user_id: 'user-id',
    wallet: wallets[0],
    tx_hash: generateTxHash(),
    type: 'swap',
    token_symbol: 'BTC → ETH',
    amount: 0.02,
    fee: 0.0005,
    timestamp: getDaysAgo(10),
    status: 'confirmed',
    from_address: wallets[0],
    to_address: wallets[0],
    notes: 'Swapped BTC for ETH on 1inch',
    created_at: getDaysAgo(10),
    updated_at: getDaysAgo(10)
  },
  {
    id: '7',
    user_id: 'user-id',
    wallet: wallets[1],
    tx_hash: generateTxHash(),
    type: 'receive',
    token_symbol: 'SOL',
    amount: 10,
    timestamp: getDaysAgo(12),
    status: 'confirmed',
    from_address: generateAddress(),
    to_address: wallets[1],
    created_at: getDaysAgo(12),
    updated_at: getDaysAgo(12)
  },
  {
    id: '8',
    user_id: 'user-id',
    wallet: wallets[0],
    tx_hash: generateTxHash(),
    type: 'send',
    token_symbol: 'ETH',
    amount: 0.3,
    fee: 0.001,
    timestamp: getDaysAgo(15),
    status: 'failed',
    from_address: wallets[0],
    to_address: generateAddress(),
    notes: 'Transaction failed due to insufficient gas',
    created_at: getDaysAgo(15),
    updated_at: getDaysAgo(15)
  },
  {
    id: '9',
    user_id: 'user-id',
    wallet: wallets[1],
    tx_hash: generateTxHash(),
    type: 'receive',
    token_symbol: 'USDC',
    amount: 750,
    timestamp: getDaysAgo(18),
    status: 'confirmed',
    from_address: generateAddress(),
    to_address: wallets[1],
    created_at: getDaysAgo(18),
    updated_at: getDaysAgo(18)
  },
  {
    id: '10',
    user_id: 'user-id',
    wallet: wallets[0],
    tx_hash: generateTxHash(),
    type: 'send',
    token_symbol: 'BTC',
    amount: 0.01,
    fee: 0.0002,
    timestamp: getDaysAgo(20),
    status: 'pending',
    from_address: wallets[0],
    to_address: generateAddress(),
    notes: 'Withdrawal to hardware wallet',
    created_at: getDaysAgo(20),
    updated_at: getDaysAgo(20)
  }
];

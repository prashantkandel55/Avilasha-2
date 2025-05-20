import { Asset } from '../types/Asset';

export const mockAssets: Asset[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 65432.10,
    amount: 0.5,
    change24h: 2.3,
    imageUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3521.45,
    amount: 5.2,
    change24h: -1.2,
    imageUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    id: '3',
    symbol: 'SOL',
    name: 'Solana',
    price: 142.78,
    amount: 25.0,
    change24h: 5.7,
    imageUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png'
  },
  {
    id: '4',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.58,
    amount: 1000.0,
    change24h: 0.9,
    imageUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png'
  },
  {
    id: '5',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 7.82,
    amount: 150.0,
    change24h: -2.5,
    imageUrl: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png'
  }
];

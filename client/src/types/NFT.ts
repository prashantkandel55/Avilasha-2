export interface NFTTrait {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  collection: {
    name: string;
    slug: string;
    image?: string;
  };
  token_id: string;
  token_standard: 'ERC721' | 'ERC1155';
  contract_address: string;
  owner_address: string;
  blockchain: 'ethereum' | 'polygon' | 'solana' | 'other';
  metadata_url?: string;
  traits?: NFTTrait[];
  last_sale_price?: number;
  last_sale_currency?: string;
  rarity_rank?: number;
  created_at: string;
  updated_at: string;
}

export interface NFTState {
  nfts: NFT[];
  selectedNFT: NFT | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

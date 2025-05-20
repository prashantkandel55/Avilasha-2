import { NFT } from '../types/NFT';

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

// Mock wallet address (owner)
const ownerAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

// Mock NFT data
export const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Bored Ape #7329',
    description: 'The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain.',
    image: 'https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs?auto=format&w=1000',
    collection: {
      name: 'Bored Ape Yacht Club',
      slug: 'boredapeyachtclub',
      image: 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&w=256'
    },
    token_id: '7329',
    token_standard: 'ERC721',
    contract_address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    owner_address: ownerAddress,
    blockchain: 'ethereum',
    metadata_url: 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/7329',
    traits: [
      { trait_type: 'Background', value: 'Orange' },
      { trait_type: 'Clothes', value: 'Striped Tee' },
      { trait_type: 'Eyes', value: 'Bored' },
      { trait_type: 'Fur', value: 'Brown' },
      { trait_type: 'Mouth', value: 'Bored Cigarette' }
    ],
    last_sale_price: 85.69,
    last_sale_currency: 'ETH',
    rarity_rank: 1423,
    created_at: getDaysAgo(180),
    updated_at: getDaysAgo(30)
  },
  {
    id: '2',
    name: 'CryptoPunk #5822',
    description: 'CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard.',
    image: 'https://i.seadn.io/gae/Nnp8Pdo6EidK7eBduGnAn_JBvFsYGhNGMJ_fHJ_mzGMN_2Khu5snL5zmiUMcSsIqtANh19KqxXDs0iNq_aYbKC5smO3hiCSw9PlL?auto=format&w=1000',
    collection: {
      name: 'CryptoPunks',
      slug: 'cryptopunks',
      image: 'https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&w=256'
    },
    token_id: '5822',
    token_standard: 'ERC721',
    contract_address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    owner_address: ownerAddress,
    blockchain: 'ethereum',
    traits: [
      { trait_type: 'Type', value: 'Alien' },
      { trait_type: 'Accessory', value: 'Bandana' }
    ],
    last_sale_price: 8000,
    last_sale_currency: 'ETH',
    rarity_rank: 2,
    created_at: getDaysAgo(365),
    updated_at: getDaysAgo(90)
  },
  {
    id: '3',
    name: 'Azuki #9605',
    description: 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.',
    image: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1000',
    collection: {
      name: 'Azuki',
      slug: 'azuki',
      image: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&w=256'
    },
    token_id: '9605',
    token_standard: 'ERC721',
    contract_address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
    owner_address: ownerAddress,
    blockchain: 'ethereum',
    traits: [
      { trait_type: 'Type', value: 'Human' },
      { trait_type: 'Hair', value: 'Pink Long' },
      { trait_type: 'Clothing', value: 'Kimono' },
      { trait_type: 'Eyes', value: 'Tired' },
      { trait_type: 'Mouth', value: 'Chewing' }
    ],
    last_sale_price: 12.4,
    last_sale_currency: 'ETH',
    rarity_rank: 3245,
    created_at: getDaysAgo(150),
    updated_at: getDaysAgo(15)
  },
  {
    id: '4',
    name: 'Doodle #2491',
    description: 'A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000.',
    image: 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&w=1000',
    collection: {
      name: 'Doodles',
      slug: 'doodles-official',
      image: 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&w=256'
    },
    token_id: '2491',
    token_standard: 'ERC721',
    contract_address: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
    owner_address: ownerAddress,
    blockchain: 'ethereum',
    traits: [
      { trait_type: 'Background', value: 'Blue' },
      { trait_type: 'Face', value: 'Happy' },
      { trait_type: 'Body', value: 'Alien' },
      { trait_type: 'Head', value: 'Rainbow Afro' }
    ],
    last_sale_price: 8.5,
    last_sale_currency: 'ETH',
    rarity_rank: 1876,
    created_at: getDaysAgo(200),
    updated_at: getDaysAgo(45)
  },
  {
    id: '5',
    name: 'Clone X #12345',
    description: 'CLONE X IS A COLLECTION OF 20,000 NEXT-GEN AVATARS, CREATED BY RTFKT AND TAKASHI MURAKAMI 🌸',
    image: 'https://i.seadn.io/gae/XN0XuD8Uh3jyRWNtPTFeXJg_ht8m5ofDx6aHklOiy4amhFuWUa0JaR6It49AH8tlnYS386Q0TW_-Lmedn0UET_ko1a3CbJGeu5iHMg?auto=format&w=1000',
    collection: {
      name: 'CLONE X - X TAKASHI MURAKAMI',
      slug: 'clonex',
      image: 'https://i.seadn.io/gae/XN0XuD8Uh3jyRWNtPTFeXJg_ht8m5ofDx6aHklOiy4amhFuWUa0JaR6It49AH8tlnYS386Q0TW_-Lmedn0UET_ko1a3CbJGeu5iHMg?auto=format&w=256'
    },
    token_id: '12345',
    token_standard: 'ERC721',
    contract_address: '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B',
    owner_address: ownerAddress,
    blockchain: 'ethereum',
    traits: [
      { trait_type: 'DNA', value: 'Human' },
      { trait_type: 'Eye Color', value: 'Blue' },
      { trait_type: 'Hair', value: 'Blonde Wavy' },
      { trait_type: 'Clothing', value: 'RTFKT Hoodie' }
    ],
    last_sale_price: 6.2,
    last_sale_currency: 'ETH',
    rarity_rank: 5432,
    created_at: getDaysAgo(120),
    updated_at: getDaysAgo(10)
  },
  {
    id: '6',
    name: 'Moonbird #7821',
    description: 'A collection of 10,000 utility-enabled PFPs that feature a richly diverse and unique pool of rarity-powered traits.',
    image: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&w=1000',
    collection: {
      name: 'Moonbirds',
      slug: 'moonbirds',
      image: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&w=256'
    },
    token_id: '7821',
    token_standard: 'ERC721',
    contract_address: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
    owner_address: ownerAddress,
    blockchain: 'ethereum',
    traits: [
      { trait_type: 'Background', value: 'Blue' },
      { trait_type: 'Beak', value: 'Short' },
      { trait_type: 'Eyes', value: 'Cosmic' },
      { trait_type: 'Feathers', value: 'Legendary' }
    ],
    last_sale_price: 30.5,
    last_sale_currency: 'ETH',
    rarity_rank: 345,
    created_at: getDaysAgo(90),
    updated_at: getDaysAgo(5)
  },
  {
    id: '7',
    name: 'Pudgy Penguin #2384',
    description: 'Pudgy Penguins is a collection of 8,888 NFTs, waddling through Web3. Embodying empathy & compassion, Pudgy Penguins are a beacon of positivity in the NFT Space.',
    image: 'https://i.seadn.io/gae/yNi-XdYxoVBNzYDwTDj-s0CgMRwG1eFcKAJzKmF5G-BLwUbN1e0vFjpNSzTxjHfHnLX0Rgj6KYoRQCYCkIeaWQ6VOHmA7SqbEGC8?auto=format&w=1000',
    collection: {
      name: 'Pudgy Penguins',
      slug: 'pudgypenguins',
      image: 'https://i.seadn.io/gae/yNi-XdYxoVBNzYDwTDj-s0CgMRwG1eFcKAJzKmF5G-BLwUbN1e0vFjpNSzTxjHfHnLX0Rgj6KYoRQCYCkIeaWQ6VOHmA7SqbEGC8?auto=format&w=256'
    },
    token_id: '2384',
    token_standard: 'ERC721',
    contract_address: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8',
    owner_address: ownerAddress,
    blockchain: 'ethereum',
    traits: [
      { trait_type: 'Background', value: 'Blue' },
      { trait_type: 'Skin', value: 'Normal' },
      { trait_type: 'Body', value: 'Hoodie' },
      { trait_type: 'Face', value: 'Sunglasses' },
      { trait_type: 'Head', value: 'Beanie' }
    ],
    last_sale_price: 5.8,
    last_sale_currency: 'ETH',
    rarity_rank: 2143,
    created_at: getDaysAgo(250),
    updated_at: getDaysAgo(60)
  },
  {
    id: '8',
    name: 'World of Women #5672',
    description: 'World of Women is a collection of 10,000 unique NFTs that give you full access to our ever-expanding universe.',
    image: 'https://i.seadn.io/gae/7tBnWi5gu6CS5S0B_fHVOmT-QkRv3KyMPQq-1TkuYjwlynAGsRTXSG0PKuRUHxvNrBxXxCWNEcGQr_Nj1WHjgCewNfym7_Qh5QBY?auto=format&w=1000',
    collection: {
      name: 'World of Women',
      slug: 'world-of-women-nft',
      image: 'https://i.seadn.io/gae/7tBnWi5gu6CS5S0B_fHVOmT-QkRv3KyMPQq-1TkuYjwlynAGsRTXSG0PKuRUHxvNrBxXxCWNEcGQr_Nj1WHjgCewNfym7_Qh5QBY?auto=format&w=256'
    },
    token_id: '5672',
    token_standard: 'ERC721',
    contract_address: '0xe785E82358879F061BC3dcAC6f0444462D4b5330',
    owner_address: ownerAddress,
    blockchain: 'ethereum',
    traits: [
      { trait_type: 'Skin Tone', value: 'Dawn' },
      { trait_type: 'Background', value: 'Purple' },
      { trait_type: 'Clothes', value: 'Leather Jacket' },
      { trait_type: 'Eyes', value: 'Natural' },
      { trait_type: 'Hair', value: 'Pink Bob' }
    ],
    last_sale_price: 3.2,
    last_sale_currency: 'ETH',
    rarity_rank: 3987,
    created_at: getDaysAgo(220),
    updated_at: getDaysAgo(40)
  }
];

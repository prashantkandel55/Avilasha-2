import { MarketCoin } from '../types/Market';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Service for fetching cryptocurrency market data from CoinGecko API
 */
export const marketService = {
  /**
   * Fetches top cryptocurrencies by market cap
   * @param limit Number of coins to fetch (default: 10)
   * @param currency Currency for price data (default: 'usd')
   * @returns Promise with market data
   */
  async getTopCoins(limit: number = 10, currency: string = 'usd'): Promise<MarketCoin[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h,7d`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: MarketCoin[] = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching market data:', error);
      throw new Error(error.message || 'Failed to fetch market data');
    }
  },
  
  /**
   * Fetches data for specific coins by their IDs
   * @param coinIds Array of coin IDs (e.g., ['bitcoin', 'ethereum'])
   * @param currency Currency for price data (default: 'usd')
   * @returns Promise with market data
   */
  async getCoinsByIds(coinIds: string[], currency: string = 'usd'): Promise<MarketCoin[]> {
    try {
      const idsParam = coinIds.join(',');
      const response = await fetch(
        `${API_BASE_URL}/coins/markets?vs_currency=${currency}&ids=${idsParam}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: MarketCoin[] = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching coin data:', error);
      throw new Error(error.message || 'Failed to fetch coin data');
    }
  },
  
  /**
   * Fetches price data for specific coins
   * @param coinIds Array of coin IDs (e.g., ['bitcoin', 'ethereum'])
   * @param currencies Array of currencies (e.g., ['usd', 'eur'])
   * @returns Promise with price data
   */
  async getPrices(coinIds: string[], currencies: string[] = ['usd']): Promise<Record<string, Record<string, number>>> {
    try {
      const idsParam = coinIds.join(',');
      const currenciesParam = currencies.join(',');
      
      const response = await fetch(
        `${API_BASE_URL}/simple/price?ids=${idsParam}&vs_currencies=${currenciesParam}&include_24h_change=true`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching price data:', error);
      throw new Error(error.message || 'Failed to fetch price data');
    }
  }
};

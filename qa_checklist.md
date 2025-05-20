# Avilasha-2 MVP QA Checklist

## Smoke Testing

### Authentication
- [ ] User can open the login page
- [ ] User can enter email and request a magic link
- [ ] User receives confirmation message after requesting magic link
- [ ] User can log in via magic link (requires manual testing with real email)
- [ ] User stays logged in after closing and reopening the app (persistent session)
- [ ] User can log out
- [ ] Protected routes redirect to login when not authenticated

### Wallet Management
- [ ] User can view the wallet connect UI
- [ ] User can add a new wallet with a valid Ethereum address
- [ ] User receives validation errors when entering invalid addresses
- [ ] User can see the list of connected wallets
- [ ] User can remove a wallet
- [ ] Wallets persist after page refresh

### Portfolio Analytics
- [ ] User can view the portfolio overview
- [ ] Portfolio displays mock assets correctly
- [ ] Total portfolio value is calculated and displayed
- [ ] Portfolio shows 24-hour change percentage
- [ ] Asset details (price, amount, value) are displayed correctly

### Market Data
- [ ] User can view the market overview
- [ ] Market data loads from CoinGecko API
- [ ] Top 10 cryptocurrencies are displayed with prices and 24h change
- [ ] User can change the refresh interval
- [ ] User can toggle auto-refresh
- [ ] User can manually refresh market data

### Transaction History
- [ ] User can view the transaction history
- [ ] Transactions are displayed in a table
- [ ] User can filter transactions by type
- [ ] User can filter transactions by wallet
- [ ] User can filter transactions by token
- [ ] User can sort transactions by different columns
- [ ] Transaction details are displayed correctly

### NFT Gallery
- [ ] User can view the NFT gallery
- [ ] NFTs are displayed in a grid layout
- [ ] User can click on an NFT to view details
- [ ] NFT details modal shows comprehensive information
- [ ] NFT traits are displayed correctly
- [ ] NFT images load properly

### Secure Storage
- [ ] User session is stored securely
- [ ] User stays logged in after closing and reopening the app
- [ ] Sensitive data is encrypted properly
- [ ] Session is cleared on logout

## Build and Packaging

### Electron Builder Configuration
- [ ] electron-builder.json is properly configured
- [ ] App metadata is correctly set
- [ ] Build scripts are properly defined in package.json

### Platform Builds
- [ ] Application builds successfully for Windows
- [ ] Application builds successfully for macOS
- [ ] Application builds successfully for Linux

### Installation and Launch
- [ ] Application installs correctly on Windows
- [ ] Application installs correctly on macOS
- [ ] Application installs correctly on Linux
- [ ] Application launches successfully after installation
- [ ] All features work correctly in the installed application

## Performance and Usability
- [ ] Application loads within acceptable time
- [ ] UI transitions are smooth
- [ ] Data loading states are properly indicated
- [ ] Error states are properly handled and displayed
- [ ] Responsive design works on different window sizes
- [ ] Dark mode works correctly

## Bug Tracking
| Issue | Description | Severity | Status |
|-------|-------------|----------|--------|
|       |             |          |        |

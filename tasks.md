🛠️ Avilasha-2 MVP Build Plan (Step-by-Step)
🔧 Step 1: Project Setup
1.1 - Initialize monorepo
Create root folder: avilasha-2

Add .gitignore, README.md

Init Git repo + commit baseline

1.2 - Set up Vite + React + TypeScript frontend
Run npm create vite@latest client --template react-ts

Install deps: npm i

Test: App renders “Hello, world”

1.3 - Set up Electron base app
Create /electron/ folder

Add main.ts to launch browser window

Add preload.ts with minimal contextBridge

Connect to Vite’s dev server

Test: Electron opens React app in a window

1.4 - Add Tailwind CSS
Install and configure Tailwind via Vite plugin

Add sample styled component

Test: Styles applied correctly

🔐 Step 2: Auth + Supabase Setup
2.1 - Create Supabase project
Set up DB, enable Email magic link auth

Create .env with Supabase keys

2.2 - Add Supabase client to /lib/supabaseClient.ts
Export initialized Supabase client

Test: Connect + fetch anon session

2.3 - Implement login flow
Build login page with email input + login button

Use supabase.auth.signInWithOtp()

Test: Email sent, redirected to app on auth

2.4 - Implement auth state listener
Use supabase.auth.onAuthStateChange

Persist user session in Redux or context

Test: User stays logged in across reloads

📦 Step 3: State & Navigation
3.1 - Set up Redux Toolkit store
Add /state/store.ts and Provider in App.tsx

Add devtools, logger middleware

Test: Can dispatch + observe state

3.2 - Add authSlice
Store user, session, status

Actions: setUser, logout

Test: user.email appears in dashboard

3.3 - Add react-router and routes
Set up /login and /dashboard routes

Add route guard based on auth state

Test: Logged-out user redirected to /login

💼 Step 4: Wallet Management
4.1 - Create walletSlice
State: connected wallets array

Actions: addWallet, removeWallet

Test: Can store mock wallet address in state

4.2 - Create wallet connect UI
Basic input to “Connect Wallet” (manual for MVP)

Validate Ethereum address

Test: Adds wallet to list

4.3 - Save wallet to Supabase
Create wallets table: id, user_id, address

On connect, upsert wallet for current user

Test: Wallet persists after refresh

4.4 - Fetch wallets from Supabase
Query on auth load, dispatch to Redux

Test: Wallets auto-loaded on login

📊 Step 5: Portfolio Analytics (Mock)
5.1 - Create portfolioSlice
State: assets list, total value, gain/loss

Actions: setAssets, setValue

5.2 - Add mock asset data
JSON file with tokens: symbol, name, price, amount

Render in simple table

Test: Table populates with mock portfolio

5.3 - Compute total portfolio value
Derive value from asset price * amount

Show total at top

Test: Correct total shown

📈 Step 6: Market Data (Live)
6.1 - Create marketService.ts
Fetch top 10 tokens from Coingecko

Return name, symbol, price, 24h %

6.2 - Add marketSlice
State: prices array, loading

Dispatch market data on dashboard load

Test: Display live token prices

💳 Step 7: Transaction History (Mock)
7.1 - Create transactions table in Supabase
Fields: id, user_id, wallet, tx_hash, type, amount, timestamp

7.2 - Create transactionSlice
State: tx list

Actions: setTransactions

7.3 - Add mock transaction viewer
Table with token, amount, timestamp

Fetch from Supabase

Test: Transactions load on login

🖼️ Step 8: NFT Gallery (Mock)
8.1 - Create nftSlice
State: nfts, loading

Actions: setNFTs, clearNFTs

8.2 - Add dummy NFTs
Use placeholder OpenSea-style metadata

Render image grid with title/collection

Test: NFTs appear from Redux

🔒 Step 9: Secure Storage via Electron
9.1 - Add IPC channel: secureStore
In electron/ipc/secureStore.ts, add save/get handlers

Encrypt data using crypto module

9.2 - Expose via preload
Whitelist secureStore methods

Add type-safe bridge in contextBridge

9.3 - Store session token
On login, write session to secure storage

On load, read session and restore user

Test: User stays logged in after closing app

🧪 Step 10: Final MVP QA
10.1 - Smoke test all flows
Login/logout

Connect wallet

View mock portfolio

View market prices

Fetch + show transactions

View NFT gallery

10.2 - Build Electron app
Configure electron-builder

Package app for Windows/Mac/Linux

Test: Install and launch app successfully
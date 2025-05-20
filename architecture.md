🧠 Avilasha-2 Architecture
Avilasha-2 is a modern desktop application for managing cryptocurrency assets, wallets, and investments. Built on the Electron + React + TypeScript + Vite stack with Supabase for backend services.

🏗️ Folder Structure
bash
Copy
Edit
avilasha-2/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, icons, and static assets
│   ├── components/             # Reusable React components
│   ├── features/               # Feature-based structure (Redux Toolkit slices + views)
│   │   ├── portfolio/
│   │   ├── market/
│   │   ├── wallet/
│   │   ├── defi/
│   │   ├── nft/
│   │   ├── transactions/
│   ├── layouts/                # App and dashboard layouts
│   ├── lib/                    # Utility functions, Supabase client
│   ├── services/               # Data access layer (API, Supabase, etc.)
│   ├── state/                  # Global state (Redux store, slices)
│   ├── types/                  # Global TypeScript types/interfaces
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                  # Page-level components (route entries)
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Vite entry point
├── electron/
│   ├── main.ts                 # Electron main process
│   ├── preload.ts              # Electron preload script
│   ├── ipc/                    # IPC handlers (secure communication)
├── .env                        # Environment variables
├── package.json
├── vite.config.ts
└── tsconfig.json
🧩 Explanation of Each Layer
/public
Static files like index.html, logos, and preload icons.

/src
/assets
Images, logos, Lottie animations, etc.

/components
Reusable UI components like buttons, cards, modals, and charts.

/features
Domain-driven structure to keep logic modular.

Each feature folder (portfolio/, market/, etc.) includes:

bash
Copy
Edit
portfolio/
├── components/        # Feature-specific components
├── PortfolioPage.tsx  # Feature entry view
├── portfolioSlice.ts  # Redux slice for state
├── portfolioAPI.ts    # API services (calls Supabase or third-party APIs)
/layouts
Wrapper components for application shells (e.g., sidebar + topbar layouts).

/lib
supabaseClient.ts: Initializes and exports the Supabase client.

Utility functions: formatters, math, and date helpers.

/services
Data-fetching and interfacing layer:

marketService.ts: Coingecko or similar API for real-time data.

walletService.ts: Connects with wallet APIs or libraries (e.g., WalletConnect, MetaMask).

defiService.ts: Pulls DeFi investment data.

nftService.ts: Fetches NFTs from wallets.

secureStore.ts: Handles encryption/storage using Electron APIs.

/state
store.ts: Configures Redux store.

rootReducer.ts: Combines slices.

Middleware and selectors.

/types
Type definitions used across the app:

User.ts

Asset.ts

Wallet.ts

Transaction.ts

/hooks
Custom hooks like:

useAuth()

usePortfolio()

useMarketData()

/pages
Routes like:

Dashboard.tsx

Login.tsx

Settings.tsx

/electron
main.ts
Main Electron process:

App lifecycle (create window, open dev tools).

Window config (frameless, resizing, etc.).

Sets preload script.

preload.ts
Exposes whitelisted Electron/Node APIs to the renderer process (e.g., file system, secure store) via contextBridge.

/ipc
Handles IPC channels:

secureStore.ts: Read/write encrypted data

walletBridge.ts: Communicates wallet actions securely

🌐 State Management
Redux Toolkit
Used for predictable and scalable state.

Lives in:
src/state/

Feature-specific slices in src/features/*

Handles:
Portfolio data

Wallet balances

NFT & DeFi tracking

Auth/session state

Local Component State
For UI-local things (e.g., modals, input toggles).

🔌 Services & Connectivity
Supabase (Auth + DB)
Auth: Magic link / OAuth-based login

Database: Stores user portfolios, transactions, and NFT metadata

Functions (optional): Can be used for serverless logic (e.g., webhook handlers)

External APIs
Coingecko / CoinMarketCap: Price data

Etherscan / Blockchair: Transaction history

WalletConnect / MetaMask: Wallet integrations

OpenSea / Alchemy: NFT metadata

Electron IPC
Securely bridges Electron main and renderer.

Used for encrypted storage, wallet signing, local key management.

🔐 Security
Supabase RLS: Enforced per-user data access

Encryption: Sensitive info encrypted using crypto (Electron secure store)

IPC Whitelist: No direct Node access in renderer

Token Management: Tokens stored securely via Electron APIs, not browser localStorage

🧠 Key Feature Workflows
🔹 Portfolio Analytics
User connects wallets.

Fetch assets via walletService.

Save + analyze using Supabase + Redux.

🔹 Market Analysis
Market data polled from third-party API every X mins.

Trend charts rendered using Chart.js / Recharts.

🔹 Wallet Integration
WalletConnect/MetaMask via Electron-safe bridges.

Balances + NFTs retrieved and cached in Redux.

🔹 DeFi Dashboard
Pulls lending/staking data (Aave, Uniswap) through APIs.

Graphs & earnings shown per protocol.

🔹 NFT Gallery
Fetch NFT metadata (OpenSea, Alchemy).

Display media, traits, collection info.

⚙️ Build & Dev Setup
Dev: Vite + React + Tailwind

Desktop: Electron (electron-builder)

API Layer: Supabase (Auth + DB)

CI/CD: GitHub Actions → Build & sign Electron apps

📌 Future Enhancements
AI-powered insights (integrate HuggingFace or OpenAI for analysis)

Local hardware wallet support (Ledger/Trezor)

Multi-chain DeFi support (Arbitrum, Solana)


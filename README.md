# Avilasha-2

A modern desktop application for managing cryptocurrency assets, wallets, and investments.

## Features

- **Wallet Management**: Connect and manage multiple cryptocurrency wallets
- **Portfolio Analytics**: Track your portfolio value and performance
- **Market Data**: Real-time cryptocurrency prices and market information
- **Transaction History**: View and filter your transaction history
- **NFT Gallery**: Browse and view your NFT collection
- **Secure Storage**: Encrypted local storage for sensitive data

## Technologies

- **Electron**: Cross-platform desktop application framework
- **React**: UI library for building interactive interfaces
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tooling
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Backend-as-a-Service for authentication and data storage

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v8+)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/avilasha-2.git
   cd avilasha-2
   ```

2. Install dependencies
   ```bash
   npm install
   cd client && npm install
   ```

3. Create a `.env` file in the `client` directory with your Supabase credentials
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development

1. Start the development server
   ```bash
   npm run dev
   ```

   This will start both the Vite dev server for the React app and the Electron process.

### Building

1. Build the application
   ```bash
   npm run build
   ```

   This will build both the React app and compile the Electron TypeScript files.

### Packaging

1. Package the application for your platform
   ```bash
   npm run package
   ```

   Or for specific platforms:
   ```bash
   npm run package:win    # Windows
   npm run package:mac    # macOS
   npm run package:linux  # Linux
   ```

   Combined build and package commands are also available:
   ```bash
   npm run build:all     # All platforms
   npm run build:win     # Windows
   npm run build:mac     # macOS
   npm run build:linux   # Linux
   ```

## Testing

A comprehensive QA checklist is available in `qa_checklist.md`. Use this to perform smoke testing of all application features.

## Project Structure

```
avilasha-2/
├── build-resources/     # Resources for electron-builder
├── client/              # React frontend
│   ├── public/          # Static assets
│   ├── src/             # Source code
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context providers
│   │   ├── data/        # Mock data
│   │   ├── features/    # Feature-specific components
│   │   ├── lib/         # Utility libraries
│   │   ├── pages/       # Page components
│   │   ├── services/    # API and service functions
│   │   ├── state/       # Redux state management
│   │   └── types/       # TypeScript type definitions
├── electron/            # Electron main process
│   ├── ipc/             # IPC handlers
│   ├── main.ts          # Main entry point
│   └── preload.ts       # Preload script
└── supabase/            # Supabase migrations and configuration
    └── migrations/      # Database migration scripts
```

## Security

Avilasha-2 implements several security features:

- **Authentication**: Secure email magic link authentication via Supabase
- **Encrypted Storage**: AES-256-GCM encryption for sensitive local data
- **Context Isolation**: Proper Electron security practices
- **Row-Level Security**: Supabase RLS policies to protect user data

## License

MIT

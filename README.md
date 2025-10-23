# BUBBLO - Mood NFT App

A Farcaster-integrated NFT app where users can express their moods through dynamic, customizable NFTs on Base.

## Features

- **Wallet Connection**: Connect with any Web3 wallet via WalletConnect
- **NFT Minting**: Mint your unique BUBBLO mood NFT
- **Mood Selection**: Choose from 6 different moods (Happy, Neutral, Sad, Angry, Sleepy, Cool)
- **Style Customization**: Personalize your NFT with custom colors and patterns
- **Friends Integration**: Connect with Farcaster to see your friends' moods
- **Mobile-First Design**: Beautiful, responsive UI optimized for mobile

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Web3**: Wagmi + WalletConnect
- **UI**: shadcn/ui + Tailwind CSS
- **Social**: Farcaster integration

## Getting Started

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your WalletConnect Project ID from https://cloud.walletconnect.com
   - Add your deployed contract address

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Smart Contract

The app requires a BUBBLO NFT smart contract deployed on Base with the following functions:
- `mint()` - Mint a new NFT
- `getMood(tokenId)` - Get current mood
- `setMood(tokenId, mood)` - Update mood
- `getStyle(tokenId)` - Get style configuration
- `setStyle(tokenId, backgroundColor, bubbleColor, pattern)` - Update style

## Deployment

Deploy to Vercel with one click or use the Vercel CLI:

\`\`\`bash
vercel
\`\`\`

Make sure to add your environment variables in the Vercel dashboard.

## License

MIT

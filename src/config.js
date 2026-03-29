// src/config.js
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, sepolia } from '@reown/appkit/networks'
import { metaMask } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'
import { injected } from '@wagmi/core'
import { http } from '@wagmi/core'

export const queryClient = new QueryClient()

const projectId = 'eb35257e261a6d0e7f96be85cfb6447a'

const metadata = {
  name: 'Checkyourcrypto.com',
  description: 'Multi-chain dApp',
  url: window.location.origin,
  icons: ['https://mydapp.com/icon.png']
}

// Ethereum adapter (wagmi-based)
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, polygon],
  projectId,
})


// Initialize AppKit
// createAppKit({
//   adapters: [wagmiAdapter],
//   networks: [mainnet, polygon],
//   projectId,
//   metadata,
//   // connectors: [
//   //   injected({
//   //     filter(provider) {
//   //       return !provider.isPhantom  // ✅ blocks Phantom extension
//   //     }
//   //   })
//   // ],
//   enableWalletConnect: false,
//   enableInjected: false,
//   enableEIP6963: false,

//   connectors: [],

//   featuredWalletIds: [
//     'c57ca95b3b0c3f4a3c0c9c6c5d1e6f3c1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f', // MetaMask
//     '4622a2b2d6af0b7c3e1c2b1c3f4e5d6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', // Trust Wallet
//     '19177a982e7f6c6f0d3b0a2c9f4e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3', // Exodus
//     'imtoken', // imToken
//   ],

//   features: {
//     email: false,           // ✅ removes email login
//     socials: [],            // ✅ removes Google, X, Github etc
//     emailShowWallets: false,
//     analytics: true
//   },
  
// })

//This is the AppKit without phantom
// createAppKit({
//   adapters: [wagmiAdapter],
//   networks: [mainnet, polygon],
//   projectId,
//   metadata,

//   // ❌ COMPLETELY DISABLE WalletConnect
//   enableWalletConnect: false,

//   // ❌ Disable auto wallet discovery
//   enableEIP6963: true,

//   // ✅ Only allow injected wallets (MetaMask etc.)
//   enableInjected: true,

//   // connectors: [
//   //   injected({
//   //     target: 'metaMask', // 🔥 ONLY MetaMask allowed
//   //   })
//   // ],
//   connectors: [
//     metaMask(),
//     injected({ target: 'trust' }),
//   ],

//   excludeWalletIds: [
//     'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // Phantom (main)
//     '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662', // Phantom (alt)
//   ],
  
//   featuredWalletIds: [
//     '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
//   ],

//   features: {
//     email: false,
//     socials: [],
//     emailShowWallets: false,
//     analytics: true
//   },
// })

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, polygon],
  projectId,
  metadata,

  // ❌ COMPLETELY DISABLE WalletConnect
  enableWalletConnect: true,

  // ❌ Disable auto wallet discovery
  enableEIP6963: true,

  // ✅ Only allow injected wallets (MetaMask etc.)
  enableInjected: true,

  // connectors: [
  //   injected({
  //     target: 'metaMask', // 🔥 ONLY MetaMask allowed
  //   })
  // ],
  // connectors: [
  //   metaMask(),
  //   injected({ target: 'trust' }),
  // ],

  features: {
    email: false,
    socials: [],
    emailShowWallets: false,
    analytics: true
  },
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
import { createPublicClient, createWalletClient, http } from 'viem'
import { defineChain } from 'viem'

export const megaeth = defineChain({
  id: 420420, // Example Chain ID for MegaETH (replace if different)
  name: 'MegaETH',
  nativeCurrency: {
    decimals: 18,
    name: 'MegaETH',
    symbol: 'MEGA',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.megaeth.xyz'],
    },
    public: {
      http: ['https://rpc.megaeth.xyz'],
    },
  },
})

export const publicClient = createPublicClient({
  chain: megaeth,
  transport: http(),
})

export const walletClient = createWalletClient({
  chain: megaeth,
  transport: http(),
})

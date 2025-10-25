"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { config } from "@/lib/wagmi-config"
import { Toaster } from "@/components/ui/toaster"
import { MiniAppProvider } from "@/components/miniapp-provider"
import { useBlockchainSync } from "@/hooks/use-blockchain-sync"
import { useState } from "react"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
})

/**
 * Composant interne qui active la synchronisation blockchain → MongoDB
 * Doit être à l'intérieur de WagmiProvider pour accéder aux hooks wagmi
 */
function BlockchainSyncProvider({ children }: { children: React.ReactNode }) {
  // Active les listeners d'événements blockchain
  useBlockchainSync()
  
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <MiniAppProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <BlockchainSyncProvider>
            {children}
            <Toaster />
          </BlockchainSyncProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </MiniAppProvider>
  )
}

"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { config } from "@/lib/wagmi-config"
import { Toaster } from "@/components/ui/toaster"
import { MiniAppProvider } from "@/components/miniapp-provider"
import { useState } from "react"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <MiniAppProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </WagmiProvider>
    </MiniAppProvider>
  )
}

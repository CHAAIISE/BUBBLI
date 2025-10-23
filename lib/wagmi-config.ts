import { http, createConfig } from "wagmi"
import { base, baseSepolia } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [injected(), walletConnect({ projectId })],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

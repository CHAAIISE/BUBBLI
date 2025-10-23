"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function WalletConnect() {
  const { open } = useWeb3Modal()

  return (
    <Button size="lg" onClick={() => open()} className="w-full gap-2 text-lg shadow-lg">
      <Wallet className="h-5 w-5" />
      Connect Wallet
    </Button>
  )
}

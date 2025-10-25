"use client"

import { useAccount, useDisconnect } from "wagmi"
import { WalletConnect } from "@/components/wallet-connect"
import { NFTDisplay } from "@/components/nft-display"
import { MintButton } from "@/components/mint-button"
import { BottomNav } from "@/components/bottom-nav"
import { useNFTOwnership } from "@/hooks/use-nft-ownership"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { hasNFT, tokenId, isLoading } = useNFTOwnership(address)

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <span className="text-5xl">💭</span>
            </div>
            <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground">BUBBLO</h1>
            <p className="text-pretty text-lg text-muted-foreground">Express your mood through dynamic NFTs</p>
          </div>
          <WalletConnect />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your NFT...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-screen flex-col pb-24">
        {/* DEBUG: Temporary disconnect button */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => disconnect()}
            variant="outline"
            size="sm"
            className="gap-2 bg-background/80 backdrop-blur-sm"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </Button>
        </div>

        <div className="flex-1 p-6">
          {!hasNFT ? (
            <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-8">
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <span className="text-7xl">✨</span>
                </div>
                <h2 className="text-balance text-3xl font-bold text-foreground">Welcome to BUBBLO</h2>
                <p className="text-pretty text-muted-foreground">Mint your first mood NFT to get started</p>
              </div>
              <MintButton />
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Your NFT</h2>
                <p className="text-sm text-muted-foreground">Customize your mood and style below</p>
              </div>
              <NFTDisplay tokenId={tokenId!} />
            </div>
          )}
        </div>
      </div>
      {isConnected && <BottomNav />}
    </>
  )
}

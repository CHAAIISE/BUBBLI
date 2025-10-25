"use client"

import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { useNFTOwnership } from "@/hooks/use-nft-ownership"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function StylePage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { hasNFT } = useNFTOwnership(address)

  if (!isConnected || !hasNFT) {
    return (
      <>
        <div className="flex min-h-screen items-center justify-center p-6 pb-24">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              {!isConnected ? "Please connect your wallet" : "You need to mint an NFT first"}
            </p>
            <Button onClick={() => router.push("/")}>Go to Home</Button>
          </div>
        </div>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen pb-24">
        <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center gap-4 p-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Customize Style</h1>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <Card className="p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-6">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Style Customization</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Cette fonctionnalité sera disponible prochainement. Pour l'instant, vous pouvez changer votre humeur dans l'onglet Mood.
            </p>
            <Button onClick={() => router.push("/mood")} size="lg" className="mt-4">
              Change Your Mood Instead
            </Button>
          </Card>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

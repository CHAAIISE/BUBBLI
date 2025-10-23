"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BottomNav } from "@/components/bottom-nav"
import { useNFTOwnership } from "@/hooks/use-nft-ownership"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const BACKGROUND_COLORS = [
  { name: "Purple Dream", value: "#8B5CF6", gradient: "from-purple-500 to-purple-600" },
  { name: "Ocean Blue", value: "#3B82F6", gradient: "from-blue-500 to-blue-600" },
  { name: "Sunset Orange", value: "#F97316", gradient: "from-orange-500 to-orange-600" },
  { name: "Forest Green", value: "#10B981", gradient: "from-green-500 to-green-600" },
  { name: "Rose Pink", value: "#EC4899", gradient: "from-pink-500 to-pink-600" },
  { name: "Golden Yellow", value: "#F59E0B", gradient: "from-yellow-500 to-yellow-600" },
]

const BUBBLE_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Light Blue", value: "#DBEAFE" },
  { name: "Light Purple", value: "#E9D5FF" },
  { name: "Light Pink", value: "#FCE7F3" },
  { name: "Light Green", value: "#D1FAE5" },
  { name: "Light Yellow", value: "#FEF3C7" },
]

const PATTERNS = [
  { name: "Bubbles", value: "bubbles" },
  { name: "Waves", value: "waves" },
  { name: "Dots", value: "dots" },
  { name: "Gradient", value: "gradient" },
  { name: "Solid", value: "solid" },
]

export default function StylePage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { hasNFT, tokenId } = useNFTOwnership(address)
  const { toast } = useToast()

  const [backgroundColor, setBackgroundColor] = useState(BACKGROUND_COLORS[0].value)
  const [bubbleColor, setBubbleColor] = useState(BUBBLE_COLORS[0].value)
  const [pattern, setPattern] = useState(PATTERNS[0].value)

  const { data: currentStyle } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getStyle",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  })

  useEffect(() => {
    if (currentStyle) {
      setBackgroundColor(currentStyle.backgroundColor || BACKGROUND_COLORS[0].value)
      setBubbleColor(currentStyle.bubbleColor || BUBBLE_COLORS[0].value)
      setPattern(currentStyle.pattern || PATTERNS[0].value)
    }
  }, [currentStyle])

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSave = async () => {
    if (!tokenId) return

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "setStyle",
        args: [BigInt(tokenId), backgroundColor, bubbleColor, pattern],
      })

      toast({
        title: "Updating style",
        description: "Please wait for confirmation...",
      })
    } catch (error) {
      console.error("[v0] Style update error:", error)
      toast({
        title: "Error",
        description: "Failed to update style",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success!",
        description: "Your NFT style has been updated",
      })
    }
  }, [isSuccess, toast])

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
              <p className="text-sm text-muted-foreground">Make your NFT unique</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Preview */}
          <Card className="overflow-hidden">
            <div className="aspect-square p-8 transition-colors duration-300" style={{ backgroundColor }}>
              <div className="flex h-full items-center justify-center">
                <div
                  className="h-32 w-32 rounded-full shadow-lg transition-colors duration-300"
                  style={{ backgroundColor: bubbleColor }}
                />
              </div>
            </div>
          </Card>

          {/* Background Color */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Background Color</Label>
            <div className="grid grid-cols-3 gap-3">
              {BACKGROUND_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setBackgroundColor(color.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
                    backgroundColor === color.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className={cn("h-12 w-12 rounded-full bg-gradient-to-br", color.gradient)} />
                  <span className="text-xs font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bubble Color */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Bubble Color</Label>
            <div className="grid grid-cols-3 gap-3">
              {BUBBLE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setBubbleColor(color.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
                    bubbleColor === color.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div
                    className="h-12 w-12 rounded-full border border-border"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Pattern</Label>
            <div className="grid grid-cols-2 gap-3">
              {PATTERNS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPattern(p.value)}
                  className={cn(
                    "rounded-lg border-2 p-4 text-center font-medium transition-all",
                    pattern === p.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button size="lg" onClick={handleSave} disabled={isPending || isConfirming} className="w-full gap-2">
            {isPending || isConfirming ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isConfirming ? "Confirming..." : "Saving..."}
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Save Style
              </>
            )}
          </Button>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { useNFTOwnership } from "@/hooks/use-nft-ownership"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const MOODS = [
  { id: 0, label: "Happy", emoji: "😊", color: "from-yellow-400 to-orange-400", description: "Feeling great!" },
  { id: 1, label: "Neutral", emoji: "😐", color: "from-gray-400 to-gray-500", description: "Just okay" },
  { id: 2, label: "Sad", emoji: "😢", color: "from-blue-400 to-blue-600", description: "Feeling down" },
  { id: 3, label: "Angry", emoji: "😡", color: "from-red-400 to-red-600", description: "Frustrated" },
  { id: 4, label: "Sleepy", emoji: "😴", color: "from-purple-400 to-indigo-500", description: "Need rest" },
  { id: 5, label: "Cool", emoji: "😎", color: "from-cyan-400 to-blue-500", description: "Feeling awesome" },
]

export default function MoodPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { hasNFT, tokenId } = useNFTOwnership(address)
  const { toast } = useToast()

  const [selectedMood, setSelectedMood] = useState<number>(0)

  const { data: currentMood } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getMood",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  })

  useEffect(() => {
    if (currentMood !== undefined) {
      setSelectedMood(Number(currentMood))
    }
  }, [currentMood])

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleMoodChange = async (moodId: number) => {
    if (!tokenId) return

    setSelectedMood(moodId)

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "setMood",
        args: [BigInt(tokenId), moodId],
      })

      toast({
        title: "Updating mood",
        description: "Please wait for confirmation...",
      })
    } catch (error) {
      console.error("[v0] Mood update error:", error)
      toast({
        title: "Error",
        description: "Failed to update mood",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success!",
        description: "Your mood has been updated",
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

  const currentMoodData = MOODS[selectedMood]

  return (
    <>
      <div className="min-h-screen pb-24">
        <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center gap-4 p-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Set Your Mood</h1>
              <p className="text-sm text-muted-foreground">Express how you feel</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Current Mood Display */}
          <Card className="overflow-hidden">
            <div className={cn("bg-gradient-to-br p-12 text-center", currentMoodData.color)}>
              <div className="space-y-4">
                <div className="text-8xl">{currentMoodData.emoji}</div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold text-white">{currentMoodData.label}</h2>
                  <p className="text-lg text-white/90">{currentMoodData.description}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Mood Selection Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Your Mood</h3>
            <div className="grid grid-cols-2 gap-4">
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodChange(mood.id)}
                  disabled={isPending || isConfirming}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border-2 p-6 transition-all",
                    selectedMood === mood.id
                      ? "border-primary ring-2 ring-primary/20 scale-105"
                      : "border-border hover:border-primary/50 hover:scale-102",
                    (isPending || isConfirming) && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10", mood.color)} />
                  <div className="relative space-y-2 text-center">
                    <div className="text-5xl">{mood.emoji}</div>
                    <div className="font-semibold">{mood.label}</div>
                    <div className="text-xs text-muted-foreground">{mood.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status Message */}
          {(isPending || isConfirming) && (
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">
                  {isConfirming ? "Confirming transaction..." : "Updating your mood..."}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  )
}

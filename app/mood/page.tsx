"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { useNFTOwnership } from "@/hooks/use-nft-ownership"
import { CONTRACT_ADDRESS, CONTRACT_ABI, MOODS } from "@/lib/contract"
import { MOOD_STYLES } from "@/lib/mood-styles"
import { NFTAvatar } from "@/components/nft-avatar"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

// Tous les moods du smart contract avec leurs infos
const MOOD_OPTIONS = [
  { id: MOODS.HAPPY, name: "Happy", emoji: "😊", description: "Feeling great!" },
  { id: MOODS.SAD, name: "Sad", emoji: "�", description: "Feeling down" },
  { id: MOODS.ANGER, name: "Anger", emoji: "😠", description: "Frustrated" },
  { id: MOODS.FEAR, name: "Fear", emoji: "�", description: "Scared" },
  { id: MOODS.SURPRISE, name: "Surprise", emoji: "😲", description: "Shocked!" },
  { id: MOODS.BOREDOM, name: "Boredom", emoji: "�", description: "So bored" },
  { id: MOODS.SHAME, name: "Shame", emoji: "😳", description: "Embarrassed" },
  { id: MOODS.DETERMINATION, name: "Determination", emoji: "�", description: "Let's go!" },
  { id: MOODS.EXCITEMENT, name: "Excitement", emoji: "🤩", description: "So excited!" },
  { id: MOODS.KAWAII, name: "Kawaii", emoji: "🥰", description: "Cuteness!" },
  { id: MOODS.SLEEPY, name: "Sleepy", emoji: "�", description: "Need rest" },
  { id: MOODS.MISCHIEVOUS, name: "Mischievous", emoji: "😈", description: "Up to something" },
]

export default function MoodPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { hasNFT, tokenId } = useNFTOwnership(address)
  const { toast } = useToast()

  // Charger le style personnalisé depuis localStorage
  const [customStyle, setCustomStyle] = useState<{
    headColor?: string
    bodyColor?: string
    bgColor?: string
    bgItem?: string
  }>({})

  useEffect(() => {
    if (tokenId !== undefined) {
      const saved = localStorage.getItem(`nft-style-${tokenId}`)
      if (saved) {
        setCustomStyle(JSON.parse(saved))
      }
    }
  }, [tokenId])

  const { data: currentMood } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getMood",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  })

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleMoodChange = async (moodId: number) => {
    if (!hasNFT) return

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "changeMood",
        args: [moodId],
      })

      toast({
        title: "Updating mood",
        description: "Please wait for confirmation...",
      })
    } catch (error) {
      console.error("Mood update error:", error)
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
        title: "Success! 🎉",
        description: "Your mood has been updated",
      })
      setTimeout(() => window.location.reload(), 2000)
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
              <h1 className="text-xl font-bold">Set Your Mood</h1>
              <p className="text-sm text-muted-foreground">Express how you feel</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Mood Selection Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Choose Your Mood</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {MOOD_OPTIONS.map((mood) => {
                const moodStyle = MOOD_STYLES[mood.id as keyof typeof MOOD_STYLES]
                const isSelected = currentMood !== undefined && Number(currentMood) === mood.id
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodChange(mood.id)}
                    disabled={isPending || isConfirming}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border-2 p-4 transition-all",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 scale-105"
                        : "border-border hover:border-primary/50 hover:scale-102",
                      (isPending || isConfirming) && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {/* Mini NFT Preview */}
                    <div className="aspect-square w-full mb-3 rounded-lg overflow-hidden" style={{ backgroundColor: moodStyle.bgColor }}>
                      <NFTAvatar 
                        mood={mood.id} 
                        headColor={customStyle.headColor}
                        bodyColor={customStyle.bodyColor}
                        bgColor={customStyle.bgColor}
                        bgItem={customStyle.bgItem}
                        className="w-full h-full" 
                      />
                    </div>
                    
                    {/* Mood Info */}
                    <div className="relative space-y-1 text-center">
                      <div className="font-semibold text-sm">{mood.name}</div>
                      <div className="text-xs text-muted-foreground">{mood.description}</div>
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
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

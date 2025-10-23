"use client"

import { useEffect, useState } from "react"
import { useReadContract } from "wagmi"
import { Card } from "@/components/ui/card"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Palette, Smile } from "lucide-react"
import Link from "next/link"

interface NFTDisplayProps {
  tokenId: number
}

const MOOD_LABELS = ["Happy", "Neutral", "Sad", "Angry", "Sleepy", "Cool"]
const MOOD_EMOJIS = ["😊", "😐", "😢", "😡", "😴", "😎"]

export function NFTDisplay({ tokenId }: NFTDisplayProps) {
  const [metadata, setMetadata] = useState<any>(null)

  const { data: tokenURI } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  })

  const { data: mood } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getMood",
    args: [BigInt(tokenId)],
  })

  const { data: style } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getStyle",
    args: [BigInt(tokenId)],
  })

  useEffect(() => {
    if (tokenURI && typeof tokenURI === "string") {
      fetch(tokenURI)
        .then((res) => res.json())
        .then(setMetadata)
        .catch(console.error)
    }
  }, [tokenURI])

  const moodIndex = mood ? Number(mood) : 0
  const currentMood = MOOD_LABELS[moodIndex] || "Unknown"
  const currentEmoji = MOOD_EMOJIS[moodIndex] || "❓"

  const backgroundColor = style?.backgroundColor || "#8B5CF6"
  const bubbleColor = style?.bubbleColor || "#FFFFFF"

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="aspect-square p-8 transition-colors duration-300" style={{ backgroundColor }}>
          {metadata?.image ? (
            <img
              src={metadata.image || "/placeholder.svg"}
              alt={metadata.name || "NFT"}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div
                className="flex h-48 w-48 items-center justify-center rounded-full shadow-2xl transition-colors duration-300"
                style={{ backgroundColor: bubbleColor }}
              >
                <span className="text-8xl">{currentEmoji}</span>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{metadata?.name || `BUBBLO #${tokenId}`}</h3>
            <Badge variant="secondary" className="text-lg">
              {currentEmoji} {currentMood}
            </Badge>
          </div>
          {metadata?.description && <p className="text-sm text-muted-foreground">{metadata.description}</p>}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
          <Link href="/mood">
            <Smile className="h-5 w-5" />
            Change Mood
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
          <Link href="/style">
            <Palette className="h-5 w-5" />
            Customize Style
          </Link>
        </Button>
      </div>
    </div>
  )
}

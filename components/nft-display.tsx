"use client"

import { useReadContract } from "wagmi"
import { Card } from "@/components/ui/card"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Smile } from "lucide-react"
import Link from "next/link"
import { NFTAvatar } from "@/components/nft-avatar"
import { MOOD_STYLES } from "@/lib/mood-styles"
import { useState, useEffect } from "react"

interface NFTDisplayProps {
  tokenId: number
}

export function NFTDisplay({ tokenId }: NFTDisplayProps) {
  const { data: mood } = useReadContract({
    address: CONTRACT_ADDRESS as `0x\${string}`,
    abi: CONTRACT_ABI,
    functionName: "getMood",
    args: tokenId !== undefined ? [BigInt(tokenId)] : undefined,
    query: { enabled: tokenId !== undefined },
  })

  const { data: message } = useReadContract({
    address: CONTRACT_ADDRESS as `0x\${string}`,
    abi: CONTRACT_ABI,
    functionName: "getMessage",
    args: tokenId !== undefined ? [BigInt(tokenId)] : undefined,
    query: { enabled: tokenId !== undefined },
  })

  const moodIndex = mood ? Number(mood) : 0
  const moodStyle = MOOD_STYLES[moodIndex as keyof typeof MOOD_STYLES] || MOOD_STYLES[0]
  const userMessage = message as string || ""

  const [customStyle, setCustomStyle] = useState<{
    headColor?: string
    bodyColor?: string
    bgColor?: string
    bgItem?: string
  }>({})

  useEffect(() => {
    const saved = localStorage.getItem(`nft-style-\${tokenId}`)
    if (saved) {
      setCustomStyle(JSON.parse(saved))
    }
  }, [tokenId])

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="aspect-square p-8">
          <NFTAvatar mood={moodIndex} headColor={customStyle.headColor} bodyColor={customStyle.bodyColor} bgColor={customStyle.bgColor} bgItem={customStyle.bgItem} className="w-full h-full" />
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">BUBBLO #{tokenId}</h3>
            <Badge variant="secondary" className="text-lg">{moodStyle.name}</Badge>
          </div>
          {userMessage && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm italic">"{userMessage}"</p>
            </div>
          )}
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
          <Link href="/mood">
            <Smile className="h-5 w-5" />
            Change Mood
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
          <Link href="/message">
            <MessageSquare className="h-5 w-5" />
            Set Message
          </Link>
        </Button>
      </div>
    </div>
  )
}

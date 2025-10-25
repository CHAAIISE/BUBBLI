"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract } from "wagmi"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BottomNav } from "@/components/bottom-nav"
import { useNFTOwnership } from "@/hooks/use-nft-ownership"
import { NFTAvatar } from "@/components/nft-avatar"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { MOOD_STYLES } from "@/lib/mood-styles"
import { ArrowLeft, Shuffle } from "lucide-react"

export default function StylePage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { hasNFT, tokenId } = useNFTOwnership(address)

  const { data: mood } = useReadContract({
    address: CONTRACT_ADDRESS as `0x\${string}`,
    abi: CONTRACT_ABI,
    functionName: "getMood",
    args: tokenId !== undefined ? [BigInt(tokenId)] : undefined,
    query: { enabled: tokenId !== undefined },
  })

  const moodIndex = mood ? Number(mood) : 0
  const defaultStyle = MOOD_STYLES[moodIndex as keyof typeof MOOD_STYLES] || MOOD_STYLES[0]

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 }
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }).join("")
  }

  const [headRgb, setHeadRgb] = useState(hexToRgb(defaultStyle.headColor))
  const [bodyRgb, setBodyRgb] = useState(hexToRgb(defaultStyle.bodyColor))
  const [bgRgb, setBgRgb] = useState(hexToRgb(defaultStyle.bgColor))
  const [bgItem, setBgItem] = useState<string>(defaultStyle.bgItem)

  const bgItems = ["BGI1", "BGI2", "BGI3", "BGI4", "BGI5", "BGI6", "BGI7", "BGI8", "BGI9"]

  const randomizeBgItem = () => {
    const availableItems = bgItems.filter(item => item !== bgItem)
    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)]
    setBgItem(randomItem)
  }

  const headColor = rgbToHex(headRgb.r, headRgb.g, headRgb.b)
  const bodyColor = rgbToHex(bodyRgb.r, bodyRgb.g, bodyRgb.b)
  const bgColor = rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b)

  useEffect(() => {
    if (tokenId !== undefined) {
      localStorage.setItem(`nft-style-\${tokenId}`, JSON.stringify({
        headColor, bodyColor, bgColor, bgItem
      }))
    }
  }, [headColor, bodyColor, bgColor, bgItem, tokenId])

  useEffect(() => {
    if (tokenId !== undefined) {
      const saved = localStorage.getItem(`nft-style-\${tokenId}`)
      if (saved) {
        const style = JSON.parse(saved)
        setHeadRgb(hexToRgb(style.headColor))
        setBodyRgb(hexToRgb(style.bodyColor))
        setBgRgb(hexToRgb(style.bgColor))
        if (style.bgItem) setBgItem(style.bgItem)
      }
    }
  }, [tokenId])

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
      <div className="min-h-screen pb-24 overflow-x-hidden">
        <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center gap-4 p-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Customize Style</h1>
              <p className="text-sm text-muted-foreground">{defaultStyle.name}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6 max-w-2xl mx-auto">
          <div className="w-full aspect-square max-w-sm mx-auto">
            <NFTAvatar mood={moodIndex} headColor={headColor} bodyColor={bodyColor} bgColor={bgColor} bgItem={bgItem} />
          </div>

          <Card className="p-4 space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Head Color</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm w-8 text-red-500 font-medium">R</span>
                  <input type="range" min="0" max="255" value={headRgb.r} onChange={(e) => setHeadRgb({...headRgb, r: parseInt(e.target.value)})} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-red-500" />
                  <span className="text-sm w-10 text-right font-mono">{headRgb.r}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm w-8 text-green-500 font-medium">G</span>
                  <input type="range" min="0" max="255" value={headRgb.g} onChange={(e) => setHeadRgb({...headRgb, g: parseInt(e.target.value)})} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-green-500" />
                  <span className="text-sm w-10 text-right font-mono">{headRgb.g}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm w-8 text-blue-500 font-medium">B</span>
                  <input type="range" min="0" max="255" value={headRgb.b} onChange={(e) => setHeadRgb({...headRgb, b: parseInt(e.target.value)})} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  <span className="text-sm w-10 text-right font-mono">{headRgb.b}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Body Color</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm w-8 text-red-500 font-medium">R</span>
                  <input type="range" min="0" max="255" value={bodyRgb.r} onChange={(e) => setBodyRgb({...bodyRgb, r: parseInt(e.target.value)})} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-red-500" />
                  <span className="text-sm w-10 text-right font-mono">{bodyRgb.r}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm w-8 text-green-500 font-medium">G</span>
                  <input type="range" min="0" max="255" value={bodyRgb.g} onChange={(e) => setBodyRgb({...bodyRgb, g: parseInt(e.target.value)})} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-green-500" />
                  <span className="text-sm w-10 text-right font-mono">{bodyRgb.g}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm w-8 text-blue-500 font-medium">B</span>
                  <input type="range" min="0" max="255" value={bodyRgb.b} onChange={(e) => setBodyRgb({...bodyRgb, b: parseInt(e.target.value)})} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  <span className="text-sm w-10 text-right font-mono">{bodyRgb.b}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Background Color</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm w-8 text-red-500 font-medium">R</span>
                  <input type="range" min="0" max="255" value={bgRgb.r} onChange={(e) => setBgRgb({...bgRgb, r: parseInt(e.target.value)})} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-red-500" />
                  <span className="text-sm w-10 text-right font-mono">{bgRgb.r}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm w-8 text-green-500 font-medium">G</span>
                  <input type="range" min="0" max="255" value={bgRgb.g} onChange={(e) => setBgRgb({...bgRgb, g: parseInt(e.target.value)})} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-green-500" />
                  <span className="text-sm w-10 text-right font-mono">{bgRgb.g}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm w-8 text-blue-500 font-medium">B</span>
                  <input type="range" min="0" max="255" value={bgRgb.b} onChange={(e) => setBgRgb({...bgRgb, b: parseInt(e.target.value)})} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  <span className="text-sm w-10 text-right font-mono">{bgRgb.b}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={randomizeBgItem} variant="outline" className="w-full gap-2">
                <Shuffle className="h-4 w-4" />
                Random Background Item
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

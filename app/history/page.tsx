"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"
import { useNFTOwnership } from "@/hooks/use-nft-ownership"
import { ArrowLeft, History, Loader2, Clock, MessageSquare } from "lucide-react"

/**
 * Page qui affiche l'historique complet des changements de mood/message
 * Récupère les données depuis MongoDB via l'API Render
 */
export default function HistoryPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { hasNFT, tokenId } = useNFTOwnership(address)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Charger l'historique depuis l'API
  useEffect(() => {
    if (!tokenId) return

    const fetchHistory = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/nft/${tokenId}/history`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch history")
        }

        const data = await response.json()
        setHistory(data.history || [])
      } catch (err: any) {
        console.error("Error fetching history:", err)
        setError(err.message || "Failed to load history")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [tokenId])

  // Fonction pour formater la date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Fonction pour obtenir l'emoji du mood
  const getMoodEmoji = (moodName: string) => {
    const emojis: Record<string, string> = {
      HAPPY: "😊",
      SAD: "😢",
      ANGER: "😠",
      FEAR: "😨",
      SURPRISE: "😲",
      BOREDOM: "😑",
      SHAME: "😳",
      DETERMINATION: "😤",
      EXCITEMENT: "🤩",
      KAWAII: "🥰",
      SLEEPY: "😴",
      MISCHIEVOUS: "😈",
    }
    return emojis[moodName] || "😊"
  }

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
              <h1 className="text-xl font-bold">History</h1>
              <p className="text-sm text-muted-foreground">
                Your mood & message changes
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <Card className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading history from MongoDB...</p>
            </Card>
          ) : error ? (
            <Card className="p-8 text-center space-y-4">
              <p className="text-destructive font-semibold">Error loading history</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </Card>
          ) : history.length === 0 ? (
            <Card className="p-8 text-center space-y-4">
              <History className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No history yet</p>
              <p className="text-sm text-muted-foreground">
                Your mood and message changes will appear here
              </p>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {history.length} change{history.length > 1 ? "s" : ""} recorded
                </p>
              </div>

              {history.map((entry, index) => (
                <Card key={index} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {getMoodEmoji(entry.moodName || "HAPPY")}
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-1">
                          {entry.moodName || "Unknown Mood"}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(entry.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {entry.message && (
                    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm">{entry.message}</p>
                    </div>
                  )}
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  )
}

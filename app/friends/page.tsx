"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"
import { useNFTOwnership } from "@/hooks/use-nft-ownership"
import { ArrowLeft, Search, UserPlus, ExternalLink } from "lucide-react"

const MOOD_EMOJIS = ["😊", "😐", "😢", "😡", "😴", "😎"]

// Mock friends data - in production, this would come from Farcaster API
const MOCK_FRIENDS = [
  {
    fid: 1,
    username: "dwr",
    displayName: "Dan Romero",
    pfpUrl: "/abstract-profile.png",
    mood: 5,
    hasNFT: true,
  },
  {
    fid: 2,
    username: "v",
    displayName: "Varun Srinivasan",
    pfpUrl: "/abstract-profile.png",
    mood: 0,
    hasNFT: true,
  },
  {
    fid: 3,
    username: "jessepollak",
    displayName: "Jesse Pollak",
    pfpUrl: "/abstract-profile.png",
    mood: 5,
    hasNFT: true,
  },
]

export default function FriendsPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { hasNFT } = useNFTOwnership(address)
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState(MOCK_FRIENDS)
  const [isConnectedToFarcaster, setIsConnectedToFarcaster] = useState(false)

  const filteredFriends = friends.filter(
    (friend) =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleConnectFarcaster = () => {
    // In production, this would initiate Farcaster auth flow
    setIsConnectedToFarcaster(true)
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

  if (!isConnectedToFarcaster) {
    return (
      <>
        <div className="flex min-h-screen items-center justify-center p-6 pb-24">
          <Card className="w-full max-w-md p-8 text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Connect to Farcaster</h2>
              <p className="text-muted-foreground">
                Connect your Farcaster account to see your friends' moods and share yours
              </p>
            </div>
            <Button size="lg" onClick={handleConnectFarcaster} className="w-full gap-2">
              <UserPlus className="h-5 w-5" />
              Connect Farcaster
            </Button>
            <Button variant="ghost" onClick={() => router.push("/")}>
              Skip for now
            </Button>
          </Card>
        </div>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen pb-24">
        <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="space-y-4 p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Friends</h1>
                <p className="text-sm text-muted-foreground">See how your friends are feeling</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {filteredFriends.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No friends found</p>
            </Card>
          ) : (
            filteredFriends.map((friend) => (
              <Card key={friend.fid} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={friend.pfpUrl || "/placeholder.svg"} alt={friend.displayName} />
                      <AvatarFallback>{friend.displayName[0]}</AvatarFallback>
                    </Avatar>
                    {friend.hasNFT && (
                      <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-background border-2 border-card">
                        <span className="text-lg">{MOOD_EMOJIS[friend.mood]}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{friend.displayName}</h3>
                      {friend.hasNFT && (
                        <Badge variant="secondary" className="text-xs">
                          BUBBLO
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">@{friend.username}</p>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`https://warpcast.com/${friend.username}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Share Section */}
        <div className="p-6">
          <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/10 to-accent/10">
            <h3 className="font-semibold">Share Your Mood</h3>
            <p className="text-sm text-muted-foreground">
              Cast your current mood to Farcaster and let your friends know how you're feeling
            </p>
            <Button className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              Share on Farcaster
            </Button>
          </Card>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

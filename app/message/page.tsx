"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BottomNav } from "@/components/bottom-nav"
import { useNFTOwnership } from "@/hooks/use-nft-ownership"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { ArrowLeft, MessageSquare, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

/**
 * Page pour définir/modifier le message personnalisé du NFT
 * Appelle la fonction setMessage() du smart contract
 * La synchronisation avec MongoDB se fait automatiquement via useMessageSync
 */
export default function MessagePage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { hasNFT, tokenId } = useNFTOwnership(address)
  const { toast } = useToast()
  const [message, setMessage] = useState("")

  // Lire le message actuel depuis la blockchain
  const { data: currentMessage } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getMessage",
    args: tokenId !== undefined ? [BigInt(tokenId)] : undefined,
    query: { enabled: tokenId !== undefined },
  })

  // Hook pour écrire sur la blockchain
  const { writeContract, data: hash, isPending } = useWriteContract()

  // Attendre la confirmation de la transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Fonction pour mettre à jour le message
  const handleSetMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    if (message.length > 200) {
      toast({
        title: "Error",
        description: "Message must be 200 characters or less",
        variant: "destructive",
      })
      return
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "setMessage",
        args: [message],
      })
    } catch (error) {
      console.error("Error setting message:", error)
      toast({
        title: "Error",
        description: "Failed to set message",
        variant: "destructive",
      })
    }
  }

  // Recharger la page après confirmation
  if (isSuccess) {
    toast({
      title: "Success! 💬",
      description: "Your message has been updated",
    })
    setTimeout(() => window.location.reload(), 2000)
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
              <h1 className="text-xl font-bold">Your Message</h1>
              <p className="text-sm text-muted-foreground">
                Express yourself (max 200 characters)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-3">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Current Message</h2>
                <p className="text-sm text-muted-foreground">
                  {currentMessage || "No message set yet"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">New Message</Label>
              <Input
                id="message"
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
                disabled={isPending || isConfirming}
              />
              <p className="text-xs text-muted-foreground text-right">
                {message.length}/200 characters
              </p>
            </div>

            <Button
              onClick={handleSetMessage}
              disabled={isPending || isConfirming || !message.trim()}
              className="w-full"
              size="lg"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPending ? "Sending..." : "Confirming..."}
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Update Message
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

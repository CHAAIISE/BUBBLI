"use client"

import { useState, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Sparkles } from "lucide-react"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"

export function MintButton() {
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)

  const { writeContract, data: hash } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleMint = async () => {
    try {
      setIsPending(true)
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "mint",
      })

      toast({
        title: "Transaction submitted",
        description: "Please wait for confirmation...",
      })
    } catch (error) {
      console.error("[v0] Mint error:", error)
      toast({
        title: "Error",
        description: "Failed to mint NFT",
        variant: "destructive",
      })
      setIsPending(false)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success!",
        description: "Your NFT has been minted",
      })
      setTimeout(() => window.location.reload(), 2000)
    }
  }, [isSuccess, toast])

  return (
    <Button size="lg" onClick={handleMint} disabled={isPending || isConfirming} className="gap-2 text-lg shadow-lg">
      {isPending || isConfirming ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {isConfirming ? "Confirming..." : "Minting..."}
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5" />
          Mint Your NFT
        </>
      )}
    </Button>
  )
}

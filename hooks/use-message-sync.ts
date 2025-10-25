"use client"

import { useEffect } from "react"
import { usePublicClient, useAccount } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { baseSepolia } from "wagmi/chains"

/**
 * Hook qui écoute l'événement MessageUpdated sur la blockchain
 * et synchronise automatiquement avec MongoDB via l'API Render
 * 
 * Workflow:
 * 1. Écoute les événements MessageUpdated en temps réel
 * 2. Quand un message est modifié, appelle PUT /api/nft/:tokenId
 * 3. Met à jour l'entrée MongoDB avec le nouveau message
 */
export function useMessageSync() {
  const publicClient = usePublicClient({ chainId: baseSepolia.id })
  const { address } = useAccount()

  useEffect(() => {
    if (!publicClient || !address) return

    // Fonction qui sync avec l'API
    const syncMessageToAPI = async (
      tokenId: bigint,
      owner: string,
      newMessage: string,
      currentMood: number
    ) => {
      try {
        console.log("🔄 Syncing message to MongoDB...", { 
          tokenId: tokenId.toString(), 
          owner, 
          newMessage 
        })

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/nft/${tokenId.toString()}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mood: currentMood, // On garde le mood actuel
              message: newMessage,
              userAddress: owner.toLowerCase(),
            }),
          }
        )

        const data = await response.json()

        if (response.ok) {
          console.log("✅ Message synced to MongoDB:", data)
        } else {
          console.error("❌ Error syncing message:", data)
        }
      } catch (error) {
        console.error("❌ Failed to sync message:", error)
      }
    }

    // Écouter les événements MessageUpdated
    const unwatch = publicClient.watchContractEvent({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      eventName: "MessageUpdated",
      onLogs: async (logs) => {
        for (const log of logs) {
          const { tokenId, owner, newMessage } = log.args as {
            tokenId: bigint
            owner: string
            newMessage: string
          }

          console.log("💬 MessageUpdated event detected:", { tokenId, owner, newMessage })

          // On doit récupérer le mood actuel avant de sync
          // Car l'API a besoin du mood pour la mise à jour
          try {
            const mood = await publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: CONTRACT_ABI,
              functionName: "getMood",
              args: [tokenId],
            }) as number

            // Synchroniser avec MongoDB
            syncMessageToAPI(tokenId, owner, newMessage, mood)
          } catch (error) {
            console.error("❌ Failed to get current mood:", error)
          }
        }
      },
    })

    // Cleanup
    return () => {
      unwatch()
    }
  }, [publicClient, address])
}

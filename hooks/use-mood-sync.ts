"use client"

import { useEffect } from "react"
import { usePublicClient, useAccount } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { baseSepolia } from "wagmi/chains"

/**
 * Hook qui écoute l'événement MoodChanged sur la blockchain
 * et synchronise automatiquement avec MongoDB via l'API Render
 * 
 * Workflow:
 * 1. Écoute les événements MoodChanged en temps réel
 * 2. Quand un changement est détecté, appelle PUT /api/nft/:tokenId
 * 3. Met à jour l'entrée MongoDB avec le nouveau mood
 */
export function useMoodSync() {
  const publicClient = usePublicClient({ chainId: baseSepolia.id })
  const { address } = useAccount()

  useEffect(() => {
    if (!publicClient || !address) return

    // Fonction qui sync avec l'API
    const syncMoodToAPI = async (tokenId: bigint, owner: string, newMood: number) => {
      try {
        console.log("🔄 Syncing mood change to MongoDB...", { 
          tokenId: tokenId.toString(), 
          owner, 
          newMood 
        })

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/nft/${tokenId.toString()}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mood: newMood,
              userAddress: owner.toLowerCase(),
              // message reste inchangé, on met à jour que le mood
            }),
          }
        )

        const data = await response.json()

        if (response.ok) {
          console.log("✅ Mood synced to MongoDB:", data)
        } else {
          console.error("❌ Error syncing mood:", data)
        }
      } catch (error) {
        console.error("❌ Failed to sync mood:", error)
      }
    }

    // Écouter les événements MoodChanged
    const unwatch = publicClient.watchContractEvent({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      eventName: "MoodChanged",
      onLogs: (logs) => {
        logs.forEach((log) => {
          const { tokenId, owner, newMood } = log.args as {
            tokenId: bigint
            owner: string
            newMood: number
          }

          console.log("😊 MoodChanged event detected:", { tokenId, owner, newMood })

          // Synchroniser avec MongoDB
          syncMoodToAPI(tokenId, owner, newMood)
        })
      },
    })

    // Cleanup
    return () => {
      unwatch()
    }
  }, [publicClient, address])
}

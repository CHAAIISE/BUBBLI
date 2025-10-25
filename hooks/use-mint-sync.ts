"use client"

import { useEffect } from "react"
import { usePublicClient, useAccount } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { baseSepolia } from "wagmi/chains"

/**
 * Hook qui écoute l'événement NFTMinted sur la blockchain
 * et synchronise automatiquement avec MongoDB via l'API Render
 * 
 * Workflow:
 * 1. Écoute les événements NFTMinted en temps réel
 * 2. Quand un mint est détecté, appelle POST /api/nft/mint
 * 3. Crée l'entrée dans MongoDB avec tokenId, owner, mood, message
 */
export function useMintSync() {
  const publicClient = usePublicClient({ chainId: baseSepolia.id })
  const { address } = useAccount()

  useEffect(() => {
    if (!publicClient || !address) return

    // Fonction qui sync avec l'API
    const syncMintToAPI = async (tokenId: bigint, owner: string, mood: number) => {
      try {
        console.log("🔄 Syncing mint to MongoDB...", { tokenId: tokenId.toString(), owner, mood })

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nft/mint`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tokenId: Number(tokenId),
            owner: owner.toLowerCase(),
            mood: mood,
            message: "", // Par défaut vide, l'user peut le modifier après
          }),
        })

        const data = await response.json()

        if (response.ok) {
          console.log("✅ NFT synced to MongoDB:", data)
        } else {
          console.error("❌ Error syncing to MongoDB:", data)
        }
      } catch (error) {
        console.error("❌ Failed to sync mint:", error)
      }
    }

    // Écouter les événements NFTMinted
    const unwatch = publicClient.watchContractEvent({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      eventName: "NFTMinted",
      onLogs: (logs) => {
        logs.forEach((log) => {
          const { tokenId, owner, mood } = log.args as {
            tokenId: bigint
            owner: string
            mood: number
          }

          console.log("🎉 NFTMinted event detected:", { tokenId, owner, mood })

          // Synchroniser avec MongoDB
          syncMintToAPI(tokenId, owner, mood)
        })
      },
    })

    // Cleanup: arrêter d'écouter quand le composant se démonte
    return () => {
      unwatch()
    }
  }, [publicClient, address])
}

import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"

export function useNFTOwnership(address: `0x${string}` | undefined) {
  // Check if user has minted an NFT
  const { data: hasMinted, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasMinted",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Get the tokenId for this user
  const { data: tokenId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTokenIdByAddress",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!hasMinted,
    },
  })

  return {
    hasNFT: hasMinted ?? false,
    tokenId: tokenId !== undefined ? Number(tokenId) : undefined,
    isLoading,
  }
}

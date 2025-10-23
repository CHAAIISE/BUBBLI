import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"

export function useNFTOwnership(address: `0x${string}` | undefined) {
  const { data: balance, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: tokenId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "tokenOfOwnerByIndex",
    args: address && balance && balance > 0n ? [address, 0n] : undefined,
    query: {
      enabled: !!address && !!balance && balance > 0n,
    },
  })

  return {
    hasNFT: balance ? balance > 0n : false,
    tokenId: tokenId ? Number(tokenId) : undefined,
    isLoading,
  }
}

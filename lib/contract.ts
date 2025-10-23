// BUBBLO NFT Contract Configuration
// This is a placeholder - replace with your actual deployed contract address
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`

export const CONTRACT_ABI = [
  {
    inputs: [],
    name: "mint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getMood",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint8", name: "newMood", type: "uint8" },
    ],
    name: "setMood",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getStyle",
    outputs: [
      {
        components: [
          { internalType: "string", name: "backgroundColor", type: "string" },
          { internalType: "string", name: "bubbleColor", type: "string" },
          { internalType: "string", name: "pattern", type: "string" },
        ],
        internalType: "struct BubbloNFT.Style",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "string", name: "backgroundColor", type: "string" },
      { internalType: "string", name: "bubbleColor", type: "string" },
      { internalType: "string", name: "pattern", type: "string" },
    ],
    name: "setStyle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

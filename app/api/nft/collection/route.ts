import type { NextRequest } from "next/server"

interface NFTMetadata {
  id: string
  name: string
  description: string
  image: string
  rarity: "Common" | "Rare" | "Epic" | "Legendary"
  category: "Streak" | "Level" | "Assessment" | "Lesson" | "Special"
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  mintedAt: string
  achievementId?: string
}

// Mock NFT collection data
const userNFTs: NFTMetadata[] = [
  {
    id: "nft_001",
    name: "First Steps Badge",
    description: "Awarded for completing your first lesson in LangStreak",
    image: "/placeholder-2hsk2.png",
    rarity: "Common",
    category: "Lesson",
    attributes: [
      { trait_type: "Achievement", value: "First Lesson" },
      { trait_type: "Rarity", value: "Common" },
      { trait_type: "Category", value: "Learning" },
    ],
    mintedAt: "2024-01-15T10:30:00Z",
    achievementId: "first-lesson",
  },
  {
    id: "nft_002",
    name: "Streak Warrior",
    description: "Earned by maintaining a 7-day learning streak",
    image: "/flame-sword-purple-aura.png",
    rarity: "Rare",
    category: "Streak",
    attributes: [
      { trait_type: "Achievement", value: "7-Day Streak" },
      { trait_type: "Rarity", value: "Rare" },
      { trait_type: "Streak Length", value: 7 },
    ],
    mintedAt: "2024-01-20T15:45:00Z",
    achievementId: "streak-7",
  },
  {
    id: "nft_003",
    name: "Assessment Master",
    description: "Achieved by scoring 90%+ on a language assessment",
    image: "/crystal-lightning-trophy.png",
    rarity: "Epic",
    category: "Assessment",
    attributes: [
      { trait_type: "Achievement", value: "High Score" },
      { trait_type: "Rarity", value: "Epic" },
      { trait_type: "Score", value: "90%+" },
    ],
    mintedAt: "2024-01-18T09:20:00Z",
    achievementId: "assessment-master",
  },
]

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would fetch from blockchain
    return Response.json({
      collection: userNFTs,
      totalCount: userNFTs.length,
      rarityBreakdown: {
        Common: userNFTs.filter((nft) => nft.rarity === "Common").length,
        Rare: userNFTs.filter((nft) => nft.rarity === "Rare").length,
        Epic: userNFTs.filter((nft) => nft.rarity === "Epic").length,
        Legendary: userNFTs.filter((nft) => nft.rarity === "Legendary").length,
      },
    })
  } catch (error) {
    console.error("Error fetching NFT collection:", error)
    return new Response("Failed to fetch collection", { status: 500 })
  }
}

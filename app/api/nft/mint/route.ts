import { z } from "zod"
import type { NextRequest } from "next/server"

const NFTDesignSchema = z.object({
  name: z.string(),
  description: z.string(),
  imagePrompt: z.string(),
  attributes: z.array(
    z.object({
      trait_type: z.string(),
      value: z.union([z.string(), z.number()]),
    }),
  ),
})

// Predefined NFT templates
const NFT_TEMPLATES = {
  first_lesson: {
    name: "First Steps Badge",
    description: "Congratulations on completing your first lesson! Every journey begins with a single step.",
    imagePrompt: "A golden badge with a graduation cap and the number 1",
    attributes: [
      { trait_type: "Achievement", value: "First Lesson" },
      { trait_type: "Category", value: "Milestone" },
      { trait_type: "Rarity", value: "Common" },
    ],
  },
  streak_7: {
    name: "Week Warrior",
    description: "Seven days of consistent learning! You're building great habits.",
    imagePrompt: "A flame icon with the number 7, representing a 7-day streak",
    attributes: [
      { trait_type: "Achievement", value: "7-Day Streak" },
      { trait_type: "Category", value: "Streak" },
      { trait_type: "Rarity", value: "Rare" },
    ],
  },
  streak_30: {
    name: "Monthly Master",
    description: "30 days of dedication! You're truly committed to your language learning journey.",
    imagePrompt: "A crown with stars, representing mastery and achievement",
    attributes: [
      { trait_type: "Achievement", value: "30-Day Streak" },
      { trait_type: "Category", value: "Streak" },
      { trait_type: "Rarity", value: "Epic" },
    ],
  },
  level_up: {
    name: "Level Champion",
    description: "You've advanced to a new proficiency level! Your hard work is paying off.",
    imagePrompt: "An upward arrow with stars, symbolizing progress and advancement",
    attributes: [
      { trait_type: "Achievement", value: "Level Up" },
      { trait_type: "Category", value: "Progress" },
      { trait_type: "Rarity", value: "Epic" },
    ],
  },
  perfect_month: {
    name: "Perfection Pinnacle",
    description: "A perfect month of learning! You've achieved something truly special.",
    imagePrompt: "A diamond trophy with rainbow colors, representing perfection",
    attributes: [
      { trait_type: "Achievement", value: "Perfect Month" },
      { trait_type: "Category", value: "Special" },
      { trait_type: "Rarity", value: "Legendary" },
    ],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { achievementType, achievementData, userLevel } = await request.json()

    if (!achievementType || !achievementData) {
      return new Response("Missing achievement data", { status: 400 })
    }

    // Get predefined NFT design
    const nftTemplate = NFT_TEMPLATES[achievementType as keyof typeof NFT_TEMPLATES] || NFT_TEMPLATES.first_lesson

    // Determine rarity based on achievement type
    const rarity = determineRarity(achievementType, achievementData)

    // Create NFT with template data
    const newNFT = {
      id: `nft_${Date.now()}`,
      ...nftTemplate,
      image: `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(nftTemplate.imagePrompt)}`,
      rarity,
      category: getCategoryFromType(achievementType),
      mintedAt: new Date().toISOString(),
      achievementId: achievementData.id,
    }

    // Simulate minting delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return Response.json({
      success: true,
      nft: newNFT,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    })
  } catch (error) {
    console.error("Error minting NFT:", error)
    return new Response("Failed to mint NFT", { status: 500 })
  }
}

function determineRarity(achievementType: string, data: any): "Common" | "Rare" | "Epic" | "Legendary" {
  switch (achievementType) {
    case "first_lesson":
    case "daily_goal":
      return "Common"
    case "streak_7":
    case "lessons_10":
      return "Rare"
    case "streak_30":
    case "assessment_high_score":
    case "level_up":
      return "Epic"
    case "streak_100":
    case "perfect_month":
    case "master_level":
      return "Legendary"
    default:
      return "Common"
  }
}

function getCategoryFromType(achievementType: string): string {
  if (achievementType.includes("streak")) return "Streak"
  if (achievementType.includes("lesson")) return "Lesson"
  if (achievementType.includes("assessment")) return "Assessment"
  if (achievementType.includes("level")) return "Level"
  return "Special"
}

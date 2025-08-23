"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, Gift, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MintNotificationProps {
  achievementType: string
  achievementData: any
  userLevel: number
  onMintComplete?: (nft: any) => void
}

export default function NFTMintNotification({
  achievementType,
  achievementData,
  userLevel,
  onMintComplete,
}: MintNotificationProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMinting, setIsMinting] = useState(false)
  const [mintedNFT, setMintedNFT] = useState<any>(null)
  const { toast } = useToast()

  const handleMint = async () => {
    setIsMinting(true)
    try {
      const response = await fetch("/api/nft/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievementType,
          achievementData,
          userLevel,
        }),
      })

      if (!response.ok) throw new Error("Failed to mint NFT")

      const result = await response.json()
      setMintedNFT(result.nft)

      toast({
        title: "NFT Minted Successfully!",
        description: `Your "${result.nft.name}" NFT has been added to your collection.`,
      })

      onMintComplete?.(result.nft)
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Failed to mint your NFT reward. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  const getAchievementTitle = () => {
    switch (achievementType) {
      case "first_lesson":
        return "First Lesson Complete!"
      case "streak_7":
        return "7-Day Streak Achieved!"
      case "assessment_high_score":
        return "Assessment Mastery!"
      case "level_up":
        return "Level Up!"
      default:
        return "Achievement Unlocked!"
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "Legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  if (mintedNFT) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              NFT Minted Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="aspect-square bg-white rounded-lg p-4 mb-3 flex items-center justify-center">
                  <img
                    src={mintedNFT.image || "/placeholder.svg"}
                    alt={mintedNFT.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-semibold mb-1">{mintedNFT.name}</h3>
                <Badge className={`${getRarityColor(mintedNFT.rarity)} border mb-2`}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  {mintedNFT.rarity}
                </Badge>
                <p className="text-sm text-muted-foreground">{mintedNFT.description}</p>
              </CardContent>
            </Card>
            <Button onClick={() => setIsOpen(false)} className="w-full">
              View in Collection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            {getAchievementTitle()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                NFT Reward Available!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Congratulations! You've earned a special NFT reward for this achievement. This unique digital
                collectible will be permanently added to your collection on the TON blockchain.
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">Achievement Details:</p>
                <p className="text-sm text-muted-foreground">
                  {achievementData.description || "Special milestone reached!"}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Skip for Now
            </Button>
            <Button onClick={handleMint} disabled={isMinting} className="flex-1">
              {isMinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Mint NFT
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageIcon, Sparkles, Trophy, Flame, BookOpen, Target, Star, ExternalLink } from "lucide-react"

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

interface NFTCollection {
  collection: NFTMetadata[]
  totalCount: number
  rarityBreakdown: {
    Common: number
    Rare: number
    Epic: number
    Legendary: number
  }
}

export default function NFTGallery() {
  const [collection, setCollection] = useState<NFTCollection | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    fetchCollection()
  }, [])

  const fetchCollection = async () => {
    try {
      const response = await fetch("/api/nft/collection")
      if (response.ok) {
        const data = await response.json()
        setCollection(data)
      }
    } catch (error) {
      console.error("Error fetching NFT collection:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-100 text-gray-800 border-gray-300"
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

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "from-gray-50 to-gray-100"
      case "Rare":
        return "from-blue-50 to-blue-100"
      case "Epic":
        return "from-purple-50 to-purple-100"
      case "Legendary":
        return "from-yellow-50 to-yellow-100"
      default:
        return "from-gray-50 to-gray-100"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Streak":
        return <Flame className="h-4 w-4" />
      case "Level":
        return <Star className="h-4 w-4" />
      case "Assessment":
        return <Target className="h-4 w-4" />
      case "Lesson":
        return <BookOpen className="h-4 w-4" />
      default:
        return <Trophy className="h-4 w-4" />
    }
  }

  const filteredNFTs =
    collection?.collection.filter((nft) => selectedCategory === "all" || nft.category === selectedCategory) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!collection || collection.totalCount === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No NFTs Yet</h3>
          <p className="text-muted-foreground">Complete lessons and achievements to earn your first NFT rewards!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{collection.totalCount}</div>
            <p className="text-sm text-muted-foreground">Total NFTs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{collection.rarityBreakdown.Rare}</div>
            <p className="text-sm text-muted-foreground">Rare</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{collection.rarityBreakdown.Epic}</div>
            <p className="text-sm text-muted-foreground">Epic</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{collection.rarityBreakdown.Legendary}</div>
            <p className="text-sm text-muted-foreground">Legendary</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Streak">Streak</TabsTrigger>
          <TabsTrigger value="Level">Level</TabsTrigger>
          <TabsTrigger value="Assessment">Test</TabsTrigger>
          <TabsTrigger value="Lesson">Lesson</TabsTrigger>
          <TabsTrigger value="Special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.map((nft) => (
              <Dialog key={nft.id}>
                <DialogTrigger asChild>
                  <Card
                    className={`cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${getRarityGradient(nft.rarity)} border-2`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge className={`${getRarityColor(nft.rarity)} border`}>
                          <Sparkles className="h-3 w-3 mr-1" />
                          {nft.rarity}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          {getCategoryIcon(nft.category)}
                          <span className="text-xs">{nft.category}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="aspect-square bg-white rounded-lg p-4 flex items-center justify-center">
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{nft.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{nft.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {nft.name}
                      <Badge className={`${getRarityColor(nft.rarity)} border`}>{nft.rarity}</Badge>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 flex items-center justify-center">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{nft.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Attributes</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {nft.attributes.map((attr, index) => (
                          <div key={index} className="bg-muted p-2 rounded text-center">
                            <p className="text-xs text-muted-foreground">{attr.trait_type}</p>
                            <p className="text-sm font-medium">{attr.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Minted: {new Date(nft.mintedAt).toLocaleDateString()}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

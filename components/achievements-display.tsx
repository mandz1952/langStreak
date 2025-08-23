"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  unlockedAt: string
}

interface AchievementsDisplayProps {
  achievements: Achievement[]
  showAll?: boolean
}

export default function AchievementsDisplay({ achievements, showAll = false }: AchievementsDisplayProps) {
  const displayAchievements = showAll ? achievements : achievements.slice(0, 3)

  const getAchievementIcon = (id: string) => {
    if (id.includes("streak")) return <Trophy className="h-5 w-5 text-orange-500" />
    if (id.includes("lesson")) return <Medal className="h-5 w-5 text-blue-500" />
    if (id.includes("assessment")) return <Award className="h-5 w-5 text-purple-500" />
    if (id.includes("xp")) return <Star className="h-5 w-5 text-yellow-500" />
    return <Trophy className="h-5 w-5 text-gray-500" />
  }

  const getAchievementColor = (id: string) => {
    if (id.includes("streak")) return "bg-orange-100 text-orange-800"
    if (id.includes("lesson")) return "bg-blue-100 text-blue-800"
    if (id.includes("assessment")) return "bg-purple-100 text-purple-800"
    if (id.includes("xp")) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayAchievements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Complete lessons and maintain streaks to unlock achievements!
          </p>
        ) : (
          displayAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              {getAchievementIcon(achievement.id)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{achievement.name}</span>
                  <Badge variant="outline" className={getAchievementColor(achievement.id)}>
                    New!
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          ))
        )}

        {!showAll && achievements.length > 3 && (
          <div className="text-center">
            <Badge variant="outline" className="cursor-pointer">
              +{achievements.length - 3} more achievements
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

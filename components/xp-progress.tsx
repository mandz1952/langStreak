"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Star, Zap } from "lucide-react"

interface XPProgressProps {
  totalXP: number
  level: number
  dailyXP?: number
  dailyTarget?: number
}

export default function XPProgress({ totalXP, level, dailyXP = 0, dailyTarget = 100 }: XPProgressProps) {
  const xpForCurrentLevel = (level - 1) * 200
  const xpForNextLevel = level * 200
  const progressToNextLevel = ((totalXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
  const dailyProgress = (dailyXP / dailyTarget) * 100

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Level {level}</span>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {totalXP} XP
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to Level {level + 1}</span>
              <span>
                {totalXP - xpForCurrentLevel}/{xpForNextLevel - xpForCurrentLevel} XP
              </span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            <span>Daily Goal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>XP Today</span>
              <span>
                {dailyXP}/{dailyTarget} XP
              </span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
            {dailyProgress >= 100 && (
              <Badge variant="default" className="bg-green-100 text-green-800 w-full justify-center">
                Daily Goal Complete! 🎉
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

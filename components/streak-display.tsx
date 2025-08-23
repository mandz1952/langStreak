"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy } from "lucide-react"

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string
}

export default function StreakDisplay({ currentStreak, longestStreak, lastActivityDate }: StreakDisplayProps) {
  const today = new Date().toISOString().split("T")[0]
  const isActiveToday = lastActivityDate === today

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Flame className={`h-8 w-8 ${isActiveToday ? "text-orange-500" : "text-gray-400"}`} />
              {isActiveToday && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-600">{currentStreak}</span>
                <span className="text-sm text-muted-foreground">day streak</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Trophy className="h-3 w-3" />
                <span>Best: {longestStreak} days</span>
              </div>
            </div>
          </div>
          <Badge variant={isActiveToday ? "default" : "secondary"} className="bg-orange-100 text-orange-800">
            {isActiveToday ? "Active Today" : "Keep Going!"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

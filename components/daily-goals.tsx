"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Target, BookOpen, Zap } from "lucide-react"

interface DailyGoals {
  lessonsTarget: number
  lessonsCompleted: number
  xpTarget: number
  xpEarned: number
  streakMaintained: boolean
}

interface DailyGoalsProps {
  goals: DailyGoals
}

export default function DailyGoals({ goals }: DailyGoalsProps) {
  const lessonsProgress = (goals.lessonsCompleted / goals.lessonsTarget) * 100
  const xpProgress = (goals.xpEarned / goals.xpTarget) * 100

  const allGoalsComplete =
    goals.lessonsCompleted >= goals.lessonsTarget && goals.xpEarned >= goals.xpTarget && goals.streakMaintained

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            <span>Daily Goals</span>
          </div>
          {allGoalsComplete && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Complete!
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Complete Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              {goals.lessonsCompleted >= goals.lessonsTarget && <CheckCircle className="h-4 w-4 text-green-500" />}
              <span className="text-sm font-medium">
                {goals.lessonsCompleted}/{goals.lessonsTarget}
              </span>
            </div>
          </div>
          <Progress value={lessonsProgress} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Earn XP</span>
            </div>
            <div className="flex items-center gap-2">
              {goals.xpEarned >= goals.xpTarget && <CheckCircle className="h-4 w-4 text-green-500" />}
              <span className="text-sm font-medium">
                {goals.xpEarned}/{goals.xpTarget}
              </span>
            </div>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="text-sm">Maintain Streak</span>
          </div>
          <div className="flex items-center gap-2">
            {goals.streakMaintained && <CheckCircle className="h-4 w-4 text-green-500" />}
            <Badge variant={goals.streakMaintained ? "default" : "secondary"}>
              {goals.streakMaintained ? "Active" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

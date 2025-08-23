"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { User, Trophy, BarChart3, Calendar, Star, Medal, Award, Flame, Settings } from "lucide-react"
import Link from "next/link"
import StreakDisplay from "@/components/streak-display"
import XPProgress from "@/components/xp-progress"
import AchievementsDisplay from "@/components/achievements-display"
import DailyGoals from "@/components/daily-goals"

interface UserProgress {
  userId: string
  currentStreak: number
  longestStreak: number
  totalXP: number
  level: number
  lessonsCompleted: number
  assessmentsTaken: number
  lastActivityDate: string
  achievements: Array<{
    id: string
    name: string
    description: string
    unlockedAt: string
  }>
  dailyGoals: {
    lessonsTarget: number
    lessonsCompleted: number
    xpTarget: number
    xpEarned: number
    streakMaintained: boolean
  }
}

export default function ProfilePage() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProgress()
  }, [])

  const fetchUserProgress = async () => {
    try {
      const response = await fetch("/api/user/progress")
      if (response.ok) {
        const data = await response.json()
        setUserProgress(data)
      }
    } catch (error) {
      console.error("Error fetching user progress:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!userProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <p>Не удалось загрузить данные профиля</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center justify-end mb-6">
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ваш профиль</h1>
          <p className="text-gray-600">Отслеживайте свой прогресс в изучении языка и достижения</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Достижения
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <StreakDisplay
                  currentStreak={userProgress.currentStreak}
                  longestStreak={userProgress.longestStreak}
                  lastActivityDate={userProgress.lastActivityDate}
                />
                <DailyGoals goals={userProgress.dailyGoals} />
              </div>
              <div className="space-y-4">
                <XPProgress
                  totalXP={userProgress.totalXP}
                  level={userProgress.level}
                  dailyXP={userProgress.dailyGoals.xpEarned}
                  dailyTarget={userProgress.dailyGoals.xpTarget}
                />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Быстрые действия</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/lessons">
                      <Button className="w-full" variant="default">
                        Продолжить обучение
                      </Button>
                    </Link>
                    <Link href="/assessment">
                      <Button className="w-full bg-transparent" variant="outline">
                        Пройти тест уровня
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
            <AchievementsDisplay achievements={userProgress.achievements} />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Все достижения ({userProgress.achievements.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AchievementsDisplay achievements={userProgress.achievements} showAll={true} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Доступные достижения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      name: "Воин недели",
                      description: "Поддерживайте серию 7 дней",
                      icon: <Flame className="h-5 w-5 text-orange-500" />,
                    },
                    {
                      name: "Мастер месяца",
                      description: "Поддерживайте серию 30 дней",
                      icon: <Calendar className="h-5 w-5 text-red-500" />,
                    },
                    {
                      name: "Преданный ученик",
                      description: "Завершите 10 уроков",
                      icon: <Medal className="h-5 w-5 text-blue-500" />,
                    },
                    {
                      name: "Машина обучения",
                      description: "Завершите 50 уроков",
                      icon: <Award className="h-5 w-5 text-purple-500" />,
                    },
                    {
                      name: "Мастер опыта",
                      description: "Заработайте 5000 XP",
                      icon: <Star className="h-5 w-5 text-yellow-500" />,
                    },
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg opacity-60">
                      {achievement.icon}
                      <div>
                        <span className="font-medium text-sm">{achievement.name}</span>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        Заблокировано
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{userProgress.level}</div>
                  <p className="text-sm text-muted-foreground">Текущий уровень</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{userProgress.lessonsCompleted}</div>
                  <p className="text-sm text-muted-foreground">Уроков завершено</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{userProgress.assessmentsTaken}</div>
                  <p className="text-sm text-muted-foreground">Тестов пройдено</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{userProgress.longestStreak}</div>
                  <p className="text-sm text-muted-foreground">Самая длинная серия</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Путь обучения</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium">Всего заработано XP</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {userProgress.totalXP} XP
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium">Достижений разблокировано</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {userProgress.achievements.length} / 8
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium">Дней обучения</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {userProgress.currentStreak} дней
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

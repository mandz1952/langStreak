"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, Trophy, BookOpen, Target, Zap, Lock, ImageIcon } from "lucide-react"
import Link from "next/link"

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        MainButton: {
          text: string
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
          }
        }
      }
    }
  }
}

export default function LangStreakApp() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stakingInfo, setStakingInfo] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()

      // Get user data from Telegram
      if (tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user)
      }

      setIsLoading(false)
    } else {
      // Fallback for development/testing
      setUser({ first_name: "Demo User", id: 12345 })
      setIsLoading(false)
    }

    const savedStaking = localStorage.getItem("ton-staking")
    if (savedStaking) {
      setStakingInfo(JSON.parse(savedStaking))
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground font-sans">Привет, {user?.first_name || "Ученик"}! 👋</h1>
            <p className="text-sm text-muted-foreground">Готов учиться сегодня?</p>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              3 дня подряд
            </Badge>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans">
              <BookOpen className="h-5 w-5 text-primary" />
              Прогресс изучения английского
            </CardTitle>
            <CardDescription>Начальный уровень (A1)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Дневная цель</span>
                <span>3/5 заданий выполнено</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <Link href="/lessons">
              <Button className="w-full" size="lg">
                <Zap className="h-4 w-4 mr-2" />
                Продолжить обучение
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/assessment">
            <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Тест уровня</h3>
                <p className="text-xs text-muted-foreground">Пройти оценку</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile">
            <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Достижения</h3>
                <p className="text-xs text-muted-foreground">Посмотреть награды</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Сегодняшние уроки</CardTitle>
            <CardDescription>Выполните их, чтобы сохранить серию</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">Базовая лексика</span>
              </div>
              <Badge variant="outline">5 мин</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <span className="text-sm font-medium">Практика грамматики</span>
              </div>
              <Badge variant="outline">10 мин</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <span className="text-sm font-medium">Упражнения на слух</span>
              </div>
              <Badge variant="outline">8 мин</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/staking">
            <Card
              className={`cursor-pointer transition-colors ${
                stakingInfo?.isActive
                  ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
                  : "bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20"
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sans text-sm">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-bold">T</span>
                  </div>
                  TON Стейкинг
                  {stakingInfo?.isActive && (
                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                      <Lock className="h-2 w-2 mr-1" />
                      Активен
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">
                  {stakingInfo?.isActive
                    ? `${stakingInfo.stakedAmount} TON • ${stakingInfo.rewardMultiplier}x бонус`
                    : "Повысить мотивацию"}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/nft-collection">
            <Card className="cursor-pointer hover:bg-accent/5 transition-colors bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sans text-sm">
                  <ImageIcon className="h-5 w-5 text-yellow-600" />
                  NFT Коллекция
                  <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-xs">
                    3
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">Цифровые награды</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}

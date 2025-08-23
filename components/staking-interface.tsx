"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Unlock, TrendingUp, AlertTriangle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StakingInfo {
  stakedAmount: number
  stakingPeriod: number // days
  startDate: string
  endDate: string
  isActive: boolean
  penaltyRate: number // percentage
  rewardMultiplier: number
}

export default function StakingInterface() {
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null)
  const [stakeAmount, setStakeAmount] = useState("")
  const [stakingPeriod, setStakingPeriod] = useState("30")
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user has active staking
    checkStakingStatus()
  }, [])

  const checkStakingStatus = async () => {
    // Simulate checking staking status
    const savedStaking = localStorage.getItem("ton-staking")
    if (savedStaking) {
      setStakingInfo(JSON.parse(savedStaking))
    }
  }

  const calculateRewards = (amount: number, period: number) => {
    const baseReward = amount * 0.05 // 5% base reward
    const periodMultiplier = period / 30 // 30 days = 1x multiplier
    return baseReward * periodMultiplier
  }

  const calculatePenalty = (amount: number, daysRemaining: number) => {
    const penaltyRate = Math.min(daysRemaining * 0.01, 0.5) // Max 50% penalty
    return amount * penaltyRate
  }

  const handleStake = async () => {
    if (!stakeAmount || Number.parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount.",
        variant: "destructive",
      })
      return
    }

    setIsStaking(true)
    try {
      // Simulate staking transaction
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const startDate = new Date()
      const endDate = new Date(startDate.getTime() + Number.parseInt(stakingPeriod) * 24 * 60 * 60 * 1000)

      const newStaking: StakingInfo = {
        stakedAmount: Number.parseFloat(stakeAmount),
        stakingPeriod: Number.parseInt(stakingPeriod),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isActive: true,
        penaltyRate: 0.1,
        rewardMultiplier: Number.parseInt(stakingPeriod) / 30,
      }

      setStakingInfo(newStaking)
      localStorage.setItem("ton-staking", JSON.stringify(newStaking))
      setStakeAmount("")

      toast({
        title: "Staking Successful!",
        description: `Successfully staked ${stakeAmount} TON for ${stakingPeriod} days.`,
      })
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "Failed to stake tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStaking(false)
    }
  }

  const handleUnstake = async () => {
    if (!stakingInfo) return

    setIsUnstaking(true)
    try {
      // Simulate unstaking transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const now = new Date()
      const endDate = new Date(stakingInfo.endDate)
      const isEarly = now < endDate

      if (isEarly) {
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        const penalty = calculatePenalty(stakingInfo.stakedAmount, daysRemaining)

        toast({
          title: "Early Unstaking",
          description: `Unstaked with ${penalty.toFixed(2)} TON penalty for early withdrawal.`,
          variant: "destructive",
        })
      } else {
        const rewards = calculateRewards(stakingInfo.stakedAmount, stakingInfo.stakingPeriod)
        toast({
          title: "Unstaking Complete!",
          description: `Received ${stakingInfo.stakedAmount} TON + ${rewards.toFixed(2)} TON rewards.`,
        })
      }

      setStakingInfo(null)
      localStorage.removeItem("ton-staking")
    } catch (error) {
      toast({
        title: "Unstaking Failed",
        description: "Failed to unstake tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUnstaking(false)
    }
  }

  const getDaysRemaining = () => {
    if (!stakingInfo) return 0
    const now = new Date()
    const endDate = new Date(stakingInfo.endDate)
    return Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  }

  const getStakingProgress = () => {
    if (!stakingInfo) return 0
    const now = new Date()
    const startDate = new Date(stakingInfo.startDate)
    const endDate = new Date(stakingInfo.endDate)
    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsed = now.getTime() - startDate.getTime()
    return Math.min(100, (elapsed / totalDuration) * 100)
  }

  if (stakingInfo?.isActive) {
    const daysRemaining = getDaysRemaining()
    const progress = getStakingProgress()
    const isComplete = daysRemaining === 0

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-500" />
            Active Staking
          </CardTitle>
          <CardDescription>Your TON tokens are currently staked</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Staked Amount</p>
              <p className="text-2xl font-bold text-blue-600">{stakingInfo.stakedAmount} TON</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Days Remaining</p>
              <p className="text-2xl font-bold text-orange-600">{daysRemaining}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Staking Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Learning Boost Active</p>
                <p className="text-xs text-green-600">
                  {stakingInfo.rewardMultiplier}x XP multiplier for completed lessons
                </p>
              </div>
            </div>

            {!isComplete && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Early Withdrawal Penalty</p>
                  <p className="text-xs text-orange-600">
                    {calculatePenalty(stakingInfo.stakedAmount, daysRemaining).toFixed(2)} TON penalty if unstaked now
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleUnstake}
            disabled={isUnstaking}
            variant={isComplete ? "default" : "destructive"}
            className="w-full"
          >
            {isUnstaking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Unstaking...
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                {isComplete ? "Claim Rewards" : "Unstake Early"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-blue-500" />
          Stake TON Tokens
        </CardTitle>
        <CardDescription>Stake TON tokens to boost your learning motivation and earn rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stake" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stake">Stake</TabsTrigger>
            <TabsTrigger value="info">How it Works</TabsTrigger>
          </TabsList>

          <TabsContent value="stake" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount to Stake (TON)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                min="0.1"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Staking Period</label>
              <select
                value={stakingPeriod}
                onChange={(e) => setStakingPeriod(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="7">7 days (0.25x multiplier)</option>
                <option value="30">30 days (1x multiplier)</option>
                <option value="90">90 days (3x multiplier)</option>
                <option value="180">180 days (6x multiplier)</option>
              </select>
            </div>

            {stakeAmount && (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Learning Boost:</span>
                  <span className="font-medium">{Number.parseInt(stakingPeriod) / 30}x XP multiplier</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Potential Rewards:</span>
                  <span className="font-medium text-green-600">
                    +{calculateRewards(Number.parseFloat(stakeAmount), Number.parseInt(stakingPeriod)).toFixed(2)} TON
                  </span>
                </div>
              </div>
            )}

            <Button onClick={handleStake} disabled={isStaking || !stakeAmount} className="w-full">
              {isStaking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Staking...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Stake Tokens
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Learning Motivation</h4>
                  <p className="text-sm text-blue-700">
                    Staking creates financial commitment to your learning goals, boosting motivation and consistency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">XP Multiplier</h4>
                  <p className="text-sm text-green-700">
                    Earn bonus XP for every lesson completed while staking. Longer periods = higher multipliers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Early Withdrawal</h4>
                  <p className="text-sm text-orange-700">
                    Unstaking before the period ends incurs penalties. Stay committed to maximize rewards!
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

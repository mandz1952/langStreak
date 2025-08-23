"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletInfo {
  address: string
  balance: string
  isConnected: boolean
}

export default function TONWalletConnect() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    // In a real implementation, this would check TON Connect state
    // For demo purposes, we'll simulate a connected wallet
    const savedWallet = localStorage.getItem("ton-wallet")
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet))
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      // Simulate wallet connection process
      // In real implementation, this would use TON Connect
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockWallet: WalletInfo = {
        address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        balance: "12.45",
        isConnected: true,
      }

      setWallet(mockWallet)
      localStorage.setItem("ton-wallet", JSON.stringify(mockWallet))

      toast({
        title: "Wallet Connected!",
        description: "Your TON wallet has been successfully connected.",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to TON wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    localStorage.removeItem("ton-wallet")
    toast({
      title: "Wallet Disconnected",
      description: "Your TON wallet has been disconnected.",
    })
  }

  const copyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      })
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  if (wallet?.isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">T</span>
            </div>
            TON Wallet Connected
          </CardTitle>
          <CardDescription>Your wallet is ready for staking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Balance</p>
              <p className="text-2xl font-bold text-blue-600">{wallet.balance} TON</p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground font-mono">{formatAddress(wallet.address)}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={copyAddress}>
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
            <Button variant="outline" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-500" />
          Connect TON Wallet
        </CardTitle>
        <CardDescription>Connect your TON wallet to enable staking and earn rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={connectWallet} disabled={isConnecting} className="w-full">
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

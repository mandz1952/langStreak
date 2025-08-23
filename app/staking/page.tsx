import TONWalletConnect from "@/components/ton-wallet-connect"
import StakingInterface from "@/components/staking-interface"

export default function StakingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TON Стейкинг</h1>
          <p className="text-gray-600">Повысьте мотивацию к обучению с помощью финансовых обязательств</p>
        </div>

        <div className="space-y-6">
          <TONWalletConnect />
          <StakingInterface />
        </div>
      </div>
    </div>
  )
}

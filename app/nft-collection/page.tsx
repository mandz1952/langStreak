import NFTGallery from "@/components/nft-gallery"

export default function NFTCollectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NFT Коллекция</h1>
          <p className="text-gray-600">Ваши уникальные цифровые награды за достижения в изучении языка</p>
        </div>
        <NFTGallery />
      </div>
    </div>
  )
}

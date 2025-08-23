import LanguageAssessment from "@/components/language-assessment"

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Language Assessment</h1>
          <p className="text-gray-600">Discover your language proficiency level with our AI-powered assessment</p>
        </div>
        <LanguageAssessment />
      </div>
    </div>
  )
}

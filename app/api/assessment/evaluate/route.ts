import { z } from "zod"
import type { NextRequest } from "next/server"

const EvaluationSchema = z.object({
  overallLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
  detailedAnalysis: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { answers, questions } = await request.json()

    if (!answers || !questions) {
      return new Response("Answers and questions are required", { status: 400 })
    }

    // Calculate score based on correct answers
    let correctAnswers = 0
    const levelScores = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 }

    questions.forEach((question: any, index: number) => {
      const userAnswer = answers[index]?.toLowerCase().trim()
      const correctAnswer = question.correctAnswer.toLowerCase().trim()

      if (userAnswer === correctAnswer) {
        correctAnswers++
        levelScores[question.difficulty as keyof typeof levelScores]++
      }
    })

    const score = Math.round((correctAnswers / questions.length) * 100)

    // Determine overall level based on performance
    let overallLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" = "A1"

    if (levelScores.C2 >= 2) overallLevel = "C2"
    else if (levelScores.C1 >= 2) overallLevel = "C1"
    else if (levelScores.B2 >= 2) overallLevel = "B2"
    else if (levelScores.B1 >= 2) overallLevel = "B1"
    else if (levelScores.A2 >= 2) overallLevel = "A2"

    // Generate feedback based on score
    const strengths = []
    const weaknesses = []
    const recommendations = []

    if (score >= 80) {
      strengths.push("Excellent overall performance", "Strong grasp of language fundamentals")
      recommendations.push("Continue with advanced materials", "Focus on specialized vocabulary")
    } else if (score >= 60) {
      strengths.push("Good understanding of basic concepts", "Solid foundation")
      weaknesses.push("Some gaps in advanced grammar", "Vocabulary could be expanded")
      recommendations.push("Practice more complex sentence structures", "Read more diverse materials")
    } else {
      weaknesses.push("Need to strengthen basic grammar", "Limited vocabulary")
      recommendations.push(
        "Focus on fundamental grammar rules",
        "Practice daily with basic exercises",
        "Build vocabulary through reading",
      )
    }

    const detailedAnalysis = `You scored ${score}% (${correctAnswers}/${questions.length} correct answers). Your performance indicates a ${overallLevel} level. ${score >= 70 ? "Great job! Keep up the good work." : "Keep practicing - you're making progress!"}`

    const result = {
      overallLevel,
      score,
      strengths,
      weaknesses,
      recommendations,
      detailedAnalysis,
    }

    return Response.json(result)
  } catch (error) {
    console.error("Error evaluating assessment:", error)
    return new Response("Failed to evaluate assessment", { status: 500 })
  }
}

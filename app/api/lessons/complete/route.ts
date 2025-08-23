import { z } from "zod"
import type { NextRequest } from "next/server"

const CompletionSchema = z.object({
  score: z.number().min(0).max(100),
  correctAnswers: z.number(),
  totalQuestions: z.number(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  nextRecommendations: z.array(z.string()),
  feedback: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { answers, exercises, lessonTitle } = await request.json()

    if (!answers || !exercises) {
      return new Response("Answers and exercises are required", { status: 400 })
    }

    // Calculate score
    let correctAnswers = 0
    const totalQuestions = exercises.length

    exercises.forEach((exercise: any, index: number) => {
      const userAnswer = answers[index]?.toLowerCase().trim()
      const correctAnswer = exercise.correctAnswer.toLowerCase().trim()

      if (userAnswer === correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / totalQuestions) * 100)

    // Generate feedback based on performance
    const strengths = []
    const improvements = []
    const nextRecommendations = []

    if (score >= 90) {
      strengths.push("Excellent understanding", "Perfect execution")
      nextRecommendations.push("Try more advanced lessons", "Challenge yourself with complex topics")
    } else if (score >= 70) {
      strengths.push("Good grasp of concepts", "Solid performance")
      improvements.push("Review missed questions")
      nextRecommendations.push("Practice similar exercises", "Move to next difficulty level")
    } else if (score >= 50) {
      strengths.push("Basic understanding demonstrated")
      improvements.push("Need more practice with fundamentals", "Review lesson materials")
      nextRecommendations.push("Repeat this lesson", "Practice more basic exercises")
    } else {
      improvements.push("Significant gaps in understanding", "Need to review basics")
      nextRecommendations.push("Review lesson materials carefully", "Practice with easier exercises first")
    }

    const feedback =
      score >= 70
        ? `Great job on "${lessonTitle}"! You're making excellent progress.`
        : `Keep practicing "${lessonTitle}". You're on the right track - every mistake is a learning opportunity!`

    const result = {
      score,
      correctAnswers,
      totalQuestions,
      strengths,
      improvements,
      nextRecommendations,
      feedback,
    }

    return Response.json(result)
  } catch (error) {
    console.error("Error evaluating lesson:", error)
    return new Response("Failed to evaluate lesson", { status: 500 })
  }
}

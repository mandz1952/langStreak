import { z } from "zod"
import type { NextRequest } from "next/server"

const LessonSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  estimatedTime: z.number(),
  exercises: z.array(
    z.object({
      id: z.number(),
      type: z.enum(["vocabulary", "grammar", "listening", "translation", "conversation"]),
      instruction: z.string(),
      content: z.string(),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      explanation: z.string(),
      audioText: z.string().optional(),
    }),
  ),
})

// Static lesson templates
const LESSON_TEMPLATES = {
  "Basic Greetings": {
    title: "Basic Greetings and Introductions",
    description: "Learn essential greetings and how to introduce yourself",
    difficulty: "A1" as const,
    estimatedTime: 15,
    exercises: [
      {
        id: 1,
        type: "vocabulary" as const,
        instruction: "Match the greeting with its meaning",
        content: "Hello",
        options: ["Goodbye", "Good morning", "General greeting", "Good night"],
        correctAnswer: "General greeting",
        explanation: "Hello is a universal greeting used at any time of day",
      },
      {
        id: 2,
        type: "grammar" as const,
        instruction: "Complete the sentence",
        content: "My name ___ John.",
        correctAnswer: "is",
        explanation: "We use 'is' with singular subjects like 'name'",
      },
      {
        id: 3,
        type: "translation" as const,
        instruction: "Translate to English",
        content: "¿Cómo te llamas?",
        correctAnswer: "What is your name?",
        explanation: "This is how to ask someone's name in Spanish",
      },
    ],
  },
  "Present Tense": {
    title: "Present Simple Tense",
    description: "Master the present simple tense for daily activities",
    difficulty: "A2" as const,
    estimatedTime: 20,
    exercises: [
      {
        id: 1,
        type: "grammar" as const,
        instruction: "Choose the correct form",
        content: "She ___ to work every day.",
        options: ["go", "goes", "going", "gone"],
        correctAnswer: "goes",
        explanation: "Third person singular takes 's' in present simple",
      },
      {
        id: 2,
        type: "vocabulary" as const,
        instruction: "What does 'usually' mean?",
        content: "I usually wake up at 7 AM.",
        options: ["always", "never", "most of the time", "sometimes"],
        correctAnswer: "most of the time",
        explanation: "Usually means something happens most of the time, but not always",
      },
    ],
  },
  "Past Tense": {
    title: "Past Simple Tense",
    description: "Learn to talk about past events and experiences",
    difficulty: "B1" as const,
    estimatedTime: 25,
    exercises: [
      {
        id: 1,
        type: "grammar" as const,
        instruction: "Convert to past tense",
        content: "I eat breakfast at 8 AM.",
        correctAnswer: "I ate breakfast at 8 AM.",
        explanation: "'Eat' is an irregular verb that becomes 'ate' in past tense",
      },
      {
        id: 2,
        type: "conversation" as const,
        instruction: "Complete the dialogue",
        content: "A: What did you do yesterday? B: I ___ to the movies.",
        correctAnswer: "went",
        explanation: "'Go' becomes 'went' in past tense",
      },
    ],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, lessonType, targetLanguage, nativeLanguage } = await request.json()

    if (!topic || !difficulty || !lessonType || !targetLanguage) {
      return new Response("Missing required parameters", { status: 400 })
    }

    // Find matching lesson template or use default
    const lessonTemplate =
      LESSON_TEMPLATES[topic as keyof typeof LESSON_TEMPLATES] || LESSON_TEMPLATES["Basic Greetings"]

    // Adjust difficulty if needed
    const adjustedLesson = {
      ...lessonTemplate,
      difficulty: difficulty as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
    }

    return Response.json(adjustedLesson)
  } catch (error) {
    console.error("Error generating lesson:", error)
    return new Response("Failed to generate lesson", { status: 500 })
  }
}

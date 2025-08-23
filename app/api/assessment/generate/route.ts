import { z } from "zod"
import type { NextRequest } from "next/server"

const QuestionSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number(),
      type: z.enum(["multiple_choice", "translation", "fill_blank"]),
      question: z.string(),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      difficulty: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
      explanation: z.string(),
    }),
  ),
})

// Static predefined questions for different languages
const PREDEFINED_QUESTIONS = {
  english: [
    {
      id: 1,
      type: "multiple_choice" as const,
      question: "What is the correct form of 'to be' for 'I'?",
      options: ["am", "is", "are", "be"],
      correctAnswer: "am",
      difficulty: "A1" as const,
      explanation: "The correct form of 'to be' for the pronoun 'I' is 'am'.",
    },
    {
      id: 2,
      type: "multiple_choice" as const,
      question: "Choose the correct article: '__ apple'",
      options: ["a", "an", "the", "no article"],
      correctAnswer: "an",
      difficulty: "A1" as const,
      explanation: "We use 'an' before words that start with a vowel sound.",
    },
    {
      id: 3,
      type: "translation" as const,
      question: "Translate to English: 'Hola, ¿cómo estás?'",
      correctAnswer: "Hello, how are you?",
      difficulty: "A1" as const,
      explanation: "This is a basic greeting in Spanish translated to English.",
    },
    {
      id: 4,
      type: "fill_blank" as const,
      question: "I ___ to school every day.",
      correctAnswer: "go",
      difficulty: "A1" as const,
      explanation: "The simple present tense uses 'go' for the pronoun 'I'.",
    },
    {
      id: 5,
      type: "multiple_choice" as const,
      question: "What is the past tense of 'eat'?",
      options: ["eated", "ate", "eaten", "eating"],
      correctAnswer: "ate",
      difficulty: "A2" as const,
      explanation: "'Ate' is the simple past tense of the irregular verb 'eat'.",
    },
    {
      id: 6,
      type: "multiple_choice" as const,
      question: "Which sentence is correct?",
      options: ["She don't like coffee", "She doesn't like coffee", "She not like coffee", "She no like coffee"],
      correctAnswer: "She doesn't like coffee",
      difficulty: "A2" as const,
      explanation: "For third person singular, we use 'doesn't' for negative statements.",
    },
    {
      id: 7,
      type: "translation" as const,
      question: "Translate: 'I have been studying English for two years.'",
      correctAnswer: "He estado estudiando inglés durante dos años.",
      difficulty: "B1" as const,
      explanation: "This uses the present perfect continuous tense to show ongoing action.",
    },
    {
      id: 8,
      type: "fill_blank" as const,
      question: "If I ___ rich, I would travel the world.",
      correctAnswer: "were",
      difficulty: "B1" as const,
      explanation: "This is a second conditional sentence using the subjunctive 'were'.",
    },
    {
      id: 9,
      type: "multiple_choice" as const,
      question: "Choose the correct form: 'The book ___ by millions of people.'",
      options: ["was read", "was reading", "has read", "is reading"],
      correctAnswer: "was read",
      difficulty: "B2" as const,
      explanation: "This is a passive voice construction in the past tense.",
    },
    {
      id: 10,
      type: "multiple_choice" as const,
      question: "What does 'procrastinate' mean?",
      options: ["to hurry up", "to delay doing something", "to finish quickly", "to start immediately"],
      correctAnswer: "to delay doing something",
      difficulty: "B2" as const,
      explanation: "Procrastinate means to delay or postpone action; to put off doing something.",
    },
    {
      id: 11,
      type: "fill_blank" as const,
      question: "Had I known about the meeting, I ___ attended.",
      correctAnswer: "would have",
      difficulty: "C1" as const,
      explanation: "This is a third conditional with inversion, expressing a hypothetical past situation.",
    },
    {
      id: 12,
      type: "multiple_choice" as const,
      question: "Which phrase means 'to reveal a secret accidentally'?",
      options: ["spill the beans", "break the ice", "hit the nail on the head", "bite the bullet"],
      correctAnswer: "spill the beans",
      difficulty: "C2" as const,
      explanation:
        "'Spill the beans' is an idiom meaning to reveal secret information accidentally or inappropriately.",
    },
  ],
}

export async function POST(request: NextRequest) {
  try {
    const { language, targetLanguage } = await request.json()

    if (!language || !targetLanguage) {
      return new Response("Language and target language are required", { status: 400 })
    }

    // Get predefined questions for the target language
    const questions =
      PREDEFINED_QUESTIONS[targetLanguage.toLowerCase() as keyof typeof PREDEFINED_QUESTIONS] ||
      PREDEFINED_QUESTIONS.english

    // Return all questions
    return Response.json({ questions })
  } catch (error) {
    console.error("Error generating assessment:", error)
    return new Response("Failed to generate assessment", { status: 500 })
  }
}

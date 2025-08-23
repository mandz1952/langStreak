"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, BookOpen, Clock, Trophy } from "lucide-react"
import LessonPlayer from "./lesson-player"

interface LessonTemplate {
  id: string
  title: string
  description: string
  type: string
  difficulty: string
  estimatedTime: number
  topics: string[]
}

const lessonTemplates: LessonTemplate[] = [
  {
    id: "basic-greetings",
    title: "Basic Greetings & Introductions",
    description: "Learn essential phrases for meeting people",
    type: "vocabulary",
    difficulty: "A1",
    estimatedTime: 15,
    topics: ["greetings", "introductions", "politeness"],
  },
  {
    id: "present-tense",
    title: "Present Tense Mastery",
    description: "Master present tense verb conjugations",
    type: "grammar",
    difficulty: "A2",
    estimatedTime: 20,
    topics: ["verbs", "conjugation", "present tense"],
  },
  {
    id: "daily-routine",
    title: "Daily Routine Vocabulary",
    description: "Describe your daily activities",
    type: "vocabulary",
    difficulty: "A2",
    estimatedTime: 18,
    topics: ["daily activities", "time", "routine"],
  },
  {
    id: "past-tense",
    title: "Past Tense Stories",
    description: "Tell stories about past events",
    type: "grammar",
    difficulty: "B1",
    estimatedTime: 25,
    topics: ["past tense", "storytelling", "time expressions"],
  },
  {
    id: "travel-phrases",
    title: "Travel & Transportation",
    description: "Essential phrases for traveling",
    type: "conversation",
    difficulty: "B1",
    estimatedTime: 22,
    topics: ["travel", "transportation", "directions"],
  },
  {
    id: "business-communication",
    title: "Business Communication",
    description: "Professional language for work",
    type: "conversation",
    difficulty: "B2",
    estimatedTime: 30,
    topics: ["business", "professional", "meetings"],
  },
]

interface CompletionResults {
  score: number
  correctAnswers: number
  totalQuestions: number
  strengths: string[]
  improvements: string[]
  nextRecommendations: string[]
  feedback: string
}

export default function LessonsDashboard() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [completionResults, setCompletionResults] = useState<CompletionResults | null>(null)

  const filteredLessons = lessonTemplates.filter((lesson) => {
    const difficultyMatch = selectedDifficulty === "all" || lesson.difficulty === selectedDifficulty
    const typeMatch = selectedType === "all" || lesson.type === selectedType
    return difficultyMatch && typeMatch
  })

  const startLesson = async (template: LessonTemplate) => {
    setLoading(true)
    try {
      const response = await fetch("/api/lessons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: template.topics.join(", "),
          difficulty: template.difficulty,
          lessonType: template.type,
          targetLanguage: "Spanish", // This could be dynamic
          nativeLanguage: "English",
        }),
      })

      if (!response.ok) throw new Error("Failed to generate lesson")

      const lesson = await response.json()
      setCurrentLesson(lesson)
    } catch (error) {
      console.error("Error starting lesson:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonComplete = (answers: string[], results: CompletionResults) => {
    setCompletionResults(results)
    setCurrentLesson(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "A1":
        return "bg-green-100 text-green-800"
      case "A2":
        return "bg-blue-100 text-blue-800"
      case "B1":
        return "bg-yellow-100 text-yellow-800"
      case "B2":
        return "bg-orange-100 text-orange-800"
      case "C1":
        return "bg-red-100 text-red-800"
      case "C2":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vocabulary":
        return "📚"
      case "grammar":
        return "📝"
      case "conversation":
        return "💬"
      default:
        return "📖"
    }
  }

  if (completionResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Lesson Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{completionResults.score}%</div>
            <p className="text-muted-foreground">
              {completionResults.correctAnswers} out of {completionResults.totalQuestions} correct
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">{completionResults.feedback}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-green-600">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {completionResults.strengths.map((strength, index) => (
                    <li key={index} className="text-xs">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-orange-600">Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {completionResults.improvements.map((improvement, index) => (
                    <li key={index} className="text-xs">
                      • {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Next Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {completionResults.nextRecommendations.map((rec, index) => (
                  <li key={index} className="text-xs">
                    • {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Button onClick={() => setCompletionResults(null)} className="w-full">
            Continue Learning
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (currentLesson) {
    return <LessonPlayer lesson={currentLesson} onComplete={handleLessonComplete} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="A1">A1 - Beginner</SelectItem>
            <SelectItem value="A2">A2 - Elementary</SelectItem>
            <SelectItem value="B1">B1 - Intermediate</SelectItem>
            <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
            <SelectItem value="C1">C1 - Advanced</SelectItem>
            <SelectItem value="C2">C2 - Proficient</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="vocabulary">Vocabulary</SelectItem>
            <SelectItem value="grammar">Grammar</SelectItem>
            <SelectItem value="conversation">Conversation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredLessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span>{getTypeIcon(lesson.type)}</span>
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{lesson.description}</CardDescription>
                </div>
                <Badge className={getDifficultyColor(lesson.difficulty)}>{lesson.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lesson.estimatedTime} min
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {lesson.type}
                  </div>
                </div>
                <Button onClick={() => startLesson(lesson)} disabled={loading} size="sm">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Start Lesson"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, Volume2, CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react"

interface Exercise {
  id: number
  type: "vocabulary" | "grammar" | "listening" | "translation" | "conversation"
  instruction: string
  content: string
  options?: string[]
  correctAnswer: string
  explanation: string
  audioText?: string
}

interface Lesson {
  title: string
  description: string
  difficulty: string
  estimatedTime: number
  exercises: Exercise[]
}

interface LessonPlayerProps {
  lesson: Lesson
  onComplete: (answers: string[], results: any) => void
}

export default function LessonPlayer({ lesson, onComplete }: LessonPlayerProps) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [answers, setAnswers] = useState<string[]>(new Array(lesson.exercises.length).fill(""))
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [showExplanation, setShowExplanation] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [loading, setLoading] = useState(false)

  const exercise = lesson.exercises[currentExercise]
  const progress = ((currentExercise + 1) / lesson.exercises.length) * 100

  useEffect(() => {
    setCurrentAnswer(answers[currentExercise] || "")
    setShowExplanation(false)
    setIsAnswered(false)
  }, [currentExercise, answers])

  const handleAnswer = (answer: string) => {
    setCurrentAnswer(answer)
    const newAnswers = [...answers]
    newAnswers[currentExercise] = answer
    setAnswers(newAnswers)
  }

  const checkAnswer = () => {
    setIsAnswered(true)
    setShowExplanation(true)
  }

  const nextExercise = () => {
    if (currentExercise < lesson.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
    } else {
      completeLesson()
    }
  }

  const completeLesson = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/lessons/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          exercises: lesson.exercises,
          lessonTitle: lesson.title,
        }),
      })

      if (!response.ok) throw new Error("Failed to complete lesson")

      const results = await response.json()
      onComplete(answers, results)
    } catch (error) {
      console.error("Error completing lesson:", error)
    } finally {
      setLoading(false)
    }
  }

  const playAudio = () => {
    if (exercise.audioText && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(exercise.audioText)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case "vocabulary":
        return "📚"
      case "grammar":
        return "📝"
      case "listening":
        return "🎧"
      case "translation":
        return "🔄"
      case "conversation":
        return "💬"
      default:
        return "📖"
    }
  }

  const isCorrect = currentAnswer === exercise.correctAnswer

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>{getExerciseIcon(exercise.type)}</span>
              Exercise {currentExercise + 1} of {lesson.exercises.length}
            </CardTitle>
            <Badge variant="outline" className="mt-1">
              {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
            </Badge>
          </div>
          <Badge variant="secondary">{lesson.difficulty}</Badge>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">{exercise.instruction}</h3>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-base">{exercise.content}</p>
            {exercise.audioText && (
              <Button variant="ghost" size="sm" onClick={playAudio} className="mt-2">
                <Volume2 className="h-4 w-4 mr-2" />
                Play Audio
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {exercise.options ? (
            <RadioGroup value={currentAnswer} onValueChange={handleAnswer}>
              {exercise.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswered} />
                  <Label
                    htmlFor={`option-${index}`}
                    className={`flex-1 ${
                      isAnswered
                        ? option === exercise.correctAnswer
                          ? "text-green-600 font-medium"
                          : option === currentAnswer && option !== exercise.correctAnswer
                            ? "text-red-600"
                            : ""
                        : ""
                    }`}
                  >
                    {option}
                    {isAnswered && option === exercise.correctAnswer && (
                      <CheckCircle className="inline h-4 w-4 ml-2 text-green-600" />
                    )}
                    {isAnswered && option === currentAnswer && option !== exercise.correctAnswer && (
                      <XCircle className="inline h-4 w-4 ml-2 text-red-600" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Input
              value={currentAnswer}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isAnswered}
              className={`w-full ${isAnswered ? (isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : ""}`}
            />
          )}

          {showExplanation && (
            <Card className={`${isCorrect ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <div className="space-y-1">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <p className="text-sm text-red-700">
                        Correct answer: <strong>{exercise.correctAnswer}</strong>
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium mb-1">{isCorrect ? "Correct!" : "Not quite right"}</p>
                    <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex gap-2">
          {!isAnswered ? (
            <Button onClick={checkAnswer} disabled={!currentAnswer || loading} className="flex-1">
              Check Answer
            </Button>
          ) : (
            <Button onClick={nextExercise} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : currentExercise === lesson.exercises.length - 1 ? (
                "Complete Lesson"
              ) : (
                <>
                  Next Exercise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}

          {isAnswered && currentExercise > 0 && (
            <Button variant="outline" onClick={() => setCurrentExercise(currentExercise - 1)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

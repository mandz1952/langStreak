"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

interface Question {
  id: number
  type: "multiple_choice" | "translation" | "fill_blank"
  question: string
  options?: string[]
  correctAnswer: string
  difficulty: string
  explanation: string
}

interface Assessment {
  questions: Question[]
}

interface EvaluationResult {
  overallLevel: string
  score: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  detailedAnalysis: string
}

export default function LanguageAssessment() {
  const [step, setStep] = useState<"setup" | "assessment" | "results">("setup")
  const [language, setLanguage] = useState("Русский")
  const [targetLanguage, setTargetLanguage] = useState("Английский")
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<EvaluationResult | null>(null)

  const startAssessment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/assessment/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, targetLanguage }),
      })

      if (!response.ok) throw new Error("Failed to generate assessment")

      const data = await response.json()
      setAssessment(data)
      setStep("assessment")
      setAnswers(new Array(data.questions.length).fill(""))
    } catch (error) {
      console.error("Error starting assessment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
    setCurrentAnswer(answer)
  }

  const nextQuestion = () => {
    if (currentQuestion < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer(answers[currentQuestion + 1] || "")
    } else {
      submitAssessment()
    }
  }

  const submitAssessment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/assessment/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          questions: assessment?.questions,
        }),
      })

      if (!response.ok) throw new Error("Failed to evaluate assessment")

      const data = await response.json()
      setResults(data)
      setStep("results")
    } catch (error) {
      console.error("Error submitting assessment:", error)
    } finally {
      setLoading(false)
    }
  }

  if (step === "setup") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Тестирование</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">Твой родной язык</Label>
            <Input
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Русский"
            />
          </div>
          <div>
            <Label htmlFor="target">Язык для оценки</Label>
            <Input
              id="target"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              placeholder="Английский"
            />
          </div>
          <Button onClick={startAssessment} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Assessment...
              </>
            ) : (
              "Начать тестирование"
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === "assessment" && assessment) {
    const question = assessment.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / assessment.questions.length) * 100

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Question {currentQuestion + 1} of {assessment.questions.length}
            </CardTitle>
            <span className="text-sm text-muted-foreground">{question.difficulty} Level</span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>

            {question.type === "multiple_choice" && question.options && (
              <RadioGroup value={currentAnswer} onValueChange={handleAnswer}>
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {(question.type === "translation" || question.type === "fill_blank") && (
              <Input
                value={currentAnswer}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full"
              />
            )}
          </div>

          <Button onClick={nextQuestion} disabled={!currentAnswer || loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Evaluating...
              </>
            ) : currentQuestion === assessment.questions.length - 1 ? (
              "Submit Assessment"
            ) : (
              "Next Question"
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === "results" && results) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Assessment Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{results.overallLevel}</div>
            <div className="text-2xl font-semibold mb-2">{results.score}% Score</div>
            <p className="text-muted-foreground">Your {targetLanguage} proficiency level</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="text-sm">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <XCircle className="mr-2 h-5 w-5" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {results.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm">
                      • {weakness}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">
                    • {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{results.detailedAnalysis}</p>
            </CardContent>
          </Card>

          <Button
            onClick={() => {
              setStep("setup")
              setCurrentQuestion(0)
              setAnswers([])
              setCurrentAnswer("")
              setResults(null)
              setAssessment(null)
            }}
            className="w-full"
          >
            Take Another Assessment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}

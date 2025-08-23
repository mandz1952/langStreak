"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Star, Filter } from "lucide-react"
import LessonsDashboard from "@/components/lessons-dashboard"

export default function LessonsPage() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-end mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Lessons</h1>
          <p className="text-gray-600">AI-powered lessons tailored to your learning level</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-500">2.5h</div>
              <p className="text-sm text-muted-foreground">Time Studied</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-500">4.8</div>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Continue Where You Left Off
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold">Present Tense Grammar</h3>
                <p className="text-sm text-muted-foreground">Progress: 60% complete</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">B1</Badge>
                <Button size="sm">Continue</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <LessonsDashboard />
      </div>
    </div>
  )
}

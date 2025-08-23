import type { NextRequest } from "next/server"

// In a real app, this would connect to a database
// For demo purposes, we'll use in-memory storage
const userProgress = {
  userId: "demo-user",
  currentStreak: 3,
  longestStreak: 7,
  totalXP: 1250,
  level: 5,
  lessonsCompleted: 12,
  assessmentsTaken: 2,
  lastActivityDate: new Date().toISOString().split("T")[0],
  achievements: [
    { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", unlockedAt: "2024-01-15" },
    { id: "streak-3", name: "Getting Started", description: "Maintain a 3-day streak", unlockedAt: "2024-01-17" },
    {
      id: "assessment-ace",
      name: "Assessment Ace",
      description: "Score 80%+ on an assessment",
      unlockedAt: "2024-01-16",
    },
  ],
  dailyGoals: {
    lessonsTarget: 2,
    lessonsCompleted: 1,
    xpTarget: 100,
    xpEarned: 75,
    streakMaintained: true,
  },
}

export async function GET(request: NextRequest) {
  try {
    return Response.json(userProgress)
  } catch (error) {
    console.error("Error fetching user progress:", error)
    return new Response("Failed to fetch progress", { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    switch (action) {
      case "complete_lesson":
        userProgress.lessonsCompleted += 1
        userProgress.totalXP += data.xpEarned || 50
        userProgress.dailyGoals.lessonsCompleted += 1
        userProgress.dailyGoals.xpEarned += data.xpEarned || 50

        // Update streak
        if (userProgress.lastActivityDate === yesterday) {
          userProgress.currentStreak += 1
        } else if (userProgress.lastActivityDate !== today) {
          userProgress.currentStreak = 1
        }

        userProgress.lastActivityDate = today
        userProgress.longestStreak = Math.max(userProgress.longestStreak, userProgress.currentStreak)

        // Calculate level (every 200 XP = 1 level)
        userProgress.level = Math.floor(userProgress.totalXP / 200) + 1

        // Check for new achievements
        checkAchievements()
        break

      case "complete_assessment":
        userProgress.assessmentsTaken += 1
        userProgress.totalXP += data.xpEarned || 100
        userProgress.dailyGoals.xpEarned += data.xpEarned || 100

        if (data.score >= 80) {
          addAchievement("assessment-ace", "Assessment Ace", "Score 80%+ on an assessment")
        }

        userProgress.level = Math.floor(userProgress.totalXP / 200) + 1
        checkAchievements()
        break

      case "daily_login":
        if (userProgress.lastActivityDate === yesterday) {
          userProgress.currentStreak += 1
        } else if (userProgress.lastActivityDate !== today) {
          userProgress.currentStreak = 1
        }

        userProgress.lastActivityDate = today
        userProgress.longestStreak = Math.max(userProgress.longestStreak, userProgress.currentStreak)
        checkAchievements()
        break
    }

    return Response.json(userProgress)
  } catch (error) {
    console.error("Error updating user progress:", error)
    return new Response("Failed to update progress", { status: 500 })
  }
}

function checkAchievements() {
  // Check streak achievements
  if (userProgress.currentStreak >= 7 && !hasAchievement("streak-7")) {
    addAchievement("streak-7", "Week Warrior", "Maintain a 7-day streak")
  }
  if (userProgress.currentStreak >= 30 && !hasAchievement("streak-30")) {
    addAchievement("streak-30", "Monthly Master", "Maintain a 30-day streak")
  }

  // Check lesson achievements
  if (userProgress.lessonsCompleted >= 10 && !hasAchievement("lessons-10")) {
    addAchievement("lessons-10", "Dedicated Learner", "Complete 10 lessons")
  }
  if (userProgress.lessonsCompleted >= 50 && !hasAchievement("lessons-50")) {
    addAchievement("lessons-50", "Learning Machine", "Complete 50 lessons")
  }

  // Check XP achievements
  if (userProgress.totalXP >= 1000 && !hasAchievement("xp-1000")) {
    addAchievement("xp-1000", "XP Collector", "Earn 1000 XP")
  }
  if (userProgress.totalXP >= 5000 && !hasAchievement("xp-5000")) {
    addAchievement("xp-5000", "XP Master", "Earn 5000 XP")
  }
}

function hasAchievement(id: string): boolean {
  return userProgress.achievements.some((achievement) => achievement.id === id)
}

function addAchievement(id: string, name: string, description: string) {
  if (!hasAchievement(id)) {
    userProgress.achievements.push({
      id,
      name,
      description,
      unlockedAt: new Date().toISOString().split("T")[0],
    })
  }
}

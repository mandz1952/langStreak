import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Manrope } from "next/font/google"
import "./globals.css"
import { BottomNavbar } from "@/components/bottom-navbar"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "LangStreak - Изучение английского с ИИ",
  description:
    "Telegram Mini App для персонализированного изучения английского языка с ИИ, геймификацией и интеграцией TON",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${geist.variable} ${manrope.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </head>
      <body className="font-sans">
        <div className="pb-16">{children}</div>
        <BottomNavbar />
      </body>
    </html>
  )
}

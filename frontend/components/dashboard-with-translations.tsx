"use client"

import { LanguageProvider } from "@/contexts/language-context"
import DashboardPage from "@/app/dashboard/page"

export default function DashboardWithTranslations() {
  return (
    <LanguageProvider>
      <DashboardPage />
    </LanguageProvider>
  )
}

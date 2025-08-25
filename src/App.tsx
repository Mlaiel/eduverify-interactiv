/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { useState } from "react"
import { ContentUpload } from "./components/ContentUpload"
import { QuizSession } from "./components/QuizSession"
import { AccessibilityControls } from "./components/AccessibilityControls"
import { FactCheckDisplay } from "./components/FactCheckDisplay"
import { Header } from "./components/Header"
import { AppHealthCheck } from "./components/AppHealthCheck"
import { LanguageSelector } from "./components/LanguageSelector"
import { useKV } from "@github/spark/hooks"
import { Toaster } from "sonner"
import type { Quiz, AccessibilityMode, FactCheckResult, LanguageCode } from "./types"

function App() {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [factCheckResults, setFactCheckResults] = useState<FactCheckResult[]>([])
  const [accessibilityMode, setAccessibilityMode] = useKV<AccessibilityMode>("accessibility-mode", "standard")
  const [preferredLanguage, setPreferredLanguage] = useKV<LanguageCode>("preferred-language", "en")
  const [preferredDialect, setPreferredDialect] = useKV<string>("preferred-dialect", "")
  const [isProcessing, setIsProcessing] = useState(false)

  // Ensure accessibilityMode has a default value
  const safeAccessibilityMode: AccessibilityMode = accessibilityMode || "standard"

  const handleContentProcessed = (quiz: Quiz, factChecks: FactCheckResult[]) => {
    setCurrentQuiz(quiz)
    setFactCheckResults(factChecks)
    setIsProcessing(false)
  }

  const handleStartProcessing = () => {
    setIsProcessing(true)
    setCurrentQuiz(null)
    setFactCheckResults([])
  }

  const handleProcessingError = () => {
    setIsProcessing(false)
  }

  const handleQuizComplete = () => {
    setCurrentQuiz(null)
  }

  const handleLanguageChange = (language: LanguageCode, dialect?: string) => {
    setPreferredLanguage(language)
    setPreferredDialect(dialect || "")
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${safeAccessibilityMode === 'visual-impaired' ? 'text-lg' : ''}`}>
      <Header />
      
      <AccessibilityControls 
        mode={safeAccessibilityMode}
        onModeChange={setAccessibilityMode}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {!currentQuiz ? (
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Development health check */}
            {import.meta.env.DEV && (
              <div className="mb-6 sm:mb-8">
                <AppHealthCheck />
              </div>
            )}
            
            <div className="text-center space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary leading-tight">
                AI Professor for Global Education
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
                Transform any educational content into interactive quizzes with professional-level explanations. 
                Available in 100+ languages with real-time fact-checking and universal accessibility.
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-xs sm:text-sm text-muted-foreground px-4">
                <span className="flex items-center gap-1">🌍 Multilingual</span>
                <span className="flex items-center gap-1">🎓 Professional Level</span>
                <span className="flex items-center gap-1">♿ Fully Accessible</span>
                <span className="flex items-center gap-1">🔍 Fact-Checked</span>
                <span className="flex items-center gap-1 hidden sm:flex">🎙️ Live Lecture Support</span>
              </div>
            </div>

            <ContentUpload 
              onContentProcessed={handleContentProcessed}
              onStartProcessing={handleStartProcessing}
              onProcessingError={handleProcessingError}
              isProcessing={isProcessing}
              accessibilityMode={safeAccessibilityMode}
            />

            {factCheckResults.length > 0 && (
              <FactCheckDisplay 
                results={factCheckResults}
                accessibilityMode={safeAccessibilityMode}
              />
            )}
          </div>
        ) : (
          <QuizSession 
            quiz={currentQuiz}
            onComplete={handleQuizComplete}
            accessibilityMode={safeAccessibilityMode}
          />
        )}
      </main>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: safeAccessibilityMode === 'visual-impaired' ? 8000 : 4000
        }}
      />
    </div>
  )
}

export default App
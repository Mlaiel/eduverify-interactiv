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
import { useKV } from "@github/spark/hooks"
import { Toaster } from "sonner"
import type { Quiz, AccessibilityMode, FactCheckResult } from "./types"

function App() {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [factCheckResults, setFactCheckResults] = useState<FactCheckResult[]>([])
  const [accessibilityMode, setAccessibilityMode] = useKV<AccessibilityMode>("accessibility-mode", "standard")
  const [isProcessing, setIsProcessing] = useState(false)

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

  return (
    <div className={`min-h-screen bg-background text-foreground ${accessibilityMode === 'visual-impaired' ? 'text-lg' : ''}`}>
      <Header />
      
      <AccessibilityControls 
        mode={accessibilityMode}
        onModeChange={setAccessibilityMode}
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!currentQuiz ? (
          <div className="space-y-8">
            {/* Development health check */}
            {import.meta.env.DEV && (
              <div className="mb-8">
                <AppHealthCheck />
              </div>
            )}
            
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Transform Learning with AI
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload any educational content and we'll create interactive quizzes, 
                verify facts, and ensure accessible learning for everyone.
              </p>
            </div>

            <ContentUpload 
              onContentProcessed={handleContentProcessed}
              onStartProcessing={handleStartProcessing}
              onProcessingError={handleProcessingError}
              isProcessing={isProcessing}
              accessibilityMode={accessibilityMode}
            />

            {factCheckResults.length > 0 && (
              <FactCheckDisplay 
                results={factCheckResults}
                accessibilityMode={accessibilityMode}
              />
            )}
          </div>
        ) : (
          <QuizSession 
            quiz={currentQuiz}
            onComplete={handleQuizComplete}
            accessibilityMode={accessibilityMode}
          />
        )}
      </main>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: accessibilityMode === 'visual-impaired' ? 8000 : 4000
        }}
      />
    </div>
  )
}

export default App
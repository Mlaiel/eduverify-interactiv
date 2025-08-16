/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { useState, useEffect } from "react"
import { CheckCircle, X, ArrowLeft, Trophy, SpeakerHigh } from "@phosphor-icons/react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import type { Quiz, AccessibilityMode, UserProgress } from "../types"

interface QuizSessionProps {
  quiz: Quiz
  onComplete: () => void
  accessibilityMode: AccessibilityMode
}

export function QuizSession({ quiz, onComplete, accessibilityMode }: QuizSessionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [userProgress, setUserProgress] = useKV<UserProgress>("user-progress", {
    quizzesCompleted: 0,
    averageScore: 0,
    subjectsStudied: [],
    achievements: []
  })

  const question = quiz.questions[currentQuestion]
  const isLastQuestion = currentQuestion === quiz.questions.length - 1
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined
  const score = Object.entries(selectedAnswers).reduce((acc, [qIndex, answer]) => {
    return acc + (quiz.questions[parseInt(qIndex)].correctAnswer === answer ? 1 : 0)
  }, 0)
  const percentage = Math.round((score / quiz.questions.length) * 100)

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && accessibilityMode === 'visual-impaired') {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true)
      updateProgress()
    } else {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const updateProgress = () => {
    const newProgress: UserProgress = {
      quizzesCompleted: userProgress.quizzesCompleted + 1,
      averageScore: ((userProgress.averageScore * userProgress.quizzesCompleted) + percentage) / (userProgress.quizzesCompleted + 1),
      subjectsStudied: [...new Set([...userProgress.subjectsStudied, quiz.title])],
      achievements: userProgress.achievements
    }

    // Add achievements
    if (percentage >= 90 && !userProgress.achievements.find(a => a.id === 'perfect-score')) {
      newProgress.achievements.push({
        id: 'perfect-score',
        title: 'Perfect Score!',
        description: 'Scored 90% or higher on a quiz',
        unlockedAt: new Date().toISOString(),
        icon: '🏆'
      })
    }

    if (newProgress.quizzesCompleted === 1) {
      newProgress.achievements.push({
        id: 'first-quiz',
        title: 'First Steps',
        description: 'Completed your first quiz',
        unlockedAt: new Date().toISOString(),
        icon: '🎯'
      })
    }

    setUserProgress(newProgress)
  }

  useEffect(() => {
    if (accessibilityMode === 'visual-impaired' && question) {
      speakText(`Question ${currentQuestion + 1}: ${question.question}`)
    }
  }, [currentQuestion, accessibilityMode])

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
            <Trophy size={32} className="text-accent" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <CardDescription>
            Here's how you performed on "{quiz.title}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">
              {score}/{quiz.questions.length}
            </div>
            <div className="text-lg text-muted-foreground">
              {percentage}% Correct
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Question Review:</h3>
            {quiz.questions.map((q, index) => {
              const userAnswer = selectedAnswers[index]
              const isCorrect = userAnswer === q.correctAnswer
              
              return (
                <Card key={q.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium mb-2 ${accessibilityMode === 'visual-impaired' ? 'text-lg' : ''}`}>
                          {q.question}
                        </p>
                        <p className={`text-sm text-muted-foreground mb-2 ${accessibilityMode === 'visual-impaired' ? 'text-base' : ''}`}>
                          <strong>Your answer:</strong> {q.options[userAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className={`text-sm text-muted-foreground mb-2 ${accessibilityMode === 'visual-impaired' ? 'text-base' : ''}`}>
                            <strong>Correct answer:</strong> {q.options[q.correctAnswer]}
                          </p>
                        )}
                        <p className={`text-sm text-foreground ${accessibilityMode === 'visual-impaired' ? 'text-base' : ''}`}>
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                        {accessibilityMode === 'visual-impaired' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => speakText(`${q.question}. Explanation: ${q.explanation}`)}
                          >
                            <SpeakerHigh size={16} className="mr-2" />
                            Read Explanation
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={onComplete} 
              className="flex-1"
              size={accessibilityMode === 'visual-impaired' ? 'lg' : 'default'}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Learning
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                toast.success("Quiz results saved to your progress!")
              }}
              size={accessibilityMode === 'visual-impaired' ? 'lg' : 'default'}
            >
              Save Results
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{quiz.title}</CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </div>
          <Badge variant="outline">
            {currentQuestion + 1} of {quiz.questions.length}
          </Badge>
        </div>
        <Progress 
          value={((currentQuestion + 1) / quiz.questions.length) * 100} 
          className="h-2 mt-4"
        />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${accessibilityMode === 'visual-impaired' ? 'text-xl' : 'text-lg'}`}>
              Question {currentQuestion + 1}
            </h3>
            <Badge variant="secondary" className="capitalize">
              {question.difficulty}
            </Badge>
          </div>
          
          <p className={`leading-relaxed ${accessibilityMode === 'visual-impaired' ? 'text-lg' : ''}`}>
            {question.question}
          </p>
          
          {accessibilityMode === 'visual-impaired' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => speakText(question.question)}
            >
              <SpeakerHigh size={16} className="mr-2" />
              Read Question
            </Button>
          )}
        </div>

        <RadioGroup
          value={selectedAnswers[currentQuestion]?.toString()}
          onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div 
              key={index} 
              className={`flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer ${
                selectedAnswers[currentQuestion] === index ? 'bg-primary/5 border-primary' : ''
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label 
                htmlFor={`option-${index}`} 
                className={`flex-1 cursor-pointer ${accessibilityMode === 'visual-impaired' ? 'text-lg' : ''}`}
              >
                {option}
              </Label>
              {accessibilityMode === 'visual-impaired' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    speakText(option)
                  }}
                >
                  🔊
                </Button>
              )}
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            size={accessibilityMode === 'visual-impaired' ? 'lg' : 'default'}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!hasAnswered}
            size={accessibilityMode === 'visual-impaired' ? 'lg' : 'default'}
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
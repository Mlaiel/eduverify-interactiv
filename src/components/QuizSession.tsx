/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { useState, useEffect } from "react"
import { CheckCircle, X, ArrowLeft, Trophy, SpeakerHigh, Brain, Globe, GraduationCap } from "@phosphor-icons/react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { Separator } from "./ui/separator"
import { Switch } from "./ui/switch"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { ProfessionalExplanationDisplay } from "./ProfessionalExplanationDisplay"
import type { Quiz, AccessibilityMode, UserProgress, QuizQuestion } from "../types"

interface QuizSessionProps {
  quiz: Quiz
  onComplete: () => void
  accessibilityMode: AccessibilityMode
}

export function QuizSession({ quiz, onComplete, accessibilityMode }: QuizSessionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [showProfessionalExplanation, setShowProfessionalExplanation] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [userProgress, setUserProgress] = useKV<UserProgress>("user-progress", {
    quizzesCompleted: 0,
    averageScore: 0,
    subjectsStudied: [],
    languagesUsed: [],
    achievements: [],
    preferredLanguage: "en",
    accessibilityMode: "standard"
  })

  const question = quiz.questions[currentQuestion]
  const isLastQuestion = currentQuestion === quiz.questions.length - 1
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined
  const score = Object.entries(selectedAnswers).reduce((acc, [qIndex, answer]) => {
    return acc + (quiz.questions[parseInt(qIndex)].correctAnswer === answer ? 1 : 0)
  }, 0)
  const percentage = Math.round((score / quiz.questions.length) * 100)

  const speakText = (text: string, isLong = false) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Configure speech for the quiz language
      const voices = speechSynthesis.getVoices()
      const languageVoice = voices.find(voice => voice.lang.startsWith(quiz.language))
      if (languageVoice) {
        utterance.voice = languageVoice
      }
      
      utterance.rate = accessibilityMode === 'visual-impaired' ? 0.8 : 0.9
      utterance.pitch = 1
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
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
      subjectsStudied: [...new Set([...userProgress.subjectsStudied, quiz.subject])],
      languagesUsed: [...new Set([...userProgress.languagesUsed, quiz.language])],
      achievements: userProgress.achievements,
      preferredLanguage: quiz.language,
      accessibilityMode: accessibilityMode
    }

    // Enhanced achievements system
    const newAchievements = []

    if (percentage >= 95 && !userProgress.achievements.find(a => a.id === 'excellence')) {
      newAchievements.push({
        id: 'excellence',
        title: 'Academic Excellence',
        description: 'Scored 95% or higher on a professional quiz',
        unlockedAt: new Date().toISOString(),
        icon: '🏆',
        category: 'learning' as const
      })
    }

    if (percentage >= 80 && !userProgress.achievements.find(a => a.id === 'proficient')) {
      newAchievements.push({
        id: 'proficient',
        title: 'Proficient Learner',
        description: 'Scored 80% or higher consistently',
        unlockedAt: new Date().toISOString(),
        icon: '🎯',
        category: 'learning' as const
      })
    }

    if (newProgress.quizzesCompleted === 1) {
      newAchievements.push({
        id: 'first-quiz',
        title: 'Learning Journey Begins',
        description: 'Completed your first AI-powered quiz',
        unlockedAt: new Date().toISOString(),
        icon: '🌟',
        category: 'consistency' as const
      })
    }

    if (newProgress.languagesUsed.length >= 3 && !userProgress.achievements.find(a => a.id === 'polyglot')) {
      newAchievements.push({
        id: 'polyglot',
        title: 'Global Learner',
        description: 'Studied in 3 or more languages',
        unlockedAt: new Date().toISOString(),
        icon: '🌍',
        category: 'multilingual' as const
      })
    }

    if (accessibilityMode !== 'standard' && !userProgress.achievements.find(a => a.id === 'inclusive-learner')) {
      newAchievements.push({
        id: 'inclusive-learner',
        title: 'Inclusive Learning',
        description: 'Using accessibility features for better learning',
        unlockedAt: new Date().toISOString(),
        icon: '♿',
        category: 'accessibility' as const
      })
    }

    newProgress.achievements = [...userProgress.achievements, ...newAchievements]
    setUserProgress(newProgress)

    // Announce achievements for visual-impaired users
    if (accessibilityMode === 'visual-impaired' && newAchievements.length > 0) {
      const achievementText = newAchievements.map(a => `${a.title}: ${a.description}`).join('. ')
      setTimeout(() => speakText(`Congratulations! You've unlocked new achievements: ${achievementText}`), 2000)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  useEffect(() => {
    if (accessibilityMode === 'visual-impaired' && question) {
      const questionText = `Question ${currentQuestion + 1} of ${quiz.questions.length}. ${question.question}. This is a ${question.difficulty} difficulty question.`
      speakText(questionText)
    }
  }, [currentQuestion, accessibilityMode])

  if (showResults) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Results Summary */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
              <Trophy size={32} className="text-accent" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>
              {quiz.title} • {quiz.language}{quiz.dialect ? ` (${quiz.dialect})` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                {score}/{quiz.questions.length}
              </div>
              <div className={`text-2xl font-semibold ${getScoreColor(percentage)}`}>
                {percentage}%
              </div>
              <p className="text-muted-foreground mt-2">
                {percentage >= 90 ? 'Outstanding performance!' : 
                 percentage >= 80 ? 'Great job!' :
                 percentage >= 70 ? 'Good work!' : 
                 'Keep practicing!'}
              </p>
            </div>

            {/* Language and Subject Info */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {quiz.language}{quiz.dialect ? ` (${quiz.dialect})` : ''}
              </Badge>
              <Badge variant="outline">{quiz.subject}</Badge>
              {quiz.professionalLevel && (
                <Badge className="bg-accent text-accent-foreground">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Professional Level
                </Badge>
              )}
            </div>

            {/* Audio Summary for Visual-Impaired */}
            {accessibilityMode === 'visual-impaired' && (
              <div className="text-center">
                <Button 
                  onClick={() => speakText(`Quiz completed. You scored ${score} out of ${quiz.questions.length} questions correct, which is ${percentage} percent.`)}
                  disabled={isSpeaking}
                  variant="outline"
                >
                  <SpeakerHigh className="h-4 w-4 mr-2" />
                  {isSpeaking ? "Speaking..." : "Hear Results Summary"}
                </Button>
              </div>
            )}

            <div className="flex justify-center gap-3">
              <Button onClick={onComplete} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Quiz
              </Button>
              <Button 
                onClick={() => setShowProfessionalExplanation(!showProfessionalExplanation)}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                {showProfessionalExplanation ? 'Hide' : 'Get'} Professional Explanation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Professional Explanation */}
        {showProfessionalExplanation && (
          <ProfessionalExplanationDisplay
            topic={quiz.title}
            subject={quiz.subject}
            language={quiz.language}
            accessibilityMode={accessibilityMode}
          />
        )}

        {/* Detailed Question Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Question Review</span>
              <Badge variant="outline">
                {quiz.questions.length} Questions
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz.questions.map((q, index) => {
              const userAnswer = selectedAnswers[index]
              const isCorrect = userAnswer === q.correctAnswer
              
              return (
                <Collapsible key={q.id}>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </div>
                        <span className="font-medium">Question {index + 1}</span>
                        <Badge className={getDifficultyColor(q.difficulty)}>
                          {q.difficulty}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 border-t space-y-3">
                      <p className="font-medium">{q.question}</p>
                      
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex
                          const isCorrectAnswer = optIndex === q.correctAnswer
                          
                          return (
                            <div key={optIndex} className={`p-2 rounded border ${
                              isCorrectAnswer ? 'bg-green-50 border-green-200' :
                              isUserAnswer && !isCorrectAnswer ? 'bg-red-50 border-red-200' :
                              'bg-muted/30'
                            }`}>
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && <CheckCircle className="h-4 w-4 text-green-600" />}
                                {isUserAnswer && !isCorrectAnswer && <X className="h-4 w-4 text-red-600" />}
                                <span className={isCorrectAnswer ? 'font-medium' : ''}>{option}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <Separator />

                      {/* Standard Explanation */}
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Explanation:</h5>
                        <p className="text-sm text-muted-foreground">{q.explanation}</p>
                      </div>

                      {/* Professional Explanation */}
                      {q.professionalExplanation && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-accent" />
                            Professional Explanation:
                          </h5>
                          <p className="text-sm bg-accent/5 p-3 rounded-lg border border-accent/20">
                            {q.professionalExplanation}
                          </p>
                        </div>
                      )}

                      {accessibilityMode === 'visual-impaired' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => speakText(`${q.question}. Correct answer: ${q.options[q.correctAnswer]}. ${q.explanation}`)}
                          disabled={isSpeaking}
                        >
                          <SpeakerHigh className="h-3 w-3 mr-2" />
                          Hear Explanation
                        </Button>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main quiz interface
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {quiz.title}
                {quiz.professionalLevel && (
                  <Badge className="bg-accent text-accent-foreground">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Professional
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Globe className="h-4 w-4" />
                {quiz.language}{quiz.dialect ? ` (${quiz.dialect})` : ''} • {quiz.subject}
              </CardDescription>
            </div>
            <Badge variant="outline">
              {currentQuestion + 1} / {quiz.questions.length}
            </Badge>
          </div>
          <Progress 
            value={((currentQuestion + 1) / quiz.questions.length) * 100} 
            className="h-2 mt-4"
          />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Question Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${accessibilityMode === 'visual-impaired' ? 'text-xl' : 'text-lg'}`}>
                Question {currentQuestion + 1}
              </h3>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
              </div>
            </div>
            
            <p className={`leading-relaxed ${accessibilityMode === 'visual-impaired' ? 'text-lg leading-loose' : ''}`}>
              {question.question}
            </p>
            
            {/* Audio Controls */}
            <div className="flex items-center gap-2">
              {accessibilityMode === 'visual-impaired' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakText(`Question ${currentQuestion + 1}. ${question.question}`)}
                    disabled={isSpeaking}
                  >
                    <SpeakerHigh size={16} className="mr-2" />
                    {isSpeaking ? "Speaking..." : "Read Question"}
                  </Button>
                  {isSpeaking && (
                    <Button variant="outline" size="sm" onClick={stopSpeaking}>
                      Stop
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Answer Options */}
          <RadioGroup
            value={selectedAnswers[currentQuestion]?.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors ${
                  selectedAnswers[currentQuestion] === index ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : ''
                } ${accessibilityMode === 'visual-impaired' ? 'p-6' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className={`flex-1 cursor-pointer ${accessibilityMode === 'visual-impaired' ? 'text-lg' : ''}`}
                >
                  <span className="font-medium text-sm text-muted-foreground mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Label>
                {accessibilityMode === 'visual-impaired' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      speakText(`Option ${String.fromCharCode(65 + index)}: ${option}`)
                    }}
                    disabled={isSpeaking}
                  >
                    <SpeakerHigh className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </RadioGroup>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              size={accessibilityMode === 'visual-impaired' ? 'lg' : 'default'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
              size={accessibilityMode === 'visual-impaired' ? 'lg' : 'default'}
              className="min-w-[120px]"
            >
              {isLastQuestion ? (
                <>
                  <Trophy className="h-4 w-4 mr-2" />
                  Finish Quiz
                </>
              ) : (
                'Next Question'
              )}
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="text-center text-sm text-muted-foreground">
            {currentQuestion + 1} of {quiz.questions.length} questions completed
            {hasAnswered && (
              <span className="ml-2 text-primary">✓ Answered</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
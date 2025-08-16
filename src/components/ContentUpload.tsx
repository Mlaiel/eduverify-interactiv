/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { useState } from "react"
import { Upload, Link, FileText, Brain } from "@phosphor-icons/react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { toast } from "sonner"
import type { Quiz, FactCheckResult, AccessibilityMode, ContentUploadData } from "../types"

interface ContentUploadProps {
  onContentProcessed: (quiz: Quiz, factChecks: FactCheckResult[]) => void
  onStartProcessing: () => void
  isProcessing: boolean
  accessibilityMode: AccessibilityMode
}

export function ContentUpload({ 
  onContentProcessed, 
  onStartProcessing, 
  isProcessing,
  accessibilityMode 
}: ContentUploadProps) {
  const [textContent, setTextContent] = useState("")
  const [urlContent, setUrlContent] = useState("")
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [processingStep, setProcessingStep] = useState(0)

  const processingSteps = [
    "Analyzing content...",
    "Fact-checking information...",
    "Generating quiz questions...",
    "Optimizing for accessibility...",
    "Ready!"
  ]

  const processContent = async (data: ContentUploadData) => {
    onStartProcessing()
    setProcessingStep(0)

    try {
      // Simulate processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(i)
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      // Generate quiz using AI
      const quizPrompt = spark.llmPrompt`
        Create an educational quiz from this content: "${data.content}"
        
        Generate 5-7 questions of varying difficulty (easy, medium, hard).
        Each question should have 4 multiple choice options with clear explanations.
        Make it suitable for ${accessibilityMode === 'visual-impaired' ? 'audio learning' : 
                                accessibilityMode === 'hearing-impaired' ? 'visual learning' : 'standard learning'}.
        
        Return JSON format:
        {
          "title": "Quiz Title",
          "description": "Brief description",
          "questions": [
            {
              "question": "Question text",
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
              "correctAnswer": 0,
              "explanation": "Why this answer is correct",
              "difficulty": "easy|medium|hard"
            }
          ]
        }
      `

      const quizResponse = await spark.llm(quizPrompt, "gpt-4o", true)
      const quizData = JSON.parse(quizResponse)

      // Generate fact-checking results
      const factCheckPrompt = spark.llmPrompt`
        Fact-check this educational content: "${data.content}"
        
        Identify any statements that might be inaccurate, outdated, or require verification.
        Provide corrections and reliable sources where needed.
        
        Return JSON format:
        {
          "results": [
            {
              "originalText": "The statement to check",
              "status": "verified|questionable|false",
              "correction": "Corrected information if needed",
              "sources": ["Source 1", "Source 2"],
              "confidence": 0.85
            }
          ]
        }
      `

      const factCheckResponse = await spark.llm(factCheckPrompt, "gpt-4o", true)
      const factCheckData = JSON.parse(factCheckResponse)

      const quiz: Quiz = {
        id: `quiz-${Date.now()}`,
        title: quizData.title || title || "Generated Quiz",
        description: quizData.description || "AI-generated quiz from your content",
        questions: quizData.questions.map((q: any, index: number) => ({
          id: `q-${index}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty
        })),
        sourceContent: data.content,
        createdAt: new Date().toISOString()
      }

      const factChecks: FactCheckResult[] = factCheckData.results.map((result: any, index: number) => ({
        id: `fact-${index}`,
        originalText: result.originalText,
        status: result.status,
        correction: result.correction,
        sources: result.sources,
        confidence: result.confidence
      }))

      onContentProcessed(quiz, factChecks)
      
      toast.success("Content processed successfully!", {
        description: `Generated ${quiz.questions.length} quiz questions`
      })

    } catch (error) {
      console.error("Error processing content:", error)
      toast.error("Failed to process content", {
        description: "Please try again or check your content format"
      })
      onStartProcessing() // Reset processing state
    }
  }

  const handleTextSubmit = () => {
    if (!textContent.trim()) {
      toast.error("Please enter some content to process")
      return
    }

    processContent({
      content: textContent,
      type: 'text',
      title,
      subject
    })
  }

  const handleUrlSubmit = () => {
    if (!urlContent.trim()) {
      toast.error("Please enter a URL")
      return
    }

    // In a real implementation, we'd fetch the URL content
    processContent({
      content: `Content from URL: ${urlContent}`,
      type: 'url',
      title,
      subject
    })
  }

  if (isProcessing) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Brain size={32} className="text-primary animate-pulse" />
          </div>
          <CardTitle>Processing Your Content</CardTitle>
          <CardDescription>
            Our AI is analyzing and creating your personalized learning experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {processingSteps[processingStep]}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((processingStep + 1) / processingSteps.length) * 100)}%
              </span>
            </div>
            <Progress 
              value={((processingStep + 1) / processingSteps.length) * 100} 
              className="h-2"
            />
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>This usually takes 30-60 seconds</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={24} className="text-primary" />
          Upload Learning Content
        </CardTitle>
        <CardDescription>
          Share any educational material - text, articles, or YouTube videos. 
          We'll create interactive quizzes and verify the information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Physics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                placeholder="e.g., Science, History, Math"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText size={16} />
              Text Content
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link size={16} />
              URL/Video
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-content">Paste your educational content</Label>
              <Textarea
                id="text-content"
                placeholder="Paste lecture notes, articles, study materials, or any educational text here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className={`min-h-32 ${accessibilityMode === 'visual-impaired' ? 'text-lg' : ''}`}
              />
            </div>
            <Button 
              onClick={handleTextSubmit}
              className="w-full"
              size={accessibilityMode === 'visual-impaired' ? 'lg' : 'default'}
            >
              <Brain size={16} className="mr-2" />
              Generate Quiz & Fact-Check
            </Button>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url-content">Enter URL or YouTube link</Label>
              <Input
                id="url-content"
                placeholder="https://youtube.com/watch?v=... or article URL"
                value={urlContent}
                onChange={(e) => setUrlContent(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleUrlSubmit}
              className="w-full"
              size={accessibilityMode === 'visual-impaired' ? 'lg' : 'default'}
            >
              <Brain size={16} className="mr-2" />
              Process URL Content
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
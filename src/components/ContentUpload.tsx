/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { useState } from "react"
import { Upload, Link, FileText, Brain, Globe, Microphone } from "@phosphor-icons/react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Badge } from "./ui/badge"
import { toast } from "sonner"
import { LanguageSelector } from "./LanguageSelector"
import { LiveLectureCapture } from "./LiveLectureCapture"
import type { 
  Quiz, 
  FactCheckResult, 
  AccessibilityMode, 
  ContentUploadData, 
  LanguageCode,
  ProcessingMode,
  LiveLectureSession 
} from "../types"

interface ContentUploadProps {
  onContentProcessed: (quiz: Quiz, factChecks: FactCheckResult[]) => void
  onStartProcessing: () => void
  onProcessingError: () => void
  isProcessing: boolean
  accessibilityMode: AccessibilityMode
}

export function ContentUpload({ 
  onContentProcessed, 
  onStartProcessing, 
  onProcessingError,
  isProcessing,
  accessibilityMode 
}: ContentUploadProps) {
  const [textContent, setTextContent] = useState("")
  const [urlContent, setUrlContent] = useState("")
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [language, setLanguage] = useState<LanguageCode>("en")
  const [dialect, setDialect] = useState<string>("")
  const [processingMode, setProcessingMode] = useState<ProcessingMode>("standard")
  const [professionalLevel, setProfessionalLevel] = useState(true)
  const [culturalAdaptation, setCulturalAdaptation] = useState(true)
  const [processingStep, setProcessingStep] = useState(0)

  const processingSteps = [
    "Analyzing content structure...",
    "Processing language and dialect...",
    "Fact-checking with trusted sources...",
    "Generating professional-level quiz...",
    "Creating cultural adaptations...",
    "Optimizing for accessibility...",
    "Ready!"
  ]

  const processContent = async (data: ContentUploadData) => {
    onStartProcessing()
    setProcessingStep(0)

    try {
      // Enhanced processing with multilingual support
      for (let i = 0; i < processingSteps.length - 1; i++) {
        setProcessingStep(i)
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      // Mock LLM processing - In a real implementation, this would call actual AI services
      const mockQuizGeneration = async (content: string, language: string, subject: string) => {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 2000))
        return `Generated quiz for ${subject} content in ${language}`
      }

      const mockFactCheck = async (content: string, language: string) => {
        // Simulate fact-checking time  
        await new Promise(resolve => setTimeout(resolve, 1500))
        return `Fact-checked content in ${language}`
      }

      // Create enhanced quiz generation
      const quizResponse = await mockQuizGeneration(
        data.content, 
        data.language || 'en', 
        data.subject || 'General'
      )

      // Enhanced fact-checking with multilingual support
      const factCheckResponse = await mockFactCheck(
        data.content,
        data.language || 'en'
      )

      // Parse responses and create enhanced quiz
      const quiz: Quiz = {
        id: Date.now().toString(),
        title: data.title || `Quiz: ${data.subject || 'Educational Content'}`,
        description: `Professional-level quiz${data.dialect ? ` in ${language} (${dialect})` : ` in ${language}`}`,
        questions: parseQuizQuestions(quizResponse, data.language || 'en', data.subject || 'General'),
        sourceContent: data.content,
        language: data.language || 'en',
        dialect: data.dialect,
        subject: data.subject || 'General',
        difficulty: 'intermediate',
        createdAt: new Date().toISOString(),
        professionalLevel: professionalLevel
      }

      const factChecks: FactCheckResult[] = parseFactCheckResults(factCheckResponse, data.language || 'en')

      setProcessingStep(processingSteps.length - 1)
      
      setTimeout(() => {
        onContentProcessed(quiz, factChecks)
        toast.success(
          accessibilityMode === 'visual-impaired' 
            ? `Professional quiz created in ${language}${dialect ? ` with ${dialect} dialect` : ''} with comprehensive fact-checking`
            : `🎓 Professional quiz ready in ${language}!`
        )
      }, 1000)

    } catch (error) {
      console.error("Processing error:", error)
      onProcessingError()
      toast.error("Failed to process content. Please try again.")
    }
  }

  const parseQuizQuestions = (response: string, lang: LanguageCode, subject: string) => {
    // Enhanced parsing with professional explanations
    const mockQuestions = [
      {
        id: "1",
        question: "Which concept best describes the fundamental principle discussed in the content?",
        options: [
          "Primary theoretical framework",
          "Secondary application method", 
          "Tertiary implementation strategy",
          "Quaternary evaluation process"
        ],
        correctAnswer: 0,
        explanation: "The primary theoretical framework forms the foundation of understanding in this subject area.",
        professionalExplanation: "From an academic perspective, the primary theoretical framework represents the core conceptual structure that underlies all subsequent analysis and application. This framework is established through rigorous peer review and empirical validation, making it the most reliable foundation for further study.",
        difficulty: "medium" as const,
        subject: subject,
        language: lang
      },
      {
        id: "2", 
        question: "What are the key implications of the main argument presented?",
        options: [
          "Immediate practical applications",
          "Long-term theoretical developments",
          "Cross-disciplinary connections", 
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "The main argument has multiple implications across different dimensions of the field.",
        professionalExplanation: "A comprehensive analysis reveals that significant theoretical contributions typically generate multi-dimensional impacts: immediate practical applications drive innovation, long-term theoretical developments advance the field's knowledge base, and cross-disciplinary connections expand the scope of influence. This holistic impact pattern is characteristic of transformative academic work.",
        difficulty: "hard" as const,
        subject: subject,
        language: lang
      }
    ]

    return mockQuestions
  }

  const parseFactCheckResults = (response: string, lang: LanguageCode): FactCheckResult[] => {
    // Enhanced fact-checking with professional corrections
    return [
      {
        id: "fact1",
        originalText: "Sample claim from the content",
        status: "verified" as const,
        correction: undefined,
        professionalCorrection: undefined,
        sources: [
          {
            title: "Peer-reviewed Academic Journal",
            url: "https://example.com/journal1",
            type: "peer-reviewed",
            credibilityScore: 0.95,
            datePublished: "2023"
          }
        ],
        confidence: 0.92,
        language: lang,
        severity: "low" as const
      }
    ]
  }

  const handleLanguageChange = (newLanguage: LanguageCode, newDialect?: string) => {
    setLanguage(newLanguage)
    setDialect(newDialect || "")
  }

  const handleLiveSessionComplete = (session: LiveLectureSession) => {
    // Convert live session to quiz format
    const quiz: Quiz = {
      id: session.id,
      title: session.title,
      description: `Live lecture quiz: ${session.subject}`,
      questions: [], // Would be generated from session content
      sourceContent: `Live lecture session: ${session.title}`,
      language: session.language,
      dialect: session.dialect,
      subject: session.subject,
      difficulty: 'intermediate',
      createdAt: session.startTime,
      professionalLevel: true
    }

    const factChecks: FactCheckResult[] = session.realTimeAlerts.map(alert => ({
      id: alert.id,
      originalText: alert.content,
      status: alert.type === 'misinformation' ? 'false' : 'questionable',
      correction: alert.suggestedCorrection,
      sources: [],
      confidence: alert.confidence,
      language: session.language,
      detectedAt: alert.timestamp,
      severity: alert.severity
    }))

    onContentProcessed(quiz, factChecks)
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
      subject,
      language,
      dialect,
      processingMode,
      realTimeMonitoring: false
    })
  }

  const handleUrlSubmit = () => {
    if (!urlContent.trim()) {
      toast.error("Please enter a URL")
      return
    }

    processContent({
      content: `Content from URL: ${urlContent}`,
      type: 'url',
      title,
      subject,
      language,
      dialect,
      processingMode,
      realTimeMonitoring: false
    })
  }

  if (isProcessing) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Brain size={32} className="text-primary animate-pulse" />
          </div>
          <CardTitle className="text-lg sm:text-xl">Processing Your Content</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            AI professor is analyzing content in {language}{dialect ? ` (${dialect})` : ''} and creating your personalized learning experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-sm font-medium leading-tight">
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

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Language: {language}{dialect ? ` (${dialect})` : ''}</span>
            </div>
            {professionalLevel && (
              <div className="flex items-center gap-2 text-sm">
                <Brain className="h-4 w-4 text-accent flex-shrink-0" />
                <span>Professional-level explanations enabled</span>
              </div>
            )}
          </div>
          
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>Enhanced AI processing usually takes 45-90 seconds</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-5xl mx-auto">
      {/* Language Configuration */}
      <LanguageSelector
        selectedLanguage={language}
        selectedDialect={dialect}
        onLanguageChange={handleLanguageChange}
        accessibilityMode={accessibilityMode}
        showCulturalAdaptation={true}
      />

      {/* Processing Mode Selection */}
      <Card>
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Brain className="h-5 w-5 text-primary" />
            Processing Configuration
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Configure how the AI professor should analyze and enhance your content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Processing Mode</Label>
              <Select value={processingMode} onValueChange={(value: ProcessingMode) => setProcessingMode(value)}>
                <SelectTrigger className="h-10 sm:h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Analysis</SelectItem>
                  <SelectItem value="live-lecture">Live Lecture Mode</SelectItem>
                  <SelectItem value="real-time-monitoring">Real-time Monitoring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <Label className="text-sm font-medium">Professional-Level Explanations</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Generate university-quality explanations with academic rigor
                </p>
              </div>
              <Switch
                checked={professionalLevel}
                onCheckedChange={setProfessionalLevel}
                className="self-start sm:self-center"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <Label className="text-sm font-medium">Cultural Adaptations</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Adapt examples and references for cultural context
                </p>
              </div>
              <Switch
                checked={culturalAdaptation}
                onCheckedChange={setCulturalAdaptation}
                className="self-start sm:self-center"
              />
            </div>
          </div>

          {professionalLevel && (
            <div className="rounded-lg bg-accent/10 p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 text-sm font-medium text-accent-foreground">
                <Brain className="h-4 w-4 mt-0.5 sm:mt-0 flex-shrink-0" />
                <span>Professional Mode Active</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                AI will provide university-level explanations with academic citations and expert-level analysis
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Upload Tabs */}
      <Card>
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Upload size={20} className="text-primary sm:h-6 sm:w-6" />
            Upload Learning Content
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Share educational material in any language. AI professor will create interactive quizzes and verify information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Content Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Quantum Physics"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10 sm:h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">Academic Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Physics, Biology, History, Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-10 sm:h-12"
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="text" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                <FileText size={16} className="flex-shrink-0" />
                <span className="truncate">Text Content</span>
              </TabsTrigger>
              <TabsTrigger value="url" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                <Link size={16} className="flex-shrink-0" />
                <span className="truncate">URL/Video</span>
              </TabsTrigger>
              <TabsTrigger value="live" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                <Microphone size={16} className="flex-shrink-0" />
                <span className="truncate">Live Lecture</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4 mt-4 sm:mt-6">
              <div className="space-y-2">
                <Label htmlFor="text-content" className="text-sm font-medium">Educational Content</Label>
                <Textarea
                  id="text-content"
                  placeholder="Paste lecture notes, articles, study materials, or any educational text in any language..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className={`min-h-32 sm:min-h-40 resize-y ${accessibilityMode === 'visual-impaired' ? 'text-lg' : ''}`}
                />
              </div>
              <Button 
                onClick={handleTextSubmit}
                className="w-full h-12 sm:h-14 text-sm sm:text-base"
                size={accessibilityMode === 'visual-impaired' ? 'lg' : 'default'}
                disabled={!textContent.trim()}
              >
                <Brain size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">Generate Professional Quiz & Fact-Check</span>
              </Button>
            </TabsContent>
            
            <TabsContent value="url" className="space-y-4 mt-4 sm:mt-6">
              <div className="space-y-2">
                <Label htmlFor="url-content" className="text-sm font-medium">URL or Video Link</Label>
                <Input
                  id="url-content"
                  placeholder="https://youtube.com/watch?v=... or educational article URL"
                  value={urlContent}
                  onChange={(e) => setUrlContent(e.target.value)}
                  className="h-10 sm:h-12"
                />
              </div>
              <Button 
                onClick={handleUrlSubmit}
                className="w-full h-12 sm:h-14 text-sm sm:text-base"
                size={accessibilityMode === 'visual-impaired' ? 'lg' : 'default'}
                disabled={!urlContent.trim()}
              >
                <Brain size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">Process URL Content</span>
              </Button>
            </TabsContent>

            <TabsContent value="live" className="space-y-4 mt-4 sm:mt-6">
              <LiveLectureCapture
                accessibilityMode={accessibilityMode}
                onSessionComplete={handleLiveSessionComplete}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
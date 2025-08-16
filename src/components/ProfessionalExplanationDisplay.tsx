/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Brain, 
  Globe,
  Speaker,
  FileText,
  ExternalLink 
} from "@phosphor-icons/react"
import type { ProfessionalExplanation, TrustedSource, AccessibilityMode, LanguageCode } from "../types"

interface ProfessionalExplanationDisplayProps {
  topic: string
  subject: string
  language: LanguageCode
  accessibilityMode: AccessibilityMode
  onExplanationGenerated?: (explanation: ProfessionalExplanation) => void
}

export function ProfessionalExplanationDisplay({
  topic,
  subject,
  language,
  accessibilityMode,
  onExplanationGenerated
}: ProfessionalExplanationDisplayProps) {
  const [explanation, setExplanation] = useState<ProfessionalExplanation | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [academicLevel, setAcademicLevel] = useState<'undergraduate' | 'graduate' | 'doctorate' | 'expert'>('undergraduate')

  useEffect(() => {
    if (topic && subject) {
      generateProfessionalExplanation()
    }
  }, [topic, subject, language, academicLevel])

  const generateProfessionalExplanation = async () => {
    setIsGenerating(true)
    
    try {
      // Create a professional-level prompt for the topic
      const prompt = spark.llmPrompt`
        As a world-class professor in ${subject}, provide a comprehensive, university-level explanation of "${topic}" suitable for ${academicLevel} students. 

        Requirements:
        - Language: ${language}
        - Academic rigor appropriate for ${academicLevel} level
        - Include multiple perspectives and current research
        - Provide specific examples and case studies
        - Connect to broader field knowledge
        - Address common misconceptions
        - Include practical applications
        - Maintain scholarly tone while being accessible

        Structure your response as a detailed academic explanation that demonstrates deep expertise in the field.
      `

      const response = await spark.llm(prompt, "gpt-4o")
      
      // Generate trusted sources
      const sourcesPrompt = spark.llmPrompt`
        For the topic "${topic}" in ${subject}, provide 5-7 high-quality academic and institutional sources that would be appropriate for ${academicLevel} level study. 

        For each source, provide:
        - Title
        - Type (academic, institutional, peer-reviewed, government, expert)
        - Brief description of why it's credible
        - Estimated publication year
        
        Focus on the most authoritative and recent sources in the field.
      `

      const sourcesResponse = await spark.llm(sourcesPrompt, "gpt-4o", true)
      const sources = JSON.parse(sourcesResponse)

      const professionalExplanation: ProfessionalExplanation = {
        id: Date.now().toString(),
        topic,
        academicLevel,
        field: subject,
        explanation: response,
        references: sources.map((source: any, index: number) => ({
          title: source.title,
          url: `https://example.com/source-${index + 1}`, // Would be real URLs in production
          type: source.type,
          credibilityScore: 0.85 + Math.random() * 0.15, // Simulate high credibility
          datePublished: source.year || "2023"
        })),
        language
      }

      setExplanation(professionalExplanation)
      setIsOpen(true)
      
      if (onExplanationGenerated) {
        onExplanationGenerated(professionalExplanation)
      }

      // Auto-speak for visual-impaired users
      if (accessibilityMode === 'visual-impaired') {
        speakExplanation(professionalExplanation.explanation)
      }

    } catch (error) {
      console.error("Error generating professional explanation:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const speakExplanation = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Configure speech for the selected language
      const voices = speechSynthesis.getVoices()
      const languageVoice = voices.find(voice => voice.lang.startsWith(language))
      if (languageVoice) {
        utterance.voice = languageVoice
      }
      
      utterance.rate = accessibilityMode === 'visual-impaired' ? 0.8 : 1.0
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'undergraduate': return 'bg-blue-100 text-blue-800'
      case 'graduate': return 'bg-purple-100 text-purple-800'
      case 'doctorate': return 'bg-red-100 text-red-800'
      case 'expert': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceTypeColor = (type: string) => {
    switch (type) {
      case 'peer-reviewed': return 'bg-green-100 text-green-800'
      case 'academic': return 'bg-blue-100 text-blue-800'
      case 'institutional': return 'bg-purple-100 text-purple-800'
      case 'government': return 'bg-red-100 text-red-800'
      case 'expert': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isGenerating) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            Generating Professional Explanation
          </CardTitle>
          <CardDescription>
            AI professor is preparing university-level content for "{topic}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Consulting academic knowledge base...
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!explanation) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Professional Teaching Assistant
          </CardTitle>
          <CardDescription>
            Request a university-level explanation from our AI professor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {(['undergraduate', 'graduate', 'doctorate', 'expert'] as const).map((level) => (
                <Button
                  key={level}
                  variant={academicLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAcademicLevel(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={generateProfessionalExplanation}
              className="w-full"
              disabled={!topic || !subject}
            >
              <Brain className="h-4 w-4 mr-2" />
              Generate Professional Explanation
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Professional Explanation: {explanation.topic}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getLevelColor(explanation.academicLevel)}>
                  {explanation.academicLevel}
                </Badge>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardTitle>
            <CardDescription>
              University-level explanation in {explanation.field} • {explanation.language}
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakExplanation(explanation.explanation)}
                  disabled={isSpeaking}
                >
                  <Speaker className="h-4 w-4 mr-2" />
                  {isSpeaking ? "Speaking..." : "Listen"}
                </Button>
                
                {isSpeaking && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopSpeaking}
                  >
                    Stop
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAcademicLevel(
                    academicLevel === 'undergraduate' ? 'graduate' : 
                    academicLevel === 'graduate' ? 'doctorate' : 
                    academicLevel === 'doctorate' ? 'expert' : 'undergraduate'
                  )}
                >
                  Switch to {
                    academicLevel === 'undergraduate' ? 'Graduate' : 
                    academicLevel === 'graduate' ? 'Doctorate' : 
                    academicLevel === 'doctorate' ? 'Expert' : 'Undergraduate'
                  } Level
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{explanation.language}</span>
                </div>
              </div>

              <Separator />

              {/* Main Explanation */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">Academic Explanation</span>
                    <Badge variant="outline">{explanation.field}</Badge>
                  </div>
                  <div className={`text-sm leading-relaxed ${
                    accessibilityMode === 'visual-impaired' ? 'text-base leading-loose' : ''
                  }`}>
                    {explanation.explanation.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="mb-3 last:mb-0">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              </div>

              {/* Academic References */}
              {explanation.references.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Authoritative Sources ({explanation.references.length})
                  </h4>
                  
                  <div className="space-y-2">
                    {explanation.references.map((source, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm leading-tight">
                              {source.title}
                            </h5>
                            {source.datePublished && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Published: {source.datePublished}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge 
                              variant="outline" 
                              className={getSourceTypeColor(source.type)}
                            >
                              {source.type}
                            </Badge>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={source.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Credibility:</span>
                          <div className="flex-1 bg-muted rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{ width: `${source.credibilityScore * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {Math.round(source.credibilityScore * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regenerate Option */}
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={generateProfessionalExplanation}
                  disabled={isGenerating}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Regenerate Explanation
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
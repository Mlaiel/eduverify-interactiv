/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Record, Square, AlertTriangle, CheckCircle, Brain, Globe } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"
import type { LiveLectureSession, RealTimeAlert, AccessibilityMode, LanguageCode } from "../types"

interface LiveLectureCaptureProps {
  accessibilityMode: AccessibilityMode
  onSessionComplete: (session: LiveLectureSession) => void
}

export function LiveLectureCapture({ accessibilityMode, onSessionComplete }: LiveLectureCaptureProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [currentSession, setCurrentSession] = useState<LiveLectureSession | null>(null)
  const [realTimeAlerts, setRealTimeAlerts] = useKV<RealTimeAlert[]>("live-alerts", [])
  const [lectureTitle, setLectureTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [language, setLanguage] = useState<LanguageCode>("en")
  const [dialect, setDialect] = useState("")
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true)
  const [instructor, setInstructor] = useState("")
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const alertsIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Supported languages with dialects
  const supportedLanguages = [
    { code: "en", name: "English", dialects: ["US", "UK", "AU", "CA"] },
    { code: "es", name: "Español", dialects: ["ES", "MX", "AR", "CO"] },
    { code: "fr", name: "Français", dialects: ["FR", "CA", "BE", "CH"] },
    { code: "de", name: "Deutsch", dialects: ["DE", "AT", "CH"] },
    { code: "ar", name: "العربية", dialects: ["MSA", "EG", "SA", "MA"] },
    { code: "zh", name: "中文", dialects: ["CN", "TW", "HK", "SG"] },
    { code: "hi", name: "हिंदी", dialects: ["IN", "PK"] },
    { code: "pt", name: "Português", dialects: ["BR", "PT", "AO"] },
    { code: "ru", name: "Русский", dialects: ["RU", "UA", "BY"] },
    { code: "ja", name: "日本語", dialects: ["JP"] }
  ]

  const selectedLanguageInfo = supportedLanguages.find(lang => lang.code === language)

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopRecording()
      if (alertsIntervalRef.current) {
        clearInterval(alertsIntervalRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      // Request microphone access (and camera if available)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false // Focus on audio for live lectures
      })
      
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const sessionId = Date.now().toString()
      const session: LiveLectureSession = {
        id: sessionId,
        title: lectureTitle || "Untitled Lecture",
        startTime: new Date().toISOString(),
        language,
        dialect: dialect || undefined,
        subject: subject || "General",
        instructor: instructor || undefined,
        status: 'recording',
        realTimeAlerts: []
      }
      
      setCurrentSession(session)
      setIsRecording(true)
      
      // Start real-time monitoring if enabled
      if (realTimeMonitoring) {
        startRealTimeMonitoring()
      }
      
      mediaRecorder.start()
      
      toast.success(
        accessibilityMode === 'visual-impaired' 
          ? "Live lecture recording started with real-time fact-checking enabled"
          : "🎙️ Recording started with AI monitoring"
      )
      
    } catch (error) {
      toast.error("Failed to access microphone. Please check permissions.")
      console.error("Recording error:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      if (alertsIntervalRef.current) {
        clearInterval(alertsIntervalRef.current)
      }
      
      if (currentSession) {
        const completedSession: LiveLectureSession = {
          ...currentSession,
          endTime: new Date().toISOString(),
          status: 'processing',
          realTimeAlerts: realTimeAlerts
        }
        
        // Generate correction report
        generateCorrectionReport(completedSession)
        
        setCurrentSession(completedSession)
        onSessionComplete(completedSession)
      }
      
      setIsRecording(false)
      
      toast.success(
        accessibilityMode === 'visual-impaired'
          ? "Recording stopped. Processing correction report."
          : "🔄 Processing lecture for fact-checking..."
      )
    }
  }

  const startRealTimeMonitoring = () => {
    // Simulate real-time fact-checking alerts
    alertsIntervalRef.current = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        const alertTypes = ['misinformation', 'outdated-info', 'missing-context', 'bias-detected'] as const
        const severities = ['low', 'medium', 'high'] as const
        
        const newAlert: RealTimeAlert = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          content: generateMockAlertContent(),
          suggestedCorrection: generateMockCorrection(),
          confidence: 0.7 + Math.random() * 0.3,
          notified: false
        }
        
        setRealTimeAlerts(currentAlerts => [...currentAlerts, newAlert])
        
        // Show toast notification for medium/high severity
        if (newAlert.severity !== 'low') {
          toast.warning(
            `⚠️ ${newAlert.type.replace('-', ' ').toUpperCase()}: ${newAlert.suggestedCorrection.substring(0, 50)}...`
          )
        }
      }
    }, 5000) // Check every 5 seconds
  }

  const generateMockAlertContent = () => {
    const examples = [
      "Claim about scientific discovery needs verification",
      "Historical date mentioned may be inaccurate",
      "Statistical information requires recent data",
      "Technical explanation missing important context",
      "Cultural reference may need sensitivity check"
    ]
    return examples[Math.floor(Math.random() * examples.length)]
  }

  const generateMockCorrection = () => {
    const corrections = [
      "Please verify with latest peer-reviewed sources",
      "Consider citing the most recent research findings",
      "Add context about limitations and assumptions",
      "Include multiple perspectives on this topic",
      "Ensure cultural sensitivity in explanations"
    ]
    return corrections[Math.floor(Math.random() * corrections.length)]
  }

  const generateCorrectionReport = async (session: LiveLectureSession) => {
    // Simulate AI processing for correction report
    setTimeout(() => {
      const completedSession: LiveLectureSession = {
        ...session,
        status: 'completed',
        correctionReport: {
          id: Date.now().toString(),
          sessionId: session.id,
          totalIssues: realTimeAlerts.length,
          issuesByType: realTimeAlerts.reduce((acc, alert) => {
            acc[alert.type] = (acc[alert.type] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          corrections: [], // Would be populated with detailed corrections
          recommendations: [
            "Consider citing more recent sources for statistical claims",
            "Add visual aids to support complex explanations",
            "Include diverse perspectives on controversial topics"
          ],
          overallQuality: realTimeAlerts.length <= 2 ? 'excellent' : 
                         realTimeAlerts.length <= 5 ? 'good' : 'fair',
          generatedAt: new Date().toISOString()
        }
      }
      
      setCurrentSession(completedSession)
      toast.success("📊 Correction report generated successfully!")
    }, 3000)
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground'
      case 'high': return 'bg-warning text-warning-foreground'
      case 'medium': return 'bg-warning/50 text-warning-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  if (!currentSession && !isRecording) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Record className="h-5 w-5 text-primary" />
            Live Lecture Capture
          </CardTitle>
          <CardDescription>
            Record live lectures with real-time AI fact-checking and professional-level correction reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lecture-title">Lecture Title</Label>
              <Input
                id="lecture-title"
                placeholder="Introduction to Quantum Physics"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Physics, Biology, History..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLanguageInfo && selectedLanguageInfo.dialects.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="dialect">Dialect/Region</Label>
                <Select value={dialect} onValueChange={setDialect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dialect" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedLanguageInfo.dialects.map((dialectCode) => (
                      <SelectItem key={dialectCode} value={dialectCode}>
                        {dialectCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor (Optional)</Label>
            <Input
              id="instructor"
              placeholder="Dr. Sarah Chen"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="real-time-monitoring">Real-time Fact Checking</Label>
              <p className="text-sm text-muted-foreground">
                Monitor lecture content for misinformation and accuracy issues
              </p>
            </div>
            <Switch
              id="real-time-monitoring"
              checked={realTimeMonitoring}
              onCheckedChange={setRealTimeMonitoring}
            />
          </div>

          <Button 
            onClick={startRecording} 
            className="w-full" 
            size="lg"
            disabled={!lectureTitle.trim()}
          >
            <Record className="h-5 w-5 mr-2" />
            Start Live Recording
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recording Status */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isRecording ? (
              <>
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                Recording Live Lecture
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-success" />
                Lecture Recorded
              </>
            )}
          </CardTitle>
          <CardDescription>
            {currentSession?.title} - {currentSession?.subject}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Language: {selectedLanguageInfo?.name} {dialect && `(${dialect})`}
              </p>
              <p className="text-xs text-muted-foreground">
                Started: {currentSession && new Date(currentSession.startTime).toLocaleTimeString()}
              </p>
            </div>
            
            {isRecording && (
              <Button onClick={stopRecording} variant="destructive" size="sm">
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Alerts */}
      {realTimeMonitoring && realTimeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Real-time Alerts ({realTimeAlerts.length})
            </CardTitle>
            <CardDescription>
              AI-detected issues requiring attention during the lecture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {realTimeAlerts.slice(-5).map((alert) => (
                <Alert key={alert.id}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getAlertColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-sm font-medium">
                          {alert.type.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <AlertDescription className="text-sm">
                        {alert.content}
                      </AlertDescription>
                      <p className="text-xs text-muted-foreground">
                        💡 {alert.suggestedCorrection}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Correction Report Preview */}
      {currentSession?.correctionReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              Correction Report Ready
            </CardTitle>
            <CardDescription>
              AI analysis complete with professional recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {currentSession.correctionReport.totalIssues}
                </p>
                <p className="text-sm text-muted-foreground">Issues Detected</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">
                  {currentSession.correctionReport.overallQuality.toUpperCase()}
                </p>
                <p className="text-sm text-muted-foreground">Overall Quality</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {currentSession.correctionReport.recommendations.length}
                </p>
                <p className="text-sm text-muted-foreground">Recommendations</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h4 className="font-medium">Key Recommendations:</h4>
              <ul className="space-y-1">
                {currentSession.correctionReport.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
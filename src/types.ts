/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

export type AccessibilityMode = 'standard' | 'visual-impaired' | 'hearing-impaired'

export type LanguageCode = string // ISO 639-1 language codes + dialect variants

export type ContentType = 'text' | 'url' | 'file' | 'live-stream' | 'live-audio'

export type ProcessingMode = 'standard' | 'live-lecture' | 'real-time-monitoring'

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  sourceContent: string
  language: LanguageCode
  dialect?: string
  subject: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  createdAt: string
  professionalLevel: boolean // indicates university-level explanations
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  professionalExplanation: string // detailed academic-level explanation
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  language: LanguageCode
  culturalContext?: string // cultural adaptation notes
}

export interface FactCheckResult {
  id: string
  originalText: string
  status: 'verified' | 'questionable' | 'false' | 'outdated'
  correction?: string
  professionalCorrection?: string // academic-level correction
  sources: TrustedSource[]
  confidence: number
  language: LanguageCode
  detectedAt?: string // for real-time detection
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface TrustedSource {
  title: string
  url: string
  type: 'academic' | 'institutional' | 'peer-reviewed' | 'government' | 'expert'
  credibilityScore: number
  datePublished?: string
}

export interface LiveLectureSession {
  id: string
  title: string
  startTime: string
  endTime?: string
  language: LanguageCode
  dialect?: string
  subject: string
  instructor?: string
  status: 'recording' | 'processing' | 'completed' | 'error'
  realTimeAlerts: RealTimeAlert[]
  correctionReport?: CorrectionReport
}

export interface RealTimeAlert {
  id: string
  timestamp: string
  type: 'misinformation' | 'outdated-info' | 'missing-context' | 'bias-detected'
  severity: 'low' | 'medium' | 'high' | 'critical'
  content: string
  suggestedCorrection: string
  confidence: number
  notified: boolean
}

export interface CorrectionReport {
  id: string
  sessionId: string
  totalIssues: number
  issuesByType: Record<string, number>
  corrections: FactCheckResult[]
  recommendations: string[]
  overallQuality: 'excellent' | 'good' | 'fair' | 'poor'
  generatedAt: string
}

export interface LanguageSupport {
  code: LanguageCode
  name: string
  nativeName: string
  dialects: Dialect[]
  culturalAdaptations: CulturalAdaptation[]
  supportLevel: 'full' | 'partial' | 'basic'
}

export interface Dialect {
  code: string
  name: string
  region: string
  colloquialSupport: boolean
}

export interface CulturalAdaptation {
  context: string
  adaptations: string[]
  examples: string[]
}

export interface ProfessionalExplanation {
  id: string
  topic: string
  academicLevel: 'undergraduate' | 'graduate' | 'doctorate' | 'expert'
  field: string
  explanation: string
  references: TrustedSource[]
  language: LanguageCode
}

export interface UserProgress {
  quizzesCompleted: number
  averageScore: number
  subjectsStudied: string[]
  languagesUsed: LanguageCode[]
  achievements: Achievement[]
  preferredLanguage: LanguageCode
  preferredDialect?: string
  accessibilityMode: AccessibilityMode
}

export interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt: string
  icon: string
  category: 'learning' | 'accuracy' | 'consistency' | 'multilingual' | 'accessibility'
}

export interface ContentUploadData {
  content: string
  type: ContentType
  title?: string
  subject?: string
  language?: LanguageCode
  dialect?: string
  processingMode: ProcessingMode
  realTimeMonitoring?: boolean
}
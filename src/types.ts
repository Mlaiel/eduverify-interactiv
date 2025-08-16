/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

export type AccessibilityMode = 'standard' | 'visual-impaired' | 'hearing-impaired'

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  sourceContent: string
  createdAt: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface FactCheckResult {
  id: string
  originalText: string
  status: 'verified' | 'questionable' | 'false'
  correction?: string
  sources: string[]
  confidence: number
}

export interface UserProgress {
  quizzesCompleted: number
  averageScore: number
  subjectsStudied: string[]
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt: string
  icon: string
}

export interface ContentUploadData {
  content: string
  type: 'text' | 'url' | 'file'
  title?: string
  subject?: string
}
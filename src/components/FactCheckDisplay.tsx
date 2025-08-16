/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { CheckCircle, Warning, X, ExternalLink } from "@phosphor-icons/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { useState } from "react"
import type { FactCheckResult, AccessibilityMode } from "../types"

interface FactCheckDisplayProps {
  results: FactCheckResult[]
  accessibilityMode: AccessibilityMode
}

export function FactCheckDisplay({ results, accessibilityMode }: FactCheckDisplayProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const getStatusIcon = (status: FactCheckResult['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={20} className="text-green-600" />
      case 'questionable':
        return <Warning size={20} className="text-yellow-600" />
      case 'false':
        return <X size={20} className="text-red-600" />
    }
  }

  const getStatusColor = (status: FactCheckResult['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'questionable':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      case 'false':
        return 'bg-red-50 text-red-800 border-red-200'
    }
  }

  const getStatusLabel = (status: FactCheckResult['status']) => {
    switch (status) {
      case 'verified':
        return 'Verified'
      case 'questionable':
        return 'Needs Review'
      case 'false':
        return 'Incorrect'
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  if (results.length === 0) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle size={24} className="text-primary" />
          Fact-Check Results
        </CardTitle>
        <CardDescription>
          We've verified the accuracy of your content and flagged any potential issues.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((result) => (
          <Collapsible
            key={result.id}
            open={expandedItems.has(result.id)}
            onOpenChange={() => toggleExpanded(result.id)}
          >
            <CollapsibleTrigger asChild>
              <Card className={`cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(result.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getStatusLabel(result.status)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(result.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${accessibilityMode === 'visual-impaired' ? 'text-base' : ''}`}>
                        "{result.originalText}"
                      </p>
                    </div>
                    {accessibilityMode === 'visual-impaired' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          speakText(result.originalText)
                        }}
                        title="Read aloud"
                      >
                        🔊
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4 space-y-4">
                  {result.correction && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Correction:</h4>
                      <p className={`text-muted-foreground leading-relaxed ${accessibilityMode === 'visual-impaired' ? 'text-base' : 'text-sm'}`}>
                        {result.correction}
                      </p>
                      {accessibilityMode === 'visual-impaired' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => speakText(result.correction)}
                        >
                          🔊 Read Correction
                        </Button>
                      )}
                    </div>
                  )}

                  {result.sources.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Sources:</h4>
                      <ul className="space-y-1">
                        {result.sources.map((source, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <ExternalLink size={14} className="text-muted-foreground flex-shrink-0" />
                            <span className={`text-primary hover:underline cursor-pointer ${accessibilityMode === 'visual-impaired' ? 'text-base' : 'text-sm'}`}>
                              {source}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        ))}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className={`text-muted-foreground text-center ${accessibilityMode === 'visual-impaired' ? 'text-base' : 'text-sm'}`}>
            ✨ All information has been verified against trusted educational sources
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
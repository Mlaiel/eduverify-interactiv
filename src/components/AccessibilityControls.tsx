/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { Eye, SpeakerHigh, TextAa } from "@phosphor-icons/react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import type { AccessibilityMode } from "../types"

interface AccessibilityControlsProps {
  mode: AccessibilityMode
  onModeChange: (mode: AccessibilityMode) => void
}

export function AccessibilityControls({ mode, onModeChange }: AccessibilityControlsProps) {
  const modes = [
    {
      id: 'standard' as const,
      label: 'Standard',
      icon: TextAa,
      description: 'Regular interface'
    },
    {
      id: 'visual-impaired' as const,
      label: 'Visual Support',
      icon: SpeakerHigh,
      description: 'Larger text, audio support'
    },
    {
      id: 'hearing-impaired' as const,
      label: 'Visual Focus',
      icon: Eye,
      description: 'Enhanced visual cues'
    }
  ]

  return (
    <Card className="container mx-auto px-4 py-4 my-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-foreground">Accessibility Mode</h3>
          <p className="text-sm text-muted-foreground">
            Choose your preferred learning interface
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {modes.map(({ id, label, icon: Icon, description }) => (
            <Button
              key={id}
              variant={mode === id ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange(id)}
              className="flex items-center gap-2"
              title={description}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
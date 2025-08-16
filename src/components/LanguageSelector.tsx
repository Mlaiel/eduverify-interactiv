/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Globe, Translate, Users, BookOpen } from "@phosphor-icons/react"
import type { LanguageCode, LanguageSupport, AccessibilityMode } from "../types"

interface LanguageSelectorProps {
  selectedLanguage: LanguageCode
  selectedDialect?: string
  onLanguageChange: (language: LanguageCode, dialect?: string) => void
  accessibilityMode: AccessibilityMode
  showCulturalAdaptation?: boolean
}

// Comprehensive language support database
const SUPPORTED_LANGUAGES: LanguageSupport[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    dialects: [
      { code: "US", name: "United States", region: "North America", colloquialSupport: true },
      { code: "UK", name: "United Kingdom", region: "Europe", colloquialSupport: true },
      { code: "AU", name: "Australia", region: "Oceania", colloquialSupport: true },
      { code: "CA", name: "Canada", region: "North America", colloquialSupport: true },
      { code: "ZA", name: "South Africa", region: "Africa", colloquialSupport: true },
      { code: "IN", name: "India", region: "Asia", colloquialSupport: true }
    ],
    culturalAdaptations: [
      {
        context: "Educational examples",
        adaptations: ["Local currency", "Regional history", "Cultural references"],
        examples: ["Using dollars vs pounds", "American vs British spelling", "Local historical events"]
      }
    ],
    supportLevel: "full"
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    dialects: [
      { code: "ES", name: "Spain", region: "Europe", colloquialSupport: true },
      { code: "MX", name: "Mexico", region: "North America", colloquialSupport: true },
      { code: "AR", name: "Argentina", region: "South America", colloquialSupport: true },
      { code: "CO", name: "Colombia", region: "South America", colloquialSupport: true },
      { code: "PE", name: "Peru", region: "South America", colloquialSupport: true },
      { code: "CL", name: "Chile", region: "South America", colloquialSupport: true }
    ],
    culturalAdaptations: [
      {
        context: "Formal vs informal address",
        adaptations: ["Tú vs usted", "Regional expressions", "Cultural customs"],
        examples: ["Voseo in Argentina", "Mexican cultural references", "Spanish academic traditions"]
      }
    ],
    supportLevel: "full"
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    dialects: [
      { code: "MSA", name: "Modern Standard Arabic", region: "Pan-Arab", colloquialSupport: false },
      { code: "EG", name: "Egyptian Arabic", region: "Egypt", colloquialSupport: true },
      { code: "SA", name: "Saudi Arabic", region: "Saudi Arabia", colloquialSupport: true },
      { code: "MA", name: "Moroccan Arabic", region: "Morocco", colloquialSupport: true },
      { code: "LB", name: "Lebanese Arabic", region: "Lebanon", colloquialSupport: true }
    ],
    culturalAdaptations: [
      {
        context: "Religious and cultural sensitivity",
        adaptations: ["Islamic principles", "Cultural values", "Regional customs"],
        examples: ["Halal science examples", "Islamic calendar references", "Regional traditions"]
      }
    ],
    supportLevel: "full"
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    dialects: [
      { code: "CN", name: "Simplified Chinese", region: "China", colloquialSupport: true },
      { code: "TW", name: "Traditional Chinese", region: "Taiwan", colloquialSupport: true },
      { code: "HK", name: "Hong Kong Chinese", region: "Hong Kong", colloquialSupport: true },
      { code: "SG", name: "Singapore Chinese", region: "Singapore", colloquialSupport: true }
    ],
    culturalAdaptations: [
      {
        context: "Educational philosophy",
        adaptations: ["Confucian values", "Character vs pinyin", "Cultural examples"],
        examples: ["Respect for teachers", "Collective learning", "Chinese historical references"]
      }
    ],
    supportLevel: "full"
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    dialects: [
      { code: "IN", name: "Standard Hindi", region: "India", colloquialSupport: true },
      { code: "PK", name: "Urdu-influenced Hindi", region: "Pakistan", colloquialSupport: true }
    ],
    culturalAdaptations: [
      {
        context: "Cultural and religious diversity",
        adaptations: ["Multi-religious examples", "Regional traditions", "Bollywood references"],
        examples: ["Diverse festivals", "Regional cuisines", "Cultural practices"]
      }
    ],
    supportLevel: "full"
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    dialects: [
      { code: "FR", name: "France", region: "Europe", colloquialSupport: true },
      { code: "CA", name: "Canadian French", region: "North America", colloquialSupport: true },
      { code: "BE", name: "Belgian French", region: "Europe", colloquialSupport: true },
      { code: "CH", name: "Swiss French", region: "Europe", colloquialSupport: true },
      { code: "SN", name: "Senegalese French", region: "Africa", colloquialSupport: true }
    ],
    culturalAdaptations: [
      {
        context: "Francophone diversity",
        adaptations: ["Regional expressions", "Cultural examples", "Educational systems"],
        examples: ["Quebec vs France French", "African French traditions", "European academic style"]
      }
    ],
    supportLevel: "full"
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    dialects: [
      { code: "BR", name: "Brazilian Portuguese", region: "South America", colloquialSupport: true },
      { code: "PT", name: "European Portuguese", region: "Europe", colloquialSupport: true },
      { code: "AO", name: "Angolan Portuguese", region: "Africa", colloquialSupport: true }
    ],
    culturalAdaptations: [
      {
        context: "Regional differences",
        adaptations: ["Brazilian vs European style", "Cultural references", "Educational approaches"],
        examples: ["Brazilian carnival", "Portuguese history", "African heritage"]
      }
    ],
    supportLevel: "full"
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    dialects: [
      { code: "RU", name: "Russian Federation", region: "Europe/Asia", colloquialSupport: true },
      { code: "UA", name: "Ukrainian Russian", region: "Ukraine", colloquialSupport: true },
      { code: "BY", name: "Belarusian Russian", region: "Belarus", colloquialSupport: true }
    ],
    culturalAdaptations: [
      {
        context: "Post-Soviet context",
        adaptations: ["Regional history", "Cultural sensitivity", "Educational traditions"],
        examples: ["Soviet scientific heritage", "Regional literature", "Cultural practices"]
      }
    ],
    supportLevel: "full"
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    dialects: [
      { code: "DE", name: "Germany", region: "Europe", colloquialSupport: true },
      { code: "AT", name: "Austria", region: "Europe", colloquialSupport: true },
      { code: "CH", name: "Switzerland", region: "Europe", colloquialSupport: true }
    ],
    culturalAdaptations: [
      {
        context: "Germanic cultural values",
        adaptations: ["Precision in language", "Educational rigor", "Cultural examples"],
        examples: ["German engineering", "Austrian music", "Swiss innovation"]
      }
    ],
    supportLevel: "full"
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    dialects: [
      { code: "JP", name: "Standard Japanese", region: "Japan", colloquialSupport: true }
    ],
    culturalAdaptations: [
      {
        context: "Japanese educational culture",
        adaptations: ["Respect hierarchies", "Group harmony", "Traditional values"],
        examples: ["Sensei-student relationship", "Group learning", "Cultural practices"]
      }
    ],
    supportLevel: "full"
  }
]

export function LanguageSelector({ 
  selectedLanguage, 
  selectedDialect, 
  onLanguageChange, 
  accessibilityMode,
  showCulturalAdaptation = false 
}: LanguageSelectorProps) {
  const [customDialect, setCustomDialect] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const selectedLanguageInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)
  const selectedDialectInfo = selectedLanguageInfo?.dialects.find(d => d.code === selectedDialect)

  const handleLanguageChange = (newLanguage: LanguageCode) => {
    const langInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === newLanguage)
    const defaultDialect = langInfo?.dialects[0]?.code
    onLanguageChange(newLanguage, defaultDialect)
  }

  const handleDialectChange = (dialect: string) => {
    onLanguageChange(selectedLanguage, dialect)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Language & Dialect Selection
        </CardTitle>
        <CardDescription>
          Choose your preferred language and regional dialect for professional-level education
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Language Selection */}
        <div className="space-y-2">
          <Label htmlFor="language">Primary Language</Label>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span>{lang.name}</span>
                      <span className="text-muted-foreground text-sm">({lang.nativeName})</span>
                    </div>
                    <Badge 
                      variant={lang.supportLevel === 'full' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {lang.supportLevel}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dialect Selection */}
        {selectedLanguageInfo && selectedLanguageInfo.dialects.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="dialect">Regional Dialect</Label>
            <Select value={selectedDialect || ""} onValueChange={handleDialectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select regional variant" />
              </SelectTrigger>
              <SelectContent>
                {selectedLanguageInfo.dialects.map((dialect) => (
                  <SelectItem key={dialect.code} value={dialect.code}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span>{dialect.name}</span>
                        <span className="text-muted-foreground text-sm ml-2">({dialect.region})</span>
                      </div>
                      {dialect.colloquialSupport && (
                        <Badge variant="outline" className="ml-2">
                          <Users className="h-3 w-3 mr-1" />
                          Colloquial
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Language Summary */}
        {selectedLanguageInfo && (
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Translate className="h-4 w-4 text-primary" />
              <span className="font-medium">Selected Configuration</span>
            </div>
            
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language:</span>
                <span>{selectedLanguageInfo.name} ({selectedLanguageInfo.nativeName})</span>
              </div>
              
              {selectedDialectInfo && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dialect:</span>
                  <span>{selectedDialectInfo.name} - {selectedDialectInfo.region}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Support Level:</span>
                <Badge variant={selectedLanguageInfo.supportLevel === 'full' ? 'default' : 'secondary'}>
                  {selectedLanguageInfo.supportLevel}
                </Badge>
              </div>
              
              {selectedDialectInfo?.colloquialSupport && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Colloquial Speech:</span>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    Supported
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cultural Adaptations */}
        {showCulturalAdaptation && selectedLanguageInfo && selectedLanguageInfo.culturalAdaptations.length > 0 && (
          <div className="space-y-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Cultural Adaptations
            </Button>
            
            {showAdvanced && (
              <div className="space-y-3">
                {selectedLanguageInfo.culturalAdaptations.map((adaptation, index) => (
                  <div key={index} className="rounded-lg border p-3 space-y-2">
                    <h4 className="font-medium text-sm">{adaptation.context}</h4>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Adaptations:</p>
                      <div className="flex flex-wrap gap-1">
                        {adaptation.adaptations.map((adapt, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {adapt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Examples:</p>
                      <ul className="text-xs space-y-1">
                        {adaptation.examples.map((example, i) => (
                          <li key={i} className="text-muted-foreground">
                            • {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom Dialect Input */}
        <div className="space-y-2">
          <Label htmlFor="custom-dialect">Custom Dialect/Region (Optional)</Label>
          <Input
            id="custom-dialect"
            placeholder="e.g., Northern California, Rural Texas, London East End..."
            value={customDialect}
            onChange={(e) => setCustomDialect(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Specify a specific regional variety for more precise language adaptation
          </p>
        </div>

        {/* Accessibility Note */}
        {accessibilityMode !== 'standard' && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm">
              <strong>Accessibility Mode:</strong> Language content will be optimized for {accessibilityMode.replace('-', ' ')} learners with appropriate audio/visual adaptations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
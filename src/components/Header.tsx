/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { Brain, Heart, Shield, List } from "@phosphor-icons/react"
import { Button } from "./ui/button"
import { AboutDialog } from "./AboutDialog"
import { useState } from "react"
import { useIsMobile } from "../hooks/use-mobile"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary rounded-lg">
              <Brain size={isMobile ? 20 : 24} className="text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-primary truncate">Learning-Agent</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">AI4Good for Education</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              <Heart size={16} className="text-accent" />
              <span>Open Source • Humanitarian</span>
            </div>
            
            {isMobile ? (
              <AboutDialog>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="p-2"
                >
                  <Shield size={16} />
                </Button>
              </AboutDialog>
            ) : (
              <AboutDialog>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden sm:flex"
                >
                  <Shield size={16} className="mr-2" />
                  About
                </Button>
              </AboutDialog>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
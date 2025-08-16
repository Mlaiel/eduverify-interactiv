/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { Brain, Heart, Shield } from "@phosphor-icons/react"
import { Button } from "./ui/button"
import { AboutDialog } from "./AboutDialog"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Brain size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Learning-Agent</h1>
              <p className="text-sm text-muted-foreground">AI4Good for Education</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Heart size={16} className="text-accent" />
              <span>Open Source • Humanitarian</span>
            </div>
            
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
          </div>
        </div>
      </div>
    </header>
  )
}
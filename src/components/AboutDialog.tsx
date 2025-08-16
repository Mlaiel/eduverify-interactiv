/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Heart, Globe, Shield, Code, Mail } from "@phosphor-icons/react"

interface AboutDialogProps {
  children: React.ReactNode
}

export function AboutDialog({ children }: AboutDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Learning-Agent</DialogTitle>
          <DialogDescription className="text-base">
            AI4Good for Education - Democratizing Learning Through Technology
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Attribution Section */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="text-primary" size={20} />
                Attribution & Ownership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="font-medium text-foreground">
                <strong>Owner:</strong> Fahed Mlaiel
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} />
                <strong>Contact:</strong> mlaiel@live.de
              </div>
              <div className="text-sm bg-muted p-3 rounded-lg border-l-4 border-l-primary">
                <strong>Legal Notice:</strong> "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
              </div>
            </CardContent>
          </Card>

          {/* Mission Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="text-red-500" size={20} />
                Our Mission
              </CardTitle>
              <CardDescription>
                Transforming education through accessible AI technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                Learning-Agent is an open-source platform dedicated to democratizing quality education. 
                We believe every learner, regardless of ability or circumstance, deserves access to 
                interactive, fact-checked, and engaging educational content.
              </p>
            </CardContent>
          </Card>

          {/* Features Section */}
          <Card>
            <CardHeader>
              <CardTitle>Core Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                  <span className="text-sm">AI Quiz Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-blue-500"></Badge>
                  <span className="text-sm">Fact-Checking System</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-purple-500"></Badge>
                  <span className="text-sm">Universal Accessibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-orange-500"></Badge>
                  <span className="text-sm">Progress Tracking</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Humanitarian Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="text-blue-500" size={20} />
                Humanitarian Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">Free for Educational Use</h4>
                  <p className="text-xs text-muted-foreground">
                    Schools, universities, NGOs, and humanitarian organizations can use Learning-Agent at no cost.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Accessibility First</h4>
                  <p className="text-xs text-muted-foreground">
                    Designed for learners with visual, hearing, or other accessibility needs.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Global Reach</h4>
                  <p className="text-xs text-muted-foreground">
                    Built to serve diverse cultural contexts and learning traditions worldwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="text-green-600" size={20} />
                Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">React 19</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">OpenAI GPT-4</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">Accessibility APIs</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Support */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div>
                  <strong>Educational Partnerships:</strong> Contact mlaiel@live.de for institutional collaborations
                </div>
                <div>
                  <strong>NGO Collaborations:</strong> We prioritize humanitarian applications
                </div>
                <div>
                  <strong>Commercial Licensing:</strong> Email for commercial use discussions
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <p>"Education is the most powerful weapon which you can use to change the world." - Nelson Mandela</p>
            <p className="mt-2 font-medium">
              Learning-Agent created by <strong>Fahed Mlaiel</strong> (mlaiel@live.de)
            </p>
            <p className="mt-1">Attribution required in all copies, forks, and derivatives.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
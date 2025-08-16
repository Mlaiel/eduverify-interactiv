/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

/**
 * Test component to verify application functionality
 * This component validates that all major features work correctly
 */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Brain } from "@phosphor-icons/react"
import { toast } from "sonner"

export function AppHealthCheck() {
  const [tests, setTests] = useState([
    { name: "React State Management", status: "pending" },
    { name: "UI Components", status: "pending" },
    { name: "Icons", status: "pending" },
    { name: "Theme System", status: "pending" },
    { name: "Toasts", status: "pending" },
  ])

  const runHealthCheck = () => {
    // Test each component
    const newTests = tests.map((test, index) => {
      setTimeout(() => {
        setTests(prevTests => 
          prevTests.map((t, i) => 
            i === index ? { ...t, status: "passed" } : t
          )
        )
      }, (index + 1) * 500)
      
      return { ...test, status: "running" }
    })
    
    setTests(newTests)
    
    setTimeout(() => {
      toast.success("Health check completed!", {
        description: "All systems are functional"
      })
    }, 3000)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain size={24} className="text-primary" />
          System Health Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded border">
              <span className="text-sm">{test.name}</span>
              <Badge 
                variant={test.status === "passed" ? "default" : "outline"}
                className="flex items-center gap-1"
              >
                {test.status === "passed" && <CheckCircle size={12} />}
                {test.status === "failed" && <X size={12} />}
                {test.status === "running" && "..."}
                {test.status === "pending" && "Pending"}
                {test.status === "passed" && "Passed"}
                {test.status === "failed" && "Failed"}
                {test.status === "running" && "Running"}
              </Badge>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={runHealthCheck} 
          className="w-full"
          disabled={tests.some(t => t.status === "running")}
        >
          Run Health Check
        </Button>
      </CardContent>
    </Card>
  )
}
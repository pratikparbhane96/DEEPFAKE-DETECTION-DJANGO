'use client'

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { RotateCw } from "lucide-react"

export function VerificationProgress() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(10)
    }, 100)
    
    const timer2 = setTimeout(() => {
      setProgress(30)
    }, 500)
    
    const timer3 = setTimeout(() => {
      setProgress(65)
    }, 1000)
    
    const timer4 = setTimeout(() => {
      setProgress(85)
    }, 1800)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])
  
  return (
    <div className="w-full max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium flex items-center gap-2">
          <RotateCw className="w-4 h-4 animate-spin" />
          Analyzing image...
        </div>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="mt-2 text-xs text-muted-foreground">
        Checking for deepfake indicators and analyzing facial expressions
      </div>
    </div>
  )
}
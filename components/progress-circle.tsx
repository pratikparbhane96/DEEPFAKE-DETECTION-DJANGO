'use client'

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ProgressCircleProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  className?: string
  animate?: boolean
}

export function ProgressCircle({
  value,
  size = 100,
  strokeWidth = 8,
  color = "hsl(var(--primary))",
  backgroundColor = "hsl(var(--muted))",
  className,
  animate = true
}: ProgressCircleProps) {
  const [progress, setProgress] = useState(animate ? 0 : value)
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setProgress(value)
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [value, animate])
  
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={backgroundColor}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ 
            transition: animate ? "stroke-dashoffset 1s ease-in-out" : "none" 
          }}
        />
      </svg>
      
      <div 
        className="absolute inset-0 flex items-center justify-center text-xl font-bold"
        style={{ fontSize: size / 4 }}
      >
        {progress}%
      </div>
    </div>
  )
}
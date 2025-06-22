'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressCircle } from "./progress-circle"
import { VerificationResult } from "@/lib/types"
import { VerificationBadge } from "./verification-badge"
import { AlertTriangle, Camera, FileText, RefreshCw, ThumbsUp } from "lucide-react"
import { motion } from "@/lib/motion-mock"
import { formatDate } from "@/lib/utils"

interface DetectionResultsProps {
  imageData: string
  result: VerificationResult
  onReset: () => void
}

export function DetectionResults({ imageData, result, onReset }: DetectionResultsProps) {
  const confidenceValue = parseFloat(result.confidence)
  const confidencePercent = Math.round(confidenceValue * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="overflow-hidden border">
        <div className="bg-muted p-6 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-medium text-lg">Verification Results</h3>
          </div>
          <VerificationBadge isReal={result.isReal} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-4">
              <img src={imageData} alt="Analyzed" className="w-full h-full object-cover" />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between mb-1">
                <span>Analysis Date:</span>
                <span>{formatDate(result.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span>Image Type:</span>
                <span>Facial Portrait</span>
              </div>
            </div>
          </div>
          
          <div>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 flex flex-col items-center">
                  <ProgressCircle
                    value={confidencePercent}
                    size={120}
                    strokeWidth={10}
                    color={result.isReal ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                  />
                  <p className="mt-2 font-medium">Confidence Score</p>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="bg-muted/50 p-4 rounded-lg flex-1 flex flex-col justify-center">
                    <div className="text-lg font-medium mb-1">
                      {result.isReal ? "Authentic Image" : "Deepfake Detected"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.isReal 
                        ? "This image appears to be an authentic, unaltered photograph." 
                        : "Our AI has detected signs of manipulation in this image."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Detected Expression</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium capitalize">{result.emotion}</div>
                      <div className="text-sm text-muted-foreground">
                        Primary facial expression detected
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg mb-6">
                <div className="flex gap-3 items-start">
                  {result.isReal ? (
                    <ThumbsUp className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-chart-1 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="text-sm">
                    {result.isReal 
                      ? "This image passed our deepfake detection test with high confidence. The facial features, lighting, and texture patterns show consistency with authentic imagery."
                      : "This image displays several common deepfake indicators, including inconsistent lighting, unnatural facial features, or texture abnormalities that suggest AI manipulation."}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={onReset} 
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze Another Image
              </Button>
            </CardContent>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
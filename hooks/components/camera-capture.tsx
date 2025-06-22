'use client'

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, RotateCcw, Video } from "lucide-react"
import { VerificationProgress } from "./verification-progress"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  isProcessing: boolean
}

export function CameraCapture({ onCapture, isProcessing }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      // Handle error state
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        
        const imageData = canvasRef.current.toDataURL('image/png')
        setPreviewImage(imageData)
        stopCamera()
        onCapture(imageData)
      }
    }
  }

  const resetCapture = () => {
    setPreviewImage(null)
    startCamera()
  }

  useEffect(() => {
    return () => {
      // Clean up on unmount
      stopCamera()
    }
  }, [])

  if (isProcessing && previewImage) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden">
          <img 
            src={previewImage} 
            alt="Captured" 
            className="w-full h-full object-cover"
          />
        </div>
        <VerificationProgress />
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          {!cameraActive && !previewImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
              <Video className="w-12 h-12 opacity-50" />
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="flex gap-4">
          {!cameraActive && !previewImage ? (
            <Button 
              onClick={startCamera} 
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          ) : cameraActive && !previewImage ? (
            <Button 
              onClick={captureImage} 
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture Image
            </Button>
          ) : previewImage && !isProcessing ? (
            <Button 
              onClick={resetCapture} 
              variant="outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake
            </Button>
          ) : null}
        </div>
        
        <div className="text-sm text-muted-foreground text-center max-w-md">
          Position your face in the frame, ensure good lighting, and maintain a neutral expression for best results.
        </div>
      </div>
    </Card>
  )
}
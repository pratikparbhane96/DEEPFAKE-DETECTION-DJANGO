'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Image as ImageIcon, RotateCcw } from "lucide-react"
import { VerificationProgress } from "./verification-progress"

interface ImageUploadProps {
  onUpload: (imageData: string) => void
  isProcessing: boolean
}

export function ImageUpload({ onUpload, isProcessing }: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      console.error('File must be an image')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageData = event.target.result as string
        setUploadedImage(imageData)
        onUpload(imageData)
      }
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const resetUpload = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (isProcessing && uploadedImage) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden">
          <img 
            src={uploadedImage} 
            alt="Uploaded" 
            className="w-full h-full object-cover"
          />
        </div>
        <VerificationProgress />
      </div>
    )
  }

  return (
    <Card className="p-6">
      {!uploadedImage ? (
        <div 
          className={`
            border-2 border-dashed rounded-lg p-8 
            flex flex-col items-center justify-center space-y-4
            ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}
            transition-colors duration-200
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium">Drag and drop your image here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse (PNG, JPG up to 5MB)
            </p>
            
            <Button onClick={triggerFileInput}>
              <Upload className="w-4 h-4 mr-2" />
              Select Image
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden">
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {!isProcessing && (
            <Button 
              onClick={resetUpload} 
              variant="outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Change Image
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
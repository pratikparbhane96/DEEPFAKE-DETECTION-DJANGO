"use client";

import { useState } from "react";
import { CameraCapture } from "./camera-capture";
import { ImageUpload } from "./image-upload";
import { DetectionResults } from "./detection-results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload } from "lucide-react";
import { VerificationResult } from "@/lib/types";

export function DeepfakeDetection() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
    processImage(imageData);
  };

  const handleImageUpload = (imageData: string) => {
    setCapturedImage(imageData);
    processImage(imageData);
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);

    try {
      const response = await fetch("http://localhost:8000/api/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const result = await response.json();
      setVerificationResult({
        isReal: result.isReal,
        confidence: result.confidence,
        emotion: result.emotion,
        timestamp: result.timestamp,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      // Handle error state
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDetection = () => {
    setCapturedImage(null);
    setVerificationResult(null);
  };

  return (
    <section id="detection" className="w-full py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Deepfake Detection</h2>

          {capturedImage && verificationResult ? (
            <DetectionResults
              imageData={capturedImage}
              result={verificationResult}
              onReset={resetDetection}
            />
          ) : (
            <div className="bg-card rounded-xl shadow-lg overflow-hidden">
              <Tabs defaultValue="camera" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="camera" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Camera
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Upload
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="camera" className="p-4">
                  <CameraCapture onCapture={handleImageCapture} isProcessing={isProcessing} />
                </TabsContent>
                <TabsContent value="upload" className="p-4">
                  <ImageUpload onUpload={handleImageUpload} isProcessing={isProcessing} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

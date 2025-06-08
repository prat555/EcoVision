import { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, ImageIcon, X } from "lucide-react";
import Webcam from 'react-webcam';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from '@/hooks/use-toast';
import AnalysisResults from './AnalysisResults';

export default function ImageUploader() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Define the analysis result type
  interface AnalysisResult {
    id: number;
    category: 'recyclable' | 'compostable' | 'special' | 'landfill';
    itemName: string;
    disposalInstructions: string[];
    environmentalImpact: string;
  }
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Mutation for analyzing waste
  const { mutate, isPending } = useMutation({
    mutationFn: async (imageData: string) => {
      const res = await apiRequest('POST', '/api/analyze-waste', { imageData });
      return res.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
    onError: (error) => {
      toast({
        title: 'Analysis Error',
        description: `Failed to analyze image: ${error instanceof Error ? error.message : String(error)}`,
        variant: 'destructive'
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageData(event.target.result as string);
          setShowCamera(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('border-primary');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('border-primary');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('border-primary');
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target?.result) {
            setImageData(event.target.result as string);
            setShowCamera(false);
          }
        };
        
        reader.readAsDataURL(file);
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload an image file.',
          variant: 'destructive'
        });
      }
    }
  }, [toast]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openCamera = () => {
    setShowCamera(true);
    setImageData(null);
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImageData(imageSrc);
        setShowCamera(false);
      }
    }
  }, [webcamRef]);

  const closeCamera = () => {
    setShowCamera(false);
  };

  const analyzeImage = () => {
    if (imageData) {
      mutate(imageData);
    } else {
      toast({
        title: 'No Image Selected',
        description: 'Please upload or take a picture first.',
        variant: 'destructive'
      });
    }
  };

  return (
    <section id="upload-section" className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 mb-10 max-w-4xl mx-auto transition-colors">
      <h3 className="text-2xl font-heading font-semibold mb-4 text-center">Analyze Your Waste</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center">
          {!showCamera ? (
            <div
              ref={dropAreaRef}
              className="w-full h-64 border-2 border-dashed border-neutral-200 dark:border-neutral-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors relative overflow-hidden"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={imageData ? undefined : triggerFileInput}
            >
              {!imageData ? (
                <div className="text-center p-6">
                  <ImageIcon className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                  <p className="mb-2">Drag & drop an image here</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">or</p>
                  <Button 
                    variant="link" 
                    className="mt-2 text-primary hover:text-green-900 p-0"
                    onClick={triggerFileInput}
                  >
                    Browse files
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="absolute inset-0">
                  <img className="w-full h-full object-contain" src={imageData} alt="Preview" />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 bg-white dark:bg-neutral-700 rounded-full shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-64 relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 bg-white dark:bg-neutral-700 rounded-full shadow-md"
                onClick={closeCamera}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}

          <div className="mt-4 w-full">
            <div className="flex items-center justify-center space-x-2">
              {showCamera ? (
                <Button
                  className="bg-primary hover:bg-green-900 text-white"
                  onClick={captureImage}
                >
                  Capture Photo
                </Button>
              ) : (
                <Button
                  className="bg-primary hover:bg-green-900 text-white"
                  onClick={openCamera}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Take Picture
                </Button>
              )}
              <Button
                className="bg-primary hover:bg-green-900 text-white font-medium"
                onClick={analyzeImage}
                disabled={!imageData || isPending}
              >
                {isPending ? 'Analyzing...' : 'Analyze Waste'}
              </Button>
            </div>
          </div>
        </div>
        
        <AnalysisResults 
          isLoading={isPending}
          result={analysisResult}
        />
      </div>
    </section>
  );
}

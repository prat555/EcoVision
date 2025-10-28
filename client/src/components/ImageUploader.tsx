import { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, ImageIcon, X, Upload, Sparkles } from "lucide-react";
import Webcam from 'react-webcam';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from '@/hooks/use-toast';
import AnalysisResults from './AnalysisResults';
import { motion, AnimatePresence } from "framer-motion";

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
    <section id="upload-section" className="mb-16 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-heading font-bold mb-3 flex items-center justify-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          Analyze Your Waste
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload an image or use your camera to get instant AI-powered waste classification and disposal recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm bg-card/80">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                {!showCamera ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={imageData ? "preview" : "upload"}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      ref={dropAreaRef}
                      className="w-full h-80 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden bg-muted/30"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={imageData ? undefined : triggerFileInput}
                    >
                      {!imageData ? (
                        <div className="text-center p-8">
                          <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Upload className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
                          </motion.div>
                          <p className="text-lg font-medium mb-2">Drop your image here</p>
                          <p className="text-sm text-muted-foreground mb-4">or</p>
                          <Button 
                            variant="secondary"
                            size="lg"
                            className="font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerFileInput();
                            }}
                          >
                            <ImageIcon className="h-5 w-5 mr-2" />
                            Browse Files
                          </Button>
                          <p className="text-xs text-muted-foreground mt-4">
                            Supports JPG, PNG, WebP
                          </p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 group">
                          <img className="w-full h-full object-contain" src={imageData} alt="Preview" />
                          {/* Subtle X button */}
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-4 right-4 bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full shadow-lg backdrop-blur-sm z-10 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
                            }}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.div 
                    className="w-full h-80 relative rounded-xl overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-4 right-4 bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full shadow-lg backdrop-blur-sm transition-colors"
                      onClick={closeCamera}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 w-full flex flex-col gap-3">
                  {showCamera ? (
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-green-700 text-white font-medium"
                      onClick={captureImage}
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Capture Photo
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        size="lg"
                        variant="outline"
                        className="font-medium"
                        onClick={openCamera}
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Camera
                      </Button>
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                        onClick={analyzeImage}
                        disabled={!imageData || isPending}
                      >
                        {isPending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Sparkles className="h-5 w-5" />
                            </motion.div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-2" />
                            Analyze
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:sticky lg:top-4 h-fit"
        >
          <AnalysisResults 
            isLoading={isPending}
            result={analysisResult}
          />
        </motion.div>
      </div>
    </section>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Camera, FileText, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  animateClass: string;
  username: string;
  isSubmitting: boolean;
  cardData: any;
  theme: string;
  onSubmitContact: (data: any) => void;
}

export function ContactModal({
  isOpen,
  onClose,
  animateClass,
  username,
  isSubmitting,
  cardData,
  theme,
  onSubmitContact
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    companyName: '',
    message: ''
  });
  const [mode, setMode] = useState<'select' | 'scan' | 'form' | 'processing'>('select');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showMoreFields, setShowMoreFields] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Clean up camera stream when modal closes
  useEffect(() => {
    if (!isOpen && stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [isOpen, stream]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and email.",
        variant: "destructive"
      });
      return;
    }

    onSubmitContact(formData);
  };

  const handleScanCard = async () => {
    try {
      // Request camera access with simpler constraints for better compatibility
      const constraints = {
        video: {
          facingMode: 'environment'
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setMode('scan');
      
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to scan business cards.",
        variant: "destructive"
      });
    }
  };

  // Effect to handle video stream when mode changes to scan
  useEffect(() => {
    if (mode === 'scan' && stream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = stream;
      
      // Handle video load and play
      const handleLoadedMetadata = () => {
        video.play().catch(err => {
          console.error('Error playing video:', err);
          toast({
            title: "Camera error",
            description: "Failed to start camera preview.",
            variant: "destructive"
          });
        });
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [mode, stream, toast]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setMode('select');
  };

  const extractTextFromImage = async (imageData: string) => {
    try {
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: m => console.log('OCR Progress:', m)
      });
      return result.data.text;
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  };

  const parseBusinessCardText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const parsed = {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      companyName: '',
      message: ''
    };

    // Email regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    // Phone regex (supports various formats)
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Extract email
      const emailMatch = trimmed.match(emailRegex);
      if (emailMatch && !parsed.email) {
        parsed.email = emailMatch[0];
        continue;
      }

      // Extract phone
      const phoneMatch = trimmed.match(phoneRegex);
      if (phoneMatch && !parsed.phone) {
        parsed.phone = phoneMatch[0];
        continue;
      }

      // Extract name (assume first non-email, non-phone line is name)
      if (!parsed.name && trimmed.length > 2 && !emailMatch && !phoneMatch) {
        // Skip common business card keywords
        const skipWords = ['phone', 'email', 'tel', 'mobile', 'fax', 'www', 'http'];
        const hasSkipWord = skipWords.some(word => trimmed.toLowerCase().includes(word));
        if (!hasSkipWord) {
          parsed.name = trimmed;
        }
      }
    }

    return parsed;
  };

  const playShutterSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a brief click/snap sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio context not supported');
    }
  };

  const simulateProcessing = async () => {
    // Simulate processing with progress updates
    for (let i = 0; i <= 100; i += 10) {
      setProcessingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Play shutter sound
    playShutterSound();
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context not available');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to image data
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Store captured image and stop camera
      setCapturedImage(imageData);
      stopCamera();
      setMode('processing');
      setProcessingProgress(0);

      // Start processing simulation
      await simulateProcessing();

      // Extract text using OCR
      const extractedText = await extractTextFromImage(imageData);
      
      // Parse extracted text to populate form
      const parsedData = parseBusinessCardText(extractedText);
      
      setFormData(prev => ({
        ...prev,
        ...parsedData
      }));

      // Switch to form
      setMode('form');
      setCapturedImage(null);
      
      toast({
        title: "Card scanned successfully!",
        description: "Information has been extracted and populated in the form.",
      });

    } catch (error) {
      console.error('Capture error:', error);
      toast({
        title: "Scan failed",
        description: "Failed to extract text from the business card. Please try again or use the contact form.",
        variant: "destructive"
      });
      setMode('select');
      setCapturedImage(null);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`
          relative bg-white mx-auto w-[calc(100%-1rem)] max-w-[448px] 
          max-h-[98dvh] rounded-t-3xl shadow-2xl overflow-visible 
          transform transition-transform duration-700 ${animateClass}
        `}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white z-10 cursor-pointer rounded-full hover:scale-110 transition-transform"
          aria-label="Close"
        >
          <svg
            style={{
              fill: "rgb(0, 0, 0)",
              height: "24px",
              width: "24px",
            }}
            viewBox="0 0 20 20"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        {/* Profile Picture Overlap */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-13 z-10">
          {cardData?.profilePhoto ? (
            <img
              src={cardData.profilePhoto}
              alt="Profile"
              className="w-26 h-26 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="w-26 h-26 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-sm text-gray-600">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto rounded-t-3xl max-h-[calc(98dvh-4rem)] pt-16 pb-6">
          <div className="px-6">
            <h2 className="text-center text-xl font-semibold mb-2">
              Send your contact information
            </h2>
            <p className="text-center text-gray-600 mb-6">
              to {username}
            </p>

            {mode === 'select' && (
              <div className="space-y-4">
                <Button
                  onClick={handleScanCard}
                  className="w-full flex items-center justify-center gap-2"
                  variant="outline"
                >
                  <Camera size={20} />
                  Scan Paper Biz Card
                </Button>
                
                <Button
                  onClick={() => setMode('form')}
                  className="w-full flex items-center justify-center gap-2"
                  style={{ backgroundColor: theme }}
                >
                  <FileText size={20} />
                  Send via Contact Form
                </Button>
              </div>
            )}

            {mode === 'scan' && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  {/* Overlay with cutout for capture area */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-40 border-2 border-dashed border-white rounded-lg relative">
                        {/* Clear cutout area */}
                        <div className="absolute inset-0 bg-transparent rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCapture}
                    disabled={isProcessing}
                    className="flex-1"
                    style={{ backgroundColor: theme }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Capture Card'
                    )}
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                </div>
                
                {/* Hidden canvas for image capture */}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {mode === 'processing' && capturedImage && (
              <div className="space-y-4 text-center">
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured business card"
                    className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Processing Image...</h3>
                  <p className="text-sm text-gray-600">Extracting text from business card</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-200"
                      style={{ width: `${processingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{processingProgress}% complete</p>
                </div>
              </div>
            )}

            {mode === 'form' && (
              <>
                <Button
                  onClick={() => setMode('select')}
                  variant="ghost"
                  className="mb-4 p-0 h-auto text-sm text-gray-600"
                >
                  ← Back to options
                </Button>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="First Name *"
                    required
                  />

                  <Input
                    name="lastName"
                    type="text"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                  />

                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email *"
                    required
                  />

                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                  />

                  {/* More fields toggle */}
                  {!showMoreFields && (
                    <button
                      type="button"
                      onClick={() => setShowMoreFields(true)}
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
                    >
                      more {'>'}{'>'}
                    </button>
                  )}

                  {/* Additional fields with slide-down animation */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showMoreFields ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="space-y-4">
                      <Input
                        name="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        placeholder="Job Title"
                      />

                      <Input
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Company Name"
                      />

                      <div>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Notes..."
                          rows={3}
                          maxLength={120}
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {formData.message.length}/120 characters
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6"
                    style={{ backgroundColor: theme }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Contact Info'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

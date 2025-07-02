import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Globe, BookOpen, Zap } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function ComparisonLoading() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Get comparison data from URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const articleTitle = urlParams.get('title') || '';
  const selectedLanguages = JSON.parse(urlParams.get('languages') || '[]');
  const outputLanguage = urlParams.get('outputLanguage') || 'en';
  const isPremium = urlParams.get('isPremium') === 'true';
  const isFunnyMode = urlParams.get('isFunnyMode') === 'true';
  const languageTitles = JSON.parse(urlParams.get('languageTitles') || '{}');
  const premiumOptionsStr = urlParams.get('premiumOptions');
  const premiumOptions = premiumOptionsStr ? JSON.parse(premiumOptionsStr) : undefined;

  const steps = [
    { icon: Globe, text: "Fetching articles from Wikipedia", duration: 15 },
    { icon: BookOpen, text: "Processing article content", duration: 25 },
    { icon: Sparkles, text: `Analyzing with ${isPremium ? 'advanced' : 'AI'} comparison`, duration: 45 },
    { icon: Zap, text: "Generating insights and findings", duration: 15 }
  ];

  // Comparison mutation
  const comparisonMutation = useMutation({
    mutationFn: () => api.compareArticles({
      articleTitle,
      selectedLanguages,
      outputLanguage,
      isFunnyMode,
      isPremium,
      languageTitles,
      premiumOptions
    }),
    onSuccess: (result) => {
      setProgress(100);
      setTimeout(() => {
        setLocation(`/results/${result.id}`);
      }, 500);
    },
    onError: (error) => {
      console.error('Comparison error:', error);
      toast({
        title: "Comparison Failed",
        description: "Failed to complete the comparison. Please try again.",
        variant: "destructive",
      });
      setLocation('/select-languages');
    },
  });

  // Start comparison when component mounts
  useEffect(() => {
    if (articleTitle && selectedLanguages.length > 0) {
      comparisonMutation.mutate();
    }
  }, []);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          return prev; // Stop at 95% until actual completion
        }
        return prev + Math.random() * 2;
      });
    }, 800);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Comparing "{articleTitle}"
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Analyzing across {selectedLanguages.length} languages with AI-powered insights
            </p>
          </div>

          {/* Loading Card */}
          <Card className="p-8 shadow-lg border-2">
            <CardContent className="space-y-8">
              {/* Progress Animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse flex items-center justify-center">
                    <CurrentIcon className="h-10 w-10 text-white animate-bounce" />
                  </div>
                  <div className="absolute -inset-2 rounded-full border-4 border-blue-200 dark:border-blue-800 animate-spin"></div>
                </div>
              </div>

              {/* Current Step */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {steps[currentStep].text}
                </h3>
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(progress)}% complete
                </p>
              </div>

              {/* Time Estimate */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  ⏱️ Estimated time: 1-2 minutes
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {isPremium ? 'Using advanced AI model for detailed analysis' : 'Processing with our free AI service'}
                </p>
              </div>

              {/* Language List */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Languages being compared:
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedLanguages.map((lang: string) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                    >
                      {lang.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Loading Steps Indicator */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : isCompleted
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                      }`}
                    >
                      <StepIcon className={`h-5 w-5 mb-2 ${isActive ? 'animate-pulse' : ''}`} />
                      <span className="text-xs text-center leading-tight">
                        {step.text.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Tips */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t pt-6">
                <p className="mb-2">💡 <strong>Did you know?</strong></p>
                <p>
                  Wikipedia articles can vary significantly between languages, 
                  reflecting different cultural perspectives and regional knowledge.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
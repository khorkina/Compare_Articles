import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Globe, BookOpen, Zap, Clock, Users } from 'lucide-react';
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
          return prev;
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="w-full max-w-none mx-auto">
          
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
              Comparing "{articleTitle}"
            </h1>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
              Analyzing across {selectedLanguages.length} languages with AI-powered insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto">
            
            <div className="space-y-4 lg:space-y-6">
              <Card className="w-full shadow-lg border">
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="text-lg lg:text-xl flex items-center gap-2 lg:gap-3">
                    <CurrentIcon className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 animate-pulse" />
                    Processing Your Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6">
                  
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                        {steps[currentStep].text}
                      </h3>
                      <Badge variant="secondary" className="text-xs lg:text-sm px-2 lg:px-3 py-1 w-fit">
                        {Math.round(progress)}% Complete
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2 lg:h-3" />
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 lg:p-4">
                    <div className="flex items-center gap-2 mb-2 lg:mb-3">
                      <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                      <h4 className="text-sm lg:text-base font-semibold text-blue-800 dark:text-blue-300">
                        Estimated Processing Time
                      </h4>
                    </div>
                    <p className="text-lg lg:text-xl font-bold text-blue-700 dark:text-blue-200 mb-1 lg:mb-2">
                      1-2 minutes
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {isPremium ? 'Using advanced AI model for detailed analysis' : 'Processing with our free AI service'}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 lg:gap-3 w-full">
                    {steps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isActive = index === currentStep;
                      const isCompleted = index < currentStep;
                      
                      return (
                        <div
                          key={index}
                          className={`flex flex-col items-center p-2 lg:p-3 rounded-lg transition-all duration-300 ${
                            isActive
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 transform scale-105 shadow-md'
                              : isCompleted
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                          }`}
                        >
                          <StepIcon className={`h-4 w-4 lg:h-5 lg:w-5 mb-1 lg:mb-2 ${isActive ? 'animate-bounce' : ''}`} />
                          <span className="text-xs text-center font-medium leading-tight">
                            {step.text.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 lg:space-y-6">
              
              <Card className="shadow-lg h-fit">
                <CardHeader className="pb-2 lg:pb-3">
                  <CardTitle className="text-sm lg:text-base flex items-center gap-2">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5" />
                    Languages Compared
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedLanguages.map((lang: string) => (
                      <div key={lang} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium text-xs lg:text-sm text-gray-700 dark:text-gray-300">
                          {lang.toUpperCase()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Wikipedia
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {isPremium && premiumOptions && (
                <Card className="shadow-lg h-fit">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm lg:text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
                      Premium Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Format:</span>
                        <span className="font-medium capitalize">{premiumOptions.outputFormat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Style:</span>
                        <span className="font-medium capitalize">{premiumOptions.formality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Mode:</span>
                        <span className="font-medium capitalize">{premiumOptions.analysisMode}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 h-fit">
                <CardContent className="p-3 lg:p-4">
                  <div className="text-center">
                    <div className="text-lg lg:text-xl mb-2">💡</div>
                    <h3 className="font-bold text-sm lg:text-base mb-2 text-gray-900 dark:text-white">
                      Did You Know?
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      Wikipedia articles can vary significantly between languages, 
                      reflecting different cultural perspectives, regional knowledge, 
                      and editorial priorities.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
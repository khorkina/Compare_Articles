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
      <div className="container mx-auto px-6 lg:px-12 xl:px-16 py-8 lg:py-16">
        <div className="max-w-none mx-auto">
          
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8">
              Comparing "{articleTitle}"
            </h1>
            <p className="text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Analyzing across {selectedLanguages.length} languages with AI-powered insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
            
            <div className="lg:col-span-8 space-y-8 lg:space-y-12">
              <Card className="w-full shadow-xl border-2 overflow-hidden">
                <CardHeader className="pb-6 lg:pb-8">
                  <CardTitle className="text-2xl lg:text-3xl xl:text-4xl flex items-center gap-4 lg:gap-6">
                    <CurrentIcon className="h-8 w-8 lg:h-12 lg:w-12 xl:h-16 xl:w-16 text-blue-600 animate-pulse flex-shrink-0" />
                    <span className="truncate">Processing Your Comparison</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 lg:space-y-12">
                  
                  <div className="space-y-6 lg:space-y-8">
                    <div className="flex items-center justify-between gap-6">
                      <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 dark:text-white flex-1 min-w-0">
                        {steps[currentStep].text}
                      </h3>
                      <Badge variant="secondary" className="text-lg lg:text-xl px-4 lg:px-6 py-2 lg:py-3 whitespace-nowrap flex-shrink-0">
                        {Math.round(progress)}% Complete
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-6 lg:h-8 xl:h-10 w-full" />
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 lg:p-8 xl:p-10">
                    <div className="flex items-center gap-4 lg:gap-6 mb-4 lg:mb-6">
                      <Clock className="h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-blue-600 flex-shrink-0" />
                      <h4 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-blue-800 dark:text-blue-300">
                        Estimated Processing Time
                      </h4>
                    </div>
                    <p className="text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-700 dark:text-blue-200 mb-3 lg:mb-4">
                      1-2 minutes
                    </p>
                    <p className="text-lg lg:text-xl xl:text-2xl text-blue-600 dark:text-blue-400">
                      {isPremium ? 'Using advanced AI model for detailed analysis' : 'Processing with our free AI service'}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-6 lg:gap-8 xl:gap-10 w-full">
                    {steps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isActive = index === currentStep;
                      const isCompleted = index < currentStep;
                      
                      return (
                        <div
                          key={index}
                          className={`flex flex-col items-center p-4 lg:p-6 xl:p-8 rounded-xl transition-all duration-300 ${
                            isActive
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 transform scale-105 shadow-lg'
                              : isCompleted
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                          }`}
                        >
                          <StepIcon className={`h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 mb-3 lg:mb-4 flex-shrink-0 ${isActive ? 'animate-bounce' : ''}`} />
                          <span className="text-sm lg:text-base xl:text-lg text-center font-medium leading-tight">
                            {step.text.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-8 lg:space-y-12">
              
              <Card className="shadow-xl border-2 h-fit overflow-hidden">
                <CardHeader className="pb-6 lg:pb-8">
                  <CardTitle className="text-xl lg:text-2xl xl:text-3xl flex items-center gap-3 lg:gap-4">
                    <Users className="h-6 w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10 flex-shrink-0" />
                    <span className="truncate">Languages Compared</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 lg:space-y-6">
                    {selectedLanguages.map((lang: string) => (
                      <div key={lang} className="flex items-center justify-between p-4 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl min-w-0">
                        <span className="font-medium text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-gray-300 truncate flex-1 mr-4">
                          {lang.toUpperCase()}
                        </span>
                        <Badge variant="outline" className="text-sm lg:text-base px-3 lg:px-4 py-1 lg:py-2 flex-shrink-0">
                          Wikipedia
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {isPremium && premiumOptions && (
                <Card className="shadow-xl border-2 h-fit overflow-hidden">
                  <CardHeader className="pb-6 lg:pb-8">
                    <CardTitle className="text-xl lg:text-2xl xl:text-3xl flex items-center gap-3 lg:gap-4">
                      <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10 flex-shrink-0" />
                      <span className="truncate">Premium Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 lg:space-y-6">
                    <div className="text-base lg:text-lg xl:text-xl space-y-3 lg:space-y-4">
                      <div className="flex justify-between items-center min-w-0">
                        <span className="text-gray-600 dark:text-gray-400 flex-shrink-0 mr-4">Format:</span>
                        <span className="font-medium capitalize truncate">{premiumOptions.outputFormat}</span>
                      </div>
                      <div className="flex justify-between items-center min-w-0">
                        <span className="text-gray-600 dark:text-gray-400 flex-shrink-0 mr-4">Style:</span>
                        <span className="font-medium capitalize truncate">{premiumOptions.formality}</span>
                      </div>
                      <div className="flex justify-between items-center min-w-0">
                        <span className="text-gray-600 dark:text-gray-400 flex-shrink-0 mr-4">Mode:</span>
                        <span className="font-medium capitalize truncate">{premiumOptions.analysisMode}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-xl border-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 h-fit overflow-hidden">
                <CardContent className="p-6 lg:p-8 xl:p-10">
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl xl:text-6xl mb-4 lg:mb-6">💡</div>
                    <h3 className="font-bold text-xl lg:text-2xl xl:text-3xl mb-4 lg:mb-6 text-gray-900 dark:text-white">
                      Did You Know?
                    </h3>
                    <p className="text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
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
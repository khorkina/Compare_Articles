import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, type LanguageLink } from '@/lib/api';
import { getLanguageName, getLanguageNativeName, SUPPORTED_LANGUAGES, searchLanguages } from '@/lib/languages';
import { clientStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { PlanSelection } from '@/components/plan-selection';
import { PremiumComparisonOptions, type ComparisonOptions } from '@/components/premium-comparison-options';

export default function LanguageSelection() {
  const [match, params] = useRoute('/select-languages');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const title = params ? decodeURIComponent(new URLSearchParams(window.location.search).get('title') || '') : '';
  const language = params ? new URLSearchParams(window.location.search).get('lang') || 'en' : 'en';
  
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([language]);
  const [outputLanguage, setOutputLanguage] = useState('en');
  const [languageSearchQuery, setLanguageSearchQuery] = useState('');
  
  // Set output language based on user's browser language preference on component mount
  useEffect(() => {
    const getUserLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      // Check if browser language is supported, otherwise default to English
      const supportedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
      return supportedLang ? browserLang : 'en';
    };
    
    setOutputLanguage(getUserLanguage());
  }, []);
  const [currentMode, setCurrentMode] = useState<'academic' | 'funny' | 'biography' | null>(null);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [showPremiumOptions, setShowPremiumOptions] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium' | null>(null);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<{ isValid: boolean; daysRemaining?: number }>({ isValid: false });

  // Check subscription status on page load
  useEffect(() => {
    const checkSubscription = async () => {
      const status = await clientStorage.checkSubscriptionStatus();
      setUserSubscriptionStatus(status);
    };
    checkSubscription();
  }, []);

  // Fetch available language links
  const languageLinksQuery = useQuery({
    queryKey: ['/api/wikipedia/languages', title, language],
    queryFn: () => api.getLanguageLinks(title, language),
    enabled: !!title,
  });

  // Comparison mutation supporting both free and premium plans
  const comparisonMutation = useMutation({
    mutationFn: async ({ articleTitle, selectedLanguages, outputLanguage, isFunnyMode, isPremium, premiumOptions }: {
      articleTitle: string;
      selectedLanguages: string[];
      outputLanguage: string;
      isFunnyMode?: boolean;
      isPremium?: boolean;
      premiumOptions?: ComparisonOptions;
    }) => {
      console.log(`Starting ${isPremium ? 'premium' : 'free'} comparison process...`);
      
      // Get language-specific article titles
      const languageTitles: Record<string, string> = {};
      const availableLinks = languageLinksQuery.data || [];
      
      // Add the base language
      languageTitles[language] = title;
      
      // Map selected languages to their article titles
      for (const selectedLang of selectedLanguages) {
        if (selectedLang === language) {
          languageTitles[selectedLang] = title;
        } else {
          const langLink = availableLinks.find(link => link.lang === selectedLang);
          if (langLink) {
            languageTitles[selectedLang] = langLink.title;
          }
        }
      }

      return api.compareArticles({
        articleTitle,
        selectedLanguages,
        outputLanguage,
        baseLanguage: language,
        isFunnyMode,
        languageTitles,
        isPremium
      });
    },
    onSuccess: (result) => {
      // Navigate to results page
      setLocation(`/results/${result.id}`);
    },
    onError: (error: Error) => {
      console.error('Comparison error:', error);
      toast({
        title: "Comparison Failed",
        description: error.message || "An error occurred during comparison",
        variant: "destructive"
      });
    }
  });

  const handleLanguageToggle = (langCode: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(langCode)) {
        // Don't allow removing the search language (base language)
        if (langCode === language) {
          toast({
            title: "Cannot Remove Search Language",
            description: `${getLanguageName(language)} is the search language and cannot be removed from comparison`,
            variant: "destructive"
          });
          return prev;
        }
        // Remove language if it's not the base language
        return prev.filter(l => l !== langCode);
      } else {
        // Don't allow more than 5 languages
        if (prev.length >= 5) {
          toast({
            title: "Maximum Languages Reached",
            description: "You can select up to 5 languages for comparison",
            variant: "destructive"
          });
          return prev;
        }
        // Add the language
        return [...prev, langCode];
      }
    });
  };

  const handleCompare = async (isFunnyMode: boolean = false) => {
    if (selectedLanguages.length < 2) {
      toast({
        title: "Select More Languages",
        description: "Please select at least 2 languages to compare",
        variant: "destructive"
      });
      return;
    }

    // Check subscription status
    const subscriptionStatus = await clientStorage.checkSubscriptionStatus();
    setUserSubscriptionStatus(subscriptionStatus);
    const isPremium = subscriptionStatus.isValid;

    // Premium users MUST configure their comparison settings first
    if (isPremium) {
      setShowPremiumOptions(true);
      toast({
        title: "Premium Settings Required",
        description: "Please configure your premium comparison options before starting",
        variant: "default"
      });
      return;
    }

    // For free users, navigate to loading page
    // Build language titles mapping
    const languageTitles: Record<string, string> = {};
    const availableLinks = languageLinksQuery.data || [];
    
    // Add the base language
    languageTitles[language] = title;
    
    // Map selected languages to their article titles
    for (const selectedLang of selectedLanguages) {
      if (selectedLang === language) {
        languageTitles[selectedLang] = title;
      } else {
        const langLink = availableLinks.find(link => link.lang === selectedLang);
        if (langLink) {
          languageTitles[selectedLang] = langLink.title;
        }
      }
    }

    const params = new URLSearchParams({
      title,
      languages: JSON.stringify(selectedLanguages),
      outputLanguage,
      isFunnyMode: isFunnyMode.toString(),
      isPremium: 'false',
      languageTitles: JSON.stringify(languageTitles)
    });
    setLocation(`/comparison-loading?${params.toString()}`);
  };

  const handlePremiumComparisonStart = (options: ComparisonOptions) => {
    setShowPremiumOptions(false);
    
    // Build language titles mapping for premium
    const languageTitles: Record<string, string> = {};
    const availableLinks = languageLinksQuery.data || [];
    
    // Add the base language
    languageTitles[language] = title;
    
    // Map selected languages to their article titles
    for (const selectedLang of selectedLanguages) {
      if (selectedLang === language) {
        languageTitles[selectedLang] = title;
      } else {
        const langLink = availableLinks.find(link => link.lang === selectedLang);
        if (langLink) {
          languageTitles[selectedLang] = langLink.title;
        }
      }
    }
    
    // Navigate to loading page for premium comparison
    const params = new URLSearchParams({
      title,
      languages: JSON.stringify(selectedLanguages),
      outputLanguage,
      isFunnyMode: (options.analysisMode === 'funny').toString(),
      isPremium: (options.aiModel === 'premium').toString(),
      languageTitles: JSON.stringify(languageTitles),
      premiumOptions: JSON.stringify(options)
    });
    setLocation(`/comparison-loading?${params.toString()}`);
  };

  const handleUpgradeToPremium = () => {
    setShowPlanSelection(true);
  };

  const handlePlanSelected = async (isPremium: boolean) => {
    setShowPlanSelection(false);
    
    if (isPremium) {
      // Check if user already has premium subscription
      const subscriptionStatus = await clientStorage.checkSubscriptionStatus();
      if (!subscriptionStatus.isValid) {
        // User selected premium but doesn't have active subscription
        // PlanSelection component will handle redirect to payment
        return;
      }
    }
  };

  const availableLanguages = languageLinksQuery.data || [];
  
  // Show ALL supported languages, not just the ones Wikipedia reports as available
  // We'll merge the available languages with all supported languages
  const allLanguagesForSelection = SUPPORTED_LANGUAGES.map(lang => {
    const existingLink = availableLanguages.find(link => link.lang === lang.code);
    return {
      lang: lang.code,
      title: existingLink?.title || title, // Use original title if no specific version exists
      url: existingLink?.url || `https://${lang.code}.wikipedia.org/wiki/${encodeURIComponent(title)}`
    };
  });
  
  // Ensure the search language is always included first
  const searchLanguageEntry = {
    lang: language,
    title: title,
    url: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(title)}`
  };
  
  // Create final list with search language first, then others (excluding duplicates)
  let supportedAvailableLanguages = [
    searchLanguageEntry,
    ...allLanguagesForSelection.filter(lang => lang.lang !== language)
  ];
  
  // Filter languages based on search query
  if (languageSearchQuery.trim()) {
    const searchResults = searchLanguages(languageSearchQuery);
    const searchCodes = searchResults.map(lang => lang.code);
    
    // Keep search language first, then filter others based on search
    supportedAvailableLanguages = [
      searchLanguageEntry,
      ...supportedAvailableLanguages.filter(lang => 
        lang.lang !== language && searchCodes.includes(lang.lang)
      )
    ];
  }

  if (!title) {
    return <div>Loading...</div>;
  }

  // Show plan selection when user clicks compare
  if (showPlanSelection) {
    return (
      <PlanSelection
        onPlanSelected={handlePlanSelected}
        selectedLanguages={selectedLanguages}
        articleTitle={title}
      />
    );
  }

  // Show premium comparison options for premium users
  if (showPremiumOptions) {
    return (
      <main className="lg:col-span-3">
        <PremiumComparisonOptions
          selectedLanguages={selectedLanguages}
          articleTitle={title}
          outputLanguage={outputLanguage}
          onStartComparison={handlePremiumComparisonStart}
          onBack={() => setShowPremiumOptions(false)}
        />
      </main>
    );
  }

  return (
    <main className="lg:col-span-3">
      {/* Article Header */}
      <div className="wiki-content-section mb-6">
        <h1 className="wiki-article-title text-2xl font-bold mb-2">{title}</h1>
        <p className="text-wiki-gray mb-4">
          Select languages to compare and analyze cultural perspectives
        </p>
        
        {/* Service Notice */}
        {userSubscriptionStatus.isValid ? (
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
            <p className="text-green-800 text-sm">
              <i className="fas fa-crown mr-2"></i>
              <strong>Premium Plan Active:</strong> Advanced AI analysis with full article processing 
              {userSubscriptionStatus.daysRemaining && (
                <span className="ml-2 text-xs">({userSubscriptionStatus.daysRemaining} days remaining)</span>
              )}
            </p>
            <p className="text-green-700 text-xs mt-1">
              <i className="fas fa-cog mr-1"></i>
              Click any analysis button below to configure your premium comparison settings
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-blue-800 text-sm">
                <i className="fas fa-check-circle mr-2"></i>
                <strong>Free Analysis:</strong> Unlimited comparisons with AI
              </p>
              <Button 
                onClick={handleUpgradeToPremium}
                size="sm"
                variant="outline"
                className="ml-4 text-xs"
              >
                <i className="fas fa-crown mr-1"></i>
                Upgrade to Premium
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Language Selection Section */}
      <div className="wiki-content-section mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="wiki-section-title text-xl font-semibold">
            Select Languages for Comparison
          </h2>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedLanguages.length >= 2 && selectedLanguages.length <= 5 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {selectedLanguages.length}/5 languages selected
            </div>
            <div className="text-xs text-gray-600">
              Choose 2-5 languages to compare
            </div>
          </div>
        </div>
        
        {selectedLanguages.length < 2 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-blue-800 text-sm">
              <i className="fas fa-info-circle mr-2"></i>
              <strong>Getting Started:</strong> Please select at least 2 languages to compare Wikipedia articles and discover cultural differences.
            </p>
          </div>
        )}
        
        {selectedLanguages.length > 5 && (
          <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
            <p className="text-amber-800 text-sm">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              <strong>Maximum Reached:</strong> Please select no more than 5 languages for optimal comparison quality.
            </p>
          </div>
        )}
        
        {languageLinksQuery.isLoading && (
          <div className="space-y-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-12 rounded"></div>
            ))}
          </div>
        )}
        
        {languageLinksQuery.error && (
          <div className="wiki-message wiki-message-error mb-4">
            Failed to load language options. Please try again.
          </div>
        )}
        
        {supportedAvailableLanguages.length === 0 && !languageLinksQuery.isLoading && !languageLinksQuery.error && (
          <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-4">
            <p className="text-amber-800 text-sm">
              <i className="fas fa-info-circle mr-2"></i>
              <strong>Single Language Article:</strong> This article is only available in {getLanguageName(language)} ({getLanguageNativeName(language)}).
            </p>
            <p className="text-amber-700 text-xs mt-1">
              Wikipedia comparison requires at least 2 different language versions of the same article.
            </p>
          </div>
        )}

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-3">
            <i className="fas fa-info-circle mr-1"></i>
            All 270+ Wikipedia languages are available for selection. If an article doesn't exist in a selected language, the comparison will note this.
          </div>
          
          {/* Language Search */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for a language (e.g., French, Español, Русский)..."
              value={languageSearchQuery}
              onChange={(e) => setLanguageSearchQuery(e.target.value)}
              className="wiki-input pr-10"
            />
            <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            {languageSearchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguageSearchQuery('')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              >
                <i className="fas fa-times text-xs"></i>
              </Button>
            )}
          </div>
          
          {languageSearchQuery && (
            <div className="text-xs text-gray-500 mt-1">
              Showing {supportedAvailableLanguages.length - 1} languages matching "{languageSearchQuery}"
            </div>
          )}
        </div>

        {supportedAvailableLanguages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {supportedAvailableLanguages.map((link) => {
              const isSearchLanguage = link.lang === language;
              const isSelected = selectedLanguages.includes(link.lang);
              const hasConfirmedArticle = availableLanguages.some(avail => avail.lang === link.lang);
              
              return (
                <div 
                  key={link.lang} 
                  className={`wiki-sidebar p-3 flex items-center space-x-3 ${
                    isSearchLanguage ? 'border-2 border-blue-200 bg-blue-50' : ''
                  }`}
                >
                  <Checkbox
                    id={link.lang}
                    checked={isSelected}
                    disabled={isSearchLanguage}
                    onCheckedChange={() => handleLanguageToggle(link.lang)}
                  />
                  <label htmlFor={link.lang} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{getLanguageName(link.lang)}</span>
                      {isSearchLanguage && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Search Language
                        </span>
                      )}
                      {!isSearchLanguage && hasConfirmedArticle && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Article Available
                        </span>
                      )}
                      {!isSearchLanguage && !hasConfirmedArticle && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          Try Language
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-wiki-gray">{getLanguageNativeName(link.lang)}</div>
                    {isSearchLanguage && (
                      <div className="text-xs text-blue-600 mt-1">
                        This language is automatically included in your comparison
                      </div>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison Settings */}
      <div className="wiki-content-section mb-6">
        <h2 className="wiki-section-title text-xl font-semibold mb-4">Comparison Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Selected Languages ({selectedLanguages.length})
            </label>
            {selectedLanguages.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedLanguages.map(lang => (
                  <span key={lang} className="wiki-tag bg-wiki-blue text-white px-2 py-1 rounded text-sm">
                    {getLanguageName(lang)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-wiki-gray text-sm">No languages selected</p>
            )}
            {selectedLanguages.length < 2 && (
              <p className="text-amber-600 text-sm">Select at least 2 languages to compare</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Output Language</label>
            <Select value={outputLanguage} onValueChange={setOutputLanguage}>
              <SelectTrigger className="wiki-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Comparison Actions */}
      <div className="wiki-content-section mb-6">
        <h2 className="wiki-section-title text-xl font-semibold mb-4">Start Analysis</h2>
        
        <div className="space-y-3">
          <Button 
            onClick={() => handleCompare(false)}
            disabled={selectedLanguages.length < 2 || comparisonMutation.isPending}
            className="w-full wiki-button-primary"
          >
            {currentMode === 'academic' && comparisonMutation.isPending ? (
              <span>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Analyzing Articles...
              </span>
            ) : (
              <span>
                <i className="fas fa-search mr-2"></i>
                {userSubscriptionStatus.isValid ? 'Configure Premium Analysis' : 'Start Academic Analysis'}
              </span>
            )}
          </Button>

          <Button 
            onClick={() => handleCompare(true)}
            disabled={selectedLanguages.length < 2 || comparisonMutation.isPending}
            className="w-full wiki-button-secondary"
          >
            {currentMode === 'funny' && comparisonMutation.isPending ? (
              <span>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Creating Fun Analysis...
              </span>
            ) : (
              <span>
                <i className="fas fa-smile mr-2"></i>
                {userSubscriptionStatus.isValid ? 'Configure Fun Analysis' : 'Fun Mode Analysis'}
              </span>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
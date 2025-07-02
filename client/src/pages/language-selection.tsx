import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, type LanguageLink } from '@/lib/api';
import { getLanguageName, getLanguageNativeName, SUPPORTED_LANGUAGES } from '@/lib/languages';
import { clientStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function LanguageSelection() {
  const [match, params] = useRoute('/select-languages');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const title = params ? decodeURIComponent(new URLSearchParams(window.location.search).get('title') || '') : '';
  const language = params ? new URLSearchParams(window.location.search).get('lang') || 'en' : 'en';
  
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([language]);
  const [outputLanguage, setOutputLanguage] = useState('en');
  const [currentMode, setCurrentMode] = useState<'academic' | 'funny' | null>(null);

  // Fetch available language links
  const languageLinksQuery = useQuery({
    queryKey: ['/api/wikipedia/languages', title, language],
    queryFn: () => api.getLanguageLinks(title, language),
    enabled: !!title,
  });

  // Comparison mutation using OpenRouter (free for all users)
  const comparisonMutation = useMutation({
    mutationFn: async ({ articleTitle, selectedLanguages, outputLanguage, isFunnyMode }: {
      articleTitle: string;
      selectedLanguages: string[];
      outputLanguage: string;
      isFunnyMode?: boolean;
    }) => {
      console.log('Starting free comparison process...');
      
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
        languageTitles
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
        return prev.filter(l => l !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
  };

  const handleCompare = (isFunnyMode: boolean = false) => {
    if (selectedLanguages.length < 2) {
      toast({
        title: "Select More Languages",
        description: "Please select at least 2 languages to compare",
        variant: "destructive"
      });
      return;
    }

    setCurrentMode(isFunnyMode ? 'funny' : 'academic');
    
    comparisonMutation.mutate({
      articleTitle: title,
      selectedLanguages,
      outputLanguage,
      isFunnyMode
    }, {
      onSettled: () => {
        setCurrentMode(null);
      }
    });
  };

  const availableLanguages = languageLinksQuery.data || [];
  const supportedAvailableLanguages = availableLanguages.filter(link => 
    SUPPORTED_LANGUAGES.some(lang => lang.code === link.lang)
  );

  if (!title) {
    return <div>Loading...</div>;
  }

  return (
    <main className="lg:col-span-3">
      {/* Article Header */}
      <div className="wiki-content-section mb-6">
        <h1 className="wiki-article-title text-2xl font-bold mb-2">{title}</h1>
        <p className="text-wiki-gray mb-4">
          Select languages to compare and analyze cultural perspectives
        </p>
        
        {/* Free Service Notice */}
        <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
          <p className="text-green-800 text-sm">
            <i className="fas fa-check-circle mr-2"></i>
            <strong>Completely Free:</strong> Unlimited comparisons powered by AI
          </p>
        </div>
      </div>

      {/* Language Selection Section */}
      <div className="wiki-content-section mb-6">
        <h2 className="wiki-section-title text-xl font-semibold mb-4">
          Available Languages ({supportedAvailableLanguages.length})
        </h2>
        
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
        
        {supportedAvailableLanguages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {supportedAvailableLanguages.map((link) => (
              <div key={link.lang} className="wiki-sidebar p-3 flex items-center space-x-3">
                <Checkbox
                  id={link.lang}
                  checked={selectedLanguages.includes(link.lang)}
                  onCheckedChange={() => handleLanguageToggle(link.lang)}
                />
                <label htmlFor={link.lang} className="flex-1 cursor-pointer">
                  <div className="font-medium">{getLanguageName(link.lang)}</div>
                  <div className="text-sm text-wiki-gray">{getLanguageNativeName(link.lang)}</div>
                </label>
              </div>
            ))}
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
                Start Academic Analysis
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
                Fun Mode Analysis
              </span>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
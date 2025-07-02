import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Globe, ArrowRight } from 'lucide-react';
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

    comparisonMutation.mutate({
      articleTitle: title,
      selectedLanguages,
      outputLanguage,
      isFunnyMode
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compare: {title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Select languages to compare and discover cultural perspectives
          </p>
          
          {/* Free Service Banner */}
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-green-800">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">Completely Free Service</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              No subscription required • Unlimited comparisons • Powered by OpenRouter.ai
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Language Selection */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Available Languages ({supportedAvailableLanguages.length})
              </h2>
              
              {languageLinksQuery.isLoading && (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-8 rounded"></div>
                  ))}
                </div>
              )}
              
              {languageLinksQuery.error && (
                <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                  Failed to load language options. Please try again.
                </div>
              )}
              
              {supportedAvailableLanguages.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {supportedAvailableLanguages.map((link) => (
                    <div key={link.lang} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <Checkbox
                        id={link.lang}
                        checked={selectedLanguages.includes(link.lang)}
                        onCheckedChange={() => handleLanguageToggle(link.lang)}
                      />
                      <label htmlFor={link.lang} className="flex-1 cursor-pointer">
                        <div className="font-medium">{getLanguageName(link.lang)}</div>
                        <div className="text-sm text-gray-500">{getLanguageNativeName(link.lang)}</div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Settings */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Comparison Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Selected Languages ({selectedLanguages.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguages.map(lang => (
                      <span key={lang} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {getLanguageName(lang)}
                      </span>
                    ))}
                  </div>
                  {selectedLanguages.length < 2 && (
                    <p className="text-sm text-amber-600 mt-1">Select at least 2 languages</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Output Language</label>
                  <Select value={outputLanguage} onValueChange={setOutputLanguage}>
                    <SelectTrigger>
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

                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={() => handleCompare(false)}
                    disabled={selectedLanguages.length < 2 || comparisonMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {comparisonMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analyzing Articles...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Start Academic Analysis
                      </div>
                    )}
                  </Button>

                  <Button 
                    onClick={() => handleCompare(true)}
                    disabled={selectedLanguages.length < 2 || comparisonMutation.isPending}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    {comparisonMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        Creating Fun Analysis...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        😄 Fun Mode Analysis
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
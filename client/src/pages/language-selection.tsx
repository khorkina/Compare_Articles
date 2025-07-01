import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, CreditCard } from 'lucide-react';
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
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    isPremium: boolean;
    isValid: boolean;
    daysRemaining: number;
  }>({ isPremium: false, isValid: false, daysRemaining: 0 });

  // Fetch available language links
  const languageLinksQuery = useQuery({
    queryKey: ['/api/wikipedia/languages', title, language],
    queryFn: () => api.getLanguageLinks(title, language),
    enabled: !!title,
  });

  // Load subscription status
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const info = await clientStorage.getSubscriptionInfo();
        setSubscriptionInfo(info);
      } catch (error) {
        console.error('Error loading subscription:', error);
      }
    };
    loadSubscription();
  }, []);

  const handleSubscribe = async () => {
    try {
      // Generate unique payment reference
      const user = await clientStorage.getCurrentUser();
      const timestamp = Date.now();
      const paymentRef = `wt_${user.id.slice(0, 8)}_${timestamp}`;
      
      // Create payment session via our server (which will integrate with Smart Glocal properly)
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 100, // $1.00 in cents
          currency: 'USD',
          orderId: paymentRef,
          customerId: user.id,
          description: 'Wiki Truth Premium Subscription (30 days)',
          returnUrl: `${window.location.origin}/thank-you`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment session creation failed:', error);
      // For now, redirect to a simple payment page as fallback
      window.location.href = '/thank-you?demo=true';
    }
  };

  // Comparison mutation
  const comparisonMutation = useMutation({
    mutationFn: (isFunnyMode: boolean) => {
      // Create language titles mapping
      const languageTitles: Record<string, string> = {};
      selectedLanguages.forEach(lang => {
        const langLink = languageLinksQuery.data?.find(link => link.lang === lang);
        languageTitles[lang] = langLink?.title || title;
      });

      console.log('Language titles mapping:', languageTitles);
      console.log('Selected languages:', selectedLanguages);
      console.log('Available language links:', languageLinksQuery.data);

      return api.compareArticles({
        articleTitle: title,
        selectedLanguages,
        outputLanguage,
        baseLanguage: language,
        isFunnyMode,
        languageTitles
      });
    },
    onSuccess: (result) => {
      setLocation(`/comparison/${result.id}`);
    },
    onError: (error) => {
      toast({
        title: "Comparison Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLanguageToggle = (langCode: string, checked: boolean) => {
    if (checked) {
      if (selectedLanguages.length >= 5) {
        toast({
          title: "Maximum Languages",
          description: "Please select maximum 5 languages for comparison.",
          variant: "destructive",
        });
        return;
      }
      setSelectedLanguages(prev => [...prev, langCode]);
    } else {
      if (selectedLanguages.length <= 2) {
        toast({
          title: "Minimum Languages",
          description: "Please select at least 2 languages for comparison.",
          variant: "destructive",
        });
        return;
      }
      setSelectedLanguages(prev => prev.filter(lang => lang !== langCode));
    }
  };

  const handleCompare = (isFunnyMode: boolean = false) => {
    if (selectedLanguages.length < 2) {
      toast({
        title: "Insufficient Languages",
        description: "Please select at least 2 languages for comparison.",
        variant: "destructive",
      });
      return;
    }
    
    comparisonMutation.mutate(isFunnyMode);
  };

  if (!title) {
    return (
      <main className="lg:col-span-3">
        <div className="wiki-content-section">
          <h2 className="font-bold text-2xl mb-4">No Article Selected</h2>
          <p className="text-wiki-gray mb-4">Please go back and select an article to compare.</p>
          <Button onClick={() => setLocation('/')} className="wiki-button">
            Back to Search
          </Button>
        </div>
      </main>
    );
  }

  // Show subscription gate if user doesn't have valid subscription
  if (!subscriptionInfo.isValid) {
    return (
      <main className="lg:col-span-3">
        <div className="wiki-content-section">
          <Card className="border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardContent className="p-8 text-center">
              <Crown className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Feature</h2>
              <p className="text-gray-700 mb-6">
                Wikipedia comparisons require a premium subscription to access our AI-powered analysis features.
              </p>
              
              <div className="bg-white rounded-lg p-4 mb-6 border border-amber-200">
                <h3 className="font-semibold text-gray-900 mb-3">What you'll get:</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>✓ Unlimited Wikipedia article comparisons</div>
                  <div>✓ AI-powered cultural analysis</div>
                  <div>✓ Advanced export features</div>
                  <div>✓ Priority processing</div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">$1/month</div>
                <div className="text-sm text-gray-600">30-day subscription period</div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Subscribe Now
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/')}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const availableLanguages = languageLinksQuery.data || [];
  const allLanguages = [
    { lang: language, title, url: '' },
    ...availableLanguages
  ].filter((lang, index, self) => 
    index === self.findIndex(l => l.lang === lang.lang)
  );

  return (
    <main className="lg:col-span-3">
      <div className="wiki-content-section">
        <h2 className="font-bold text-2xl mb-6">Select Language Versions to Compare</h2>
        
        {/* Selected Article Info */}
        <div className="mb-6 p-4 bg-wiki-light-gray border border-wiki-light-border rounded">
          <h3 className="font-semibold mb-2">Selected Article:</h3>
          <div className="text-wiki-blue font-semibold">{title}</div>
          <div className="text-sm text-wiki-gray">
            Source language: {getLanguageName(language)}
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">
            Available Language Versions (select 2-5):
          </h3>
          
          {languageLinksQuery.isLoading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-2xl text-wiki-gray mb-2"></i>
              <p className="text-wiki-gray">Loading available languages...</p>
            </div>
          ) : allLanguages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-wiki-gray">No additional language versions found for this article.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allLanguages.map((lang) => (
                <label
                  key={lang.lang}
                  className="flex items-center p-3 border border-wiki-light-border rounded hover:bg-wiki-light-gray cursor-pointer"
                >
                  <Checkbox
                    checked={selectedLanguages.includes(lang.lang)}
                    onCheckedChange={(checked) => 
                      handleLanguageToggle(lang.lang, checked as boolean)
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">
                      {getLanguageNativeName(lang.lang)}
                    </div>
                    <div className="text-sm text-wiki-gray">
                      {getLanguageName(lang.lang)}
                    </div>
                    <div className="text-xs text-wiki-gray truncate">
                      {lang.title}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Output Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Output language for comparison:
          </label>
          <Select value={outputLanguage} onValueChange={setOutputLanguage}>
            <SelectTrigger className="wiki-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => handleCompare(false)}
            className="wiki-button-primary flex-1"
            disabled={comparisonMutation.isPending || selectedLanguages.length < 2}
          >
            {comparisonMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Comparing Articles...
              </>
            ) : (
              <>
                <i className="fas fa-chart-line mr-2"></i>
                Compare Articles
              </>
            )}
          </Button>
          
          <Button
            onClick={() => handleCompare(true)}
            className="funny-mode flex-1 text-white border-none"
            disabled={comparisonMutation.isPending || selectedLanguages.length < 2}
          >
            <i className="fas fa-laugh mr-2"></i>
            Funny Mode
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="wiki-link"
          >
            ← Back to Search
          </Button>
        </div>
      </div>
    </main>
  );
}

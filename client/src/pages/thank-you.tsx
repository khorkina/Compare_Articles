import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { CheckCircle, ArrowRight, Sparkles, Globe, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { clientStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function ThankYou() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionActivated, setSubscriptionActivated] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    // Check if this is a premium subscription activation
    const urlParams = new URLSearchParams(window.location.search);
    const premiumParam = urlParams.get('premium');
    
    if (premiumParam === 'true') {
      // Activate premium subscription
      activatePremiumSubscription();
    }

    // Remove confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const activatePremiumSubscription = async () => {
    try {
      await clientStorage.activatePremiumSubscription();
      setIsPremium(true);
      setSubscriptionActivated(true);
      toast({
        title: "Premium Activated!",
        description: "Your premium subscription is now active for 30 days.",
      });
    } catch (error) {
      toast({
        title: "Activation Error",
        description: "There was an issue activating your premium subscription.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="lg:col-span-3">
      <div className="wiki-content-section">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/20 to-transparent animate-pulse"></div>
          </div>
        )}
        
        <div className="text-center py-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-500" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
          </div>

          {isPremium ? (
            <>
              <div className="flex justify-center items-center gap-2 mb-4">
                <Crown className="h-8 w-8 text-green-500" />
                <Badge className="bg-lime-200 text-lime-800 px-3 py-1 text-lg font-semibold">
                  PREMIUM ACTIVATED
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to WikiTruth Premium!
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Your premium subscription is now active with enhanced AI analysis
              </p>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8 max-w-xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Zap className="h-6 w-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-green-800">
                    Premium Features Unlocked
                  </h2>
                </div>
                <div className="space-y-2 text-green-700">
                  <p>⭐ Advanced AI analysis</p>
                  <p>⭐ Full Wikipedia articles (no size limits)</p>
                  <p>⭐ Enhanced document processing</p>
                  <p>⭐ Priority processing speed</p>
                  <p>⭐ Advanced cultural insights</p>
                  <p>⭐ Detailed comparative reports</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to WikiTruth!
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Your free Wikipedia comparison service is ready to use
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Globe className="h-6 w-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-green-800">
                    Free Plan Active
                  </h2>
                </div>
                <div className="space-y-2 text-green-700">
                  <p>✅ AI-powered analysis</p>
                  <p>✅ Multi-language comparisons</p>
                  <p>✅ Academic and fun mode</p>
                  <p>✅ No registration required</p>
                  <p>✅ Privacy-first design</p>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">
                <ArrowRight className="mr-2 h-5 w-5" />
                Start Comparing Articles
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                Browse Wikipedia
              </Link>
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            All your data stays in your browser. We respect your privacy.
          </p>
        </div>
      </div>
    </main>
  );
}
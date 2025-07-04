import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Globe, Calendar, AlertTriangle, Sparkles } from 'lucide-react';
import { clientStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export function SubscriptionStatus() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isValid: boolean;
    daysRemaining?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const status = await clientStorage.checkSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    // Simulate Smart Glocal payment demo (3 second delay)
    const returnUrl = encodeURIComponent(window.location.origin + "/thank-you?premium=true");
    setTimeout(() => {
      window.location.href = window.location.origin + "/thank-you?premium=true";
    }, 3000);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionStatus) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {subscriptionStatus.isValid ? (
              <>
                <Crown className="h-5 w-5 text-yellow-500" />
                Premium Plan
              </>
            ) : (
              <>
                <Globe className="h-5 w-5 text-blue-500" />
                Free Plan
              </>
            )}
          </CardTitle>
          <Badge variant={subscriptionStatus.isValid ? "default" : "secondary"} className={
            subscriptionStatus.isValid 
              ? "bg-green-100 text-green-800 border-green-300" 
              : "bg-gray-100 text-gray-800"
          }>
            {subscriptionStatus.isValid ? "ACTIVE" : "FREE"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {subscriptionStatus.isValid ? (
          <>
            <CardDescription className="mb-4">
              You have access to premium features including advanced AI analysis and unlimited article processing.
            </CardDescription>
            
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {subscriptionStatus.daysRemaining !== undefined ? (
                  subscriptionStatus.daysRemaining > 7 ? (
                    `${subscriptionStatus.daysRemaining} days remaining`
                  ) : (
                    <span className="text-orange-600 font-medium">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      {subscriptionStatus.daysRemaining} days remaining
                    </span>
                  )
                ) : (
                  "Subscription active"
                )}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Sparkles className="h-3 w-3" />
                <span>Advanced AI analysis</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Sparkles className="h-3 w-3" />
                <span>Full Wikipedia articles (no limits)</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Sparkles className="h-3 w-3" />
                <span>Priority processing</span>
              </div>
            </div>

            {subscriptionStatus.daysRemaining !== undefined && subscriptionStatus.daysRemaining <= 7 && (
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                Renew Subscription
              </Button>
            )}
          </>
        ) : (
          <>
            <CardDescription className="mb-4">
              You're using the free plan with Meta Llama analysis. Upgrade for enhanced features.
            </CardDescription>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Globe className="h-3 w-3" />
                <span>Meta Llama 3.1 analysis</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Globe className="h-3 w-3" />
                <span>Multi-language comparisons</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Globe className="h-3 w-3" />
                <span>Article truncation for large content</span>
              </div>
            </div>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium ($5/month)
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
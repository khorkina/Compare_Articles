import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { clientStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function ThankYou() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const activatePremium = async () => {
      try {
        // Set premium status with current timestamp
        await clientStorage.setPremiumStatus(true, new Date().toISOString());
        
        toast({
          title: "Premium Activated!",
          description: "Your subscription is now active for 30 days."
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error activating premium:', error);
        toast({
          title: "Activation Error",
          description: "There was an issue activating your premium subscription. Please contact support.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    activatePremium();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Activating your premium subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You for Subscribing!
            </h1>
            <p className="text-gray-600">
              Your premium subscription has been activated successfully.
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="font-semibold text-indigo-900">Premium Benefits</span>
            </div>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Unlimited Wikipedia comparisons</li>
              <li>• Priority AI processing</li>
              <li>• Advanced export features</li>
              <li>• 30-day subscription period</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full" size="lg">
                Start Comparing Articles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/settings">
              <Button variant="outline" className="w-full">
                View Subscription Details
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Your subscription will automatically expire after 30 days. 
            You can renew anytime from the Settings page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
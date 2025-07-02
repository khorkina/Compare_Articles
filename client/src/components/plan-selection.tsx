import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Sparkles, Globe, BookOpen, Zap, FileText, Shield } from "lucide-react";
import { clientStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface PlanSelectionProps {
  onPlanSelected: (isPremium: boolean) => void;
  selectedLanguages: string[];
  articleTitle: string;
}

export function PlanSelection({ onPlanSelected, selectedLanguages, articleTitle }: PlanSelectionProps) {
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFreePlan = () => {
    onPlanSelected(false);
  };

  const handlePremiumPlan = async () => {
    if (!isPolicyAccepted) {
      toast({
        title: "Policy Acceptance Required",
        description: "Please read and accept the subscription terms and policy.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Redirect to demo payment page (simulating Smart Glocal payment)
    const returnUrl = encodeURIComponent(window.location.origin + "/thank-you?premium=true");
    const paymentUrl = `https://httpbin.org/delay/3?return_url=${returnUrl}`;
    
    // For demo purposes, simulate successful payment after 3 seconds
    setTimeout(() => {
      window.location.href = window.location.origin + "/thank-you?premium=true";
    }, 3000);
  };

  const SubscriptionPolicy = () => (
    <div className="space-y-4 text-sm">
      <h4 className="font-semibold text-lg">Subscription Terms & Policy</h4>
      
      <div className="space-y-3">
        <div>
          <h5 className="font-medium text-wiki-blue">Browser-Based Subscription</h5>
          <p>Your premium subscription is tied to your unique browser ID and will only work in this specific browser on this device. If you clear browser data or switch devices, you'll need to purchase a new subscription.</p>
        </div>

        <div>
          <h5 className="font-medium text-wiki-blue">Billing & Duration</h5>
          <p>Premium subscription costs $5.00 USD per month. Your subscription is valid for 30 days from activation date. No automatic renewal - you'll need to manually renew before expiration.</p>
        </div>

        <div>
          <h5 className="font-medium text-wiki-blue">Premium Features</h5>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>OpenAI GPT-4o analysis instead of free Meta Llama model</li>
            <li>Process full Wikipedia articles without size limits</li>
            <li>Advanced document analysis capabilities</li>
            <li>Priority processing with faster response times</li>
            <li>Enhanced cultural insight analysis</li>
          </ul>
        </div>

        <div>
          <h5 className="font-medium text-wiki-blue">Data & Privacy</h5>
          <p>All your data remains stored locally in your browser. We don't store payment information or personal data on our servers. Your subscription status is tracked locally using your browser's unique identifier.</p>
        </div>

        <div>
          <h5 className="font-medium text-wiki-blue">Refund Policy</h5>
          <p>Due to the digital nature and browser-specific limitations of this service, all sales are final. No refunds are available. Please ensure you understand the browser-based limitations before purchasing.</p>
        </div>

        <div>
          <h5 className="font-medium text-wiki-blue">Support</h5>
          <p>For technical support, contact us through the Help section. Payment support is handled through Smart Glocal payment processor.</p>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <p className="text-xs text-gray-600">
          By accepting these terms, you acknowledge that you understand the browser-specific nature of this subscription service and agree to the no-refund policy.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Analysis Plan</h2>
        <p className="text-gray-600 mb-2">
          Comparing "{articleTitle}" across {selectedLanguages.length} languages
        </p>
        <p className="text-sm text-gray-500">
          Select the plan that best fits your needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Free Plan
              </CardTitle>
              <Badge variant="secondary">Always Free</Badge>
            </div>
            <CardDescription>
              Basic Wikipedia comparison powered by Meta Llama AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">$0<span className="text-sm font-normal text-gray-500">/month</span></div>
            
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Meta Llama 3.1 8B analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Up to 5 languages comparison</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Article truncation for large content</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Basic cultural insights</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Standard processing speed</span>
              </li>
            </ul>

            <Button 
              onClick={handleFreePlan}
              className="w-full"
              variant="outline"
            >
              Continue with Free Plan
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative border-2 border-yellow-300">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-yellow-400 text-black font-semibold px-3 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              PREMIUM
            </Badge>
          </div>
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Premium Plan
              </CardTitle>
              <Badge variant="default" className="bg-yellow-100 text-yellow-800">Recommended</Badge>
            </div>
            <CardDescription>
              Advanced analysis powered by OpenAI GPT-4o with full article processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">$5<span className="text-sm font-normal text-gray-500">/month</span></div>
            
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">OpenAI GPT-4o analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Full article processing (no limits)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Advanced document analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Enhanced cultural insights</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Priority processing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Detailed comparative reports</span>
              </li>
            </ul>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  <Shield className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Subscription Terms & Policy</DialogTitle>
                  <DialogDescription>
                    Please read and accept our subscription policy before proceeding.
                  </DialogDescription>
                </DialogHeader>
                
                <SubscriptionPolicy />
                
                <div className="flex items-start space-x-2 mt-6">
                  <Checkbox 
                    id="accept-policy" 
                    checked={isPolicyAccepted}
                    onCheckedChange={(checked) => setIsPolicyAccepted(checked === true)}
                  />
                  <label 
                    htmlFor="accept-policy" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have read and accept the subscription terms and policy
                  </label>
                </div>
                
                <Button 
                  onClick={handlePremiumPlan}
                  disabled={!isPolicyAccepted || isLoading}
                  className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  {isLoading ? "Redirecting to Payment..." : "Proceed to Payment ($5/month)"}
                </Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <FileText className="h-4 w-4" />
          <span>Both plans include text export and sharing features</span>
        </div>
      </div>
    </div>
  );
}
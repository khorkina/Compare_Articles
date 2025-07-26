import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Shield, Zap } from 'lucide-react';
import { clientStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface NowPaymentsWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NowPaymentsWidget({ isOpen, onClose, onSuccess }: NowPaymentsWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setPaymentCompleted(false);
      
      // Listen for payment completion messages from the iframe
      const handleMessage = async (event: MessageEvent) => {
        // Accept messages from nowpayments.io domain
        if (event.origin !== 'https://nowpayments.io') return;
        
        if (event.data?.type === 'payment_success') {
          setPaymentCompleted(true);
          setIsLoading(false);
          
          // Activate premium subscription
          try {
            await clientStorage.activatePremiumSubscription();
            toast({
              title: "Payment Successful!",
              description: "Your premium subscription has been activated.",
              variant: "default",
            });
            onSuccess?.();
          } catch (error) {
            console.error('Failed to activate premium subscription:', error);
            toast({
              title: "Payment Received",
              description: "Payment successful, but there was an issue activating your subscription. Please contact support.",
              variant: "destructive",
            });
          }
        } else if (event.data?.type === 'payment_error') {
          toast({
            title: "Payment Failed",
            description: "There was an issue processing your payment. Please try again.",
            variant: "destructive",
          });
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [isOpen, onSuccess, toast]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Unlock advanced AI analysis with GPT-4o and enhanced features for $5/month
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Premium Features Summary */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Premium Features</h4>
            <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
              <li>• Advanced GPT-4o AI analysis</li>
              <li>• Full article processing (no truncation)</li>
              <li>• Enhanced cultural insights</li>
              <li>• Priority support</li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="h-4 w-4" />
            <span>Secure payment processing via NowPayments</span>
          </div>

          {/* Payment Widget Container */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading payment options...</span>
                </div>
              </div>
            )}
            
            {paymentCompleted ? (
              <div className="text-center py-8 space-y-4">
                <div className="text-green-600 text-4xl">✓</div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your premium subscription has been activated.
                </p>
                <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                  Continue
                </Button>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src="https://nowpayments.io/embeds/payment-widget?iid=5894409417"
                width="100%"
                height="500"
                frameBorder="0"
                scrolling="no"
                onLoad={handleIframeLoad}
                className="rounded-lg border"
                style={{ 
                  minHeight: '500px',
                  overflow: 'hidden'
                }}
                title="NowPayments Widget"
              >
                <div className="flex items-center justify-center p-8 text-gray-600 dark:text-gray-400">
                  <CreditCard className="h-8 w-8 mr-2" />
                  <span>Unable to load payment widget. Please try again.</span>
                </div>
              </iframe>
            )}
          </div>

          {/* Cancel Button */}
          {!paymentCompleted && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
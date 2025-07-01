import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, Download, Trash2, Eye, EyeOff, Crown, Calendar, CreditCard } from 'lucide-react';
import { clientStorage, type UserAccount } from '@/lib/storage';
import { openaiClient } from '@/lib/openai-client';
import { useToast } from '@/hooks/use-toast';

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyValid, setKeyValid] = useState<boolean | null>(null);
  const [exportData, setExportData] = useState<string>('');
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    isPremium: boolean;
    isValid: boolean;
    daysRemaining: number;
    subscriptionDate?: string;
  }>({ isPremium: false, isValid: false, daysRemaining: 0 });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadUserData();
    }
  }, [open]);

  const loadUserData = async () => {
    try {
      const userData = await clientStorage.getCurrentUser();
      setUser(userData);
      setApiKey(userData.openaiApiKey || '');
      setKeyValid(userData.openaiApiKey ? true : null);
      
      const subInfo = await clientStorage.getSubscriptionInfo();
      setSubscriptionInfo(subInfo);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user settings",
        variant: "destructive"
      });
    }
  };

  const testApiKey = async (key: string) => {
    if (!key.trim()) {
      setKeyValid(null);
      return;
    }

    setIsTestingKey(true);
    try {
      const isValid = await openaiClient.testApiKey(key.trim());
      setKeyValid(isValid);
      
      if (!isValid) {
        toast({
          title: "Invalid API Key",
          description: "The provided OpenAI API key is not valid",
          variant: "destructive"
        });
      }
    } catch (error) {
      setKeyValid(false);
      toast({
        title: "API Key Test Failed",
        description: "Unable to validate the API key. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const saveApiKey = async () => {
    try {
      if (apiKey.trim()) {
        // Test the key before saving
        await testApiKey(apiKey.trim());
        if (keyValid === false) return;
      }

      await clientStorage.setOpenAIKey(apiKey.trim() || '');
      toast({
        title: "Settings Saved",
        description: apiKey.trim() ? "Your OpenAI API key has been saved securely in your browser" : "API key removed"
      });
      
      await loadUserData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive"
      });
    }
  };

  const testComparison = async () => {
    try {
      console.log('=== TESTING FULL COMPARISON FLOW ===');
      
      // Test API key retrieval
      const testKey = await clientStorage.getOpenAIKey();
      console.log('Retrieved API key:', testKey ? 'Found' : 'Missing');
      
      if (!testKey) {
        toast({
          title: "No API Key",
          description: "Please save your OpenAI API key first",
          variant: "destructive"
        });
        return;
      }
      
      // Test simple OpenAI call
      console.log('Testing OpenAI API call...');
      const testResponse = await fetch('/api/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: 'Say "Test successful"' }],
          max_tokens: 10,
          apiKey: testKey
        })
      });
      
      console.log('OpenAI response status:', testResponse.status);
      
      if (testResponse.ok) {
        const data = await testResponse.json();
        console.log('OpenAI test result:', data.choices[0].message.content);
        toast({
          title: "API Test Successful",
          description: "Your OpenAI API key is working correctly"
        });
      } else {
        const errorText = await testResponse.text();
        console.error('OpenAI error:', errorText);
        toast({
          title: "API Test Failed",
          description: "OpenAI API call failed. Check console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Test comparison failed:', error);
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const exportUserData = async () => {
    try {
      const data = await clientStorage.exportAllData();
      const jsonData = JSON.stringify(data, null, 2);
      setExportData(jsonData);
      
      // Create download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wiki-truth-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your data has been downloaded as a JSON file"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data",
        variant: "destructive"
      });
    }
  };

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
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive"
      });
      console.error('Payment session creation failed:', error);
    }
  };

  const clearAllData = async () => {
    if (!confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
      return;
    }

    try {
      await clientStorage.clearAllData();
      toast({
        title: "Data Cleared",
        description: "All your data has been permanently deleted"
      });
      setOpen(false);
      // Reload the page to reset the app state
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear data",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings & Privacy</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Account Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Account Information</h3>
            {user && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">User ID: {user.id.slice(0, 8)}...</Badge>
                  <Badge variant="outline">Created: {new Date(user.createdAt).toLocaleDateString()}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your account is stored securely in your browser's local storage. No personal data is sent to our servers.
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Subscription */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Premium Subscription
            </h3>
            
            {subscriptionInfo.isValid ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium Active
                    </Badge>
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      {subscriptionInfo.daysRemaining} days remaining
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-600" />
                      <span>Subscribed: {subscriptionInfo.subscriptionDate ? 
                        new Date(subscriptionInfo.subscriptionDate).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                    <div className="text-amber-700">
                      ✓ Unlimited Wikipedia comparisons<br/>
                      ✓ Priority AI processing<br/>
                      ✓ Advanced export features
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubscribe} 
                  variant="outline" 
                  className="w-full"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Renew Subscription ($1/month)
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <Crown className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Unlock Premium Features</h4>
                    <p className="text-sm text-gray-600">Get unlimited access to all comparison features</p>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-700 mb-4">
                    <div>✓ Unlimited Wikipedia comparisons</div>
                    <div>✓ Priority AI processing</div>
                    <div>✓ Advanced export features</div>
                    <div>✓ No rate limits</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">$1/month</div>
                    <div className="text-xs text-gray-500 mb-4">30-day subscription period</div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubscribe} 
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Subscribe for $1/month
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Secure payment powered by Smart Glocal. Cancel anytime.
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Data Management */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Data Management</h3>
            <div className="space-y-4">
              <div>
                <Button onClick={exportUserData} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Download all your comparisons, search history, and settings as a JSON file.
                </p>
              </div>
              
              <div>
                <Button onClick={clearAllData} variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Data
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Permanently delete your account and all associated data from this browser.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Privacy Notice */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Privacy & Security</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• All your data is stored locally in your browser using IndexedDB</p>
              <p>• No personal information is transmitted to our servers</p>
              <p>• Wikipedia content is fetched directly from Wikipedia's public API</p>
              <p>• OpenAI API calls are made directly from your browser (if you provide your own key)</p>
              <p>• You can export or delete your data at any time</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
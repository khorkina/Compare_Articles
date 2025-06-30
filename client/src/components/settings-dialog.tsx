import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, Download, Trash2, Eye, EyeOff } from 'lucide-react';
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

          {/* OpenAI API Key */}
          <div>
            <h3 className="text-lg font-semibold mb-3">OpenAI API Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  OpenAI API Key (Optional)
                </Label>
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setKeyValid(null);
                      }}
                      placeholder="sk-..."
                      className="pr-20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button 
                    onClick={() => testApiKey(apiKey)}
                    disabled={!apiKey.trim() || isTestingKey}
                    variant="outline"
                  >
                    {isTestingKey ? "Testing..." : "Test"}
                  </Button>
                </div>
                {keyValid === true && (
                  <p className="text-sm text-green-600 mt-1">✓ API key is valid</p>
                )}
                {keyValid === false && (
                  <p className="text-sm text-red-600 mt-1">✗ API key is invalid</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Provide your own OpenAI API key for unlimited usage. If not provided, you'll use our shared key with rate limits.
                  Your key is stored securely in your browser and never sent to our servers.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={saveApiKey} className="flex-1">
                  Save API Key
                </Button>
                <Button onClick={testComparison} variant="outline" className="flex-1">
                  Test API
                </Button>
              </div>
            </div>
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Bug, Zap, FileText, Mail, Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ReportIssuesPage() {
  const [formData, setFormData] = useState({
    title: '',
    email: '',
    category: '',
    priority: '',
    description: '',
    steps: '',
    expected: '',
    actual: '',
    browser: '',
    os: '',
    includeData: false
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Collect system information
    const systemInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenResolution: `${screen.width}x${screen.height}`,
      timestamp: new Date().toISOString()
    };

    // Prepare email content
    const emailSubject = `Wiki Truth Issue Report: ${formData.title}`;
    const emailBody = `
ISSUE REPORT
============

Title: ${formData.title}
Email: ${formData.email}
Category: ${formData.category}
Priority: ${formData.priority}

DESCRIPTION
-----------
${formData.description}

STEPS TO REPRODUCE
------------------
${formData.steps}

EXPECTED BEHAVIOR
-----------------
${formData.expected}

ACTUAL BEHAVIOR
---------------
${formData.actual}

USER ENVIRONMENT
----------------
Browser: ${formData.browser}
Operating System: ${formData.os}

SYSTEM INFORMATION
------------------
User Agent: ${systemInfo.userAgent}
Platform: ${systemInfo.platform}
Language: ${systemInfo.language}
Screen Resolution: ${systemInfo.screenResolution}
Online Status: ${systemInfo.onLine}
Cookies Enabled: ${systemInfo.cookieEnabled}
Report Timestamp: ${systemInfo.timestamp}

${formData.includeData ? `
DATA CONSENT
------------
User has consented to include local data for debugging purposes.
` : ''}
`;

    const mailtoLink = `mailto:issues@wikitruth.app?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
    
    toast({
      title: "Issue Report Prepared",
      description: "Your email client should open with the detailed issue report. Thank you for helping us improve Wiki Truth!",
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-detect browser and OS
  const detectBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const detectOS = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Other';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Report Issues
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Help us improve Wiki Truth by reporting bugs and issues
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Quick Issue Types */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Issue Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Bug className="h-5 w-5 text-red-500 mt-1" />
                <div>
                  <h4 className="font-medium text-sm">Bugs</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Application errors, crashes, or unexpected behavior
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-medium text-sm">Performance</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Slow loading, timeouts, or resource issues
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-medium text-sm">Content</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Incorrect comparisons or data display issues
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                  <h4 className="font-medium text-sm">Security</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Privacy concerns or potential vulnerabilities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issue Report Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Issue Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Issue Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="performance">Performance Issue</SelectItem>
                        <SelectItem value="content">Content Problem</SelectItem>
                        <SelectItem value="ui">User Interface</SelectItem>
                        <SelectItem value="security">Security Concern</SelectItem>
                        <SelectItem value="subscription">Subscription Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                        <SelectItem value="medium">Medium - Affects functionality</SelectItem>
                        <SelectItem value="high">High - Blocks key features</SelectItem>
                        <SelectItem value="critical">Critical - App unusable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Detailed Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed description of the issue..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="steps">Steps to Reproduce</Label>
                  <Textarea
                    id="steps"
                    value={formData.steps}
                    onChange={(e) => handleInputChange('steps', e.target.value)}
                    placeholder="1. Go to... 2. Click on... 3. See error..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expected">Expected Behavior</Label>
                    <Textarea
                      id="expected"
                      value={formData.expected}
                      onChange={(e) => handleInputChange('expected', e.target.value)}
                      placeholder="What should have happened?"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="actual">Actual Behavior</Label>
                    <Textarea
                      id="actual"
                      value={formData.actual}
                      onChange={(e) => handleInputChange('actual', e.target.value)}
                      placeholder="What actually happened?"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Environment Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="browser">Browser</Label>
                    <Input
                      id="browser"
                      value={formData.browser}
                      onChange={(e) => handleInputChange('browser', e.target.value)}
                      placeholder={detectBrowser()}
                    />
                  </div>
                  <div>
                    <Label htmlFor="os">Operating System</Label>
                    <Input
                      id="os"
                      value={formData.os}
                      onChange={(e) => handleInputChange('os', e.target.value)}
                      placeholder={detectOS()}
                    />
                  </div>
                </div>

                {/* Privacy Consent */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeData"
                    checked={formData.includeData}
                    onCheckedChange={(checked) => handleInputChange('includeData', checked as boolean)}
                  />
                  <Label htmlFor="includeData" className="text-sm">
                    Include local data for debugging (Optional - only your comparison history, no personal data)
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Issue Report
                </Button>
              </form>

              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Privacy Notice:</strong> This form opens your email client with the report details. 
                  System information is included to help us diagnose issues. No data is sent to our servers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Before Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Common Solutions</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Try refreshing the page or clearing browser cache</li>
                  <li>• Check if the issue occurs in a different browser</li>
                  <li>• Ensure you have stable internet connection</li>
                  <li>• Disable browser extensions that might interfere</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Helpful Information</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Screenshots or screen recordings of the issue</li>
                  <li>• Browser console error messages (F12 → Console)</li>
                  <li>• Specific article titles or languages that cause issues</li>
                  <li>• Time when the issue occurred</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
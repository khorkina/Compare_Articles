import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Settings, Bot, BookOpen, User, Laugh, Zap, FileText } from "lucide-react";

interface PremiumComparisonOptionsProps {
  selectedLanguages: string[];
  articleTitle: string;
  outputLanguage: string;
  onStartComparison: (options: ComparisonOptions) => void;
  onBack: () => void;
}

export interface ComparisonOptions {
  outputFormat: 'bullet-points' | 'narrative';
  focusPoints: string;
  formality: 'formal' | 'casual' | 'academic';
  aiModel: 'free' | 'premium';
  analysisMode: 'academic' | 'biography' | 'funny';
}

export function PremiumComparisonOptions({ 
  selectedLanguages, 
  articleTitle, 
  outputLanguage, 
  onStartComparison, 
  onBack 
}: PremiumComparisonOptionsProps) {
  const [options, setOptions] = useState<ComparisonOptions>({
    outputFormat: 'narrative',
    focusPoints: '',
    formality: 'formal',
    aiModel: 'premium',
    analysisMode: 'academic'
  });

  const handleStartComparison = () => {
    onStartComparison(options);
  };

  const updateOption = <K extends keyof ComparisonOptions>(key: K, value: ComparisonOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full text-sm text-purple-700 dark:text-purple-300 mb-4">
          <Sparkles className="h-4 w-4" />
          Premium Analysis Options
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Customize Your Comparison
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Configure advanced settings for analyzing "{articleTitle}" across {selectedLanguages.length} languages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Output Format */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Output Format
            </CardTitle>
            <CardDescription>Choose how you want the comparison presented</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={options.outputFormat}
              onValueChange={(value: 'bullet-points' | 'narrative') => updateOption('outputFormat', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bullet-points" id="bullet-points" />
                <Label htmlFor="bullet-points" className="flex-1">
                  <div>
                    <div className="font-medium">Bullet Points</div>
                    <div className="text-sm text-gray-500">Structured list of all differences</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="narrative" id="narrative" />
                <Label htmlFor="narrative" className="flex-1">
                  <div>
                    <div className="font-medium">Narrative Analysis</div>
                    <div className="text-sm text-gray-500">Flowing discussion of differences</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Analysis Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Analysis Mode
            </CardTitle>
            <CardDescription>Select the type of analysis focus</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={options.analysisMode}
              onValueChange={(value: 'academic' | 'biography' | 'funny') => updateOption('analysisMode', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="academic" id="academic" />
                <Label htmlFor="academic" className="flex-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Academic Analysis</div>
                      <div className="text-sm text-gray-500">Scholarly, fact-focused</div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="biography" id="biography" />
                <Label htmlFor="biography" className="flex-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Biography Analysis</div>
                      <div className="text-sm text-gray-500">Person-centered, life events</div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="funny" id="funny" />
                <Label htmlFor="funny" className="flex-1">
                  <div className="flex items-center gap-2">
                    <Laugh className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Fun Mode</div>
                      <div className="text-sm text-gray-500">Humorous, entertaining</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Formality Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Formality Level
            </CardTitle>
            <CardDescription>Set the tone and style of writing</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={options.formality}
              onValueChange={(value: 'formal' | 'casual' | 'academic') => updateOption('formality', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select formality level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic - Highly formal, research-style</SelectItem>
                <SelectItem value="formal">Formal - Professional, structured</SelectItem>
                <SelectItem value="casual">Casual - Conversational, approachable</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* AI Model Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Model
            </CardTitle>
            <CardDescription>Select your preferred analysis model</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={options.aiModel}
              onValueChange={(value: 'free' | 'premium') => updateOption('aiModel', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="premium" id="premium-model" />
                <Label htmlFor="premium-model" className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">OpenAI GPT-4o</div>
                      <div className="text-sm text-gray-500">Enhanced analysis, full articles</div>
                    </div>
                    <Badge variant="default" className="bg-purple-100 text-purple-700">Recommended</Badge>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="standard-model" />
                <Label htmlFor="standard-model" className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Standard Model</div>
                      <div className="text-sm text-gray-500">Fast analysis, good quality</div>
                    </div>
                    <Badge variant="secondary">Alternative</Badge>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Focus Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Focus Points (Optional)
          </CardTitle>
          <CardDescription>
            Specify particular aspects, facts, or questions you want the AI to focus on during comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="E.g., 'Focus on historical dates and their accuracy', 'Compare cultural perspectives on this person's achievements', 'Look for differences in controversy mentions'..."
            value={options.focusPoints}
            onChange={(e) => updateOption('focusPoints', e.target.value)}
            className="min-h-[100px]"
          />
          <p className="text-xs text-gray-500 mt-2">
            You can write in any language. The AI will understand your instructions and focus on these areas.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Language Selection
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Output Language: <span className="font-medium">{outputLanguage}</span>
          </div>
          <Button onClick={handleStartComparison} className="bg-purple-600 hover:bg-purple-700">
            <Sparkles className="h-4 w-4 mr-2" />
            Start Premium Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
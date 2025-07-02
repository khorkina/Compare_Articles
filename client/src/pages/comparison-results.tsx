import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Globe } from 'lucide-react';
import { api } from '@/lib/api';
import { getLanguageName, getLanguageNativeName } from '@/lib/languages';
import { useToast } from '@/hooks/use-toast';

export default function ComparisonResults() {
  const [match, params] = useRoute('/results/:id');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const comparisonId = params?.id || null;

  const comparisonQuery = useQuery({
    queryKey: ['/api/compare', comparisonId],
    queryFn: () => api.getComparison(comparisonId!),
    enabled: !!comparisonId,
  });

  const handleExport = async () => {
    if (!comparisonId) return;
    
    try {
      const blob = await api.exportComparison(comparisonId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wiki-truth-${comparisonQuery.data?.articleTitle}-comparison.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Comparison has been exported as a Word document.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export the comparison document.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (platform: string) => {
    if (!comparisonId) return;
    
    try {
      const shareText = await api.shareComparison(comparisonId, platform);
      toast({
        title: "Copied to Clipboard",
        description: `Comparison text and link copied for ${platform}.`,
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to prepare sharing content.",
        variant: "destructive",
      });
    }
  };

  if (!comparisonId) {
    return (
      <main className="lg:col-span-3">
        <div className="wiki-content-section">
          <h2 className="font-bold text-2xl mb-4">Invalid Comparison</h2>
          <p className="text-wiki-gray mb-4">The comparison ID is invalid or missing.</p>
          <Button onClick={() => setLocation('/')} className="wiki-button">
            Back to Search
          </Button>
        </div>
      </main>
    );
  }

  if (comparisonQuery.isLoading) {
    return (
      <main className="lg:col-span-3">
        <div className="wiki-content-section">
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-wiki-gray mb-4"></i>
            <h2 className="font-bold text-2xl mb-2">Loading Comparison</h2>
            <p className="text-wiki-gray">Please wait while we load your comparison results...</p>
          </div>
        </div>
      </main>
    );
  }

  if (comparisonQuery.error || !comparisonQuery.data) {
    return (
      <main className="lg:col-span-3">
        <div className="wiki-content-section">
          <h2 className="font-bold text-2xl mb-4">Comparison Not Found</h2>
          <p className="text-wiki-gray mb-4">
            The requested comparison could not be found or loaded.
          </p>
          <Button onClick={() => setLocation('/')} className="wiki-button">
            Back to Search
          </Button>
        </div>
      </main>
    );
  }

  const comparison = comparisonQuery.data;
  const languageNames = comparison.selectedLanguages.map(lang => 
    `${getLanguageNativeName(lang)} (${getLanguageName(lang)})`
  ).join(', ');

  return (
    <main className="lg:col-span-3">
      <div className="wiki-content-section">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-2xl">
              Comparison Results
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {comparison.isPremium && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium Analysis
                </Badge>
              )}
              {comparison.isFunnyMode && (
                <Badge className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white">
                  FUNNY MODE
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport} className="wiki-button text-sm">
              <i className="fas fa-file-word mr-2"></i>Export DOCX
            </Button>
            <Button 
              onClick={() => handleShare('general')} 
              className="wiki-button text-sm"
            >
              <i className="fas fa-share mr-2"></i>Share
            </Button>
          </div>
        </div>

        {/* Article Metadata */}
        <div className="mb-6 p-4 bg-wiki-light-gray border border-wiki-light-border rounded">
          <h3 className="font-semibold mb-2">
            Compared Article: <span className="text-wiki-blue">{comparison.articleTitle}</span>
          </h3>
          <div className="text-sm text-wiki-gray">
            Languages compared: <span className="font-medium">{languageNames}</span> • 
            Output language: <span className="font-medium">{getLanguageName(comparison.outputLanguage)}</span>
          </div>
          {comparison.articles && (
            <div className="text-sm text-wiki-gray mt-2">
              Article lengths: {comparison.articles.map(a => 
                `${getLanguageNativeName(a.language)}: ${a.contentLength.toLocaleString()} chars`
              ).join(' • ')}
            </div>
          )}
        </div>

        {/* Comparison Content */}
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {comparison.comparisonResult}
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-8 pt-6 border-t border-wiki-light-border">
          <h3 className="font-semibold mb-4">Share this comparison:</h3>
          <div className="mb-3">
            <Button 
              onClick={async () => {
                try {
                  const comparison = comparisonQuery.data!;
                  const fullText = `Wiki Truth Comparison: "${comparison.articleTitle}"\n${comparison.selectedLanguages.map(lang => `• ${lang.toUpperCase()}`).join('\n')}\n\n${comparison.comparisonResult}`;
                  await navigator.clipboard.writeText(fullText);
                  toast({
                    title: "Copied to Clipboard",
                    description: "Full comparison text copied to clipboard",
                  });
                } catch (error) {
                  toast({
                    title: "Copy Failed", 
                    description: "Could not copy to clipboard",
                    variant: "destructive"
                  });
                }
              }} 
              className="wiki-button-primary"
            >
              <i className="fas fa-copy mr-2"></i>Copy Full Text to Clipboard
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => handleShare('X')} 
              className="wiki-button text-sm"
            >
              <i className="fab fa-x-twitter mr-2"></i>X (Twitter)
            </Button>
            <Button 
              onClick={() => handleShare('LinkedIn')} 
              className="wiki-button text-sm"
            >
              <i className="fab fa-linkedin mr-2"></i>LinkedIn
            </Button>
            <Button 
              onClick={() => handleShare('Telegram')} 
              className="wiki-button text-sm"
            >
              <i className="fab fa-telegram mr-2"></i>Telegram
            </Button>
            <Button 
              onClick={() => handleShare('WhatsApp')} 
              className="wiki-button text-sm"
            >
              <i className="fab fa-whatsapp mr-2"></i>WhatsApp
            </Button>
            <Button 
              onClick={() => handleShare('Reddit')} 
              className="wiki-button text-sm"
            >
              <i className="fab fa-reddit mr-2"></i>Reddit
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="wiki-link"
          >
            ← Start New Comparison
          </Button>
        </div>
      </div>
    </main>
  );
}

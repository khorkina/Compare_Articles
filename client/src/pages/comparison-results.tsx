import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Globe } from 'lucide-react';
import { api } from '@/lib/api';
import { getLanguageName, getLanguageNativeName } from '@/lib/languages';
import { useToast } from '@/hooks/use-toast';
import { ComparisonChat } from '@/components/comparison-chat';
import { clientStorage } from '@/lib/storage';


// Enhanced markdown formatter function
function formatMarkdownContent(content: string) {
  // Split content into lines for better processing
  let lines = content.split('\n');
  let result = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle headers (#### ### ## #)
    if (line.match(/^#{1,4}\s+/)) {
      const level = line.match(/^(#{1,4})/)?.[1].length || 1;
      const text = line.replace(/^#{1,4}\s+/, '').trim();
      
      switch (level) {
        case 1:
          result.push(`<h1 class="text-2xl font-bold mb-6 mt-0 text-blue-800 border-b-2 border-blue-600 pb-3">${text}</h1>`);
          break;
        case 2:
          result.push(`<h2 class="text-xl font-semibold mb-3 text-blue-800 mt-8 border-b border-gray-300 pb-2">${text}</h2>`);
          break;
        case 3:
          result.push(`<h3 class="text-lg font-semibold mb-2 text-blue-800 mt-6">${text}</h3>`);
          break;
        case 4:
          result.push(`<h4 class="text-base font-semibold mb-2 text-blue-800 mt-4">${text}</h4>`);
          break;
      }
      continue;
    }
    
    // Handle bullet points
    if (line.match(/^[\s]*[-*+]\s+/)) {
      if (!inList) {
        result.push('<ul class="list-disc pl-6 mb-4 space-y-1">');
        inList = true;
      }
      const text = line.replace(/^[\s]*[-*+]\s+/, '').trim();
      result.push(`<li class="leading-relaxed text-gray-800">${formatInlineMarkdown(text)}</li>`);
      continue;
    }
    
    // Handle numbered lists
    if (line.match(/^[\s]*\d+\.\s+/)) {
      if (!inList) {
        result.push('<ol class="list-decimal pl-6 mb-4 space-y-1">');
        inList = true;
      }
      const text = line.replace(/^[\s]*\d+\.\s+/, '').trim();
      result.push(`<li class="leading-relaxed text-gray-800">${formatInlineMarkdown(text)}</li>`);
      continue;
    }
    
    // Close list if we're in one and hit non-list content
    if (inList && !line.match(/^[\s]*[-*+\d]/)) {
      result.push(inList ? '</ul>' : '</ol>');
      inList = false;
    }
    
    // Handle empty lines
    if (line.trim() === '') {
      if (!inList) {
        result.push('');
      }
      continue;
    }
    
    // Handle regular paragraphs
    if (!inList) {
      result.push(`<p class="mb-4 leading-relaxed text-gray-800">${formatInlineMarkdown(line)}</p>`);
    }
  }
  
  // Close any open list
  if (inList) {
    result.push('</ul>');
  }
  
  return result.join('\n');
}

// Helper function for inline markdown (bold, italic, etc.)
function formatInlineMarkdown(text: string): string {
  return text
    // Replace **bold** text with proper HTML
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-blue-800">$1</strong>')
    // Replace *italic* text with proper HTML (but not bullet points)
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic text-gray-700">$1</em>')
    // Clean up any remaining stray markdown symbols
    .replace(/#{5,}/g, '')
    .replace(/^\s*[#]+\s*$/g, '');
}

export default function ComparisonResults() {
  const [match, params] = useRoute('/results/:id');
  const [, setLocation] = useLocation();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const { toast } = useToast();
  
  const comparisonId = params?.id || null;

  // Check premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const user = await clientStorage.getCurrentUser();
        const status = await clientStorage.checkSubscriptionStatus();
        setIsPremiumUser(status.isValid && user.subscription.isPremium);
      } catch (error) {
        console.error('Failed to check premium status:', error);
      }
    };
    checkPremiumStatus();
  }, []);

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
    if (!comparisonId || !comparisonQuery.data) return;
    
    try {
      const comparison = comparisonQuery.data;
      const wikiTruthUrl = window.location.origin;
      const currentUrl = window.location.href;
      
      // Create full text for clipboard
      const fullText = `Wiki Truth Comparison: "${comparison.articleTitle}"\n\nLanguages compared: ${comparison.selectedLanguages.map(lang => lang.toUpperCase()).join(', ')}\n\n${comparison.comparisonResult}\n\nDiscover more at ${wikiTruthUrl}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(fullText);
      
      // Create platform-specific messages and URLs
      const platformMessages: Record<string, string> = {
        twitter: `🌍 Fascinating Wikipedia comparison: "${comparison.articleTitle}" across ${comparison.selectedLanguages.length} languages reveals cultural differences! #WikiTruth #Wikipedia #X`,
        facebook: `Check out this interesting Wikipedia comparison of "${comparison.articleTitle}" across ${comparison.selectedLanguages.length} languages. The cultural perspectives are fascinating!`,
        linkedin: `I just compared the Wikipedia article "${comparison.articleTitle}" across ${comparison.selectedLanguages.length} languages. The AI analysis reveals interesting cultural perspectives and factual variations.`,
        whatsapp: `Check out this interesting Wikipedia comparison: "${comparison.articleTitle}" across ${comparison.selectedLanguages.length} languages. The differences are quite revealing!`,
        telegram: `📖 Multi-language Wikipedia comparison: "${comparison.articleTitle}" - revealing cultural perspectives and narrative differences across ${comparison.selectedLanguages.length} languages`,
        reddit: `TIL: The Wikipedia article for "${comparison.articleTitle}" varies significantly across ${comparison.selectedLanguages.length} languages. Here's an AI analysis of the differences:`
      };

      const message = platformMessages[platform] || `Check out this Wikipedia comparison: "${comparison.articleTitle}"`;
      
      // Create platform-specific share URLs
      const shareUrls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(currentUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(message)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&summary=${encodeURIComponent(message)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + currentUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(message)}`,
        reddit: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(message)}`
      };

      // Open social media sharing window
      if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      }
      
      toast({
        title: "Ready to Share",
        description: `Content copied to clipboard and ${platform} sharing opened.`,
      });
    } catch (error) {
      console.error('Share error:', error);
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
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
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
                `${getLanguageNativeName(a.language)}: ${(a.contentLength || 0).toLocaleString()} chars`
              ).join(' • ')}
            </div>
          )}
        </div>

        {/* Comparison Content */}
        <div className="prose prose-slate max-w-none markdown-content">
          <div 
            className="formatted-content"
            dangerouslySetInnerHTML={{ 
              __html: formatMarkdownContent(comparison.comparisonResult) 
            }}
          />
        </div>

        {/* Share Buttons */}
        <div className="mt-8 pt-6 border-t border-wiki-light-border">
          <h3 className="font-semibold text-lg mb-6 text-center">Share this comparison</h3>
          
          {/* Copy to Clipboard */}
          <div className="mb-6 flex justify-center">
            <Button 
              onClick={async () => {
                try {
                  const comparison = comparisonQuery.data!;
                  const wikiTruthUrl = window.location.origin;
                  const fullText = `Wiki Truth Comparison: "${comparison.articleTitle}"\n\nLanguages compared: ${comparison.selectedLanguages.map(lang => lang.toUpperCase()).join(', ')}\n\n${comparison.comparisonResult}\n\nDiscover more at ${wikiTruthUrl}`;
                  await navigator.clipboard.writeText(fullText);
                  toast({
                    title: "Copied to Clipboard",
                    description: "Comparison and Wiki Truth link copied to clipboard",
                  });
                } catch (error) {
                  toast({
                    title: "Copy Failed", 
                    description: "Could not copy to clipboard",
                    variant: "destructive"
                  });
                }
              }} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <i className="fas fa-copy mr-3 text-lg"></i>
              <span className="font-semibold">Copy Full Text + Link</span>
            </Button>
          </div>

          {/* Social Media Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* X (Twitter) */}
            <div className="flex flex-col items-center gap-2">
              <Button 
                onClick={() => handleShare('twitter')} 
                className="bg-black hover:bg-gray-800 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group p-0"
                title="Share on X"
              >
                <span className="text-2xl font-bold group-hover:animate-pulse">𝕏</span>
              </Button>
              <span className="text-xs text-gray-600 font-medium">X</span>
            </div>

            {/* Facebook */}
            <div className="flex flex-col items-center gap-2">
              <Button 
                onClick={() => handleShare('facebook')} 
                className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group p-0"
                title="Share on Facebook"
              >
                <i className="fab fa-facebook-f text-xl group-hover:animate-pulse"></i>
              </Button>
              <span className="text-xs text-gray-600 font-medium">Facebook</span>
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col items-center gap-2">
              <Button 
                onClick={() => handleShare('linkedin')} 
                className="bg-blue-700 hover:bg-blue-800 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group p-0"
                title="Share on LinkedIn"
              >
                <i className="fab fa-linkedin text-xl group-hover:animate-pulse"></i>
              </Button>
              <span className="text-xs text-gray-600 font-medium">LinkedIn</span>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col items-center gap-2">
              <Button 
                onClick={() => handleShare('whatsapp')} 
                className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group p-0"
                title="Share on WhatsApp"
              >
                <i className="fab fa-whatsapp text-xl group-hover:animate-pulse"></i>
              </Button>
              <span className="text-xs text-gray-600 font-medium">WhatsApp</span>
            </div>

            {/* Telegram */}
            <div className="flex flex-col items-center gap-2">
              <Button 
                onClick={() => handleShare('telegram')} 
                className="bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group p-0"
                title="Share on Telegram"
              >
                <i className="fab fa-telegram text-xl group-hover:animate-pulse"></i>
              </Button>
              <span className="text-xs text-gray-600 font-medium">Telegram</span>
            </div>

            {/* Reddit */}
            <div className="flex flex-col items-center gap-2">
              <Button 
                onClick={() => handleShare('reddit')} 
                className="bg-orange-600 hover:bg-orange-700 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group p-0"
                title="Share on Reddit"
              >
                <i className="fab fa-reddit text-xl group-hover:animate-pulse"></i>
              </Button>
              <span className="text-xs text-gray-600 font-medium">Reddit</span>
            </div>
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

      {/* Premium Chat Feature */}
      {isPremiumUser && (
        <ComparisonChat
          comparisonResult={comparison.comparisonResult}
          articleTitle={comparison.articleTitle}
          selectedLanguages={comparison.selectedLanguages}
          isVisible={isChatVisible}
          onToggle={() => setIsChatVisible(!isChatVisible)}
        />
      )}
    </main>
  );
}

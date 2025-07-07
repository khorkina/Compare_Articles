import { useState } from 'react';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWikipediaSearch } from '@/hooks/use-wikipedia-search';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { SearchResult } from '@/lib/api';

interface SearchInterfaceProps {
  onArticleSelected: (article: SearchResult, language: string) => void;
}

export function SearchInterface({ onArticleSelected }: SearchInterfaceProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { query, search, suggestions, isLoading } = useWikipediaSearch(selectedLanguage);

  const handleInputChange = (value: string) => {
    search(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    onArticleSelected(suggestion, selectedLanguage);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = () => {
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <div className="wiki-content-section mb-8">
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Select input language:</label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="wiki-input">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative mb-6">
        <label className="block text-sm font-semibold mb-2">Search for an article:</label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Type to search Wikipedia articles..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            className="wiki-search-input pr-12"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (suggestions.length > 0 || isLoading) && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b shadow-lg z-10 max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-center text-gray-600">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full inline-block mr-2"></div>
                Searching...
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.pageid}-${index}`}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-semibold text-base mb-2 text-blue-600">{suggestion.title}</div>
                  {suggestion.snippet && (
                    <div className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {suggestion.snippet.replace(/<[^>]*>/g, '')}
                    </div>
                  )}
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Click to select this article for comparison
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Button 
        onClick={handleSearchSubmit} 
        className="wiki-button-modern w-full"
        disabled={suggestions.length === 0}
      >
        <Search className="w-4 h-4 mr-2" />
        Search Article
      </Button>
    </div>
  );
}

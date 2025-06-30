import { useState } from 'react';
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
            className="wiki-input pr-12"
          />
          <i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-wiki-gray"></i>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (suggestions.length > 0 || isLoading) && (
          <div className="absolute top-full left-0 right-0 bg-white border border-wiki-border rounded-b shadow-lg z-10 max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-center text-wiki-gray">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Searching...
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.pageid}-${index}`}
                  className="p-3 hover:bg-wiki-light-gray cursor-pointer border-b border-wiki-light-border last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-semibold">{suggestion.title}</div>
                  <div className="text-sm text-wiki-gray">{suggestion.snippet}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Button 
        onClick={handleSearchSubmit} 
        className="wiki-button-primary w-full"
        disabled={suggestions.length === 0}
      >
        <i className="fas fa-search mr-2"></i>
        Search Article
      </Button>
    </div>
  );
}

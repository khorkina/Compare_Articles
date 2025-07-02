import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, type SearchResult } from '@/lib/api';

export function useWikipediaSearch(language: string = 'en') {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Reset search when language changes
  useEffect(() => {
    setQuery('');
    setDebouncedQuery('');
  }, [language]);

  const search = useCallback((searchTerm: string) => {
    setQuery(searchTerm);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  // Search query
  const searchQuery = useQuery({
    queryKey: ['/api/wikipedia/search', debouncedQuery, language],
    queryFn: () => api.searchArticles(debouncedQuery, language, 10),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    query,
    search,
    clearSearch,
    suggestions: searchQuery.data || [],
    isLoading: searchQuery.isLoading,
    error: searchQuery.error,
  };
}

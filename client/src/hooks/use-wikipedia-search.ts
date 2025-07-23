import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, type SearchResult } from '@/lib/api';

export function useWikipediaSearch(language: string = 'en') {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query with faster response for good queries
  useEffect(() => {
    const delay = query.length >= 4 ? 200 : 400; // Faster for longer, more specific queries
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

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

  // Search query with optimized caching and retry
  const searchQuery = useQuery({
    queryKey: ['/api/wikipedia/search', debouncedQuery, language],
    queryFn: () => api.searchArticles(debouncedQuery, language, 8),
    enabled: debouncedQuery.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    gcTime: 15 * 60 * 1000, // Keep in memory for 15 minutes
    retry: 2,
    retryDelay: 1000,
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

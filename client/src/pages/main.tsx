import { useState } from 'react';
import { useLocation } from 'wouter';
import { SearchInterface } from '@/components/search-interface';
import { SearchResult } from '@/lib/api';

export default function MainPage() {
  const [, setLocation] = useLocation();

  const handleArticleSelected = (article: SearchResult, language: string) => {
    setLocation(`/select-languages?title=${encodeURIComponent(article.title)}&lang=${language}`);
  };

  return (
    <main className="lg:col-span-3">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="font-bold text-4xl mb-4">Wiki Truth</h1>
          <p className="text-lg text-wiki-gray mb-6 max-w-3xl mx-auto">
            Discover how the same topic is presented differently across Wikipedia's language versions. 
            Our AI-powered analysis reveals cultural perspectives, factual variations, and narrative differences.
          </p>
        </div>

        {/* Search Interface */}
        <SearchInterface onArticleSelected={handleArticleSelected} />

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="wiki-sidebar">
            <div className="text-center mb-4">
              <i className="fas fa-globe text-3xl text-wiki-blue mb-2"></i>
            </div>
            <h3 className="font-bold text-lg mb-2">Multi-Language Analysis</h3>
            <p className="text-sm text-wiki-gray">
              Compare articles across 2-5 Wikipedia languages from 270+ available languages to discover cultural perspectives.
            </p>
          </div>
          
          <div className="wiki-sidebar">
            <div className="text-center mb-4">
              <i className="fas fa-brain text-3xl text-wiki-blue mb-2"></i>
            </div>
            <h3 className="font-bold text-lg mb-2">AI-Powered Insights</h3>
            <p className="text-sm text-wiki-gray">
              Uses advanced AI to identify factual differences, narrative variations, and cultural biases in content presentation.
            </p>
          </div>
          
          <div className="wiki-sidebar">
            <div className="text-center mb-4">
              <i className="fas fa-shield-alt text-3xl text-wiki-blue mb-2"></i>
            </div>
            <h3 className="font-bold text-lg mb-2">Privacy First</h3>
            <p className="text-sm text-wiki-gray">
              All data stored locally in your browser. No account required, completely free to use.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="text-center">
          <div className="inline-flex items-center gap-6 text-sm text-wiki-gray">
            <span><i className="fas fa-language mr-1"></i> 35+ Languages Supported</span>
            <span><i className="fas fa-infinity mr-1"></i> Unlimited Comparisons</span>
            <span><i className="fas fa-lock mr-1"></i> 100% Free</span>
          </div>
        </div>
      </section>
    </main>
  );
}
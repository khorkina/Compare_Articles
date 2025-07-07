import { useState } from 'react';
import { Plus, Search, History, Settings, X } from 'lucide-react';
import { Link } from 'wouter';

export function MobileFAB() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="lg:hidden">
      {/* FAB Actions */}
      {isExpanded && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={toggleExpanded}
          />
          <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-3">
            <Link
              href="/search"
              className="w-14 h-14 bg-white text-wiki-blue border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={toggleExpanded}
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/recent"
              className="w-14 h-14 bg-white text-wiki-blue border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={toggleExpanded}
            >
              <History className="w-5 h-5" />
            </Link>
            <button className="w-14 h-14 bg-white text-wiki-blue border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </>
      )}

      {/* Main FAB */}
      <button
        onClick={toggleExpanded}
        className="mobile-fab"
        aria-label={isExpanded ? 'Close actions' : 'Open actions'}
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
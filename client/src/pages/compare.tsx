import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function ComparePage() {
  const [, setLocation] = useLocation();

  return (
    <main className="lg:col-span-3">
      <div className="wiki-content-section">
        <h1 className="wiki-article-title">Start a New Comparison</h1>
        <p className="text-wiki-gray mb-6">
          Begin by searching for a Wikipedia article, then select languages to compare cultural perspectives.
        </p>

        <div className="space-y-6">
          {/* Step-by-step Guide */}
          <div className="bg-gray-50 border border-gray-200 rounded p-6">
            <h2 className="font-semibold text-lg mb-4">How to Compare Articles</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-wiki-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h3 className="font-medium">Search for an Article</h3>
                  <p className="text-sm text-wiki-gray">Find any Wikipedia topic in your preferred language</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-wiki-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h3 className="font-medium">Select Languages</h3>
                  <p className="text-sm text-wiki-gray">Choose 2-5 language versions to compare</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-wiki-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h3 className="font-medium">Choose Analysis Mode</h3>
                  <p className="text-sm text-wiki-gray">Academic analysis or fun mode for entertaining insights</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-wiki-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h3 className="font-medium">Review Results</h3>
                  <p className="text-sm text-wiki-gray">Get AI-powered analysis of cultural differences and perspectives</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Button */}
          <div className="text-center">
            <Button 
              onClick={() => setLocation('/search')}
              className="wiki-button-primary text-lg px-8 py-3"
            >
              <i className="fas fa-search mr-2"></i>
              Start Searching Articles
            </Button>
          </div>

          {/* Features Reminder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h3 className="font-semibold text-green-900 mb-2">
                <i className="fas fa-check-circle mr-2"></i>Completely Free
              </h3>
              <p className="text-sm text-green-800">
                Unlimited comparisons with no account required
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                <i className="fas fa-shield-alt mr-2"></i>Privacy First
              </h3>
              <p className="text-sm text-blue-800">
                All data stored locally in your browser
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
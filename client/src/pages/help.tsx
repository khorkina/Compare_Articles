import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function HelpPage() {
  const [, setLocation] = useLocation();

  return (
    <main className="container mx-auto max-w-7xl pt-16 pb-20 lg:pt-24 lg:pb-8">
      <div className="wiki-content-section px-4 md:px-6">
        <h1 className="wiki-article-title">Help & Support</h1>
        <p className="text-wiki-gray mb-6">
          Learn how to use Wiki Truth effectively and get answers to common questions.
        </p>

        <div className="space-y-8">
          {/* Getting Started */}
          <section>
            <h2 className="wiki-section-title">Getting Started</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h3 className="font-semibold mb-2">
                  <i className="fas fa-play-circle mr-2 text-wiki-blue"></i>Quick Start Guide
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Search for any Wikipedia article using the search box</li>
                  <li>Select the article you want to analyze from the suggestions</li>
                  <li>Choose 2-5 language versions to compare</li>
                  <li>Pick your preferred output language and analysis mode</li>
                  <li>Click "Start Analysis" and wait for AI-powered results</li>
                </ol>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="wiki-section-title">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="bg-gray-50 border border-gray-200 rounded p-4">
                <summary className="font-semibold cursor-pointer">
                  <i className="fas fa-question-circle mr-2 text-wiki-blue"></i>
                  Is Wiki Truth really completely free?
                </summary>
                <div className="mt-3 text-sm text-gray-700">
                  Yes! Wiki Truth is 100% free with unlimited comparisons. No subscription, no account required, no hidden fees.
                </div>
              </details>

              <details className="bg-gray-50 border border-gray-200 rounded p-4">
                <summary className="font-semibold cursor-pointer">
                  <i className="fas fa-question-circle mr-2 text-wiki-blue"></i>
                  How many languages can I compare at once?
                </summary>
                <div className="mt-3 text-sm text-gray-700">
                  You can compare 2-5 language versions in a single analysis. This range provides meaningful insights while keeping the analysis focused and readable.
                </div>
              </details>

              <details className="bg-gray-50 border border-gray-200 rounded p-4">
                <summary className="font-semibold cursor-pointer">
                  <i className="fas fa-question-circle mr-2 text-wiki-blue"></i>
                  What's the difference between Academic and Fun Mode?
                </summary>
                <div className="mt-3 text-sm text-gray-700">
                  Academic Mode provides scholarly, objective analysis suitable for research. Fun Mode offers entertaining, humorous insights while still being informative - perfect for discovering cultural quirks and biases in an engaging way.
                </div>
              </details>

              <details className="bg-gray-50 border border-gray-200 rounded p-4">
                <summary className="font-semibold cursor-pointer">
                  <i className="fas fa-question-circle mr-2 text-wiki-blue"></i>
                  Where is my data stored?
                </summary>
                <div className="mt-3 text-sm text-gray-700">
                  All your comparison history is stored locally in your browser using IndexedDB. No data is sent to external servers except during the AI analysis process. You have complete control over your data.
                </div>
              </details>

              <details className="bg-gray-50 border border-gray-200 rounded p-4">
                <summary className="font-semibold cursor-pointer">
                  <i className="fas fa-question-circle mr-2 text-wiki-blue"></i>
                  Why do some articles show "[CONTENT TRUNCATED FOR SIZE]"?
                </summary>
                <div className="mt-3 text-sm text-gray-700">
                  Very long Wikipedia articles are automatically truncated to fit within AI processing limits. We preserve the beginning (overview) and end (recent information) of articles to maintain meaningful analysis while staying within technical constraints.
                </div>
              </details>

              <details className="bg-gray-50 border border-gray-200 rounded p-4">
                <summary className="font-semibold cursor-pointer">
                  <i className="fas fa-question-circle mr-2 text-wiki-blue"></i>
                  Can I export my comparison results?
                </summary>
                <div className="mt-3 text-sm text-gray-700">
                  Yes! Each comparison has a "Copy to Clipboard" button to copy the full analysis text. You can also export all your data from the Tools page as a JSON file.
                </div>
              </details>
            </div>
          </section>

          {/* Tips & Tricks */}
          <section>
            <h2 className="wiki-section-title">Tips & Tricks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  <i className="fas fa-lightbulb mr-2"></i>Best Topics to Compare
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Historical figures and events</li>
                  <li>• Countries and cities</li>
                  <li>• Political concepts and systems</li>
                  <li>• Scientific discoveries and theories</li>
                  <li>• Cultural and religious topics</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  <i className="fas fa-star mr-2"></i>Pro Tips
                </h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Try comparing articles from different regions</li>
                  <li>• Use Fun Mode for entertaining cultural insights</li>
                  <li>• Compare controversial topics for varied perspectives</li>
                  <li>• Mix languages from different language families</li>
                  <li>• Save interesting results for future reference</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="wiki-section-title">Need More Help?</h2>
            <div className="bg-gray-50 border border-gray-200 rounded p-6 text-center">
              <p className="text-wiki-gray mb-4">
                Wiki Truth is an open-source project focused on privacy and accessibility.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => setLocation('/about')}
                  className="wiki-button"
                >
                  <i className="fas fa-info-circle mr-2"></i>
                  Learn More About Wiki Truth
                </Button>
                <Button 
                  onClick={() => setLocation('/search')}
                  className="wiki-button-primary"
                >
                  <i className="fas fa-search mr-2"></i>
                  Start Comparing
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
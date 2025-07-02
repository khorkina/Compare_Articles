import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getLanguageName } from '@/lib/languages';
import { useToast } from '@/hooks/use-toast';

export default function RecentComparisonsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const comparisonsQuery = useQuery({
    queryKey: ['/api/comparisons'],
    queryFn: () => api.getUserComparisons(),
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this comparison?')) {
      try {
        await api.deleteComparison(id);
        comparisonsQuery.refetch();
        toast({
          title: "Comparison Deleted",
          description: "The comparison has been removed from your history",
        });
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: "Could not delete the comparison",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <main className="lg:col-span-3">
      <div className="wiki-content-section">
        <h1 className="wiki-article-title">Recent Comparisons</h1>
        <p className="text-wiki-gray mb-6">
          View and manage your comparison history stored locally in your browser.
        </p>

        {comparisonsQuery.isLoading && (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-2xl text-wiki-gray mb-2"></i>
            <p className="text-wiki-gray">Loading your comparisons...</p>
          </div>
        )}

        {comparisonsQuery.error && (
          <div className="wiki-message wiki-message-error">
            Failed to load comparison history. Please try refreshing the page.
          </div>
        )}

        {comparisonsQuery.data && comparisonsQuery.data.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-history text-4xl text-wiki-gray mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">No Comparisons Yet</h2>
            <p className="text-wiki-gray mb-6">
              You haven't created any comparisons yet. Start by searching for a Wikipedia article.
            </p>
            <Button 
              onClick={() => setLocation('/search')}
              className="wiki-button-primary"
            >
              <i className="fas fa-search mr-2"></i>
              Start Your First Comparison
            </Button>
          </div>
        )}

        {comparisonsQuery.data && comparisonsQuery.data.length > 0 && (
          <div className="space-y-4">
            {comparisonsQuery.data
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((comparison) => (
                <div key={comparison.id} className="wiki-sidebar p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {comparison.articleTitle}
                      </h3>
                      <div className="text-sm text-wiki-gray">
                        <span className="inline-flex items-center gap-2 mb-1">
                          <i className="fas fa-globe mr-1"></i>
                          Languages: {comparison.selectedLanguages.map(lang => getLanguageName(lang)).join(', ')}
                        </span>
                        <br />
                        <span className="inline-flex items-center gap-2">
                          <i className="fas fa-calendar mr-1"></i>
                          {new Date(comparison.createdAt).toLocaleDateString()} at {new Date(comparison.createdAt).toLocaleTimeString()}
                        </span>
                        <br />
                        <span className="inline-flex items-center gap-2">
                          <i className={`fas ${comparison.isFunnyMode ? 'fa-smile' : 'fa-graduation-cap'} mr-1`}></i>
                          {comparison.isFunnyMode ? 'Fun Mode' : 'Academic Analysis'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => setLocation(`/results/${comparison.id}`)}
                        className="wiki-button text-sm"
                      >
                        <i className="fas fa-eye mr-1"></i>
                        View
                      </Button>
                      <Button
                        onClick={() => handleDelete(comparison.id)}
                        className="wiki-button-secondary text-sm"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Preview of comparison result */}
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {comparison.comparisonResult.substring(0, 200)}
                    {comparison.comparisonResult.length > 200 && '...'}
                  </div>
                </div>
              ))}

            {/* Summary Statistics */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">
                <i className="fas fa-chart-pie mr-2"></i>Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-900">Total: </span>
                  <span className="text-blue-800">{comparisonsQuery.data.length}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Academic: </span>
                  <span className="text-blue-800">{comparisonsQuery.data.filter(c => !c.isFunnyMode).length}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Fun Mode: </span>
                  <span className="text-blue-800">{comparisonsQuery.data.filter(c => c.isFunnyMode).length}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Languages: </span>
                  <span className="text-blue-800">{Array.from(new Set(comparisonsQuery.data.flatMap(c => c.selectedLanguages))).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
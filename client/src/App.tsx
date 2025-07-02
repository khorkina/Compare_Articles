import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { clientStorage } from "@/lib/storage";
import Home from "@/pages/home";
import MainPage from "@/pages/main";
import SearchPage from "@/pages/search";
import ComparePage from "@/pages/compare";
import ToolsPage from "@/pages/tools";
import RecentComparisonsPage from "@/pages/recent-comparisons";
import HelpPage from "@/pages/help";
import AboutPage from "@/pages/about";
import HowItWorksPage from "@/pages/how-it-works";
import PrivacyPage from "@/pages/privacy";
import LanguageSelection from "@/pages/language-selection";
import ComparisonResults from "@/pages/comparison-results";
import ThankYou from "@/pages/thank-you";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/main" component={MainPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/compare" component={ComparePage} />
      <Route path="/tools" component={ToolsPage} />
      <Route path="/recent" component={RecentComparisonsPage} />
      <Route path="/help" component={HelpPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/select-languages" component={LanguageSelection} />
      <Route path="/results/:id" component={ComparisonResults} />
      <Route path="/thank-you" component={ThankYou} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Initialize client storage on app startup
    clientStorage.getCurrentUser().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <Sidebar />
              <Router />
            </div>
          </div>
          
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

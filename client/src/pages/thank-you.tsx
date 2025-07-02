import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { CheckCircle, ArrowRight, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ThankYou() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Remove confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/20 to-transparent animate-pulse"></div>
        </div>
      )}
      
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/90 backdrop-blur">
        <CardContent className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-500" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to WikiTruth!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your free, unlimited Wikipedia comparison service is ready to use
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Globe className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-green-800">
                Everything is Free!
              </h2>
            </div>
            <div className="space-y-2 text-green-700">
              <p>✅ Unlimited article comparisons</p>
              <p>✅ All language pairs supported</p>
              <p>✅ Both academic and fun mode analysis</p>
              <p>✅ No registration required</p>
              <p>✅ Privacy-first design</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">
                <ArrowRight className="mr-2 h-5 w-5" />
                Start Comparing Articles
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                Browse Wikipedia
              </Link>
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            All your data stays in your browser. We respect your privacy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
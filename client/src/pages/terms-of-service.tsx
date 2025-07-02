import { Card, CardContent } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: January 2, 2025
          </p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By accessing and using Wiki Truth, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Service Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Wiki Truth is a freemium web application that enables users to compare Wikipedia articles across multiple languages using AI analysis:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Free Tier:</strong> Unlimited AI-powered comparisons with standard analysis</li>
                <li><strong>Premium Tier ($5/month):</strong> Enhanced AI analysis with full document processing capabilities</li>
                <li><strong>Privacy-First:</strong> All user data stored locally in your browser only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Privacy and Data Storage</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                <strong>Local Data Storage:</strong> All your personal data, comparison history, and preferences are stored exclusively in your browser's local storage. We do not collect, store, or transmit your personal data to our servers.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                <strong>Data Control:</strong> You have complete control over your data. You can export or delete all stored data at any time through the Settings menu.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>Third-Party APIs:</strong> The service uses Wikipedia API for article content and AI services for analysis. These interactions are processed according to their respective privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Premium Subscription</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Premium subscriptions are processed through Smart Glocal payment system at $5 USD per month:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Subscription automatically renews monthly unless cancelled</li>
                <li>Subscription status is validated locally in your browser for 30 days</li>
                <li>No refunds for partial months, but you retain access until expiration</li>
                <li>You can cancel anytime through your payment provider</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Acceptable Use</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                You agree to use Wiki Truth responsibly:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Do not use the service for any illegal or unauthorized purpose</li>
                <li>Do not attempt to reverse engineer or compromise the service</li>
                <li>Respect Wikipedia's terms of service when accessing their content</li>
                <li>Do not abuse AI analysis features or attempt to circumvent usage limits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Wikipedia content is licensed under Creative Commons. AI-generated analysis is provided for informational purposes. 
                The Wiki Truth application and its original content are protected by copyright and intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Wiki Truth is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of AI-generated comparisons. 
                The service depends on third-party APIs (Wikipedia, AI services) which may experience downtime or changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In no event shall Wiki Truth be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. 
                Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Contact Information</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For questions about these Terms of Service, please contact us through our Contact Us page or report issues through our Report Issues page.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
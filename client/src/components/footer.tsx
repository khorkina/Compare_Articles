import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-wiki-light-border bg-wiki-light-gray mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Wiki Truth</h3>
            <p className="text-sm text-wiki-gray">
              AI-powered Wikipedia article comparison across languages and cultures.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/how-it-works" className="wiki-link">How it works</Link></li>
              <li><Link href="/privacy" className="wiki-link">Privacy policy</Link></li>
              <li><Link href="/terms" className="wiki-link">Terms of service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="wiki-link">Help center</Link></li>
              <li><Link href="/contact" className="wiki-link">Contact us</Link></li>
              <li><Link href="/report" className="wiki-link">Report issues</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Technology</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.mediawiki.org/wiki/API:Main_page" className="wiki-link" target="_blank" rel="noopener noreferrer">Wikipedia API</a></li>
              <li><a href="https://openai.com/" className="wiki-link" target="_blank" rel="noopener noreferrer">OpenAI GPT-4</a></li>
              <li><a href="#" className="wiki-link">Open source</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-wiki-light-border mt-8 pt-6 text-center">
          <p className="text-sm text-wiki-gray">
            © 2024 Wiki Truth. This site is not affiliated with the Wikimedia Foundation.
          </p>
        </div>
      </div>
    </footer>
  );
}

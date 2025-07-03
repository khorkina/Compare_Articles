import { Link } from "wouter";
import { SettingsDialog } from "./settings-dialog";
import { PremiumIndicator } from "./premium-indicator";

export function Navbar() {
  return (
    <header className="border-b border-wiki-light-border bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">
              <Link href="/" className="text-black hover:text-wiki-blue">
                Wiki Truth
              </Link>
            </h1>
            <span className="text-sm text-wiki-gray">Privacy-first comparison</span>
          </div>
          <nav className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/search" className="wiki-link text-sm">Search</Link>
              <Link href="/recent" className="wiki-link text-sm">History</Link>
              <Link href="/help" className="wiki-link text-sm">Help</Link>
              <Link href="/about" className="wiki-link text-sm">About</Link>
            </div>
            <div className="flex items-center space-x-3">
              <PremiumIndicator />
              <SettingsDialog />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

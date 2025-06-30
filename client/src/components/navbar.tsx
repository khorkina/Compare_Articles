import { Link } from "wouter";
import { SettingsDialog } from "./settings-dialog";

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
              <Link href="/about" className="wiki-link text-sm">About</Link>
              <Link href="/how-it-works" className="wiki-link text-sm">How it works</Link>
              <Link href="/privacy" className="wiki-link text-sm">Privacy</Link>
            </div>
            <SettingsDialog />
          </nav>
        </div>
      </div>
    </header>
  );
}

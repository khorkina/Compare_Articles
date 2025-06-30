import { Link } from "wouter";

export function Sidebar() {
  return (
    <aside className="lg:col-span-1">
      <div className="wiki-sidebar mb-6">
        <h3 className="font-bold text-lg mb-3">Navigation</h3>
        <ul className="space-y-2 text-sm">
          <li><Link href="/" className="wiki-link">Main page</Link></li>
          <li><Link href="/search" className="wiki-link">Search articles</Link></li>
          <li><Link href="/compare" className="wiki-link">Compare</Link></li>
          <li><Link href="/results" className="wiki-link">Results</Link></li>
        </ul>
      </div>
      
      <div className="wiki-sidebar">
        <h3 className="font-bold text-lg mb-3">Tools</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="wiki-link">Random article</a></li>
          <li><a href="#" className="wiki-link">Recent comparisons</a></li>
          <li><a href="#" className="wiki-link">Help</a></li>
        </ul>
      </div>
    </aside>
  );
}

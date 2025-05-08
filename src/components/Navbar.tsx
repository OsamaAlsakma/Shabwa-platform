import Link from 'next/link';
import { Button } from './ui/button';

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              أسامة AI
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/tools" className="transition-colors hover:text-foreground/80 text-foreground/60">
              أدوات الذكاء الاصطناعي
            </Link>
            <Link href="/learning" className="transition-colors hover:text-foreground/80 text-foreground/60">
              خطط التعلم
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}

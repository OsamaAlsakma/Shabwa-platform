import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserMenu } from "../auth/UserMenu";
import { BookOpen, Code, Home, BookUser, Layout, Menu, Lightbulb } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-white/10 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 order-2 md:order-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-primary/20 w-10 h-10 flex items-center justify-center shadow-lg shadow-primary/20">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl hidden md:block text-gradient animate-gradient bg-gradient-to-r from-white to-blue-400">شبوة لتعلم البرمجة</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden order-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="القائمة"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 order-1">
          <nav className="flex items-center space-x-1">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center hover:bg-primary/10 hover:text-primary transition-all">
                <Home className="h-4 w-4 ml-2" />
                الرئيسية
              </Button>
            </Link>
            <Link to="/saved">
              <Button variant="ghost" size="sm" className="flex items-center hover:bg-primary/10 hover:text-primary transition-all">
                <BookUser className="h-4 w-4 ml-2" />
                خطط التعلم المحفوظة
              </Button>
            </Link>
            <Link to="/tools">
              <Button variant="ghost" size="sm" className="flex items-center hover:bg-primary/10 hover:text-primary transition-all">
                <Lightbulb className="h-4 w-4 ml-2" />
                أدوات الذكاء الاصطناعي
              </Button>
            </Link>
          </nav>
        </div>
        
        {/* User Menu */}
        <div className="order-3 md:order-2">
          <UserMenu />
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "md:hidden bg-background border-b border-white/10 overflow-hidden transition-all duration-300 ease-in-out",
        showMobileMenu ? "max-h-64" : "max-h-0"
      )}>
        <div className="container py-2">
          <nav className="flex flex-col space-y-2">
            <Link to="/" onClick={() => setShowMobileMenu(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="h-4 w-4 ml-2" />
                الرئيسية
              </Button>
            </Link>
            <Link to="/saved" onClick={() => setShowMobileMenu(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <BookUser className="h-4 w-4 ml-2" />
                خطط التعلم المحفوظة
              </Button>
            </Link>
            <Link to="/tools" onClick={() => setShowMobileMenu(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Lightbulb className="h-4 w-4 ml-2" />
                أدوات الذكاء الاصطناعي
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}


import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/5">
      <Header />
      <main className="flex-1 container py-10 animate-fade-in">
        <Suspense fallback={
          <div className="flex items-center justify-center h-[50vh]">
            <div className="glass-morphism p-8 rounded-xl flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">جاري التحميل...</p>
            </div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Card className="w-full max-w-3xl glass-morphism hover:shadow-lg transition-all duration-300">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-2 shadow-lg shadow-primary/10">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold text-center">ماذا تريد أن تتعلم في البرمجة؟</h2>
          
          <p className="text-muted-foreground text-center max-w-xl">
            أخبرنا عما تريد تعلمه وسيساعدك الذكاء الاصطناعي في إنشاء مسار تعلم مخصص لك مع أفضل الموارد
          </p>
          
          <Alert className="bg-amber-500/10 border-amber-500/30 mb-2 w-full max-w-md">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-200 mr-2">
              إذا لم يعمل الموقع بشكل صحيح، يرجى تشغيل VPN وإعادة المحاولة
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col sm:flex-row w-full max-w-md gap-2 mt-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثال: React.js، الخوارزميات، تطوير تطبيقات الموبايل..."
              className="text-right border-white/20 focus:border-primary"
              dir="rtl"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              <Search className="h-4 w-4 ml-2" />
              {isLoading ? "جاري البحث..." : "ابدأ التعلم"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

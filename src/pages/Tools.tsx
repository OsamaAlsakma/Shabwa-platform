import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { AITool, AIToolsService } from '@/services/AIToolsService';
import { AIToolCard } from '@/components/tools/AIToolCard';

export default function Tools() {
  const [query, setQuery] = useState('');
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const results = await AIToolsService.searchTools(query);
      setTools(results);
      if (results.length === 0) {
        setError('لم يتم العثور على أدوات مناسبة');
      }
    } catch (err) {
      console.error('Error searching tools:', err);
      setError('حدث خطأ أثناء البحث');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">البحث عن أدوات الذكاء الاصطناعي</h1>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex gap-2">
          <Input
            placeholder="ماذا تريد أن تفعل؟ مثال: تحويل الصوت إلى نص..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="text-right"
          />
          <Button 
            onClick={handleSearch}
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {error && (
          <p className="text-destructive mt-2 text-center">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, index) => (
          <AIToolCard key={index} tool={tool} />
        ))}
      </div>

      {!loading && !error && tools.length === 0 && (
        <p className="text-muted-foreground text-center mt-8">
          ابحث عن أدوات الذكاء الاصطناعي التي تساعدك في مهمتك
        </p>
      )}
    </div>
  );
}

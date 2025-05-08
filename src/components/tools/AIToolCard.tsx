import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Tag, Star, Check } from "lucide-react";
import { AITool } from "@/services/AIToolsService";

interface AIToolCardProps {
  tool: AITool;
}

export function AIToolCard({ tool }: AIToolCardProps) {
  return (
    <Card className="bg-secondary/20 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg mb-1">{tool.name}</CardTitle>
            {tool.arabicSupport && (
              <Badge variant="outline" className="bg-primary/5">
                <Check className="h-3 w-3 mr-1" />
                يدعم العربية
              </Badge>
            )}
          </div>
          <Badge 
            variant={tool.pricing === 'free' ? 'default' : 'secondary'} 
            className="h-5"
          >
            {tool.pricing === 'free' ? 'مجاني' : 
             tool.pricing === 'freemium' ? 'نسخة مجانية' : 'مدفوع'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {tool.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-primary/5">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {tool.features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="bg-secondary/30">
              {feature}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {tool.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{tool.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/50" 
          asChild
        >
          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
            <ExternalLink className="h-4 w-4" />
            زيارة الأداة
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

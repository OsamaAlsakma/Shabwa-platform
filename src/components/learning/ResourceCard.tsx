import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Youtube, User, Star, BookOpen, Tag } from "lucide-react";
import { LearningResource } from "@/services/GeminiService";
import { UrlService } from "@/services/UrlService";

interface ResourceCardProps {
  resource: LearningResource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  // الحصول على الرابط المناسب حسب نوع المصدر
  const getResourceUrl = () => {
    if (resource.platform === 'youtube' && resource.channelUrl) {
      return resource.channelUrl;
    }
    return resource.url;
  };

  // التحقق من صحة الرابط
  const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    
    if (resource.platform === 'youtube') {
      return UrlService.isValidYoutubeUrl(url);
    }
    return UrlService.isValidLearningPlatformUrl(url);
  };

  // عرض نص اللغة بالعربية
  const getLanguageText = () => {
    return resource.language === 'arabic' ? 'عربي' : 'إنجليزي';
  };

  // عرض نص نوع المصدر بالعربية
  const getTypeText = () => {
    return resource.type === 'free' ? 'مجاني' : 'مدفوع';
  };

  // عرض اسم المنصة بالعربية
  const getPlatformText = () => {
    if (resource.platform === 'youtube') {
      return 'يوتيوب';
    } else if (resource.platform === 'udemy') {
      return 'يوديمي';
    } else if (resource.platform === 'coursera') {
      return 'كورسيرا';
    }
    return resource.platform || '';
  };

  const resourceUrl = getResourceUrl();
  const isUrlValid = isValidUrl(resourceUrl);

  return (
    <Card className="bg-secondary/20 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg mb-1">{resource.title}</CardTitle>
            {resource.channel && (
              <CardDescription className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {resource.channel}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={resource.type === 'free' ? 'default' : 'secondary'} className="h-5">
              {getTypeText()}
            </Badge>
            <Badge variant="outline" className="h-5">
              {getLanguageText()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {resource.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {resource.topics?.map((topic, index) => (
            <Badge key={index} variant="outline" className="bg-primary/5">
              <Tag className="h-3 w-3 mr-1" />
              {topic}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {resource.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{resource.rating.toFixed(1)}</span>
            </div>
          )}
          
          {resource.year && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{resource.year}</span>
            </div>
          )}

          {resource.level && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>
                {resource.level === 'beginner' ? 'مبتدئ' : 
                 resource.level === 'intermediate' ? 'متوسط' : 'متقدم'}
              </span>
            </div>
          )}

          {resource.score && (
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-primary">
                {(resource.score * 100).toFixed(0)}% تطابق
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/50" 
          asChild={isUrlValid}
          disabled={!isUrlValid}
        >
          {isUrlValid ? (
            <a href={resourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
              {resource.platform === 'youtube' ? (
                <>
                  <Youtube className="h-4 w-4" />
                  زيارة القناة
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  فتح الرابط
                </>
              )}
            </a>
          ) : (
            <span className="flex items-center justify-center gap-1">
             لم يتم الوصول للرابط يرجى البحث من النص الموجود اعلاة
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

import { toast } from '@/components/ui/use-toast';

export interface ResourceMetadata {
  title: string;
  description: string;
  type: 'video' | 'course' | 'article' | 'documentation';
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'arabic' | 'english';
  rating?: number;
  topics: string[];
}

export class UrlService {
  // قائمة المنصات التعليمية المعتمدة
  private static readonly TRUSTED_PLATFORMS = {
    'youtube.com': {
      name: 'YouTube',
      type: 'video',
      weight: 0.8
    },
    'udemy.com': {
      name: 'Udemy',
      type: 'course',
      weight: 0.9
    },
    'coursera.org': {
      name: 'Coursera',
      type: 'course',
      weight: 0.95
    },
    'edx.org': {
      name: 'edX',
      type: 'course',
      weight: 0.9
    },
    'freecodecamp.org': {
      name: 'freeCodeCamp',
      type: 'course',
      weight: 0.85
    },
    'khanacademy.org': {
      name: 'Khan Academy',
      type: 'course',
      weight: 0.8
    },
    'w3schools.com': {
      name: 'W3Schools',
      type: 'documentation',
      weight: 0.75
    },
    'developer.mozilla.org': {
      name: 'MDN Web Docs',
      type: 'documentation',
      weight: 0.95
    },
    'github.com': {
      name: 'GitHub',
      type: 'documentation',
      weight: 0.8
    }
  };

  // التحقق من صحة الرابط
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  // إصلاح الرابط وإضافة البروتوكول إذا كان مفقوداً
  static fixUrl(url: string): string {
    if (!url) return '';
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }

  // التحقق من صحة رابط يوتيوب
  static isValidYoutubeUrl(url: string): boolean {
    try {
      const fixedUrl = this.fixUrl(url);
      const urlObj = new URL(fixedUrl);
      if (!urlObj.hostname.includes('youtube.com') && !urlObj.hostname.includes('youtu.be')) {
        return false;
      }
      return urlObj.pathname.startsWith('/@') || urlObj.pathname.startsWith('/channel/');
    } catch (e) {
      return false;
    }
  }

  // إصلاح رابط يوتيوب
  static fixYoutubeUrl(url: string): string {
    if (!url) return '';
    try {
      const fixedUrl = this.fixUrl(url);
      const urlObj = new URL(fixedUrl);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        if (urlObj.pathname.startsWith('/channel/') || urlObj.pathname.startsWith('/@')) {
          return `https://www.youtube.com${urlObj.pathname}`;
        }
      }
      return fixedUrl;
    } catch (e) {
      return url;
    }
  }

  // التحقق من صحة رابط المنصة التعليمية
  static isValidLearningPlatformUrl(url: string): boolean {
    try {
      const fixedUrl = this.fixUrl(url);
      const urlObj = new URL(fixedUrl);
      return Object.keys(this.TRUSTED_PLATFORMS).some(platform => urlObj.hostname.includes(platform));
    } catch (e) {
      return false;
    }
  }

  // حساب درجة أهمية المصدر
  static calculateResourceScore(url: string, metadata: ResourceMetadata): number {
    try {
      const urlObj = new URL(url);
      const platform = Object.entries(this.TRUSTED_PLATFORMS).find(([domain]) => 
        urlObj.hostname.includes(domain)
      );

      if (!platform) return 0;

      const [_, info] = platform;
      let score = info.weight;

      // زيادة الدرجة بناءً على اللغة
      if (metadata.language === 'arabic') {
        score += 0.1; // تفضيل المحتوى العربي
      }

      // زيادة الدرجة بناءً على التقييم
      if (metadata.rating) {
        score += (metadata.rating / 5) * 0.2;
      }

      // زيادة الدرجة بناءً على عدد المواضيع المغطاة
      if (metadata.topics.length > 0) {
        score += Math.min(metadata.topics.length * 0.05, 0.2);
      }

      return Math.min(score, 1);
    } catch (e) {
      return 0;
    }
  }

  // ترشيح وترتيب المصادر
  static filterAndSortResources(resources: Array<{ url: string; metadata: ResourceMetadata }>): Array<{ url: string; metadata: ResourceMetadata; score: number }> {
    const scoredResources = resources.map(resource => ({
      ...resource,
      score: this.calculateResourceScore(resource.url, resource.metadata)
    }));

    // ترتيب المصادر حسب الدرجة
    return scoredResources
      .filter(resource => resource.score > 0.5) // إزالة المصادر ذات الدرجة المنخفضة
      .sort((a, b) => b.score - a.score);
  }

  // التحقق من صحة الرابط وإصلاحه
  static validateAndFixUrl(url: string, type: 'youtube' | 'learning-platform'): { isValid: boolean; fixedUrl: string } {
    if (!url) return { isValid: false, fixedUrl: '' };
    const fixedUrl = this.fixUrl(url);
    if (type === 'youtube') {
      const isValid = this.isValidYoutubeUrl(fixedUrl);
      return {
        isValid,
        fixedUrl: isValid ? this.fixYoutubeUrl(fixedUrl) : fixedUrl
      };
    } else {
      const isValid = this.isValidLearningPlatformUrl(fixedUrl);
      return {
        isValid,
        fixedUrl: isValid ? fixedUrl : ''
      };
    }
  }

  // التحقق من وجود الرابط
  static async checkUrlExists(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors'
      });
      clearTimeout(timeoutId);
      return true;
    } catch (e) {
      console.warn(`فشل التحقق من الرابط ${url}:`, e);
      return true;
    }
  }

  // التحقق من مجموعة من الروابط
  static async validateUrls(urls: string[], type: 'youtube' | 'learning-platform'): Promise<{ url: string; isValid: boolean }[]> {
    const results = await Promise.all(
      urls.map(async (url) => {
        const { isValid, fixedUrl } = this.validateAndFixUrl(url, type);
        return { url: fixedUrl, isValid: isValid };
      })
    );

    const invalidUrls = results.filter(result => !result.isValid);
    if (invalidUrls.length > 0) {
      toast({
        title: "تنبيه",
        description: `تم العثور على ${invalidUrls.length} روابط غير صالحة`,
        variant: "destructive",
      });
    }

    return results;
  }
} 
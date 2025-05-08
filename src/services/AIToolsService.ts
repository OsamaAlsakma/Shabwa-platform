import { toast } from '@/components/ui/use-toast';

// واجهة تعريف أداة ذكاء اصطناعي
export interface AITool {
  name: string;
  description: string;
  url: string;
  category: string[];
  features: string[];
  pricing: 'free' | 'freemium' | 'paid';
  rating?: number;
  popularity?: number; // مؤشر شعبيّة الأداة (من 1 إلى 5)
  arabicSupport: boolean;
  tags: string[];
  isRecommended?: boolean; // هل الأداة موصى بها
}

// مفتاح واجهة برمجة التطبيقات Gemini مخزن هنا مؤقتًا لأغراض العرض التوضيحي
// في تطبيق الإنتاج، يجب تأمينه من خلال متغير بيئي أو خدمة خلفية
const GEMINI_API_KEY = "AIzaSyAmzJRy5HmUa1rX6L0gr8DN_L7lAythHCQ";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

let cachedTools: Record<string, AITool[]> | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 دقيقة بالمللي ثانية
let allTools: AITool[] = [];

export class AIToolsService {
  /**
   * جلب أدوات الذكاء الاصطناعي من Gemini API
   * @returns وعد بقائمة الأدوات مصنفة حسب الفئة
   */
  static async fetchAllTools(): Promise<Record<string, AITool[]>> {
    try {
      // التحقق من وجود نسخة مخزنة حديثة
      const currentTime = Date.now();
      if (cachedTools && (currentTime - lastFetchTime < CACHE_DURATION)) {
        console.log('استخدام البيانات المخزنة مؤقتًا');
        return cachedTools;
      }
      
      // إعداد طلب إلى Gemini API
      const prompt = `
      أنت مساعد متخصص في أدوات الذكاء الاصطناعي. 
      قم بتوفير قائمة شاملة لأدوات الذكاء الاصطناعي الأكثر استخداماً في عام 2025، مصنفة حسب الفئة.
      
      يجب أن تكون الإجابة بتنسيق JSON بالضبط كما يلي:
      {
        "تحويل الصوت إلى نص": [
          {
            "name": "اسم الأداة",
            "description": "وصف الأداة",
            "url": "رابط الأداة",
            "category": ["فئة1", "فئة2"],
            "features": ["ميزة1", "ميزة2"],
            "pricing": "free/freemium/paid",
            "rating": 4.5,
            "popularity": 5,
            "arabicSupport": true,
            "tags": ["وسم1", "وسم2"],
            "isRecommended": true
          }
        ],
        "تصميم صور": [],
        "كتابة محتوى": [],
        "برمجة وتطوير": [],
        "تحرير الفيديو": []
      }
      
      ملاحظات:
      - يجب توفير 3-5 أدوات لكل فئة
      - يجب أن تكون الأدوات حقيقية وموجودة بالفعل
      - يجب أن تكون الروابط صحيحة
      - يجب أن تكون التقييمات واقعية من 1 إلى 5
      - يجب توفير وصف دقيق ومفصل لكل أداة باللغة العربية
      
      أنا بحاجة إلى إجابة منظمة بتنسيق JSON فقط، بدون أي نص إضافي.
      `;
      
      // إرسال الطلب إلى Gemini API
      console.log('جلب البيانات من Gemini API');
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('خطأ في واجهة برمجة التطبيقات:', errorData);
        
        let errorMessage = "حدث خطأ أثناء جلب أدوات الذكاء الاصطناعي";
        toast({
          title: "خطأ",
          description: errorMessage,
          variant: "destructive",
        });
        
        // استخدام البيانات الاحتياطية في حالة الفشل
        return fallbackTools;
      }
      
      const data = await response.json();
      const textResponse = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!textResponse) {
        console.error('لم يتم العثور على استجابة نصية:', data);
        toast({
          title: "خطأ في الاستجابة",
          description: "لم يتم استلام استجابة صحيحة من خدمة الذكاء الاصطناعي",
          variant: "destructive",
        });
        return fallbackTools;
      }
      
      // استخراج JSON من النص المستلم
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('لم يتم العثور على محتوى JSON في الاستجابة:', textResponse);
        toast({
          title: "خطأ في تنسيق البيانات",
          description: "لم يتم استلام بيانات بتنسيق صحيح",
          variant: "destructive",
        });
        return fallbackTools;
      }
      
      try {
        const jsonContent = jsonMatch[0];
        console.log('المحتوى المستلم:', jsonContent);
        
        const tools = JSON.parse(jsonContent) as Record<string, AITool[]>;
        
        // تحديث التخزين المؤقت
        cachedTools = tools;
        lastFetchTime = currentTime;
        
        // تحديث قائمة جميع الأدوات
        allTools = Object.values(tools).flat();
        
        return tools;
        
      } catch (parseError) {
        console.error('خطأ في تحليل البيانات:', parseError);
        toast({
          title: "خطأ في معالجة البيانات",
          description: "حدث خطأ أثناء معالجة البيانات المستلمة. يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
        return fallbackTools;
      }
      
    } catch (error) {
      console.error('خطأ في جلب أدوات الذكاء الاصطناعي:', error);
      toast({
        title: "خطأ في الاتصال",
        description: "تعذر الاتصال بخدمة الذكاء الاصطناعي",
        variant: "destructive",
      });
      return fallbackTools;
    }
  }
  
  /**
   * البحث عن أدوات الذكاء الاصطناعي المناسبة للاستعلام المقدم
   * @param query استعلام البحث
   * @returns قائمة بالأدوات المطابقة مرتبة حسب الأفضلية
   */
  static async searchTools(query: string): Promise<AITool[]> {
    try {
      // جلب الأدوات من API أولاً
      const tools = await this.fetchAllTools();
      
      // تحديث قائمة جميع الأدوات
      allTools = Object.values(tools).flat();
      
      const normalizedQuery = query.trim().toLowerCase();
      
      // خريطة الكلمات المفتاحية للفئات
      const keywordMap: Record<string, {keywords: string[], priority: number}> = {
        'تحويل الصوت إلى نص': {
          keywords: ['صوت', 'تحويل صوت', 'نص', 'استخراج نص', 'تفريغ', 'كلام', 'إملاء', 'تسجيل', 'محاضرة', 'مقابلة'],
          priority: 1
        },
        'تصميم صور': {
          keywords: ['تصميم', 'صور', 'رسم', 'توليد صور', 'إنشاء صور', 'فن', 'رسومات', 'جرافيك', 'شعار', 'لوحة'],
          priority: 2
        },
        'كتابة محتوى': {
          keywords: ['كتابة', 'مقال', 'محتوى', 'نص', 'تدقيق', 'إبداعي', 'تسويق', 'إعلان', 'مدونة', 'تقرير'],
          priority: 3
        },
        'برمجة وتطوير': {
          keywords: ['برمجة', 'كود', 'تطوير', 'سكريبت', 'برنامج', 'أكواد', 'مطور', 'GitHub', 'مشروع', 'خوارزمية'],
          priority: 4
        },
        'تحرير الفيديو': {
          keywords: ['فيديو', 'تحرير', 'مونتاج', 'مقطع', 'يوتيوب', 'تيك توك', 'إنتاج', 'سيناريو', 'إخراج'],
          priority: 5
        }
      };
      
      // البحث عن تطابق مع الفئات الرئيسية
      for (const [category, {keywords}] of Object.entries(keywordMap)) {
        if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
          return this.sortTools(tools[category] || [], normalizedQuery);
        }
      }
      
      // البحث المتقدم في جميع الأدوات
      const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 2);
      
      if (queryWords.length === 0) {
        return this.getRecommendedTools();
      }
      
      const results = allTools
        .map(tool => ({tool, score: this.calculateScore(tool, queryWords)}))
        .filter(({score}) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({tool}) => tool);
      
      return results.length > 0 ? results : this.getRecommendedTools();
    } catch (error) {
      console.error('خطأ في البحث عن أدوات الذكاء الاصطناعي:', error);
      return [];
    }
  }
  
  /**
   * حساب درجة تطابق الأداة مع الاستعلام
   * @param tool الأداة
   * @param queryWords كلمات الاستعلام
   * @returns درجة التطابق
   */
  private static calculateScore(tool: AITool, queryWords: string[]): number {
    const searchableText = [
      tool.name.toLowerCase(),
      tool.description.toLowerCase(),
      ...tool.category.map(c => c.toLowerCase()),
      ...tool.features.map(f => f.toLowerCase()),
      ...tool.tags.map(t => t.toLowerCase())
    ].join(' ');
    
    let score = 0;
    
    // مطابقة الكلمات
    queryWords.forEach(word => {
      if (searchableText.includes(word)) {
        score += 2;
      }
    });
    
    // تعزيز النتائج الموصى بها
    if (tool.isRecommended) score += 3;
    
    // تعزيز النتائج عالية التقييم
    if (tool.rating && tool.rating >= 4.5) score += 2;
    
    // تعزيز النتائج الشهيرة
    if (tool.popularity && tool.popularity >= 4) score += 1;
    
    // تعزيز الأدوات التي تدعم العربية إذا كان الاستعلام بالعربية
    const isArabicQuery = /[\u0600-\u06FF]/.test(queryWords.join(' '));
    if (tool.arabicSupport && isArabicQuery) score += 2;
    
    return score;
  }
  
  /**
   * فرز الأدوات حسب الأفضلية
   * @param tools قائمة الأدوات
   * @param query استعلام البحث
   * @returns أدوات مرتبة
   */
  private static sortTools(tools: AITool[], query: string): AITool[] {
    const isArabicQuery = /[\u0600-\u06FF]/.test(query);
    
    return [...tools].sort((a, b) => {
      // الأولوية للأدوات الموصى بها
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      
      // ثم الأدوات الأعلى تقييمًا
      if (a.rating && b.rating && a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      
      // ثم الأدوات التي تدعم العربية إذا كان الاستعلام بالعربية
      if (isArabicQuery) {
        if (a.arabicSupport && !b.arabicSupport) return -1;
        if (!a.arabicSupport && b.arabicSupport) return 1;
      }
      
      // ثم الأدوات الأكثر شيوعًا
      if (a.popularity && b.popularity && a.popularity !== b.popularity) {
        return b.popularity - a.popularity;
      }
      
      // ثم الأدوات المجانية أو freemium
      if (a.pricing === 'free' && b.pricing !== 'free') return -1;
      if (a.pricing === 'freemium' && b.pricing === 'paid') return -1;
      
      return 0;
    });
  }
  
  /**
   * الحصول على الأدوات الموصى بها
   * @returns قائمة بالأدوات الموصى بها
   */
  private static getRecommendedTools(): AITool[] {
    return allTools.filter(tool => tool.isRecommended);
  }
}
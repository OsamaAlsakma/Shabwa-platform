import { toast } from '@/components/ui/use-toast';
import { UrlService, ResourceMetadata } from './UrlService';

export interface LearningResource {
  title: string;
  url: string;
  description?: string;
  language: 'arabic' | 'english';
  type: 'free' | 'paid';
  platform?: string;
  channel?: string;
  channelUrl?: string; // رابط قناة اليوتيوب
  year?: number;
  topics?: string[];
  rating?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  score?: number;
}

export interface LearningPath {
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  steps: string[]; // إضافة خطوات تعليمية
  resources: {
    youtube: LearningResource[];
    courses: LearningResource[];
  };
}

export interface LearningPlan {
  topic: string;
  paths: {
    beginner: LearningPath;
    intermediate: LearningPath;
    advanced: LearningPath;
  };
  createdAt: Date;
  id?: string;
}

// مفتاح واجهة برمجة التطبيقات مخزن هنا مؤقتًا لأغراض العرض التوضيحي
// في تطبيق الإنتاج، يجب تأمينه من خلال متغير بيئي أو خدمة خلفية
const GEMINI_API_KEY = "AIzaSyAmzJRy5HmUa1rX6L0gr8DN_L7lAythHCQ";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// وظيفة للتحقق من صحة الروابط
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export async function generateLearningPlan(topic: string): Promise<LearningPlan | null> {
  try {
    const prompt = `
    أنا منصة لتعلم البرمجة باستخدام الذكاء الاصطناعي. المستخدم يريد أن يتعلم عن "${topic}".
    
    يرجى إنشاء خطة تعلم شاملة مع تقسيمها إلى ثلاث مستويات (مبتدئ، متوسط، متقدم) باللغة العربية.
    
    يجب أن تكون الإجابة بتنسيق JSON بالضبط كما يلي:
    {
      "topic": "عنوان الموضوع",
      "paths": {
        "beginner": {
          "level": "beginner",
          "description": "وصف المستوى المبتدئ",
          "steps": [
            "الخطوة الأولى: وصف الخطوة",
            "الخطوة الثانية: وصف الخطوة",
            "الخطوة الثالثة: وصف الخطوة"
          ],
          "resources": {
            "youtube": [
              {
                "title": "عنوان القناة",
                "channelUrl": "رابط القناة",
                "description": "وصف القناة",
                "language": "arabic",
                "type": "free",
                "rating": 5,
                "topics": ["موضوع1", "موضوع2"]
              }
            ],
            "courses": [
              {
                "title": "عنوان الدورة",
                "url": "رابط الدورة",
                "description": "وصف الدورة",
                "language": "arabic",
                "type": "paid",
                "rating": 5,
                "topics": ["موضوع1", "موضوع2"]
              }
            ]
          }
        },
        "intermediate": {
          "level": "intermediate",
          "description": "وصف المستوى المتوسط",
          "steps": [
            "الخطوة الأولى: وصف الخطوة",
            "الخطوة الثانية: وصف الخطوة",
            "الخطوة الثالثة: وصف الخطوة"
          ],
          "resources": {
            "youtube": [],
            "courses": []
          }
        },
        "advanced": {
          "level": "advanced",
          "description": "وصف المستوى المتقدم",
          "steps": [
            "الخطوة الأولى: وصف الخطوة",
            "الخطوة الثانية: وصف الخطوة",
            "الخطوة الثالثة: وصف الخطوة"
          ],
          "resources": {
            "youtube": [],
            "courses": []
          }
        }
      }
    }

    متطلبات المصادر:
    1. قنوات يوتيوب:
       - يجب توفير 3 قنوات يوتيوب عربية على الأقل لكل مستوى
       - يجب توفير 3 قنوات يوتيوب إنجليزية على الأقل لكل مستوى
       - يجب أن تكون روابط القنوات روابط مباشرة لقنوات يوتيوب (مثال: https://www.youtube.com/@channelname)
       - يجب أن تكون القنوات نشطة وتنشر محتوى حديث
       - يجب أن تكون القنوات متخصصة في مجال البرمجة
       - دورات حسوب تعتبر من الدورات العربية المدفوعة وتضاف للدروات التدربية المدفوعة
    2. الدورات التدريبية:
       - يجب توفير 2 دورات عربية على الأقل لكل مستوى
       - يجب توفير 2 دورات إنجليزية على الأقل لكل مستوى
       - يجب أن تكون روابط الدورات روابط مباشرة لصفحات الدورات
       - يجب أن تكون الدورات من منصات معروفة وموثوقة
     -دورات حسوب تعتبر من الدورات العربية المدفوعة التي يجب ان تظهر في الدورات التدربية المدفوعة 
    3. الخطوات التعليمية:
       - يجب توفير 5 خطوات تعليمية على الأقل لكل مستوى
       - يجب أن تكون الخطوات مرتبة بشكل منطقي ومتسلسل
       - يجب أن تكون كل خطوة واضحة ومفصلة
       - يجب أن تشمل الخطوات الممارسة العملية
       - يجب أن تكون الخطوات باللغة العربية
    
    شروط عامة:
    - يجب أن تكون جميع المصادر حديثة (2015 وما بعدها)
    - يجب أن تكون المصادر ذات جودة عالية وموثوقة
    - يجب أن تغطي المحتوى التعليمي بشكل شامل
    - يجب تضمين وصف مفصل لكل مصدر
    - يجب تحديد المواضيع التي يغطيها كل مصدر
    - يجب تحديد مستوى الصعوبة لكل مصدر
    - يجب تحديد تقييم تقريبي لكل مصدر (من 1 إلى 5)
    
    ملاحظات مهمة:
    - يجب أن تكون جميع الحقول المطلوبة موجودة في كل مصدر
    - يجب أن تكون قيم language إما "arabic" أو "english"
    - يجب أن تكون قيم type إما "free" أو "paid"
    - يجب أن تكون قيم rating أرقاماً بين 1 و 5
    - يجب أن تكون جميع الروابط صالحة وقابلة للوصول
    - يجب أن تكون جميع الأوصاف باللغة العربية
    - يجب أن تكون جميع العناوين باللغة العربية
    - يجب أن تكون جميع الخطوات التعليمية باللغة العربية
    -دورات حسوب تعتبر من الدورات العربية المدفوعة التي يجب ان تظهر في الدورات التدربية المدفوعة 

    
    أنا بحاجة إلى إجابة منظمة بتنسيق JSON فقط، بدون أي نص إضافي.
    `;

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
      
      let errorMessage = "حدث خطأ أثناء توليد خطة التعلم";
      if (errorData.error) {
        if (errorData.error.status === 'PERMISSION_DENIED') {
          errorMessage = "خطأ في صلاحيات الوصول إلى خدمة الذكاء الاصطناعي";
        } else if (errorData.error.status === 'INVALID_ARGUMENT') {
          errorMessage = "خطأ في تنسيق الطلب";
        } else if (errorData.error.status === 'RESOURCE_EXHAUSTED') {
          errorMessage = "تم تجاوز حد الاستخدام المسموح به";
        }
      }
      
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
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
      return null;
    }
    
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('لم يتم العثور على محتوى JSON في الاستجابة:', textResponse);
      toast({
        title: "خطأ في تنسيق البيانات",
        description: "لم يتم استلام بيانات بتنسيق صحيح",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const jsonContent = jsonMatch[0];
      console.log('المحتوى المستلم:', jsonContent);
      
      const result = JSON.parse(jsonContent) as LearningPlan;
      
      if (!result.topic || !result.paths) {
        console.error('هيكل البيانات غير صحيح:', result);
        toast({
          title: "خطأ في هيكل البيانات",
          description: "البيانات المستلمة لا تتوافق مع الهيكل المطلوب",
          variant: "destructive",
        });
        return null;
      }

      const requiredLevels = ['beginner', 'intermediate', 'advanced'];
      for (const level of requiredLevels) {
        if (!result.paths[level]) {
          console.error(`المستوى ${level} غير موجود في البيانات`);
          toast({
            title: "خطأ في هيكل البيانات",
            description: `المستوى ${level} غير موجود في البيانات المستلمة`,
            variant: "destructive",
          });
          return null;
        }
      }

      result.createdAt = new Date();
      result.id = Date.now().toString();
      
      for (const [level, path] of Object.entries(result.paths)) {
        console.log(`معالجة المستوى ${level}:`, path);

        if (!path.resources || !path.resources.youtube || !path.resources.courses) {
          console.error(`الموارد غير موجودة للمستوى ${level}`);
          toast({
            title: "خطأ في هيكل البيانات",
            description: `الموارد غير موجودة للمستوى ${level}`,
            variant: "destructive",
          });
          return null;
        }

        /*const youtubeResources = path.resources.youtube.map(resource => {
          if (!resource.channelUrl) {
            console.warn(`رابط القناة غير موجود للمورد: ${resource.title}`);
          }
          return {
            url: resource.channelUrl || '',
            metadata: {
              title: resource.title,
              description: resource.description || '',
              type: 'video',
              level: path.level,
              language: resource.language,
              rating: resource.rating || 0,
              topics: resource.topics || []
            } as ResourceMetadata
          };
        });*/

        /*const sortedYoutubeResources = UrlService.filterAndSortResources(youtubeResources);
        path.resources.youtube = sortedYoutubeResources.map(item => {
          const originalResource = path.resources.youtube.find(r => r.channelUrl === item.url);
          if (!originalResource) {
            console.warn(`لم يتم العثور على المورد الأصلي: ${item.url}`);
          }
          return {
            ...originalResource!,
            score: item.score
          };
        });*/

        const courseResources = path.resources.courses.map(resource => {
          if (!resource.url) {
            console.warn(`رابط الدورة غير موجود للمورد: ${resource.title}`);
          }
          return {
            url: resource.url || '',
            metadata: {
              title: resource.title,
              description: resource.description || '',
              type: 'course',
              level: path.level,
              language: resource.language,
              rating: resource.rating || 0,
              topics: resource.topics || []
            } as ResourceMetadata
          };
        });

        const sortedCourseResources = UrlService.filterAndSortResources(courseResources);
        path.resources.courses = sortedCourseResources.map(item => {
          const originalResource = path.resources.courses.find(r => r.url === item.url);
          if (!originalResource) {
            console.warn(`لم يتم العثور على المورد الأصلي: ${item.url}`);
          }
          return {
            ...originalResource!,
            score: item.score
          };
        });
      }
      
      return result;
    } catch (parseError) {
      console.error('خطأ في تحليل البيانات:', parseError);
      console.error('المحتوى الذي تسبب في الخطأ:', jsonMatch[0]);
      toast({
        title: "خطأ في معالجة البيانات",
        description: "حدث خطأ أثناء معالجة البيانات المستلمة. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      return null;
    }
  } catch (error) {
    console.error('خطأ في توليد خطة التعلم:', error);
    let errorMessage = "تعذر الاتصال بخدمة الذكاء الاصطناعي";
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = "فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت";
    }
    
    toast({
      title: "خطأ في الاتصال",
      description: errorMessage,
      variant: "destructive",
    });
    return null;
  }
}

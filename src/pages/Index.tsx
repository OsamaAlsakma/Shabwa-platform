
import { useState } from 'react';
import { SearchForm } from '@/components/learning/SearchForm';
import { LearningPlanResult } from '@/components/learning/LearningPlanResult';
import { generateLearningPlan, LearningPlan } from '@/services/GeminiService';
import { Loader2, Code, BookOpen, Layout, Sparkles } from "lucide-react";
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [learningPlan, setLearningPlan] = useState<LearningPlan | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const plan = await generateLearningPlan(query);
      if (plan) {
        setLearningPlan(plan);
        toast({
          title: "تم إنشاء خطة التعلم بنجاح",
          description: `تم إنشاء خطة تعلم مخصصة لـ "${query}"`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLearningPlan(null);
  };

  const features = [
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "مصادر متنوعة",
      description: "نقدم أفضل المصادر باللغتين العربية والإنجليزية، مجانية ومدفوعة",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "مسارات تعليمية",
      description: "خطط تعلم مخصصة لجميع المستويات: مبتدئ، متوسط، ومتقدم",
    },
    {
      icon: <Layout className="h-10 w-10 text-primary" />,
      title: "ذكاء اصطناعي",
      description: "نستخدم أحدث تقنيات الذكاء الاصطناعي لإنشاء خطة تعلم تناسب احتياجاتك",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full gap-8">
      {!learningPlan && (
        <>
          <div className="text-center max-w-3xl mx-auto mb-6 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4 gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              <h1 className="text-4xl font-bold text-gradient animate-gradient bg-gradient-to-r from-white to-blue-400">
                تعلم البرمجة بمساعدة الذكاء الاصطناعي
              </h1>
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              منصة يمنية تساعدك على تعلم البرمجة من خلال إنشاء مسار تعليمي مخصص لك باستخدام الذكاء الاصطناعي، وتوفير أفضل المصادر المجانية والمدفوعة باللغتين العربية والإنجليزية.
            </p>
            <p className="text-sm bg-primary/10 text-primary py-2 px-4 rounded-full mt-6 inline-block">
              تم تطوير الموقع بواسطة المهندس أسامة صالح السقمة
            </p>
          </div>
          
          <SearchForm onSearch={handleSearch} isLoading={loading} />
          
          <Separator className="my-12 w-full max-w-3xl opacity-30" />
          
          <div className="w-full max-w-5xl px-4">
            <h2 className="text-2xl font-bold text-center mb-12 relative">
              <span className="relative inline-block">
                مميزات المنصة
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-primary/50 rounded-full"></span>
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex flex-col items-center text-center p-6 rounded-lg border border-white/10 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5",
                    index === 0 && "bg-gradient-to-br from-secondary/10 to-background",
                    index === 1 && "bg-gradient-to-br from-secondary/20 to-background",
                    index === 2 && "bg-gradient-to-br from-secondary/15 to-background",
                  )}
                >
                  <div className="mb-4 rounded-full bg-primary/10 p-3 shadow-inner shadow-primary/5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full max-w-3xl mt-12 p-8 rounded-lg glass-morphism text-center">
            <h2 className="text-2xl font-bold mb-4">مساعدة في رحلتك التعليمية</h2>
            <p className="mb-6 text-muted-foreground">
              نحن هنا لمساعدتك في رحلة تعلم البرمجة من البداية وحتى الاحتراف
            </p>
            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30">
              ابدأ الآن
            </Button>
          </div>
        </>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="glass-morphism p-10 rounded-xl flex flex-col items-center max-w-md w-full">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
            <p className="text-xl font-semibold mb-2">
              جاري إنشاء خطة التعلم الخاصة بك...
            </p>
            <p className="text-sm text-muted-foreground text-center">
              نقوم بتحليل طلبك وإنشاء مسار تعليمي مخصص مع أفضل الموارد المناسبة لك
            </p>
          </div>
        </div>
      )}

      {!loading && learningPlan && (
        <LearningPlanResult plan={learningPlan} onReset={handleReset} />
      )}
    </div>
  );
};

export default Index;

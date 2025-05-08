
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LevelCard } from "./LevelCard";
import { LearningPlan } from "@/services/GeminiService";
import { LearningPlanService } from "@/services/LearningPlanService";
import { AuthService } from "@/services/AuthService";
import { BookmarkIcon, BookmarkCheck, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface LearningPlanResultProps {
  plan: LearningPlan;
  onReset: () => void;
}

export function LearningPlanResult({ plan, onReset }: LearningPlanResultProps) {
  const [isSaved, setIsSaved] = useState(false);
  const isAuthenticated = AuthService.isAuthenticated();
  const navigate = useNavigate();

  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "الرجاء تسجيل الدخول لحفظ خطط التعلم",
      });
      navigate("/login");
      return;
    }
    
    const success = LearningPlanService.savePlan(plan);
    if (success) {
      setIsSaved(true);
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ خطة التعلم في حسابك",
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">مسار تعلم: <span className="text-gradient-primary">{plan.topic}</span></h1>
            <p className="text-muted-foreground">تم إنشاؤه بواسطة الذكاء الاصطناعي</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="border-white/20 hover:border-white/30 hover:bg-white/5"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              بحث جديد
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isSaved}
              variant={isSaved ? "secondary" : "default"}
              className={isSaved ? "bg-green-600/20 text-green-400" : "bg-gradient-to-r from-primary to-blue-600"}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-4 w-4 ml-2" />
                  تم الحفظ
                </>
              ) : (
                <>
                  <BookmarkIcon className="h-4 w-4 ml-2" />
                  حفظ المسار
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="beginner" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-3 p-1 rounded-xl bg-secondary/20 backdrop-blur-sm">
          <TabsTrigger value="beginner" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">مبتدئ</TabsTrigger>
          <TabsTrigger value="intermediate" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">متوسط</TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">متقدم</TabsTrigger>
        </TabsList>
        
        <TabsContent value="beginner" className="mt-6 animate-fade-in">
          <LevelCard path={plan.paths.beginner} />
        </TabsContent>
        
        <TabsContent value="intermediate" className="mt-6 animate-fade-in">
          <LevelCard path={plan.paths.intermediate} />
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6 animate-fade-in">
          <LevelCard path={plan.paths.advanced} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

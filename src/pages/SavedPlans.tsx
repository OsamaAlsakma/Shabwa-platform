
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LearningPlan } from "@/services/GeminiService";
import { LearningPlanService } from "@/services/LearningPlanService";
import { SavedPlanCard } from "@/components/ui/saved-plan-card";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { BookmarkX } from "lucide-react";

const SavedPlans = () => {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load saved plans
    const savedPlans = LearningPlanService.getSavedPlans();
    setPlans(savedPlans);
  }, [navigate, isAuthenticated]);

  const handleDelete = (id: string) => {
    LearningPlanService.deletePlan(id);
    setPlans(prev => prev.filter(plan => plan.id !== id));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">خطط التعلم المحفوظة</h1>
      
      {plans.length === 0 ? (
        <div className="text-center py-16 border border-white/10 rounded-lg bg-secondary/50">
          <BookmarkX className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-medium mb-2">لا توجد خطط تعلم محفوظة</h2>
          <p className="text-muted-foreground mb-6">
            قم بإنشاء خطة تعلم جديدة وحفظها لعرضها هنا
          </p>
          <Button onClick={() => navigate('/')}>
            إنشاء خطة تعلم جديدة
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => (
            <SavedPlanCard 
              key={plan.id} 
              plan={plan} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPlans;

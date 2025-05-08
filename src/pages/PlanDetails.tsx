
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LearningPlan } from "@/services/GeminiService";
import { LearningPlanService } from "@/services/LearningPlanService";
import { LearningPlanResult } from "@/components/learning/LearningPlanResult";
import { AuthService } from "@/services/AuthService";
import { Loader2 } from "lucide-react";

const PlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!id) {
      navigate('/saved');
      return;
    }

    // Load the specific plan
    const savedPlans = LearningPlanService.getSavedPlans();
    const foundPlan = savedPlans.find(p => p.id === id);
    
    if (foundPlan) {
      setPlan(foundPlan);
    } else {
      navigate('/saved');
    }
    
    setLoading(false);
  }, [id, navigate, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على خطة التعلم</h2>
        <Button onClick={() => navigate('/saved')}>
          العودة إلى الخطط المحفوظة
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/saved')}>
          العودة إلى الخطط المحفوظة
        </Button>
      </div>
      
      <LearningPlanResult 
        plan={plan} 
        onReset={() => navigate('/')} 
      />
    </div>
  );
};

export default PlanDetails;


import { LearningPlan } from './GeminiService';
import { AuthService } from './AuthService';
import { toast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'arab-ai-learn-saved-plans';

interface UserPlans {
  [userId: string]: LearningPlan[];
}

export class LearningPlanService {
  static savePlan(plan: LearningPlan): boolean {
    try {
      const user = AuthService.getUser();
      if (!user) {
        toast({
          title: "لم يتم حفظ الخطة",
          description: "يرجى تسجيل الدخول لحفظ خطط التعلم",
          variant: "destructive",
        });
        return false;
      }

      // Generate ID if not present
      if (!plan.id) {
        plan.id = Date.now().toString();
      }

      const storedData = localStorage.getItem(STORAGE_KEY);
      const userPlans: UserPlans = storedData ? JSON.parse(storedData) : {};
      
      // Initialize user's plans array if it doesn't exist
      if (!userPlans[user.id]) {
        userPlans[user.id] = [];
      }
      
      // Check if this plan already exists
      const existingPlanIndex = userPlans[user.id].findIndex(p => p.id === plan.id);
      
      if (existingPlanIndex !== -1) {
        // Update existing plan
        userPlans[user.id][existingPlanIndex] = plan;
      } else {
        // Add new plan
        userPlans[user.id].push(plan);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(userPlans));
      
      toast({
        title: "تم حفظ الخطة",
        description: `تم حفظ خطة "${plan.topic}" بنجاح`,
      });
      return true;
    } catch (e) {
      console.error('Error saving learning plan:', e);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الخطة",
        variant: "destructive",
      });
      return false;
    }
  }

  static getSavedPlans(): LearningPlan[] {
    try {
      const user = AuthService.getUser();
      if (!user) return [];

      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) return [];

      const userPlans: UserPlans = JSON.parse(storedData);
      return userPlans[user.id] || [];
    } catch (e) {
      console.error('Error retrieving saved plans:', e);
      return [];
    }
  }

  static deletePlan(planId: string): boolean {
    try {
      const user = AuthService.getUser();
      if (!user) return false;

      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) return false;

      const userPlans: UserPlans = JSON.parse(storedData);
      
      if (!userPlans[user.id]) return false;

      userPlans[user.id] = userPlans[user.id].filter(plan => plan.id !== planId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userPlans));
      
      toast({
        title: "تم حذف الخطة",
        description: "تم حذف خطة التعلم بنجاح",
      });
      return true;
    } catch (e) {
      console.error('Error deleting learning plan:', e);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الخطة",
        variant: "destructive",
      });
      return false;
    }
  }
}

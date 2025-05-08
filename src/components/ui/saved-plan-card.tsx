
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { LearningPlan } from "@/services/GeminiService";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface SavedPlanCardProps {
  plan: LearningPlan;
  onDelete: (id: string) => void;
}

export function SavedPlanCard({ plan, onDelete }: SavedPlanCardProps) {
  const navigate = useNavigate();
  
  const createdAt = plan.createdAt instanceof Date 
    ? plan.createdAt 
    : new Date(plan.createdAt);
  
  const timeAgo = formatDistanceToNow(createdAt, { 
    addSuffix: true, 
    locale: ar 
  });

  const handleView = () => {
    navigate(`/plan/${plan.id}`);
  };

  return (
    <Card className="border border-white/10 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-lg glass-morphism">
      <CardHeader>
        <CardTitle className="text-xl text-gradient">{plan.topic}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">تم إنشاؤه {timeAgo}</p>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full hover:bg-red-500/10 hover:text-red-400 transition-colors" 
          onClick={() => onDelete(plan.id!)}
        >
          <Trash2 className="h-4 w-4 ml-2" />
          حذف
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/50" 
          onClick={handleView}
        >
          <Eye className="h-4 w-4 ml-2" />
          عرض
        </Button>
      </CardFooter>
    </Card>
  );
}

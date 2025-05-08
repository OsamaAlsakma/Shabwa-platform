import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResourceCard } from "./ResourceCard";
import { LearningPath } from "@/services/GeminiService";
import { GraduationCap, Youtube, CreditCard, ListChecks } from "lucide-react";

interface LevelCardProps {
  path: LearningPath;
}

export function LevelCard({ path }: LevelCardProps) {
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          المستوى {path.level === 'beginner' ? 'المبتدئ' : path.level === 'intermediate' ? 'المتوسط' : 'المتقدم'}
        </CardTitle>
        <CardDescription>{path.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="steps" dir="rtl" className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-1 rounded-xl bg-secondary/20 backdrop-blur-sm">
            <TabsTrigger value="steps" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ListChecks className="h-4 w-4 ml-2" />
              الخطوات التعليمية
            </TabsTrigger>
            <TabsTrigger value="youtube" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Youtube className="h-4 w-4 ml-2" />
              قنوات يوتيوب
            </TabsTrigger>
            <TabsTrigger value="courses" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CreditCard className="h-4 w-4 ml-2" />
              دورات تدريبية
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="steps" className="mt-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {path.steps.map((step, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-secondary/20 backdrop-blur-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="youtube" className="mt-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {path.resources.youtube.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="courses" className="mt-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {path.resources.courses.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

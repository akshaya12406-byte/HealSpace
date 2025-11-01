'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { wellnessIdeas, WellnessIdea } from '@/data/wellness-ideas';
import TodoItem from '@/components/plan/todo-item';
import { useToast } from '@/hooks/use-toast';

export default function PlanPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [myTimeline, setMyTimeline] = useState<WellnessIdea[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleAddTodo = (idea: WellnessIdea) => {
    setMyTimeline((prev) => [...prev, idea]);
    toast({
        title: "Activity Added",
        description: `"${idea.title}" has been added to your timeline.`
    })
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-2 mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
          Plan Your Positive Day
        </h1>
        <p className="text-muted-foreground">
          Structure your day with small, achievable wellness goals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Daily Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTimeline.length > 0 ? (
                  myTimeline.map((item, index) => (
                      <TodoItem 
                        key={`${item.id}-${index}`} 
                        item={item}
                      />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Your timeline is empty. Add an idea from the library to get started!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Wellness Ideas Library */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Wellness Ideas Library</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-3">
                  {wellnessIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{idea.title}</span>
                        <span className="text-sm text-muted-foreground">{idea.category}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddTodo(idea)}
                        aria-label={`Add ${idea.title}`}
                      >
                        <PlusCircle className="h-5 w-5 text-primary" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

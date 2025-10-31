'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { wellnessIdeas, WellnessIdea } from '@/data/wellness-ideas';
import TodoItem, { type Todo } from '@/components/plan/todo-item';
import { useToast } from '@/hooks/use-toast';

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export default function PlanPage() {
  const { user, isUserLoading } = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const today = getTodayDateString();

  const todosCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'daily_plans', today, 'todos');
  }, [firestore, user, today]);

  const { data: todos, isLoading: todosLoading } = useCollection<Todo>(todosCollectionRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleAddTodo = async (idea: WellnessIdea) => {
    if (!todosCollectionRef) return;
    
    const newTodo: Omit<Todo, 'id'> = {
        ...idea,
        completed: false,
        createdAt: new Date().toISOString(),
    };

    try {
        await addDoc(todosCollectionRef, newTodo);
        toast({
            title: "Activity Added",
            description: `"${idea.title}" has been added to your timeline.`
        })
    } catch(error) {
        console.error("Error adding todo:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not add the activity to your plan."
        })
    }
  };
  
  const handleToggleTodo = async (todo: Todo) => {
      if (!user) return;
      const todoRef = doc(firestore, 'users', user.uid, 'daily_plans', today, 'todos', todo.id);
      try {
        await updateDoc(todoRef, { completed: !todo.completed });
      } catch (error) {
        console.error("Error updating todo:", error)
      }
  };

  const handleDeleteTodo = async (todoId: string) => {
      if (!user) return;
      const todoRef = doc(firestore, 'users', user.uid, 'daily_plans', today, 'todos', todoId);
      try {
        await deleteDoc(todoRef);
        toast({
            title: "Activity Removed",
            description: "The activity has been removed from your plan."
        })
      } catch (error) {
        console.error("Error deleting todo:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not remove the activity."
        })
      }
  };


  if (isUserLoading || !user) {
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
                {todosLoading && <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}
                {!todosLoading && todos && todos.length > 0 ? (
                  todos
                    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
                    .map((todo) => (
                      <TodoItem 
                        key={todo.id} 
                        item={todo} 
                        onToggle={() => handleToggleTodo(todo)}
                        onDelete={() => handleDeleteTodo(todo.id)}
                      />
                  ))
                ) : null}
                {!todosLoading && (!todos || todos.length === 0) && (
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

    
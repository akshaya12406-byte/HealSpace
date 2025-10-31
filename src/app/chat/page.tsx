'use client';

import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { healBuddyWellnessGuidance } from '@/ai/flows/ai-chatbot-guidance';
import { cn } from '@/lib/utils';
import { Bot, Loader2, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const conversationStarters = [
  "I'm feeling really anxious today.",
  "How can I deal with stress at work?",
  "I had a fight with a friend.",
  "I just want to talk to someone."
];

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Namaste! I'm HealBuddy, your AI friend. How are you feeling today? 😊"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // This is a bit of a hack to scroll to the bottom.
        // The viewport is a child of the ref, so we access it directly.
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = { role: 'user', content: messageContent };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await healBuddyWellnessGuidance({ message: messageContent, chatHistory });
      
      const assistantMessage: Message = { role: 'assistant', content: response.response };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: Message = { role: 'assistant', content: "I'm having a little trouble connecting right now. Please try again in a moment. 😊" };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
    setInput('');
  };

  const handleStarterClick = (starter: string) => {
    setInput(starter);
    handleSendMessage(starter);
    setInput('');
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 h-[calc(100vh-8rem)] flex flex-col">
        <div className="space-y-2 mb-8">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Chat with HealBuddy</h1>
            <p className="text-muted-foreground">Your empathetic AI companion for wellness guidance.</p>
        </div>
      <div className="flex-1 overflow-hidden flex flex-col bg-card border rounded-lg shadow-sm">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-secondary text-secondary-foreground rounded-bl-none'
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border">
                     <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                    <AvatarFallback>{user.displayName?.charAt(0) ?? user.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8 border">
                   <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="bg-secondary text-secondary-foreground rounded-xl rounded-bl-none px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {messages.length <= 1 && (
            <div className="p-4 border-t">
                <p className="text-sm text-muted-foreground mb-2 text-center">Not sure where to start? Try one of these:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {conversationStarters.map(starter => (
                        <Button key={starter} variant="outline" size="sm" onClick={() => handleStarterClick(starter)}>
                            {starter}
                        </Button>
                    ))}
                </div>
            </div>
        )}

        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message to HealBuddy..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import WellnessRhythmChart, { type SentimentData } from '@/components/journal/wellness-rhythm-chart';
import { useToast } from '@/hooks/use-toast';
import { analyzeSentiment, type JournalSentimentOutput } from '@/ai/flows/journal-sentiment-analysis';
import { Loader2 } from 'lucide-react';

const getInitialSentimentData = (): SentimentData[] => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6-i));
    return {
      date: date.toISOString().split('T')[0],
      score: Math.random() * 1.5 - 0.75, // Random score between -0.75 and 0.75
    };
  });
};

export default function JournalPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [journalEntry, setJournalEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<JournalSentimentOutput | null>(null);
  const [sentimentHistory, setSentimentHistory] = useState<SentimentData[]>([]);

  useEffect(() => {
    setSentimentHistory(getInitialSentimentData());
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!journalEntry.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Entry',
        description: 'Please write something before analyzing.',
      });
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeSentiment({ journalEntry });
      setAnalysis(result);
      const newSentimentPoint = {
        date: new Date().toISOString().split('T')[0],
        score: result.sentimentScore,
      };
      setSentimentHistory(prev => [...prev.slice(-6), newSentimentPoint]);

      if (result.sentimentScore < -0.5) {
        toast({
          title: 'A Heavy Day',
          description: "It looks like today was tough. Would you like to explore these feelings with HealBuddy?",
          action: (
            <Button size="sm" onClick={() => router.push('/chat')}>
              Chat with HealBuddy
            </Button>
          ),
          duration: 10000,
        });
      }
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'We couldn\'t analyze your entry right now. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Your Private Journal</h1>
        <p className="text-muted-foreground">Reflect on your day. Your thoughts are safe and private.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Today's Entry</CardTitle>
              <CardDescription>What's on your mind? Let it all out.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Start writing here..."
                  className="min-h-[250px] text-base resize-none"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Analyzing...' : 'Analyze My Feelings'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {analysis && (
             <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-lg">
                  Today's feeling is: <span className="font-bold text-primary">{analysis.sentimentLabel}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Sentiment Score: {analysis.sentimentScore.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Your Wellness Rhythm</CardTitle>
              <CardDescription>A 7-day view of your emotional journey.</CardDescription>
            </CardHeader>
            <CardContent>
              <WellnessRhythmChart data={sentimentHistory} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

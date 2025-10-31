'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import WellnessRhythmChart, { type SentimentData } from '@/components/journal/wellness-rhythm-chart';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { Progress } from '@/components/ui/progress';

const getInitialSentimentData = (): SentimentData[] => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      score: 0,
    };
  });
};

// Simple sentiment mapping - a real model would be more complex
const getSentimentFromTfScore = (score: number): { label: string; score: number } => {
    // This is a dummy conversion. A real model would require a trained classifier on top of USE.
    // For this demo, we'll simulate a score based on tensor values.
    const scaledScore = (score - 0.5) * 2; // scale to -1 to 1
    let label = 'Neutral';
    if (scaledScore > 0.3) label = 'Positive';
    else if (scaledScore < -0.3) label = 'Negative';
    return { label, score: scaledScore };
};


export default function JournalPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [journalEntry, setJournalEntry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [analysis, setAnalysis] = useState<{ sentimentLabel: string, sentimentScore: number } | null>(null);
  const [sentimentHistory, setSentimentHistory] = useState<SentimentData[]>([]);

  const modelRef = useRef<use.UniversalSentenceEncoder | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastNudgeScore = useRef<number | null>(null);

  useEffect(() => {
    setSentimentHistory(getInitialSentimentData());
    
    async function loadModel() {
      tf.setBackend('webgl');
      try {
        const loadedModel = await use.load();
        modelRef.current = loadedModel;
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load TensorFlow.js model:", err);
        toast({
          variant: 'destructive',
          title: 'Model Failed to Load',
          description: 'The real-time analysis feature may not work.'
        });
        setIsLoading(false);
      }
    }
    loadModel();

    return () => {
        if(debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    }
  }, [toast]);

  const analyzeInRealTime = useCallback(async (text: string) => {
    if (!modelRef.current || !text.trim()) {
      setAnalysis(null);
      return;
    }

    try {
      const embeddings = await modelRef.current.embed([text]);
      const data = await embeddings.data();
      // This is a simplified sentiment calculation.
      const score = data.reduce((a, b) => a + b, 0) / data.length;
      const { label, score: sentimentScore } = getSentimentFromTfScore(score);
      
      setAnalysis({ sentimentLabel: label, sentimentScore });

      // Update chart
      const todayStr = new Date().toISOString().split('T')[0];
      setSentimentHistory(prev => {
          const newHistory = [...prev];
          const todayIndex = newHistory.findIndex(d => d.date === todayStr);
          const newPoint = { date: todayStr, score: sentimentScore };
          if(todayIndex > -1) {
              newHistory[todayIndex] = newPoint;
          } else {
              newHistory.shift();
              newHistory.push(newPoint);
          }
          return newHistory;
      });

      // Proactive Nudge Logic
      if (sentimentScore < -0.5 && (!lastNudgeScore.current || lastNudgeScore.current >= -0.5)) {
        toast({
          title: 'A Heavy Day',
          description: "It looks like today was a heavy day. Would you like to explore these feelings with HealBuddy?",
          action: (
            <Button size="sm" onClick={() => router.push('/chat')}>
              Chat with HealBuddy
            </Button>
          ),
          duration: 10000,
        });
      }
      lastNudgeScore.current = sentimentScore;

    } catch (error) {
      console.error('Real-time analysis failed:', error);
    }
  }, [router, toast]);


  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJournalEntry(newText);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
        analyzeInRealTime(newText);
    }, 500); // Debounce for 500ms
  };


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isLoading) {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground mb-2">Loading analysis model...</p>
            <Progress value={loadingProgress} className="w-1/4" />
        </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-2 mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Your Private Journal</h1>
        <p className="text-muted-foreground">Reflect on your day. Your thoughts are analyzed on-device for your privacy.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Today's Entry</CardTitle>
              <CardDescription>What's on your mind? The chart will update as you type.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <Textarea
                  placeholder="Start writing here..."
                  className="min-h-[250px] text-base resize-none"
                  value={journalEntry}
                  onChange={handleTextChange}
                />
                <Button type="submit" disabled>
                  Analyze My Feelings (Analysis is real-time)
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {analysis && (
             <Card>
              <CardHeader>
                <CardTitle>Real-time Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-lg">
                  Current feeling is: <span className="font-bold text-primary">{analysis.sentimentLabel}</span>
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

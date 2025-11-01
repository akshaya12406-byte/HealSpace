
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Map the [-1, 1] sentiment score to a [1, 5] wellness scale
const toWellnessScore = (sentimentScore: number) => {
    return sentimentScore * 2 + 3;
};

// Pre-defined data for the graph for the last 6 days.
const getInitialSentimentData = (): SentimentData[] => {
  const today = new Date();
  const data: SentimentData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    // Use a pseudo-random score for past days and 3 (neutral) for today
    const score = i === 0 ? 3 : toWellnessScore(Math.sin(i) * 0.5);
    data.push({
      date: date.toISOString().split('T')[0],
      score: score,
    });
  }
  return data;
};

// Simple sentiment mapping
const getSentimentFromTfScore = (score: number): { label: string; score: number } => {
    const scaledScore = (score - 0.5) * 2; // Original score in [-1, 1]
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
  const [analysis, setAnalysis] = useState<{ sentimentLabel: string, wellnessScore: number } | null>(null);
  const [sentimentHistory, setSentimentHistory] = useState<SentimentData[]>([]);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [modalInputValue, setModalInputValue] = useState('');

  const modelRef = useRef<use.UniversalSentenceEncoder | null>(null);
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
  }, [toast]);

  const analyzeSentiment = useCallback(async (text: string) => {
    if (!modelRef.current || !text.trim()) {
      setAnalysis(null);
      return;
    }

    try {
      const embeddings = await modelRef.current.embed([text]);
      const data = await embeddings.data();
      const score = data.reduce((a, b) => a + b, 0) / data.length;
      const { label, score: sentimentScore } = getSentimentFromTfScore(score);
      const wellnessScore = toWellnessScore(sentimentScore);
      
      setAnalysis({ sentimentLabel: label, wellnessScore: wellnessScore });

      const todayStr = new Date().toISOString().split('T')[0];
      setSentimentHistory(prev => {
          const newHistory = [...prev];
          const todayIndex = newHistory.findIndex(d => d.date === todayStr);
          const newPoint = { date: todayStr, score: wellnessScore };
          if(todayIndex > -1) {
              newHistory[todayIndex] = newPoint;
          } else {
              newHistory.shift();
              newHistory.push(newPoint);
          }
          return newHistory;
      });

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

  const handleChartClick = (data: any) => {
    const clickedData = data?.activePayload?.[0]?.payload;
    const todayStr = new Date().toISOString().split('T')[0];
    if (clickedData?.date === todayStr) {
      setModalInputValue(journalEntry); // Pre-fill with current journal entry
      setIsInputModalOpen(true);
    }
  };

  const handleModalSubmit = () => {
    setJournalEntry(modalInputValue);
    analyzeSentiment(modalInputValue);
    setIsInputModalOpen(false);
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
    <>
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
                <CardDescription>Click on today's point in the chart to log your feelings.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Textarea
                    placeholder="Your journal entry will appear here after you add it via the chart..."
                    className="min-h-[250px] text-base resize-none"
                    value={journalEntry}
                    readOnly
                  />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {analysis && (
               <Card>
                <CardHeader>
                  <CardTitle>Today's Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-lg">
                    Current feeling is: <span className="font-bold text-primary">{analysis.sentimentLabel}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Wellness Score (1-5): {analysis.wellnessScore.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Your Wellness Rhythm</CardTitle>
                <CardDescription>A 7-day view of your emotional journey. Click today's point to add an entry.</CardDescription>
              </CardHeader>
              <CardContent>
                <WellnessRhythmChart data={sentimentHistory} onChartClick={handleChartClick} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Input Dialog */}
      <AlertDialog open={isInputModalOpen} onOpenChange={setIsInputModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>How are you feeling today?</AlertDialogTitle>
            <AlertDialogDescription>
              Write down your thoughts and feelings. The graph will update with a wellness score.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="What's on your mind?"
            value={modalInputValue}
            onChange={(e) => setModalInputValue(e.target.value)}
            className="min-h-[150px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleModalSubmit}>Save & Analyze</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

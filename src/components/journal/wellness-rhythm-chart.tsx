'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

export interface SentimentData {
  date: string;
  score: number;
}

interface WellnessRhythmChartProps {
  data: SentimentData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-2">
          <p className="label">{`Date : ${label}`}</p>
          <p className="intro">{`Sentiment Score : ${payload[0].value.toFixed(2)}`}</p>
        </Card>
      );
    }
  
    return null;
  };

export default function WellnessRhythmChart({ data }: WellnessRhythmChartProps) {
  const formattedData = data.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.score,
  }));

  return (
    <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[-1, 1]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(var(--accent) / 0.2)' }} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}

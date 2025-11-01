
'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Line, Dot } from 'recharts';
import { Card } from '@/components/ui/card';

export interface SentimentData {
  date: string;
  score: number;
}

interface WellnessRhythmChartProps {
  data: SentimentData[];
  onChartClick?: (data: any) => void;
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

  const CustomDot = (props: any) => {
    const { cx, cy, payload, todayStr } = props;
    
    if (payload.date === todayStr) {
      return (
        <Dot
          cx={cx}
          cy={cy}
          r={5}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="hsl(var(--background))"
        />
      );
    }
  
    return <Dot cx={cx} cy={cy} r={3} fill="hsl(var(--muted-foreground))" />;
  };

  const sentimentTickFormatter = (value: number) => {
    if (value === 1) return 'Positive';
    if (value === 0) return 'Neutral';
    if (value === -1) return 'Negative';
    return '';
  };

export default function WellnessRhythmChart({ data, onChartClick }: WellnessRhythmChartProps) {
  const formattedData = data.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.score,
    date: item.date, // Pass original date for click handler
  }));

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} onClick={onChartClick}>
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                    domain={[-1, 1]} 
                    ticks={[-1, 0, 1]}
                    tickFormatter={sentimentTickFormatter}
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    width={70}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorScore)"
                    activeDot={{ r: 6, style: { stroke: 'hsl(var(--primary))', fill: 'hsl(var(--background))' } }}
                    dot={<CustomDot todayStr={todayStr} />}
                 />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  );
}

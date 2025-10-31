'use client';

import Link from 'next/link';
import { WellnessIdea } from '@/data/wellness-ideas';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Bot,
  CircleDot,
  Footprints,
  Heart,
  Music,
  Sparkles,
  Sun,
  Users,
  Wind,
  Book,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export interface Todo extends WellnessIdea {
  completed: boolean;
  createdAt: string;
}

interface TodoItemProps {
  item: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

// Map string names to Lucide components
const iconMap: { [key: string]: LucideIcon } = {
  'book-open': BookOpen,
  bot: Bot,
  heart: Heart,
  footprints: Footprints,
  users: Users,
  'stretch-horizontal': Users, // Using Users as a fallback for now
  sparkles: Sparkles,
  music: Music,
  'circle-dot': CircleDot,
  sun: Sun,
  wind: Wind,
  book: Book,
};


export default function TodoItem({ item, onToggle, onDelete }: TodoItemProps) {
  const Icon = iconMap[item.icon] || Heart; // Default to Heart icon if not found

  const content = (
    <div
      className={cn(
        'group flex items-center p-4 rounded-lg border transition-all',
        item.completed
          ? 'bg-secondary/50 border-dashed'
          : 'bg-card',
        item.internalLink
          ? 'hover:bg-accent/50 hover:border-primary/50 cursor-pointer'
          : ''
      )}
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mr-4">
        <Icon className={cn("h-5 w-5 text-primary", item.completed && "text-primary/50")} />
      </div>
      <div className="flex-grow" onClick={item.internalLink ? undefined : onToggle}>
         <p className={cn("font-medium text-card-foreground", item.completed && "line-through text-muted-foreground")}>{item.title}</p>
        <p className="text-sm text-muted-foreground">{item.category}</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Checkbox
            checked={item.completed}
            onCheckedChange={onToggle}
            aria-label={`Mark ${item.title} as ${item.completed ? 'incomplete' : 'complete'}`}
        />
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );

  if (item.internalLink && !item.completed) {
    return <Link href={item.internalLink}>{content}</Link>;
  }

  return content;
}

    
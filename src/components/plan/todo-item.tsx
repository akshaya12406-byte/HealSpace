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
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '../ui/button';

interface TodoItemProps {
  item: WellnessIdea;
  onRemove: () => void;
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


export default function TodoItem({ item, onRemove }: TodoItemProps) {
  const Icon = iconMap[item.icon] || Heart; // Default to Heart icon if not found

  const content = (
    <div
      className={cn(
        'group flex items-center p-4 rounded-lg border transition-all bg-card relative',
        item.internalLink
          ? 'hover:bg-accent/50 hover:border-primary/50 cursor-pointer'
          : ''
      )}
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mr-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-grow">
         <p className="font-medium text-card-foreground">{item.title}</p>
        <p className="text-sm text-muted-foreground">{item.category}</p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
        onClick={(e) => {
            e.stopPropagation(); // Prevent link navigation if it's a link item
            e.preventDefault();
            onRemove();
        }}
        aria-label={`Remove ${item.title}`}
    >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  if (item.internalLink) {
    return <Link href={item.internalLink}>{content}</Link>;
  }

  return content;
}

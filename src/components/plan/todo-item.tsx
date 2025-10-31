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
  type LucideIcon,
} from 'lucide-react';

interface TodoItemProps {
  item: WellnessIdea;
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


export default function TodoItem({ item }: TodoItemProps) {
  const Icon = iconMap[item.icon] || Heart; // Default to Heart icon if not found

  const content = (
    <div
      className={cn(
        'group flex items-center p-4 rounded-lg border transition-all bg-card',
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
    </div>
  );

  if (item.internalLink) {
    return <Link href={item.internalLink}>{content}</Link>;
  }

  return content;
}

import data from './wellness-ideas.json';
import type { LucideIcon } from 'lucide-react';

export interface WellnessIdea {
  id: number;
  title: string;
  category: string;
  icon: string;
  internalLink?: string;
}

export const wellnessIdeas: WellnessIdea[] = data;

import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <HeartHandshake className="h-6 w-6 mr-2 text-primary" />
          <p className="text-sm font-semibold">HealSpace</p>
        </div>
        <p className="text-sm text-muted-foreground mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} HealSpace. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <Link href="#" className="text-sm hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

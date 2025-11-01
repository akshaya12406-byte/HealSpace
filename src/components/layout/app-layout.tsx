'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import Footer from './footer';
import TherapistDashboard from '@/components/therapist/dashboard';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/login', '/signup', '/pending-approval', '/signup/parental-consent'];
  const showLayout = !noLayoutRoutes.some(route => pathname.startsWith(route));

  const { user, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);

  const isTherapist = userProfile?.role === 'therapist';

  const isLoading = authLoading || (user && profileLoading);

  return (
    <div className="flex flex-col min-h-screen">
      {showLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {showLayout && <Footer />}

      {isLoading && (
         <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-[100]">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {!isLoading && isTherapist && <TherapistDashboard userProfile={userProfile} />}
    </div>
  );
}

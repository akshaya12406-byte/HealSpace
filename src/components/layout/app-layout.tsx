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

      {/* Therapist-only section */}
      {!isLoading && isTherapist && (
        <div className="container mx-auto py-8 px-4 md:px-6">
             <Card className="bg-secondary">
                <CardHeader>
                    <CardTitle className="font-headline text-primary">Therapist Window</CardTitle>
                    <CardDescription>Exclusive dashboard for verified therapists</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section is only visible to you because you are logged in as a therapist. The floating dashboard is your main workspace.</p>
                </CardContent>
            </Card>
        </div>
      )}

      {isLoading && (
         <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-[100]">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {!isLoading && isTherapist && <TherapistDashboard userProfile={userProfile} />}
    </div>
  );
}

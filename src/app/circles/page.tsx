
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Loader2 } from 'lucide-react';
import SosButton from '@/components/sos-button';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/use-user-profile';

const supportCircles = [
  {
    title: 'Managing Anxiety',
    description: 'A circle for sharing strategies and support for anxiety.',
    members: 42,
  },
  {
    title: 'Student Life Stress',
    description: 'Connect with fellow students to navigate academic and social pressures.',
    members: 78,
  },
  {
    title: 'Workplace Wellness',
    description: 'Discuss challenges and find balance in your professional life.',
    members: 55,
  },
  {
    title: 'Grief and Loss Support',
    description: 'A safe space to share and process feelings of loss.',
    members: 23,
  },
];

export default function CirclesPage() {
  const { user, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);
  const router = useRouter();
  const { toast } = useToast();

  const handleJoinCircle = (circleTitle: string) => {
    if (!user) {
        toast({
            title: 'Login Required',
            description: 'Please log in or sign up to join a circle.',
            action: <Button size="sm" onClick={() => router.push('/login')}>Login</Button>
        });
        return;
    }
    toast({
      title: 'Request to Join Sent',
      description: `Your request to join the "${circleTitle}" circle is pending approval. You'll be notified soon.`,
    });
  };

  const isLoading = authLoading || (user && profileLoading);
  const isTherapist = userProfile?.role === 'therapist';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-8">
        <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Peer Support Circles</h1>
            <p className="text-muted-foreground">Connect with a community that understands. You are not alone.</p>
        </div>
        <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-destructive-foreground bg-destructive/80 p-2 rounded-md">In crisis?</p>
            <SosButton />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {supportCircles.map((circle, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{circle.title}</CardTitle>
              <CardDescription>{circle.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{circle.members} members</span>
                    </div>
                    <span className="text-green-500 font-bold">Active</span>
                </div>
              <Button className="w-full" onClick={() => handleJoinCircle(circle.title)}>Request to Join</Button>
            </CardContent>
          </Card>
        ))}
      </div>
       <div className="mt-12 text-center p-6 bg-secondary rounded-lg">
          <h3 className="font-headline text-lg font-semibold mb-2">Proactive Safety Notice</h3>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Please be aware that all public and group discussions are monitored for high-risk keywords to ensure the safety of all community members. If you express thoughts of self-harm, our SOS protocol may be proactively triggered to provide you with immediate support.
          </p>
        </div>

      {isTherapist && (
        <div className="mt-12">
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
    </div>
  );
}

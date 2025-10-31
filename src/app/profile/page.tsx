'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getUserProfile, UserProfile } from '@/lib/firebase/firestore';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        setLoadingProfile(true);
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        setLoadingProfile(false);
      }
    }

    fetchUserProfile();
  }, [user]);

  if (authLoading || !user || loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-2 mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Your Profile</h1>
        <p className="text-muted-foreground">View and manage your account details.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={userProfile?.photoURL ?? ''} alt={userProfile?.displayName ?? ''} />
              <AvatarFallback>{userProfile?.displayName?.charAt(0) ?? user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-2xl">{userProfile?.displayName ?? 'User'}</CardTitle>
              <CardDescription>{userProfile?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold">Account Status</h3>
                <p className="text-muted-foreground capitalize">{userProfile?.status?.replace('_', ' ') ?? 'N/A'}</p>
            </div>
             <div>
                <h3 className="font-semibold">Age</h3>
                <p className="text-muted-foreground">{userProfile?.age ?? 'N/A'}</p>
            </div>
            <div>
                <h3 className="font-semibold">Member Since</h3>
                <p className="text-muted-foreground">{userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
            </div>
            <Button disabled>Edit Profile (Coming Soon)</Button>
        </CardContent>
      </Card>
       <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Database connection appears to be working correctly.</p>
        </div>
    </div>
  );
}

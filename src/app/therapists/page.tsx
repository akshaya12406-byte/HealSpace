
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { therapists, allSpecialties, allLanguages, type Therapist } from '@/lib/therapists-data';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function TherapistsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [languageFilter, setLanguageFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const filteredTherapists = useMemo(() => {
    return therapists.filter(therapist => {
      const languageMatch = languageFilter === 'all' || therapist.languages.includes(languageFilter);
      const specialtyMatch = specialtyFilter === 'all' || therapist.specialties.includes(specialtyFilter);
      return languageMatch && specialtyMatch;
    });
  }, [languageFilter, specialtyFilter]);

  const handleBookClick = (therapist: Therapist) => {
    if (!user) {
        toast({
            title: 'Login Required',
            description: 'Please log in or sign up to book a session.',
            action: <Button size="sm" onClick={() => router.push('/login')}>Login</Button>
        });
        return;
    }
    setSelectedTherapist(therapist);
    setIsModalOpen(true);
  };
  
  const handleConfirmBooking = async () => {
    if (!selectedTherapist || !user) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: 'User information is missing. Please log in again.',
      });
      return;
    }

    setIsBooking(true);
    try {
      // Step 1: Get the video call link from the API
      const response = await fetch('/api/send-booking-email', {
        method: 'POST',
      });
      
      const result = await response.json();

      if (!response.ok || !result.videoCallLink) {
        throw new Error(result.message || 'Failed to get video call link.');
      }

      // Step 2: Construct the mailto link
      const therapistEmail = 'akshaya12406@gmail.com';
      const userName = user?.displayName || user?.email || 'a HealSpace user';
      const subject = `New HealSpace Therapy Request from ${userName}`;
      const body = `
Hi ${selectedTherapist.name},

A HealSpace user (${userName}) has requested a therapy session with you.

Please use the following secure video link to join the session at the scheduled time:
${result.videoCallLink}

This link is for you and the user.

- The HealSpace Team
      `;

      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body.trim());
      const mailtoLink = `mailto:${therapistEmail}?subject=${encodedSubject}&body=${encodedBody}`;

      // Step 3: Open the user's email client
      window.location.href = mailtoLink;

    } catch (error: any) {
      console.error('Booking failed:', error);
      toast({
        variant: 'destructive',
        title: '⚠️ Something went wrong.',
        description: error.message || 'Could not prepare the booking email. Please try again later.',
      });
    } finally {
      setIsBooking(false);
      setIsModalOpen(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="space-y-2 mb-8">
          <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Therapist Marketplace</h1>
          <p className="text-muted-foreground">Find the right professional to support your journey.</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
              <p className="font-medium mr-4">Filter by:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                      <SelectTrigger>
                          <SelectValue placeholder="Specialty" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Specialties</SelectItem>
                          {allSpecialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                  </Select>
                  <Select value={languageFilter} onValueChange={setLanguageFilter}>
                      <SelectTrigger>
                          <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Languages</SelectItem>
                          {allLanguages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTherapists.map(therapist => (
            <Card key={therapist.id} className="overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <div className="relative h-56 w-full">
                  <Image src={therapist.imageUrl} alt={therapist.name} fill className="object-cover" data-ai-hint={therapist.imageHint}/>
              </div>
              <CardHeader>
                <CardTitle className="font-headline">{therapist.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specialties.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.languages.map(l => <Badge key={l} variant="outline">{l}</Badge>)}
                    </div>
                  </div>
                  <Button className="w-full mt-2" onClick={() => handleBookClick(therapist)}>
                    Book Session
                 </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredTherapists.length === 0 && (
              <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No therapists match the current filters.</p>
              </div>
          )}
        </div>
      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Booking Request</AlertDialogTitle>
            <AlertDialogDescription>
              This will open your email client to send a booking request to {selectedTherapist?.name}. A unique video link will be included.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBooking}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBooking} disabled={isBooking}>
              {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isBooking ? 'Preparing...' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

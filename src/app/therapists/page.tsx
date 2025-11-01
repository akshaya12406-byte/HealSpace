
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
    if (!selectedTherapist || !user) return;

    setIsBooking(true);
    try {
      const response = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          therapistName: selectedTherapist.name,
          userName: user.displayName || user.email || 'A HealSpace User',
          userEmail: user.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send booking request.');
      }

      toast({
        title: '✅ Video session link sent to your therapist!',
        description: `Your therapist will contact you at ${user.email} to finalize details.`,
      });

    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: '⚠️ Something went wrong.',
        description: error.message || 'Could not send booking request. Please try again later.',
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
            <AlertDialogTitle>Confirm Your Booking Request</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a booking request with a unique video call link to {selectedTherapist?.name}. They will be notified and will contact you at <strong>{user?.email}</strong> to finalize the details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBooking}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBooking} disabled={isBooking}>
              {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isBooking ? 'Sending...' : 'Confirm & Send Request'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

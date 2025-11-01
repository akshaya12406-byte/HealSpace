'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface BookingButtonProps {
  therapistName: string;
}

export function BookingButton({ therapistName }: BookingButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleBooking = () => {
    // PREDEFINED DATA
    const friendEmail = 'akshaya12406@gmail.com';
    const userName = user?.displayName || user?.email || 'a HealSpace User';
    
    // PREDEFINED SUBJECT
    const subject = `New HealSpace Booking with ${therapistName}`;
    
    // PREDEFINED BODY
    const body = `
Hi!

This is a confirmation that a HealSpace session has been booked for you with ${therapistName}.

The user (${userName}) has requested this session.

We're looking forward to this session!

- The HealSpace Team
    `;

    // Create and open the mailto link
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body.trim());
    const mailtoLink = `mailto:${friendEmail}?subject=${encodedSubject}&body=${encodedBody}`;

    try {
      window.location.href = mailtoLink;
    } catch (error) {
      console.error('Failed to open mail client:', error);
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: 'Could not open your email client. Please try again.',
      });
    }
  };

  return (
    <Button className="w-full mt-2" onClick={handleBooking}>
      Book Session
    </Button>
  );
}

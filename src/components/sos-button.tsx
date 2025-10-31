'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function SosButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="font-bold">
          SOS
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You Are Not Alone</AlertDialogTitle>
          <AlertDialogDescription>
            If you are in crisis or immediate danger, please reach out for help. Here are some resources that can provide immediate support.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 my-4">
            <div>
                <h3 className="font-semibold">National Suicide Prevention Lifeline</h3>
                <p className="text-sm text-muted-foreground">Call or text 988 anytime in the US and Canada.</p>
            </div>
            <div>
                <h3 className="font-semibold">Crisis Text Line</h3>
                <p className="text-sm text-muted-foreground">Text "HOME" to 741741 from anywhere in the US, anytime, about any type of crisis.</p>
            </div>
             <div>
                <h3 className="font-semibold">Emergency Services</h3>
                <p className="text-sm text-muted-foreground">For immediate danger, please call 911 (or your local emergency number).</p>
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction onClick={() => window.open('tel:988', '_self')}>Call 988</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

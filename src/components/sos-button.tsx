
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
            If you are in crisis or immediate danger, please reach out for help. Here are some resources in India that can provide immediate support.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 my-4">
            <div>
                <h3 className="font-semibold">Vandrevala Foundation</h3>
                <p className="text-sm text-muted-foreground">A 24/7 helpline for mental wellness. Call 9999666555.</p>
            </div>
            <div>
                <h3 className="font-semibold">iCALL</h3>
                <p className="text-sm text-muted-foreground">Provides counselling by telephone, email and chat. Call 022-25521111 (Mon-Sat, 10 AM - 8 PM).</p>
            </div>
             <div>
                <h3 className="font-semibold">AASRA</h3>
                <p className="text-sm text-muted-foreground">A 24/7 helpline for emotional distress and suicide prevention. Call 9820466726.</p>
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction onClick={() => window.open('tel:9999666555', '_self')}>Call Helpline</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

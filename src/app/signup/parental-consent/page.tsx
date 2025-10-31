
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ConsentForm from './consent-form';

export default function ParentalConsentPage() {
  return (
    <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    }>
      <ConsentForm />
    </Suspense>
  );
}

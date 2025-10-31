import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Hourglass } from 'lucide-react';

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Hourglass className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Account Pending Approval</CardTitle>
          <CardDescription>Thank you for signing up!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            For your safety, accounts for users under 18 require parental consent. An approval request has been sent. We'll notify you via email once your account is approved.
          </p>
          <p className="text-sm text-muted-foreground">
            In the meantime, feel free to explore our public resources.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

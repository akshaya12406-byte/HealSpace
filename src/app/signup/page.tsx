'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { HeartHandshake } from 'lucide-react';

const ageGateSchema = z.object({
  age: z.coerce
    .number({ invalid_type_error: 'Please enter a valid age.' })
    .min(1, { message: 'Please enter your age.' })
    .max(120, { message: 'Please enter a valid age.' }),
});

const accountDetailsSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [step, setStep] = useState<'age' | 'details'>('age');
  const [age, setAge] = useState<number | null>(null);

  const ageGateForm = useForm<z.infer<typeof ageGateSchema>>({
    resolver: zodResolver(ageGateSchema),
    defaultValues: {
      age: undefined,
    },
  });

  const accountDetailsForm = useForm<z.infer<typeof accountDetailsSchema>>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onAgeSubmit(values: z.infer<typeof ageGateSchema>) {
    setAge(values.age);
    setStep('details');
  }

  async function onDetailsSubmit(values: z.infer<typeof accountDetailsSchema>) {
    if (age === null) {
      toast({ title: 'Error', description: 'Age not set, please go back to the previous step.' });
      setStep('age'); // Go back to age step if age is missing
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signUpWithEmail(values.email, values.password, age);
      if (age < 18) {
        // Pass the new user's ID to the consent page
        router.push(`/signup/parental-consent?uid=${userCredential.user.uid}`);
      } else {
        router.push('/journal');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Google sign-in doesn't have our custom age gate, so we just log them in.
      // A more robust solution would require an interstitial step to collect age.
      toast({
        title: 'Sign In Successful',
        description: 'Welcome to HealSpace!',
      });
      router.push('/journal');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm border-0 shadow-lg sm:border sm:shadow-sm">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-block">
            <HeartHandshake className="h-10 w-10 mx-auto text-primary" />
          </Link>
          <CardTitle className="text-2xl font-headline font-semibold">Create Your Space</CardTitle>
          <CardDescription>
            {step === 'age'
              ? 'To start, please enter your age.'
              : 'Join HealSpace to start your wellness journey.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'age' && (
            <Form {...ageGateForm}>
              <form onSubmit={ageGateForm.handleSubmit(onAgeSubmit)} className="space-y-4">
                <FormField
                  control={ageGateForm.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="18" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full font-semibold">
                  Continue
                </Button>
              </form>
            </Form>
          )}

          {step === 'details' && (
            <>
              <Form {...accountDetailsForm}>
                <form onSubmit={accountDetailsForm.handleSubmit(onDetailsSubmit)} className="space-y-4">
                  <FormField
                    control={accountDetailsForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={accountDetailsForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setStep('age')} className="w-1/3">
                      Back
                    </Button>
                    <Button type="submit" className="w-2/3 font-semibold" disabled={isLoading}>
                      {isLoading ? 'Creating...' : 'Create Account'}
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              <Button variant="outline" className="w-full font-semibold" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                {isGoogleLoading ? 'Signing In...' : 'Sign up with Google'}
              </Button>
            </>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary font-semibold">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
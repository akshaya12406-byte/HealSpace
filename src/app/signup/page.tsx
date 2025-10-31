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
  age: z.coerce.number().min(1, { message: 'Please enter your age.' }).max(120, { message: 'Please enter a valid age.' }),
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
    if (values.age < 18) {
      // Temporarily store age and move to details, consent will be next
      setStep('details');
    } else {
      setStep('details');
    }
  }

  async function onDetailsSubmit(values: z.infer<typeof accountDetailsSchema>) {
    if (age === null) {
        toast({ title: "Error", description: "Age not set, please go back."});
        return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail(values.email, values.password, age);
      if (age < 18) {
        router.push(`/signup/parental-consent?email=${encodeURIComponent(values.email)}`);
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
      // Google sign-in doesn't have age verification in this flow,
      // so we direct them to a safe page. A real app would require an age gate after this.
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-block">
            <HeartHandshake className="h-10 w-10 mx-auto text-primary" />
          </Link>
          <CardTitle className="text-2xl font-headline">Create Your Space</CardTitle>
          <CardDescription>
            {step === 'age'
              ? 'First, please enter your age to continue.'
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
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="18" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
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
                    <Button variant="ghost" onClick={() => setStep('age')} className='w-full'>Back</Button>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                {isGoogleLoading ? 'Signing In...' : 'Sign up with Google'}
              </Button>
            </>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

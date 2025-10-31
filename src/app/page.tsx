import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, Feather, Users, Stethoscope } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-home');
  const features = [
    {
      icon: <Feather className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Journaling',
      description: 'Understand your emotions with real-time sentiment analysis. Your personal wellness rhythm, visualized.',
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: 'Meet HealBuddy, Your AI Friend',
      description: 'Engage in empathetic conversations with HealBuddy, our AI chatbot trained in wellness guidance.',
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      title: 'Connect with Professionals',
      description: 'Browse our marketplace of qualified therapists to find the right support for you.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Peer Support Circles',
      description: 'Join safe and supportive community circles to share experiences and grow together.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[75vh] flex items-center justify-center text-center">
          <div className="absolute inset-0 bg-primary/10">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-background/50" />
          </div>
          <div className="relative z-10 container px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                Find your calm, one breath at a time.
              </h1>
              <p className="text-lg md:text-xl text-foreground/80">
                HealSpace is your private sanctuary for mental wellness, offering tools and support to navigate your emotional journey.
              </p>
              <div className="flex justify-center">
                <Button asChild size="lg" className="font-bold">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">A Space to Heal and Grow</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our tools are designed with empathy and science to support your mental well-being.
              </p>
            </div>
            <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

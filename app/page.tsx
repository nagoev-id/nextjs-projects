'use client';

import { Footer, Header, Main } from '@/components/layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Code, Gauge, Lightbulb, Rocket, Sparkles, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className="flex flex-col text-foreground min-h-screen">
      <Header showAbout={false} />
      <Main className="px-4">
        {/* Hero Section */}
        <section className="py-6 md:py-12 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="mb-6 inline-block p-3 bg-primary/10 rounded-full">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            React Projects Collection
          </h1>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl">
            Explore a diverse collection of React applications showcasing modern web development practices,
            from simple utilities to complex interfaces.
          </p>
          <div className='grid place-items-center'>
            <Image
              src="https://ik.imagekit.io/nagoevid/nextjs-projects/main.png?updatedAt=1749997869077"
              alt="React Projects Collection"
              width={800}
              height={400}
              className='w-full h-full dark:invert-100'
              priority={true}
            />
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="https://github.com/nagoev-id" target="_blank" rel="noopener noreferrer">
                GitHub Repository
              </Link>
            </Button>
          </div>
        </section>

        {/* Project Categories */}
        <section className="py-6 md:py-12">
          <h2 className="text-3xl font-bold mb-12 text-center">Project Categories</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 inline-block p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Easy Projects</CardTitle>
                <CardDescription>
                  Perfect for beginners looking to build a foundation in React development.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Simple components and basic state management with clean, understandable code examples.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="gap-2">
                  <Link href="/projects/easy">
                    Explore Easy Projects <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 inline-block p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Gauge className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Medium Projects</CardTitle>
                <CardDescription>
                  Intermediate-level applications with more complex state and component interactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Projects that demonstrate advanced hooks, context API usage, and more sophisticated UI patterns.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="gap-2">
                  <Link href="/projects/medium">
                    Explore Medium Projects <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 inline-block p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Rocket className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Hard Projects</CardTitle>
                <CardDescription>
                  Advanced applications showcasing professional-level React development techniques.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Complex state management, performance optimization, and integration with external APIs and
                  services.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="gap-2">
                  <Link href="/projects/hard">
                    Explore Hard Projects <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-6 md:py-12 bg-muted/30 -mx-4 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Modern React</h3>
                <p className="text-muted-foreground">
                  Built with the latest React features including hooks, context, and functional components.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Learning Resource</h3>
                <p className="text-muted-foreground">
                  Each project includes detailed comments and follows best practices for educational purposes.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Beautiful UI</h3>
                <p className="text-muted-foreground">
                  Styled with Tailwind CSS and Shadcn UI for sleek, responsive, and accessible interfaces.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore?</h2>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Dive into our collection of projects and enhance your React development skills today.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/projects">
              Browse Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </Main>
      <Footer />
    </div>
  );
};

export default HomePage;
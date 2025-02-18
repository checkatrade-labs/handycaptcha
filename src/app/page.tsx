"use client";

import { FlyingTools } from '@/components/flying-tools';
import { CaptchaChallenge } from '@/components/captcha/challenge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CaptchaResponse } from '@/types/captcha';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/components/providers';
import confetti from 'canvas-confetti';

// Easter egg sequences
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const CONSTRUCTOR_CODE = ['b', 'u', 'i', 'l', 'd'];

// DIY Jokes for tooltips
const DIY_JOKES = [
  "Why did the nail file for divorce? It was tired of getting hammered!",
  "What did the screwdriver say to the screw? Let's get twisted!",
  "Why don't tools tell dad jokes? They're afraid of being called a drill!",
  "What's a plumber's favorite video game? Super Mario!",
  "Why did the electrician bring a ladder to tea? They were told the voltage was stepping up!",
];

const features = [
  {
    title: 'Plumbing Verification',
    description: 'Users identify leaking taps, incorrect pipe installations, and water damage signs.',
    icon: '🚰',
    joke: "Why did the pipe go to therapy? It had too many draining experiences!",
  },
  {
    title: 'Construction Challenges',
    description: 'Find cracks in brickwork, identify structural issues, and spot unsafe scaffolding.',
    icon: '🏗️',
    joke: "What's a builder's favorite kind of novel? A brick-lit thriller!",
  },
  {
    title: 'Electrical Safety',
    description: 'Identify faulty sockets, spot dangerous wiring, and recognize overloaded circuits.',
    icon: '⚡',
    joke: "Why are electricians always up to date? Because they're current-ly training!",
  },
  {
    title: 'General Maintenance',
    description: 'Find signs of damp, identify roof damage, and spot uneven flooring.',
    icon: '🔧',
    joke: "What did the hammer say to the nail? Nailed it!",
  },
];

// Punny section headers
const SECTION_HEADERS = {
  features: "Nailing Down the Details",
  pricing: "Measuring the Cost (No Hidden Charges!)",
  integration: "Building Blocks: Quick Setup",
};


const pricingTiers = [
  {
    name: 'Free',
    price: '£0',
    features: [
      '1,000 verifications/month',
      'Basic reporting',
      'Standard themes',
      'Community support',
    ],
    icon: '🔧',
  },
  {
    name: 'Pro',
    price: '£29',
    features: [
      '10,000 verifications/month',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
      'API access',
    ],
    icon: '⚡',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited verifications',
      'Custom challenge types',
      'Dedicated support',
      'SLA guarantee',
      'Self-hosting options',
    ],
    icon: '🏗️',
  },
];

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isConstructorMode, setIsConstructorMode] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const logoClickCount = useRef(0);

  // Handle verification success with confetti
  const handleVerify = (response: CaptchaResponse) => {
    console.log('Verification response:', response);
    setIsVerified(true);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Dark mode toggle with hard hat animation
  const toggleDarkMode = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Handle key sequences for easter eggs
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setKeySequence(prev => {
        const newSequence = [...prev, e.key].slice(-10);
        
        // Check for Konami code
        if (KONAMI_CODE.every((key, i) => key === newSequence[i])) {
          // Konami code entered - could add an easter egg here
          return [];
        }

        // Check for constructor mode
        if (CONSTRUCTOR_CODE.every((key, i) => key === newSequence[i])) {
          setIsConstructorMode(prev => !prev);
          return [];
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle logo clicks for easter egg
  const handleLogoClick = useCallback(() => {
    logoClickCount.current += 1;
    if (logoClickCount.current === 5) {
      setIsConstructorMode(true);
      logoClickCount.current = 0;
    }
  }, []);


  return (
    <TooltipProvider>
      <div className={`flex flex-col min-h-screen ${isConstructorMode ? 'constructor-mode' : ''}`}>
        {/* Header */}
        <header className="border-b bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 
              className="text-2xl font-bold cursor-pointer" 
              onClick={handleLogoClick}
            >
              HandyCAPTCHA
            </h1>
            <nav className="space-x-4 flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button 
                      variant="ghost" 
                      className="dark-mode-toggle"
                      onClick={toggleDarkMode}
                    >
                      {theme === 'dark' ? '🪖' : '⛑️'}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{theme === 'dark' ? "Safety first! But make it dark." : "Time to brighten things up!"}</p>
                </TooltipContent>
              </Tooltip>

              <a href="https://handycaptcha.com/docs" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost">Documentation</Button>
              </a>
              <a href="https://handycaptcha.com/login" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost">Sign In</Button>
              </a>
              <a href="https://handycaptcha.com/signup" target="_blank" rel="noopener noreferrer">
                <Button>Get Started</Button>
              </a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950 parallax-container relative overflow-hidden min-h-[600px]">
          <FlyingTools />
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-6 parallax-layer" style={{ transform: 'translateZ(-10px)' }}>
                <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400">
                  Secure your forms with home improvement challenges
                </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-300">
                The first CAPTCHA service designed specifically for the home improvement industry.
                Verify users while showcasing your expertise.
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 italic">
                Note: This is a fun concept/demo project showcasing what a home improvement-themed CAPTCHA service could look like.
              </p>
              <div className="space-x-4">
                <a href="https://handycaptcha.com/signup" target="_blank" rel="noopener noreferrer">
                  <Button size="lg">Get Started</Button>
                </a>
                <a href="https://handycaptcha.com/docs" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline">View Documentation</Button>
                </a>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="demo-container w-full max-w-md">
                <h3 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2 text-center">Try it yourself!</h3>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full my-4"></div>
                <p className="text-zinc-600 dark:text-zinc-300 mb-6 text-center">
                  This is a live demo - click the images to verify you&apos;re a home improvement expert!
                  <span className="inline-block ml-2 animate-bounce">👇</span>
                </p>
                <CaptchaChallenge
                  siteKey="demo"
                  onVerify={handleVerify}
                />
                {isVerified && (
                  <div className="flex items-center justify-center space-x-2 text-green-600 font-medium mt-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Verification successful!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-zinc-100">{SECTION_HEADERS.features}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Tooltip key={feature.title}>
                <TooltipTrigger asChild>
                  <div>
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{feature.icon}</span>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                    </Card>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{feature.joke}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with tool dividers */}
      <section className="py-20 bg-gradient-to-br from-zinc-50 to-blue-50 dark:from-zinc-900 dark:to-indigo-950">
        <div className="tool-divider mb-20" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-zinc-100">{SECTION_HEADERS.pricing}</h2>
          <p className="text-center text-zinc-500 dark:text-zinc-400 italic mb-8">
            Note: This pricing is conceptual as part of the demo. The service is not actually available for purchase.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className="p-6 pricing-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{tier.icon}</span>
                  <h3 className="text-2xl font-semibold">{tier.name}</h3>
                </div>
                <p className="text-4xl font-bold mb-6">{tier.price}</p>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="mr-2 animate-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="https://handycaptcha.com/signup" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">Get Started</Button>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Example */}
      <section className="py-20 relative bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-zinc-100">{SECTION_HEADERS.integration}</h2>
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 font-mono text-sm dark:bg-zinc-900/50">
              <pre className="language-javascript">
                {`// Install
npm install handycaptcha

// Use in your React component
import { HandyCAPTCHA } from 'handycaptcha';

function ContactForm() {
  const onVerify = (response) => {
    console.log('Verification successful:', response);
  };

  return (
    <HandyCAPTCHA
      siteKey="your_site_key"
      theme="light"
      onVerify={onVerify}
    />
  );
}`}
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer with tool divider */}
      <footer className="mt-auto border-t py-12 relative bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <div className="tool-divider absolute top-0 w-full" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 dark:text-zinc-100">Product</h4>
              <ul className="space-y-2">
                <li><a href="https://handycaptcha.com/features" className="hover:underline">Features</a></li>
                <li><a href="https://handycaptcha.com/docs" className="hover:underline">Documentation</a></li>
                <li><a href="https://handycaptcha.com/pricing" className="hover:underline">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-zinc-100">Contact</h4>
              <ul className="space-y-2">
                <li><a href="mailto:james.pain@checkatrade.com" className="hover:underline">Email</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-zinc-100">Legal</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com/checkatrade-labs/handycaptcha/blob/main/LICENSE" className="hover:underline">License</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-zinc-100">Support</h4>
              <ul className="space-y-2">
                <li><a href="https://handycaptcha.com/help" className="hover:underline">Help Center</a></li>
                <li><a href="https://handycaptcha.com/status" className="hover:underline">System Status</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className="text-zinc-600 cursor-help">
                    © 2025 HandyCAPTCHA. All rights reserved.
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{DIY_JOKES[Math.floor(Math.random() * DIY_JOKES.length)]}</p>
              </TooltipContent>
            </Tooltip>
            {/* Easter egg: Show current key sequence */}
            <p className="text-xs text-zinc-400 mt-2 font-mono">
              {keySequence.length > 0 && `${keySequence.join(' ')}`}
            </p>
          </div>
        </div>
      </footer>

      </div>
    </TooltipProvider>
  );
}

"use client";

import { CaptchaChallenge } from '@/components/captcha/challenge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CaptchaResponse } from '@/types/captcha';
import { useState } from 'react';

const features = [
  {
    title: 'Plumbing Verification',
    description: 'Users identify leaking taps, incorrect pipe installations, and water damage signs.',
  },
  {
    title: 'Construction Challenges',
    description: 'Find cracks in brickwork, identify structural issues, and spot unsafe scaffolding.',
  },
  {
    title: 'Electrical Safety',
    description: 'Identify faulty sockets, spot dangerous wiring, and recognize overloaded circuits.',
  },
  {
    title: 'General Maintenance',
    description: 'Find signs of damp, identify roof damage, and spot uneven flooring.',
  },
];

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
  },
];

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = (response: CaptchaResponse) => {
    console.log('Verification response:', response);
    setIsVerified(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">HandyCAPTCHA</h1>
          <nav className="space-x-4">
            <Button variant="ghost">Documentation</Button>
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-5xl font-bold">Secure your forms with home improvement challenges</h2>
              <p className="text-xl text-zinc-600">
                The first CAPTCHA service designed specifically for the home improvement industry.
                Verify users while showcasing your expertise.
              </p>
              <div className="space-x-4">
                <Button size="lg">Get Started</Button>
                <Button size="lg" variant="outline">View Documentation</Button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="demo-container w-full max-w-md">
                <h3 className="text-3xl font-bold text-zinc-800 mb-2 text-center">Try it yourself!</h3>
                <div className="h-px bg-zinc-200 w-full my-4"></div>
                <p className="text-zinc-600 mb-6 text-center">
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{tier.name}</h3>
                <p className="text-4xl font-bold mb-6">{tier.price}</p>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full">
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Example */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Integration</h2>
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 font-mono text-sm">
              <pre className="language-javascript">
                {`// Install
npm install @handycaptcha/react

// Use in your React component
import { HandyCAPTCHA } from '@handycaptcha/react';

function ContactForm() {
  const onVerify = (response) => {
    console.log('Verification successful:', response);
  };

  return (
    <HandyCAPTCHA
      siteKey="your_site_key"
      theme="plumbing"
      onVerify={onVerify}
    />
  );
}`}
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
                <li>API Reference</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>GitHub</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center text-zinc-600">
            © 2025 HandyCAPTCHA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

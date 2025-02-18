"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Challenge, CaptchaProps, CaptchaResponse } from '@/types/captcha';
import { cn } from '@/lib/utils';

// Temporary mock challenges until we have real data
const mockChallenges: Challenge[] = [
  {
    id: '1',
    type: 'plumbing',
    question: 'Click on the leaking tap',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    options: [
      { x: 150, y: 200, isCorrect: true },
      { x: 300, y: 150, isCorrect: false },
    ],
  },
  {
    id: '2',
    type: 'construction',
    question: 'Identify the crack in the wall',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    options: [
      { x: 250, y: 300, isCorrect: true },
      { x: 400, y: 200, isCorrect: false },
    ],
  },
];

export function CaptchaChallenge({
  siteKey,
  theme = 'light',
  onVerify,
  onError,
}: CaptchaProps) {
  // In a real implementation, we would use siteKey to fetch site-specific challenges
  const [challenges] = useState<Challenge[]>(() => 
    siteKey === 'demo' ? mockChallenges : []
  );
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(challenges[0]);
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const rotateChallenge = useCallback(() => {
    const currentIndex = challenges.findIndex(c => c.id === currentChallenge.id);
    const nextIndex = (currentIndex + 1) % challenges.length;
    setCurrentChallenge(challenges[nextIndex]);
    setSelectedPoint(null);
  }, [currentChallenge.id, challenges]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelectedPoint({ x, y });
  };

  const verifySelection = async () => {
    if (!selectedPoint) return;

    setIsVerifying(true);
    try {
      // Check if click is within 30px radius of any correct option
      const isCorrect = currentChallenge.options.some(
        option =>
          option.isCorrect &&
          Math.hypot(option.x - selectedPoint.x, option.y - selectedPoint.y) <= 30
      );

      const response: CaptchaResponse = {
        success: isCorrect,
        score: isCorrect ? 1 : 0,
        challenge_ts: new Date().toISOString(),
        hostname: window.location.hostname,
      };

      onVerify?.(response);

      if (!isCorrect) {
        rotateChallenge();
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    // Rotate challenge every 30 seconds if no selection
    const timer = setInterval(() => {
      if (!selectedPoint) {
        rotateChallenge();
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [rotateChallenge, selectedPoint]);

  return (
    <Card className={cn('w-[400px] p-4', theme === 'dark' && 'bg-zinc-900 text-white')}>
      <div className="space-y-4">
        <div className="text-sm font-medium">{currentChallenge.question}</div>
        
        <div 
          className="relative w-full h-[300px] cursor-crosshair border rounded-lg overflow-hidden"
          onClick={handleImageClick}
        >
          <Image
            src={currentChallenge.imageUrl}
            alt={currentChallenge.question}
            fill
            sizes="(max-width: 400px) 100vw, 400px"
            className="object-cover"
          />
          {selectedPoint && (
            <div
              className="absolute w-6 h-6 -ml-3 -mt-3 border-2 border-red-500 rounded-full"
              style={{ left: selectedPoint.x, top: selectedPoint.y }}
            />
          )}
        </div>

        <Button
          className="w-full"
          disabled={!selectedPoint || isVerifying}
          onClick={verifySelection}
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </Button>
      </div>
    </Card>
  );
}

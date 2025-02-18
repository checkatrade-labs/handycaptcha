"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Challenge, CaptchaProps, CaptchaResponse } from '@/types/captcha';
import { getChallengeTypeConfig } from '@/config/challenge-types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers';

// Helper functions for hit detection
function isPointInPolygon(
  x: number,
  y: number,
  points_x: number[],
  points_y: number[]
): boolean {
  let inside = false;
  for (let i = 0, j = points_x.length - 1; i < points_x.length; j = i++) {
    const xi = points_x[i], yi = points_y[i];
    const xj = points_x[j], yj = points_y[j];
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function isPointInRect(
  x: number,
  y: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}

function isPointInEllipse(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number
): boolean {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return (dx * dx + dy * dy) <= 1;
}

// Load challenges from the normalized challenges.json
const loadChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await fetch('/challenges/normalized/challenges.json');
    const data = await response.json();
    return data.challenges;
  } catch (error) {
    console.error('Failed to load challenges:', error);
    return [];
  }
};

export function CaptchaChallenge({
  siteKey,
  onVerify,
  onError,
  debug = false,
}: Omit<CaptchaProps, 'theme'> & { debug?: boolean }): React.ReactElement {
  const { theme } = useTheme();
  // In a real implementation, we would use siteKey to fetch site-specific challenges
  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Initialize challenges on client-side only
  useEffect(() => {
    if (siteKey === 'demo') {
      loadChallenges().then(loadedChallenges => {
        const shuffled = shuffleArray(loadedChallenges);
        setChallenges(shuffled);
        setCurrentChallenge(shuffled[0]);
      });
    }
  }, [siteKey]);

  const rotateChallenge = useCallback(() => {
    if (!currentChallenge) return;
    
    // Get all challenges except the current one
    const availableChallenges = challenges.filter(c => c.id !== currentChallenge.id);
    if (availableChallenges.length === 0) return;
    
    // Pick a random challenge from the remaining ones
    const nextChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    setCurrentChallenge(nextChallenge);
    setSelectedPoint(null);
    setIsComplete(false);
    setSuccessMessage('');
    setFailureMessage('');
  }, [currentChallenge, challenges]);

  // Show loading state during initialization
  if (!currentChallenge) {
    return (
      <Card className={cn('w-[400px] p-4 relative', theme === 'dark' && 'bg-zinc-900 text-white')}>
        <div className="h-[300px] flex items-center justify-center">
          <span className="animate-spin text-2xl">🔨</span>
        </div>
      </Card>
    );
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Scale click coordinates to match the normalized image size (800x600)
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    console.log('Click coordinates:', { x, y });
    setSelectedPoint({ x, y });
  };

  const verifySelection = async () => {
    if (!selectedPoint) return;

    setIsVerifying(true);
    const config = getChallengeTypeConfig(currentChallenge.type);
    setLoadingMessage(config.loadingMessages[Math.floor(Math.random() * config.loadingMessages.length)]);
    try {
      // Check if click is within any correct region
      console.log('Checking regions:', currentChallenge.regions);
      const isCorrect = currentChallenge.regions.some((region, index) => {
        const { shape } = region;
        if (!region.isCorrect) return false;

        let result = false;

        if (shape.name === "polygon" && shape.all_points_x && shape.all_points_y) {
          result = isPointInPolygon(
            selectedPoint.x,
            selectedPoint.y,
            shape.all_points_x,
            shape.all_points_y
          );
          console.log('Polygon check:', {
            region: index,
            points: { x: shape.all_points_x, y: shape.all_points_y },
            click: selectedPoint,
            result
          });
        } else if (shape.name === "rect" && shape.x !== undefined && shape.y !== undefined) {
          result = isPointInRect(
            selectedPoint.x,
            selectedPoint.y,
            shape.x,
            shape.y,
            shape.width || 0,
            shape.height || 0
          );
          console.log('Rectangle check:', {
            region: index,
            rect: { x: shape.x, y: shape.y, w: shape.width, h: shape.height },
            click: selectedPoint,
            result
          });
        } else if (shape.name === "ellipse" && shape.cx !== undefined && shape.cy !== undefined) {
          result = isPointInEllipse(
            selectedPoint.x,
            selectedPoint.y,
            shape.cx,
            shape.cy,
            shape.rx || 0,
            shape.ry || 0
          );
          console.log('Ellipse check:', {
            region: index,
            ellipse: { cx: shape.cx, cy: shape.cy, rx: shape.rx, ry: shape.ry },
            click: selectedPoint,
            result
          });
        }

        return result;
      });

      const response: CaptchaResponse = {
        success: isCorrect,
        score: isCorrect ? 1 : 0,
        challenge_ts: new Date().toISOString(),
        hostname: window.location.hostname,
      };

      onVerify?.(response);

      if (isCorrect) {
        // Find the matched region to get its label
        const matchedRegion = currentChallenge.regions.find((region) => {
          const { shape } = region;
          if (!region.isCorrect) return false;

          let result = false;

          if (shape.name === "polygon" && shape.all_points_x && shape.all_points_y) {
            result = isPointInPolygon(
              selectedPoint.x,
              selectedPoint.y,
              shape.all_points_x,
              shape.all_points_y
            );
          } else if (shape.name === "rect" && shape.x !== undefined && shape.y !== undefined) {
            result = isPointInRect(
              selectedPoint.x,
              selectedPoint.y,
              shape.x,
              shape.y,
              shape.width || 0,
              shape.height || 0
            );
          } else if (shape.name === "ellipse" && shape.cx !== undefined && shape.cy !== undefined) {
            result = isPointInEllipse(
              selectedPoint.x,
              selectedPoint.y,
              shape.cx,
              shape.cy,
              shape.rx || 0,
              shape.ry || 0
            );
          }

          return result;
        });

        setSuccessMessage(matchedRegion?.label || "You found it!");
        setIsComplete(true);
      } else {
        const config = getChallengeTypeConfig(currentChallenge.type);
        setFailureMessage(config.failureMessages[Math.floor(Math.random() * config.failureMessages.length)]);
        setTimeout(() => {
          setFailureMessage('');
        }, 2000);
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className={cn('w-[400px] p-4 relative', theme === 'dark' && 'bg-zinc-900 text-white border-zinc-800')}>
      <div className="space-y-4">
        <div className="text-sm font-medium flex items-center gap-2">
          {getChallengeTypeConfig(currentChallenge.type).icon}
          <span className="dark:text-zinc-100">{currentChallenge.question}</span>
        </div>
        
        <div 
          className={cn(
            "relative w-full h-[300px] border rounded-lg overflow-hidden transition-all",
            `cursor-${getChallengeTypeConfig(currentChallenge.type).cursor}`,
            isComplete && "pointer-events-none",
            theme === 'dark' && "border-zinc-800"
          )}
          onClick={!isComplete ? handleImageClick : undefined}
        >
          <Image
            src={currentChallenge.imageUrl}
            alt={currentChallenge.question}
            fill
            sizes="(max-width: 400px) 100vw, 400px"
            className="object-cover"
          />
          {/* Debug visualization of regions */}
          {debug && currentChallenge.regions.map((region, i) => {
            const { shape } = region;
            if (shape.name === "polygon" && shape.all_points_x && shape.all_points_y) {
              // Ensure arrays are the same length
              const validPoints = shape.all_points_x.length === shape.all_points_y.length;
              if (!validPoints) return null;

              const points = shape.all_points_x.map((x, idx) => 
                `${(x / 800) * 100}% ${(shape.all_points_y![idx] / 600) * 100}%`
              ).join(', ');
              return (
                <div
                  key={i}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    clipPath: `polygon(${points})`,
                    border: '1px solid rgba(255, 0, 0, 0.2)',
                    background: 'rgba(255, 0, 0, 0.1)'
                  }}
                />
              );
            }
            return null;
          })}
          {selectedPoint && (
            <div
              className={cn(
                "absolute w-6 h-6 -ml-3 -mt-3 border-2 rounded-full transition-colors",
                isComplete ? "border-green-500 animate-pulse" : "border-red-500"
              )}
              style={{ 
                left: `${(selectedPoint.x / 800) * 100}%`, 
                top: `${(selectedPoint.y / 600) * 100}%` 
              }}
            />
          )}
        </div>

        {isComplete ? (
          <Button
            className="w-full"
            onClick={rotateChallenge}
          >
            Next Challenge
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={!selectedPoint || isVerifying}
            onClick={verifySelection}
          >
            <div className="flex items-center justify-center gap-2">
              {isVerifying ? (
                <>
                  <span className="animate-spin">🔨</span>
                  <span className="dark:text-zinc-100">{loadingMessage}</span>
                </>
              ) : (
                'Verify'
              )}
            </div>
          </Button>
        )}
      </div>
      {(failureMessage || successMessage) && (
        <div className={cn(
          "absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm",
          failureMessage 
            ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 animate-bounce" 
            : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
        )}>
          {failureMessage || successMessage}
        </div>
      )}
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 italic">
        No contractors were harmed in this verification process
      </div>
    </Card>
  );
}

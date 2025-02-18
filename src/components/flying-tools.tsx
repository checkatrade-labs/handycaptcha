'use client';

import { useEffect, useRef, useState } from 'react';

interface Tool {
  id: number;
  x: number;
  y: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  scale: number;
  type: string;
}

const TOOL_TYPES = ['🔧', '🔨', '⚡', '🪛', '⛏️', '🪜', '🧰', '🔌'];
const NUM_TOOLS = 12;
const VELOCITY_RANGE = 0.8; // pixels per frame
const ROTATION_SPEED_RANGE = 0.8; // degrees per frame

export function FlyingTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize tools with random positions and velocities
  useEffect(() => {
    if (!containerRef.current) return;

    const { clientWidth, clientHeight } = containerRef.current;
    const initialTools: Tool[] = Array.from({ length: NUM_TOOLS }, (_, i) => ({
      id: i,
      x: Math.random() * clientWidth,
      y: Math.random() * clientHeight,
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * VELOCITY_RANGE,
      velocityY: (Math.random() - 0.5) * VELOCITY_RANGE,
      rotationSpeed: (Math.random() - 0.5) * ROTATION_SPEED_RANGE,
      scale: 0.8 + Math.random() * 0.4, // Random scale between 0.8 and 1.2
      type: TOOL_TYPES[Math.floor(Math.random() * TOOL_TYPES.length)],
    }));

    setTools(initialTools);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!containerRef.current || tools.length === 0) return;

    const updateTools = () => {
      const { clientWidth, clientHeight } = containerRef.current!;

      setTools(prevTools =>
        prevTools.map(tool => {
          let { x, y, velocityX, velocityY, rotation } = tool;
          const { rotationSpeed } = tool;

          // Update position
          x += velocityX;
          y += velocityY;
          rotation += rotationSpeed;

          // Bounce off walls
          if (x < 0 || x > clientWidth) {
            velocityX *= -1;
          }
          if (y < 0 || y > clientHeight) {
            velocityY *= -1;
          }

          // Keep within bounds
          x = Math.max(0, Math.min(x, clientWidth));
          y = Math.max(0, Math.min(y, clientHeight));

          return {
            ...tool,
            x,
            y,
            rotation,
            velocityX,
            velocityY,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(updateTools);
    };

    animationFrameRef.current = requestAnimationFrame(updateTools);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tools]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const { clientWidth, clientHeight } = containerRef.current;
      setTools(prevTools =>
        prevTools.map(tool => ({
          ...tool,
          x: Math.min(tool.x, clientWidth),
          y: Math.min(tool.y, clientHeight),
        }))
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {tools.map(tool => (
        <div
          key={tool.id}
          className="absolute select-none flying-tool"
          style={{
            left: `${tool.x}px`,
            top: `${tool.y}px`,
            transform: `rotate(${tool.rotation}deg) scale(${tool.scale})`,
            fontSize: '28px',
          }}
        >
          {tool.type}
        </div>
      ))}
    </div>
  );
}

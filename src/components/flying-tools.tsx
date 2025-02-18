'use client';

import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

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
  isAnimating?: boolean;
}

const TOOL_TYPES = ['🔧', '🔨', '⚡', '🪛', '⛏️', '🪜', '🧰', '🔌'];
const NUM_TOOLS = 16;
const VELOCITY_RANGE = 0.4; // pixels per frame
const ROTATION_SPEED_RANGE = 0.4; // degrees per frame
const CLICK_BOOST = 8; // Velocity multiplier when clicked
const INFLUENCE_RADIUS = 1000; // Radius in pixels for affecting nearby tools

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
      scale: 0.9 + Math.random() * 2, // Random scale between 0.9 and 1.2
      type: TOOL_TYPES[Math.floor(Math.random() * TOOL_TYPES.length)],
    }));

    setTools(initialTools);
  }, []);

  // Handle tool click
  const handleToolClick = (clickedTool: Tool, event: React.MouseEvent) => {
    // Prevent event from bubbling up
    event.stopPropagation();

    // Create confetti at click position
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { x, y },
        colors: ['#FFD700', '#C0C0C0', '#B87333'], // Gold, Silver, Copper
      });
    }

    setTools(prevTools =>
      prevTools.map(tool => {
        if (tool.id === clickedTool.id) {
          // Boost the clicked tool
          return {
            ...tool,
            isAnimating: true,
            velocityX: tool.velocityX * CLICK_BOOST,
            velocityY: tool.velocityY * CLICK_BOOST,
            rotationSpeed: -tool.rotationSpeed * 2, // Reverse and speed up rotation
          };
        }

        // Affect nearby tools
        const dx = tool.x - clickedTool.x;
        const dy = tool.y - clickedTool.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < INFLUENCE_RADIUS) {
          const influence = (INFLUENCE_RADIUS - distance) / INFLUENCE_RADIUS;
          return {
            ...tool,
            velocityX: tool.velocityX + (dx / distance) * influence,
            velocityY: tool.velocityY + (dy / distance) * influence,
          };
        }

        return tool;
      })
    );

    // Reset animation state after a delay
    setTimeout(() => {
      setTools(prevTools =>
        prevTools.map(tool =>
          tool.id === clickedTool.id
            ? {
                ...tool,
                isAnimating: false,
                velocityX: tool.velocityX / CLICK_BOOST,
                velocityY: tool.velocityY / CLICK_BOOST,
                rotationSpeed: -tool.rotationSpeed / 2,
              }
            : tool
        )
      );
    }, 500);
  };

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
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 10, opacity: 0.7 }}
    >
      {tools.map(tool => (
        <div
          key={tool.id}
          className={`absolute select-none flying-tool cursor-pointer ${
            tool.isAnimating ? 'tool-clicked' : ''
          }`}
          style={{
            left: `${tool.x}px`,
            top: `${tool.y}px`,
            transform: `rotate(${tool.rotation}deg) scale(${tool.scale})`,
            fontSize: '28px',
          }}
          onClick={(e) => handleToolClick(tool, e)}
        >
          {tool.type}
        </div>
      ))}
    </div>
  );
}

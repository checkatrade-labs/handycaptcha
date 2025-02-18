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
  isNew?: boolean;
}

const TOOL_TYPES = ['🔧', '🔨', '⚡', '🪛', '⛏️', '🪜', '🧰', '🔌'];
const NUM_TOOLS = 16;
const VELOCITY_RANGE = 0.4; // pixels per frame
const ROTATION_SPEED_RANGE = 0.4; // degrees per frame

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
    event.stopPropagation();

    // Calculate split velocities (3x normal speed)
    const splitSpeed = VELOCITY_RANGE * 3;
    const angles = [-45, 45]; // Diagonal directions in degrees

    const splitTools = angles.map((angle, index) => {
      const radians = (angle * Math.PI) / 180;
      return {
        ...clickedTool,
        id: Date.now() + index, // Ensure unique IDs
        x: clickedTool.x,
        y: clickedTool.y,
        scale: clickedTool.scale * 0.4,
        velocityX: Math.cos(radians) * splitSpeed,
        velocityY: Math.sin(radians) * splitSpeed,
        isNew: true,
      };
    });

    setTools(prevTools => [
      ...prevTools.filter(tool => tool.id !== clickedTool.id),
      ...splitTools,
    ]);

    // Start growing animation after a short delay
    setTimeout(() => {
      setTools(prevTools =>
        prevTools.map(tool =>
          tool.isNew
            ? {
                ...tool,
                scale: tool.scale * 2.5,
                isNew: false,
              }
            : tool
        )
      );
    }, 100);
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
          className="absolute select-none flying-tool cursor-pointer"
          style={{
            left: `${tool.x}px`,
            top: `${tool.y}px`,
            transform: `rotate(${tool.rotation}deg) scale(${tool.scale})`,
            fontSize: '28px',
            transition: 'transform 1s ease-out',
          }}
          onClick={(e) => handleToolClick(tool, e)}
        >
          {tool.type}
        </div>
      ))}
    </div>
  );
}

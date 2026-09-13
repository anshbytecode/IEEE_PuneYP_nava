import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface LineMaskSplitProps {
  text: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  as?: React.ElementType;
}

export const LineMaskSplit = ({
  text,
  delay = 0,
  duration = 0.8,
  stagger = 0.1,
  className = '',
  as: Component = 'div',
}: LineMaskSplitProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<string[][]>([]);
  const [isReady, setIsReady] = useState(false);
  
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  // Split text into words, preserving spaces
  const words = text.split(/(\s+)/).filter((w) => w.length > 0);

  useLayoutEffect(() => {
    if (reduced) return;

    const computeLines = () => {
      if (!containerRef.current) return;
      const wordNodes = Array.from(containerRef.current.children) as HTMLElement[];
      
      let currentTop = -1;
      const computedLines: string[][] = [];
      let currentLine: string[] = [];

      wordNodes.forEach((node) => {
        const top = node.offsetTop;
        if (top !== currentTop && currentLine.length > 0) {
          computedLines.push([...currentLine]);
          currentLine = [];
        }
        currentTop = top;
        currentLine.push(node.textContent || '');
      });

      if (currentLine.length > 0) {
        computedLines.push([...currentLine]);
      }

      setLines(computedLines);
      setIsReady(true);
    };

    // Delay slightly to ensure fonts/layout are ready
    const timer = setTimeout(computeLines, 50);

    const handleResize = () => {
      setIsReady(false);
      clearTimeout(timer);
      setTimeout(computeLines, 50);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [text]);

  if (reduced) {
    return (
      <Component className={className}>
        {text}
      </Component>
    );
  }

  // Phase 1: Render flat words to measure layout
  if (!isReady) {
    return (
      <Component ref={containerRef} className={className} style={{ opacity: 0 }}>
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: word.trim() === '' ? 'pre' : 'normal',
            }}
          >
            {word}
          </span>
        ))}
      </Component>
    );
  }

  // Phase 2: Render lines wrapped in overflow-hidden masks
  return (
    <Component className={className}>
      {lines.map((lineWords, lineIndex) => {
        const lineText = lineWords.join('');
        // Ignore lines that are just whitespace
        if (lineText.trim() === '') {
          return <span key={lineIndex}>{lineText}</span>;
        }

        return (
          <span key={lineIndex} className="block overflow-hidden pb-1 -mb-1">
            <motion.span
              className="block origin-bottom-left"
              initial={{ y: '120%', rotate: 2, opacity: 0 }}
              animate={isInView ? { y: '0%', rotate: 0, opacity: 1 } : {}}
              transition={{
                duration,
                delay: delay + lineIndex * stagger,
                ease: [0.16, 1, 0.3, 1], // Exactly like Framer's spring/tween feel
              }}
            >
              {lineText}
            </motion.span>
          </span>
        );
      })}
    </Component>
  );
};

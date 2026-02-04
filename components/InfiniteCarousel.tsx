'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TarotCard } from '@/types/tarot';
import { getRandomCardOffset } from '@/lib/tarotAdapter';

interface InfiniteCarouselProps {
  cards: TarotCard[];
  onSelectCard: (card: TarotCard) => void;
}

export default function InfiniteCarousel({ cards, onSelectCard }: InfiniteCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isScrolling, setIsScrolling] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [cardOffsets] = useState(() =>
    // Generate random vertical offsets for each card (only once)
    cards.map(() => getRandomCardOffset())
  );

  const CARD_WIDTH = 180; // Card width + gap
  const SCROLL_SPEED = 0.5; // Pixels per frame (slow, calming motion)

  // Triple the cards for infinite loop effect
  const tripleCards = [...cards, ...cards, ...cards];

  // Auto-scroll effect
  useEffect(() => {
    if (!isScrolling || isDragging) return;

    const intervalId = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - SCROLL_SPEED;
        return checkLoopBoundary(newOffset);
      });
    }, 16); // ~60fps

    return () => clearInterval(intervalId);
  }, [isScrolling, isDragging, cards.length, CARD_WIDTH]);

  // Momentum effect
  useEffect(() => {
    if (isDragging || Math.abs(velocity) < 0.1) return;

    const intervalId = setInterval(() => {
      setVelocity((v) => v * 0.95); // Deceleration
      setOffset((prev) => {
        const newOffset = prev + velocity;
        return checkLoopBoundary(newOffset);
      });
    }, 16);

    return () => clearInterval(intervalId);
  }, [velocity, isDragging, cards.length, CARD_WIDTH]);

  // Initialize starting position at the middle set
  useEffect(() => {
    const singleSetWidth = cards.length * CARD_WIDTH;
    setOffset(-singleSetWidth);
  }, [cards.length, CARD_WIDTH]);

  // Check and handle infinite loop boundaries
  const checkLoopBoundary = (newOffset: number) => {
    const singleSetWidth = cards.length * CARD_WIDTH;
    const minOffset = -singleSetWidth * 1.5;
    const maxOffset = -singleSetWidth * 0.5;

    if (newOffset <= minOffset) {
      return newOffset + singleSetWidth;
    } else if (newOffset >= maxOffset) {
      return newOffset - singleSetWidth;
    }
    return newOffset;
  };

  // Touch/Mouse handlers
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setIsScrolling(false);
    setVelocity(0);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
    setLastX(clientX);
    setLastTime(Date.now());
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - currentX;
    setCurrentX(clientX);

    setOffset((prev) => checkLoopBoundary(prev + deltaX));

    // Calculate velocity
    const now = Date.now();
    const timeDelta = now - lastTime;
    if (timeDelta > 0) {
      setVelocity((clientX - lastX) / timeDelta * 16); // Normalize to 60fps
    }
    setLastX(clientX);
    setLastTime(now);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Restart auto-scroll after delay
    setTimeout(() => {
      setIsScrolling(true);
      setVelocity(0);
    }, 2000);
  };

  const handleCardClick = (card: TarotCard, index: number) => {
    // Ignore clicks during drag
    if (Math.abs(currentX - startX) > 5) return;

    // Stop scrolling
    setIsScrolling(false);
    setIsDragging(false);
    setVelocity(0);

    // Find which set this card belongs to (we only care about the original card data)
    const originalIndex = index % cards.length;
    const selectedCard = cards[originalIndex];

    // Small delay for visual feedback
    setTimeout(() => {
      onSelectCard(selectedCard);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative">
      {/* Instruction text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-0 right-0 text-center px-6 z-10"
      >
        <p className="text-lg md:text-xl text-valentine-darkpurple font-medium">
          เลือกใบที่เรียกหาคุณ ✨
        </p>
      </motion.div>

      {/* Carousel container */}
      <div className="w-full overflow-hidden py-20">
        <motion.div
          ref={carouselRef}
          className="flex gap-6 px-6 cursor-grab active:cursor-grabbing"
          style={{
            transform: `translateX(${offset}px)`,
          }}
          transition={{ type: 'linear' }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          {tripleCards.map((card, index) => {
            // Get the offset for this card (loop through the original offsets)
            const verticalOffset = cardOffsets[index % cards.length];

            return (
              <motion.div
                key={`${card.card_id}-${index}`}
                className="flex-shrink-0 cursor-pointer"
                style={{
                  transform: `translateY(${verticalOffset}px)`,
                }}
                whileHover={{ scale: 1.05, y: verticalOffset - 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card, index)}
              >
                <div className="relative">
                  {/* Card face-down with image */}
                  <div className="w-[168px] h-[300px] rounded-2xl overflow-hidden card-glow relative bg-transparent">
                    <Image
                      src="/images/card_back.png"
                      alt="Card Back"
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: 'center',
                        scale: '1.24',
                      }}
                      priority
                    />

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: [
                          'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                          'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                        ],
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>

                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute -inset-2 rounded-2xl opacity-0"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Hint text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-0 right-0 text-center px-6"
      >
        <p className="text-sm text-valentine-purple/60">
          ใช้สัญชาตญาณ ไม่ต้องคิดมาก
        </p>
      </motion.div>
    </div>
  );
}

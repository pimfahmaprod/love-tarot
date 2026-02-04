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
  const [cardOffsets] = useState(() =>
    // Generate random vertical offsets for each card (only once)
    cards.map(() => getRandomCardOffset())
  );

  const CARD_WIDTH = 180; // Card width + gap
  const SCROLL_SPEED = 0.5; // Pixels per frame (slow, calming motion)

  // Triple the cards for infinite loop effect
  const tripleCards = [...cards, ...cards, ...cards];

  useEffect(() => {
    if (!isScrolling) return;

    const intervalId = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - SCROLL_SPEED;
        const singleSetWidth = cards.length * CARD_WIDTH;

        // Seamless loop: when we scroll past the middle set, reset to the middle
        // We start at -singleSetWidth (middle set)
        // When we reach -singleSetWidth * 1.5, we're halfway through the third set
        // Reset to -singleSetWidth * 0.5 (halfway through first set) for seamless loop
        if (newOffset <= -singleSetWidth * 1.5) {
          return -singleSetWidth * 0.5;
        }

        return newOffset;
      });
    }, 16); // ~60fps

    return () => clearInterval(intervalId);
  }, [isScrolling, cards.length, CARD_WIDTH]);

  // Initialize starting position at the middle set
  useEffect(() => {
    const singleSetWidth = cards.length * CARD_WIDTH;
    setOffset(-singleSetWidth);
  }, [cards.length, CARD_WIDTH]);

  const handleCardClick = (card: TarotCard, index: number) => {
    // Stop scrolling
    setIsScrolling(false);

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
          className="flex gap-6 px-6"
          style={{
            transform: `translateX(${offset}px)`,
          }}
          transition={{ type: 'linear' }}
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
                  <div className="w-[160px] h-[260px] md:w-[180px] md:h-[300px] rounded-2xl overflow-hidden card-glow relative bg-transparent">
                    <Image
                      src="/images/card_back.png"
                      alt="Card Back"
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: 'center',
                        scale: '1.15',
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

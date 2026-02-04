'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { TarotCard } from '@/types/tarot';

interface GridCarouselProps {
  cards: TarotCard[];
  onSelectCard: (card: TarotCard) => void;
}

export default function GridCarousel({ cards, onSelectCard }: GridCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Split cards into 2 rows
  const midPoint = Math.ceil(cards.length / 2);
  const row1 = cards.slice(0, midPoint);
  const row2 = cards.slice(midPoint);

  const handleCardClick = (card: TarotCard, index: number) => {
    if (selectedIndex === index) {
      // Confirm selection - second click
      onSelectCard(card);
    } else {
      // First click - highlight
      setSelectedIndex(index);
    }
  };

  const handleBackgroundClick = () => {
    // Cancel selection
    setSelectedIndex(null);
  };

  const isInRow1 = (index: number) => index < midPoint;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative py-20"
      onClick={handleBackgroundClick}
    >
      {/* Instruction text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-0 right-0 text-center px-6 z-10"
      >
        <p className="text-lg md:text-xl text-valentine-darkpurple font-medium">
          เลือกใบที่เรียกหาคุณ ✨
        </p>
        {selectedIndex !== null && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-valentine-hotpink font-medium mt-2"
          >
            กดอีกครั้งเพื่อยืนยัน
          </motion.p>
        )}
      </motion.div>

      {/* Card Grid - 2 Rows */}
      <div className="w-full px-4 md:px-8 space-y-3">
        {/* Row 1 */}
        <div className="flex gap-[-20px] md:gap-[-30px] overflow-x-auto scrollbar-hide">
          <div className="flex">
            {row1.map((card, idx) => {
              const globalIndex = idx;
              const isSelected = selectedIndex === globalIndex;
              const shouldShift = isSelected;

              return (
                <motion.div
                  key={card.id}
                  className="flex-shrink-0 cursor-pointer relative"
                  style={{
                    marginLeft: idx === 0 ? 0 : '-20px',
                    zIndex: isSelected ? 100 : 50 - idx,
                  }}
                  animate={{
                    x: shouldShift ? 15 : 0,
                    scale: isSelected ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card, globalIndex);
                  }}
                >
                  {/* Card */}
                  <div
                    className={`w-[120px] h-[200px] md:w-[140px] md:h-[240px] rounded-2xl overflow-hidden relative bg-transparent transition-all ${
                      isSelected
                        ? 'ring-4 ring-valentine-gold shadow-2xl shadow-valentine-gold/50'
                        : 'card-glow'
                    }`}
                  >
                    <Image
                      src="/images/card_back.png"
                      alt="Card Back"
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: 'center',
                        scale: '1.24',
                      }}
                      priority={idx < 10}
                    />

                    {/* Shine effect */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          background: [
                            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
                            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
                          ],
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-[-20px] md:gap-[-30px] overflow-x-auto scrollbar-hide">
          <div className="flex">
            {row2.map((card, idx) => {
              const globalIndex = midPoint + idx;
              const isSelected = selectedIndex === globalIndex;
              const shouldShift = isSelected;

              return (
                <motion.div
                  key={card.id}
                  className="flex-shrink-0 cursor-pointer relative"
                  style={{
                    marginLeft: idx === 0 ? 0 : '-20px',
                    zIndex: isSelected ? 100 : 50 - idx,
                  }}
                  animate={{
                    x: shouldShift ? 15 : 0,
                    scale: isSelected ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card, globalIndex);
                  }}
                >
                  {/* Card */}
                  <div
                    className={`w-[120px] h-[200px] md:w-[140px] md:h-[240px] rounded-2xl overflow-hidden relative bg-transparent transition-all ${
                      isSelected
                        ? 'ring-4 ring-valentine-gold shadow-2xl shadow-valentine-gold/50'
                        : 'card-glow'
                    }`}
                  >
                    <Image
                      src="/images/card_back.png"
                      alt="Card Back"
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: 'center',
                        scale: '1.24',
                      }}
                      priority={idx < 10}
                    />

                    {/* Shine effect */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          background: [
                            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
                            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
                          ],
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hint text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-0 right-0 text-center px-6"
      >
        <p className="text-sm text-valentine-purple/60">
          {selectedIndex === null
            ? 'ใช้สัญชาตญาณ ไม่ต้องคิดมาก'
            : 'กดไพ่อีกครั้งเพื่อยืนยัน หรือเลือกใบอื่น'}
        </p>
      </motion.div>

      {/* Custom scrollbar hide */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

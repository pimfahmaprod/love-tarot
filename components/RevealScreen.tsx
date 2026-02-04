'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TarotCard } from '@/types/tarot';
import Image from 'next/image';

interface RevealScreenProps {
  card: TarotCard;
  onRevealComplete: () => void;
}

export default function RevealScreen({ card, onRevealComplete }: RevealScreenProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTransitionText, setShowTransitionText] = useState(false);

  useEffect(() => {
    // Show transition text
    const timer1 = setTimeout(() => {
      setShowTransitionText(true);
    }, 500);

    // Start flip animation
    const timer2 = setTimeout(() => {
      setIsFlipped(true);
    }, 2500);

    // Move to result screen
    const timer3 = setTimeout(() => {
      onRevealComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onRevealComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10"
    >
      {/* Mystical background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(255, 105, 180, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(255, 105, 180, 0.2) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Transition text */}
      {showTransitionText && !isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-12 left-0 right-0 text-center px-6 z-10"
        >
          <p className="text-lg md:text-xl text-valentine-darkpurple font-medium leading-relaxed">
            ไพ่ใบนี้สะท้อนพลังความรักของคุณ
          </p>
          <p className="text-lg md:text-xl text-valentine-darkpurple font-medium leading-relaxed">
            ในช่วงวาเลนไทน์…
          </p>
        </motion.div>
      )}

      {/* Card flip container */}
      <div className="relative w-full max-w-sm">
        <motion.div
          className="relative"
          style={{
            perspective: '1500px',
          }}
        >
          <motion.div
            className="relative w-full"
            style={{
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateY: isFlipped ? 180 : 0,
            }}
            transition={{
              duration: 1.2,
              ease: 'easeInOut',
            }}
          >
            {/* Card Back */}
            <motion.div
              className="absolute inset-0 w-full h-[400px] md:h-[500px]"
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="w-full h-full rounded-3xl card-glow overflow-hidden relative bg-transparent">
                <Image
                  src="/images/card_back_with_background.png"
                  alt="Card Back"
                  fill
                  className="object-cover"
                  style={{
                    objectPosition: 'center',
                    scale: '1.15',
                  }}
                  priority
                />
              </div>
            </motion.div>

            {/* Card Front */}
            <motion.div
              className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden card-glow bg-white"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                border: '4px solid #FFD700',
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <Image
                  src={card.image_path}
                  alt={card.card_name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Sparkle effects */}
        {isFlipped && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -50],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Card name reveal */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient">
            {card.card_name}
          </h2>
        </motion.div>
      )}

      {/* Loading indicator */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 left-0 right-0 text-center"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-valentine-purple/60 text-sm"
          >
            กำลังถอดความหมาย...
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

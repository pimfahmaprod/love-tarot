'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TarotCard, RelationshipStatus } from '@/types/tarot';
import { getAllTarotCards, shuffleCards } from '@/lib/tarotAdapter';

// Components
import LandingScreen from '@/components/LandingScreen';
import InstructionScreen from '@/components/InstructionScreen';
import GridCarousel from '@/components/GridCarousel';
import RevealScreen from '@/components/RevealScreen';
import ResultScreen from '@/components/ResultScreen';

type Screen = 'landing' | 'instruction' | 'selection' | 'reveal' | 'result';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus | null>(null);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);

  // Load and shuffle cards on mount
  useEffect(() => {
    const cards = getAllTarotCards();
    setShuffledCards(shuffleCards(cards));
  }, []);

  // Handle relationship status selection
  const handleSelectStatus = (status: RelationshipStatus) => {
    setRelationshipStatus(status);
    setCurrentScreen('instruction');
  };

  // Handle begin carousel
  const handleBegin = () => {
    setCurrentScreen('selection');
  };

  // Handle card selection
  const handleSelectCard = (card: TarotCard) => {
    setSelectedCard(card);
    setCurrentScreen('reveal');
  };

  // Handle reveal complete
  const handleRevealComplete = () => {
    setCurrentScreen('result');
  };

  // Handle reset
  const handleReset = () => {
    // Reshuffle cards
    const cards = getAllTarotCards();
    setShuffledCards(shuffleCards(cards));

    // Reset state
    setCurrentScreen('landing');
    setRelationshipStatus(null);
    setSelectedCard(null);
  };

  return (
    <main className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {currentScreen === 'landing' && (
          <LandingScreen key="landing" onSelectStatus={handleSelectStatus} />
        )}

        {currentScreen === 'instruction' && (
          <InstructionScreen key="instruction" onBegin={handleBegin} />
        )}

        {currentScreen === 'selection' && shuffledCards.length > 0 && (
          <GridCarousel
            key="selection"
            cards={shuffledCards}
            onSelectCard={handleSelectCard}
          />
        )}

        {currentScreen === 'reveal' && selectedCard && (
          <RevealScreen
            key="reveal"
            card={selectedCard}
            onRevealComplete={handleRevealComplete}
          />
        )}

        {currentScreen === 'result' && selectedCard && relationshipStatus && (
          <ResultScreen
            key="result"
            card={selectedCard}
            relationshipStatus={relationshipStatus}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

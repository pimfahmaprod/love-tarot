/**
 * Valentine's Day Tarot Adapter
 * Show 78 cards but map to 22 Major Arcana interpretations
 */

import { TarotCard, TarotCardRaw } from '@/types/tarot';
import valentineData from '@/valentine_tarot.json';
import fullTarotData from '@/tarot_cards.json';

/**
 * Convert raw tarot card data to our app format
 */
export function adaptTarotCard(rawCard: TarotCardRaw): TarotCard {
  return {
    id: rawCard.id,
    name: rawCard.name,
    image: rawCard.image,
    image_path: `/images/tarot/${rawCard.image}`,
    interpretation: rawCard.interpretation,
    personality: rawCard.personality,
    quote: rawCard.quote,
  };
}

/**
 * Get Major Arcana interpretations (22 cards)
 */
export function getMajorArcanaInterpretations(): TarotCard[] {
  const rawCards = valentineData.cards as TarotCardRaw[];
  return rawCards.map(adaptTarotCard);
}

/**
 * Load all 78 tarot cards for display
 */
export function getAllTarotCards(): TarotCard[] {
  const fullCards = fullTarotData.tarot_cards as any[];
  const majorArcana = getMajorArcanaInterpretations();

  // Create random mapping from 78 cards to 22 interpretations
  // Ensure each interpretation has roughly equal chance
  const interpretationMap: number[] = [];

  // Create a balanced distribution
  for (let i = 0; i < fullCards.length; i++) {
    interpretationMap.push(i % majorArcana.length);
  }

  // Shuffle the mapping to randomize
  for (let i = interpretationMap.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [interpretationMap[i], interpretationMap[j]] = [interpretationMap[j], interpretationMap[i]];
  }

  // Map each of the 78 cards to a Major Arcana interpretation
  return fullCards.map((card, index) => {
    const mappedInterpretation = majorArcana[interpretationMap[index]];
    return {
      id: index,
      name: card.card_name,
      image: `${card.card_name}.png`,
      image_path: `/images/tarot/${card.card_name}.png`,
      interpretation: mappedInterpretation.interpretation,
      personality: mappedInterpretation.personality,
      quote: mappedInterpretation.quote,
    };
  });
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleCards(cards: TarotCard[]): TarotCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get a random vertical offset for card positioning
 * Returns a value between -20 and 20 pixels
 */
export function getRandomCardOffset(): number {
  return Math.random() * 40 - 20;
}

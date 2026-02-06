# Valentine Tarot - AI Context File

## Project Overview
A Valentine's Day themed tarot card reading web application. Users can draw tarot cards to receive love predictions, save result images, and share on social media.

## Tech Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Backend**: Firebase Realtime Database (serverless)
- **Hosting**: GitHub Pages
- **Image Generation**: html2canvas library

## File Structure

```
love-tarot/
├── index.html              # Main HTML (single page app)
├── css/
│   └── styles.css          # All styles (responsive, animations)
├── js/
│   ├── app.js              # Main application logic
│   ├── translations.js     # i18n UI translations (6 languages)
│   ├── card-interpretations.js  # 78 tarot card meanings
│   ├── counter.js          # Firebase integration & analytics
│   └── facebook.js         # Facebook SDK (optional)
├── images/
│   ├── tarot/              # 78 tarot card images (PNG)
│   └── card_back_red.png   # Card back image
├── audio/
│   └── background.mp3      # Background music
└── valentine_tarot.json    # Card data (names, images, keywords)
```

## Key Files Detail

### index.html
- Single page with multiple "screens" (landing, main, result, blessing)
- Uses `data-i18n` attributes for translation keys
- Script loading order: translations.js → card-interpretations.js → app.js → counter.js

### js/app.js (~4800 lines)
Main application with these core functions:
- `initApp()` - Entry point, loads cards from JSON
- `createCardGrid()` - Renders 78 cards
- `selectCard(card)` - Handles card selection & animation
- `showResult()` - Displays prediction with interpretation
- `saveImage(format)` - Generates shareable images (ig-story, square, wide)
- `updateLangButton()` / `setLanguage()` - Language switching
- `submitComment()` - Firebase comment submission

### js/translations.js
```javascript
const translations = {
  th: { landing: {...}, main: {...}, result: {...}, ... },
  en: { ... },
  'zh-CN': { ... },
  'zh-TW': { ... },
  ko: { ... },
  ja: { ... }
};
```

### js/card-interpretations.js
```javascript
const cardInterpretations = {
  "THE FOOL": { quote: "...", prediction: "..." },
  "THE MAGICIAN": { ... },
  // ... 78 cards total (22 Major + 56 Minor Arcana)
};
```

### js/counter.js
Firebase functions:
- `incrementCardPick(cardName)` - Track card selections
- `submitComment(data)` / `fetchComments()` - Comment system
- `submitReply()` / `fetchReplies()` - Reply threads
- `fetchCardRankings()` - Popular cards leaderboard

### css/styles.css (~3500 lines)
- CSS variables for theming (--burgundy, --cream, etc.)
- Mobile-first responsive design
- Card flip animations
- Blessing screen particle effects

## Supported Languages
| Code | Language | Flag |
|------|----------|------|
| th | Thai | 🇹🇭 |
| en | English | 🇬🇧 |
| zh-CN | Simplified Chinese | 🇨🇳 |
| zh-TW | Traditional Chinese | 🇹🇼 |
| ko | Korean | 🇰🇷 |
| ja | Japanese | 🇯🇵 |
| fr | French | 🇫🇷 |

## User Flow
1. **Landing** → Click spinning card
2. **Main** → Browse & select 1 of 78 cards
3. **Result** → View prediction, quote, interpretation
4. **Actions** → Save image / Share / Comment
5. **Blessing** → Celebration screen with social links

## Firebase Data Structure
```
firebase-db/
├── cardPicks/
│   └── {cardName}: count
├── comments/
│   └── {commentId}: { name, text, cardName, timestamp, userId }
└── replies/
    └── {commentId}/
        └── {replyId}: { name, text, timestamp, userId }
```

## Image Save Formats
| Format | Ratio | Use Case |
|--------|-------|----------|
| ig-story | 9:16 | Instagram Story |
| square | 1:1 | Instagram Post |
| facebook | 1200x630 | Facebook Share |
| wide | 16:9 | General sharing |

## Common Tasks

### Add new translation key
1. Add key to all 6 languages in `js/translations.js`
2. Use in HTML: `<span data-i18n="section.key">fallback</span>`
3. Or in JS: `translations[currentLang].section.key`

### Add new card interpretation
Edit `js/card-interpretations.js`:
```javascript
"CARD NAME": {
  quote: "Inspirational quote here",
  prediction: "Detailed prediction text..."
}
```

### Modify styling
All styles in `css/styles.css`. Key selectors:
- `.landing-page` - First screen
- `.card-grid` - Card selection grid
- `.result-page` - Prediction display
- `.blessing-screen` - Celebration screen

## Version History
- v1.0.0 - Initial release
- v1.1.0 - Separated translation files, cache busting

## Notes for AI
- Card names are always in English (no translation)
- Images are in `images/tarot/{CARD NAME}.png`
- Firebase config is in counter.js (check if initialized)
- Use `?v=X.X.X` query strings for cache busting

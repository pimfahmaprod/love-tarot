// Valentine Tarot - Main Application Script

let tarotData = null;
let selectedCardElement = null;
let isAnimating = false;
let isPageReady = false;

// ========================================
// Background Music Control
// ========================================
let isMuted = false;
let musicStarted = false;
let audioElement = null;

// ========================================
// Sound Effects
// ========================================
const soundEffects = {
    cardFlip: null,
    cardSpread: null,
    cardSelect: null
};

// Web Audio API context for amplification
let audioContext = null;

// Initialize sound effects
function initSoundEffects() {
    soundEffects.cardFlip = new Audio('audio/card_select.mp3');
    soundEffects.cardFlip.volume = 0.18;

    soundEffects.cardSpread = new Audio('audio/card_spread.mp3');
    soundEffects.cardSpread.volume = 1.0;
    soundEffects.cardSpread.gainBoost = 2.5; // Amplify 250%

    soundEffects.cardSelect = new Audio('audio/card_select.mp3');
    soundEffects.cardSelect.volume = 0.18;
}

// Play a sound effect with optional gain boost
function playSoundEffect(soundName) {
    if (isMuted) return;

    const sound = soundEffects[soundName];
    if (sound) {
        // If sound has gain boost, use Web Audio API
        if (sound.gainBoost && sound.gainBoost > 1) {
            playWithGainBoost(sound, sound.gainBoost);
        } else {
            sound.currentTime = 0;
            sound.play().catch(err => {
                console.log('Sound effect play failed:', err.message);
            });
        }
    }
}

// Play audio with amplification using Web Audio API
function playWithGainBoost(audioElement, gainValue) {
    try {
        // Create audio context if not exists
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Resume context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // Clone the audio to allow overlapping plays
        const tempAudio = new Audio(audioElement.src);

        // Create media element source
        const source = audioContext.createMediaElementSource(tempAudio);

        // Create gain node for amplification
        const gainNode = audioContext.createGain();
        gainNode.gain.value = gainValue;

        // Connect: source -> gain -> destination
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Play
        tempAudio.play().catch(err => {
            console.log('Amplified sound play failed:', err.message);
        });
    } catch (err) {
        // Fallback to normal playback
        console.log('Web Audio API failed, using fallback:', err.message);
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log('Fallback play failed:', e.message));
    }
}

// Initialize sound effects on load
initSoundEffects();

// Initialize audio element
function initAudioElement() {
    if (audioElement) return audioElement;

    audioElement = document.getElementById('bgMusic');
    if (audioElement) {
        // Set source directly on element for better compatibility
        audioElement.src = 'audio/background.mp3';
        audioElement.volume = 0.15;
        audioElement.loop = true;
        audioElement.load();
        console.log('Audio element initialized');
    }
    return audioElement;
}

// Update sound indicator visibility
function updateSoundIndicator(isPlaying) {
    const indicator = document.getElementById('soundIndicator');
    if (indicator) {
        if (isPlaying && !isMuted) {
            indicator.classList.add('playing');
        } else {
            indicator.classList.remove('playing');
        }
    }
}

// Try to play music - must be called from user interaction
function tryPlayMusic(muteOnFail = false) {
    const audio = initAudioElement();
    if (!audio) {
        console.log('Audio element not found');
        return;
    }

    if (musicStarted && !audio.paused) {
        console.log('Music already playing');
        updateSoundIndicator(true);
        return;
    }

    audio.volume = 0.15;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicStarted = true;
            console.log('Music started playing successfully');
            updateSoundIndicator(true);
        }).catch(err => {
            console.log('Audio play failed:', err.message);
            musicStarted = false;
            updateSoundIndicator(false);
            // If autoplay fails on initial load, mute the audio
            if (muteOnFail) {
                isMuted = true;
                audio.muted = true;
                const muteIconEl = document.getElementById('muteIcon');
                const unmuteIconEl = document.getElementById('unmuteIcon');
                if (muteIconEl && unmuteIconEl) {
                    muteIconEl.style.display = 'none';
                    unmuteIconEl.style.display = 'block';
                }
                console.log('Autoplay blocked - audio muted by default');
            }
        });
    }
}

// Toggle mute/unmute
function toggleMute(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const audio = initAudioElement();
    const muteIconEl = document.getElementById('muteIcon');
    const unmuteIconEl = document.getElementById('unmuteIcon');

    if (!audio) {
        console.log('Audio element not found');
        return;
    }

    isMuted = !isMuted;
    audio.muted = isMuted;

    // Track music toggle
    if (window.cardCounter) {
        window.cardCounter.trackMusicToggle(isMuted);
    }

    console.log('Mute toggled:', isMuted);

    if (muteIconEl && unmuteIconEl) {
        if (isMuted) {
            muteIconEl.style.display = 'none';
            unmuteIconEl.style.display = 'block';
            updateSoundIndicator(false);
        } else {
            muteIconEl.style.display = 'block';
            unmuteIconEl.style.display = 'none';
            // Try to play if paused
            if (audio.paused) {
                audio.play().then(() => {
                    musicStarted = true;
                    console.log('Music resumed');
                    updateSoundIndicator(true);
                }).catch(() => {
                    updateSoundIndicator(false);
                });
            } else {
                updateSoundIndicator(true);
            }
        }
    }
}

// Preload an image and return a promise
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(src); // Don't fail on error, just continue
        img.src = src;
    });
}

// Mark page as ready and enable card clicking with epic reveal
function markPageReady() {
    isPageReady = true;

    // Try to play background music (may be blocked by browser)
    // Show prompt if autoplay fails
    tryPlayMusic(true);

    // Reveal the header with epic animation
    const header = document.querySelector('.landing-heading');
    if (header) {
        header.classList.add('revealed');
    }

    // Add glow effect to card
    const cardContainer = document.getElementById('spinningCardContainer');
    if (cardContainer) {
        cardContainer.classList.add('ready-glow');
    }

    // Update hint text with ready animation (after header animation)
    setTimeout(() => {
        const hintText = document.querySelector('.card-click-hint');
        if (hintText) {
            hintText.textContent = 'แตะไพ่เพื่อเริ่มดูดวง';
            hintText.classList.remove('loading-state');
            hintText.classList.add('ready-state');
        }

        // Reveal brand at bottom
        const brand = document.querySelector('.landing-brand');
        if (brand) {
            brand.classList.add('revealed');
        }

    }, 600);
}

// Wait for all resources to load
async function waitForResources() {
    // Start the card rotation animation immediately
    startCardRotation();
    createFloatingSparkles();

    // Load tarot data and essential images in parallel
    const essentialImages = [
        'images/card_back_red.png',
        ...spinningCardImages.slice(0, 3) // Only first 3 spinning images
    ];

    // Load data and essential images simultaneously
    await Promise.all([
        // Load tarot data
        (async () => {
            if (!tarotData) {
                try {
                    const response = await fetch('valentine_tarot.json');
                    tarotData = await response.json();
                } catch (error) {
                    console.error('Error loading tarot data:', error);
                }
            }
        })(),
        // Preload essential images only
        ...essentialImages.map(src => preloadImage(src))
    ]);

    // Render cards (they use card back image which is already loaded)
    renderCards();

    // Mark page as ready immediately - don't wait for all images
    markPageReady();

    // Load remaining images in background (non-blocking)
    loadRemainingImagesInBackground();
}

// Load remaining images in background after page is interactive
function loadRemainingImagesInBackground() {
    // Remaining spinning card images
    const remainingSpinning = spinningCardImages.slice(3);

    // All tarot card front images
    const tarotImages = (tarotData && tarotData.cards)
        ? tarotData.cards.map(card => `images/tarot/${card.image}`)
        : [];

    // Load in small batches to not block the main thread
    const allImages = [...remainingSpinning, ...tarotImages];
    let index = 0;
    const batchSize = 5;

    function loadBatch() {
        const batch = allImages.slice(index, index + batchSize);
        if (batch.length === 0) return;

        batch.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        index += batchSize;
        // Load next batch after a short delay
        if (index < allImages.length) {
            setTimeout(loadBatch, 100);
        }
    }

    // Start loading after a small delay to let the page settle
    setTimeout(loadBatch, 500);
}

// Card images for spinning display
const spinningCardImages = [
    'images/tarot/THE LOVERS.png',
    'images/tarot/THE STAR.png',
    'images/tarot/THE SUN.png',
    'images/tarot/THE MOON.png',
    'images/tarot/THE EMPRESS.png',
    'images/tarot/THE EMPEROR.png',
    'images/tarot/WHEEL OF FORTUNE.png',
    'images/tarot/THE MAGICIAN.png',
    'images/tarot/THE HIGH PRIESTRESS.png',
    'images/tarot/STRENGTH.png'
];

let currentSpinningCardIndex = 0;
let spinningCardInterval = null;

// Change the front card image during rotation
function startCardRotation() {
    const frontImg = document.getElementById('spinningCardFront');

    // Wait 1.5s (when back is facing) then change image every 3s (full rotation)
    // This ensures image changes when back is facing, not when front is visible
    setTimeout(() => {
        // First change at 1.5s (back facing)
        currentSpinningCardIndex = (currentSpinningCardIndex + 1) % spinningCardImages.length;
        frontImg.src = spinningCardImages[currentSpinningCardIndex];

        // Then change every 3s (one full rotation, always when back is facing)
        spinningCardInterval = setInterval(() => {
            currentSpinningCardIndex = (currentSpinningCardIndex + 1) % spinningCardImages.length;
            frontImg.src = spinningCardImages[currentSpinningCardIndex];
        }, 3000);
    }, 1500);
}

// Create floating sparkles around spinning card
let sparkleInterval = null;
function createFloatingSparkles() {
    const container = document.getElementById('spinningCardContainer');

    sparkleInterval = setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';

        // Random position in a circle around the center
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 60;
        const x = 90 + Math.cos(angle) * radius;
        const y = 160 + Math.sin(angle) * radius;

        // Random movement direction
        const moveX = (Math.random() - 0.5) * 40;
        const moveY = -20 - Math.random() * 30; // Float upward
        const duration = 1.5 + Math.random() * 1;
        const size = 3 + Math.random() * 5;

        sparkle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            animation: sparkleRise ${duration}s ease-out forwards;
            --move-x: ${moveX}px;
            --move-y: ${moveY}px;
        `;

        container.appendChild(sparkle);

        // Remove after animation
        setTimeout(() => sparkle.remove(), duration * 1000);
    }, 200);
}

function stopFloatingSparkles() {
    if (sparkleInterval) {
        clearInterval(sparkleInterval);
        sparkleInterval = null;
    }
}

// Create sparkles for card burst effect
function createBurstSparkles(centerX, centerY) {
    const container = document.getElementById('cardBurstContainer');

    for (let i = 0; i < 25; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 250;
        const sx = Math.cos(angle) * distance;
        const sy = Math.sin(angle) * distance - 100;

        sparkle.style.cssText = `
            left: ${centerX}px;
            top: ${centerY}px;
            --sx: ${sx}px;
            --sy: ${sy}px;
            animation-delay: ${Math.random() * 300}ms;
            width: ${4 + Math.random() * 8}px;
            height: ${4 + Math.random() * 8}px;
        `;

        container.appendChild(sparkle);

        setTimeout(() => {
            sparkle.classList.add('animate');
        }, Math.random() * 300);
    }
}

// Create flying cards burst effect
function createCardBurst() {
    const container = document.getElementById('cardBurstContainer');
    const flashOverlay = document.getElementById('flashOverlay');
    const cardRect = document.getElementById('spinningCardContainer').getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    // Trigger flash effect
    flashOverlay.classList.add('active');
    setTimeout(() => {
        flashOverlay.classList.remove('active');
    }, 600);

    // Create sparkles
    createBurstSparkles(centerX, centerY);

    // Create 14 flying cards
    for (let i = 0; i < 14; i++) {
        const card = document.createElement('div');
        card.className = 'flying-card';

        // Alternate between card back and front
        const imgSrc = i % 2 === 0 ? 'images/card_back_red.png' : spinningCardImages[i % spinningCardImages.length];
        card.innerHTML = `<img src="${imgSrc}" alt="Flying Card">`;

        // Random direction for burst effect
        const angle = (i / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const distance = 180 + Math.random() * 120;
        const endDistance = 500 + Math.random() * 350;

        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const txEnd = Math.cos(angle) * endDistance;
        const tyEnd = Math.sin(angle) * endDistance - 200;
        const rot = (Math.random() - 0.5) * 60;
        const rotEnd = rot + (Math.random() - 0.5) * 180;

        card.style.cssText = `
            left: ${centerX}px;
            top: ${centerY}px;
            --tx: ${tx}px;
            --ty: ${ty}px;
            --tx-end: ${txEnd}px;
            --ty-end: ${tyEnd}px;
            --rot: ${rot}deg;
            --rot-end: ${rotEnd}deg;
            animation-delay: ${i * 40}ms;
        `;

        container.appendChild(card);

        setTimeout(() => {
            card.classList.add('animate');
        }, 10 + i * 40);
    }

    // Clean up after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 2000);
}

// Start the experience (when card is clicked)
function startExperience() {
    // Don't allow starting if page is not ready yet
    if (!isPageReady) {
        return;
    }

    // Track journey step: landing to main
    if (window.cardCounter) {
        window.cardCounter.trackJourneyStep('landing');
        window.cardCounter.trackDeviceType();
    }

    // Play music on first user interaction (guaranteed to work)
    tryPlayMusic();

    // Play card select sound effect (magic sparkle)
    playSoundEffect('cardSelect');

    const spinningCard = document.getElementById('spinningCard');
    const spinningCardContainer = document.getElementById('spinningCardContainer');
    const spinningCardWrapper = spinningCardContainer.querySelector('.spinning-card-wrapper');
    const landingPage = document.getElementById('landingPage');
    const mainPage = document.getElementById('mainPage');
    const landingHeading = document.querySelector('.landing-heading');
    const cardGrid = document.getElementById('cardGrid');

    // Get stack card size for target shrink
    const { cardWidth, cardHeight } = getEllipseParams();

    // Stop the rotation interval and sparkles
    if (spinningCardInterval) {
        clearInterval(spinningCardInterval);
    }
    stopFloatingSparkles();

    // Step 1: Stop spinning and show back of card with smooth transition
    spinningCardWrapper.style.transition = 'transform 0.5s ease-out';
    spinningCardWrapper.style.animation = 'none';
    spinningCardWrapper.style.transform = 'rotateY(180deg)';

    // Step 2: Straighten the card (remove tilt)
    spinningCard.style.transition = 'transform 0.5s ease-out';
    spinningCard.style.transform = 'rotate(0deg)';

    // Hide hint text
    spinningCardContainer.querySelector('.card-click-hint').style.opacity = '0';

    // Fade out the original header smoothly
    // First, freeze current state by removing animation and setting explicit values
    landingHeading.style.animation = 'none';
    landingHeading.style.opacity = '1';
    landingHeading.style.transform = 'translateY(0) scale(1)';
    landingHeading.style.transition = 'opacity 0.6s ease';
    // Then fade out in next frame
    requestAnimationFrame(() => {
        landingHeading.style.opacity = '0';
    });

    // Hide other landing elements
    setTimeout(() => {
        document.querySelector('.landing-brand').style.opacity = '0';
        document.querySelector('.landing-instruction').style.opacity = '0';
    }, 200);

    // Prepare main page and card grid (hidden behind spinning card)
    setTimeout(() => {
        landingPage.style.pointerEvents = 'none';
        cardGrid.classList.add('stacked');
        // Don't add initial-hidden - cards will be behind the spinning card
        mainPage.classList.add('visible');
    }, 400);

    // Step 3: Shrink the card and move to stack center
    setTimeout(() => {
        // Calculate scale to match stack card size
        const currentWidth = spinningCardContainer.offsetWidth;
        const scale = cardWidth / currentWidth;

        // Clear the ready-glow animation first so transform can work
        spinningCardContainer.style.animation = 'none';
        spinningCardContainer.style.filter = 'none';

        // Calculate position difference to align with stack center
        const spinningRect = spinningCardContainer.getBoundingClientRect();
        const gridRect = cardGrid.getBoundingClientRect();

        // Calculate center of both elements
        const spinningCenterY = spinningRect.top + spinningRect.height / 2;
        const gridCenterY = gridRect.top + gridRect.height / 2;

        // Calculate how much to move
        const moveY = gridCenterY - spinningCenterY;

        // Apply shrink transition and transform with translate
        spinningCardContainer.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        requestAnimationFrame(() => {
            spinningCardContainer.style.transform = `translateY(${moveY}px) scale(${scale})`;
        });

        // Also reduce shadow on the card face
        const cardFaces = spinningCardContainer.querySelectorAll('.spinning-card-face');
        cardFaces.forEach(face => {
            face.style.transition = 'box-shadow 0.6s ease';
            face.style.boxShadow = '0 2px 8px rgba(114, 47, 55, 0.15)';
        });
    }, 500);

    // Step 4: After shrink completes, hide spinning card instantly and spread the stack
    setTimeout(() => {
        // Hide spinning card instantly with NO transition - it should just disappear
        // The stack is already visible behind at the same position
        spinningCardContainer.style.transition = 'none';
        spinningCardContainer.style.opacity = '0';
        spinningCardContainer.style.visibility = 'hidden';

        // Small delay before spreading to make it feel like the top card is part of the stack
        setTimeout(() => {
            cardGrid.classList.remove('stacked');
            animateToEllipse();

            // Create mini header that fades in at center of ellipse after cards spread
            // 78 cards * 15ms stagger + 600ms animation = ~1800ms total
            setTimeout(() => {
                const miniHeader = document.createElement('div');
                miniHeader.className = 'mini-header';
                miniHeader.innerHTML = 'Who\'s Gonna Be<br>My Next <span class="strikethrough-word"><span class="mistake">Mistake?</span><span class="valentine">Valentine!</span></span>';
                document.body.appendChild(miniHeader);

                // Fade in after a brief moment
                requestAnimationFrame(() => {
                    miniHeader.classList.add('visible');
                });
            }, 1800);
        }, 50);

        // Hide landing page
        setTimeout(() => {
            landingPage.classList.add('hidden');
        }, 300);
    }, 1100);
}

// Load tarot data
async function loadTarotData() {
    try {
        const response = await fetch('valentine_tarot.json');
        tarotData = await response.json();
        renderCards();
    } catch (error) {
        console.error('Error loading tarot data:', error);
        document.getElementById('cardGrid').innerHTML =
            '<p class="loading">ไม่สามารถโหลดข้อมูลไพ่ได้</p>';
    }
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Expand cards to 78 (or use all if already 78)
function expandCardsTo78(cards) {
    const targetCount = 78;
    const baseCount = cards.length; // 78 cards total (full tarot deck)
    const timesEach = Math.floor(targetCount / baseCount); // 1 (each card appears once)
    const remainder = targetCount % baseCount; // 0 (no duplicates needed)

    let expanded = [];

    // Add each card 'timesEach' times (3 times each = 66 cards)
    for (let i = 0; i < timesEach; i++) {
        expanded = expanded.concat(cards);
    }

    // Add 'remainder' more cards randomly (12 more to reach 78)
    const shuffledForExtra = shuffleArray([...cards]);
    for (let i = 0; i < remainder; i++) {
        expanded.push(shuffledForExtra[i]);
    }

    return expanded;
}

// Render cards
function renderCards() {
    const cardGrid = document.getElementById('cardGrid');
    const expandedCards = expandCardsTo78(tarotData.cards);
    const shuffledCards = shuffleArray(expandedCards);

    cardGrid.innerHTML = shuffledCards.map((card, index) => `
        <div class="card-container" data-card-id="${card.id}">
            <div class="card">
                <div class="card-face card-back">
                    <img src="images/card_back_red.png" alt="Card Back">
                </div>
                <div class="card-face card-front">
                    <img src="images/tarot/${card.image}" alt="${card.name}">
                </div>
            </div>
        </div>
    `).join('');

    // Add click listeners and hover effects
    document.querySelectorAll('.card-container').forEach((container, index) => {
        container.addEventListener('click', () => {
            const cardId = parseInt(container.dataset.cardId);
            selectCard(cardId, container);
        });

        // Store original transform for hover effects
        container.dataset.index = index;

        // No hover effects - card stays at original size and z-index
    });

    // Apply stacked layout initially (animation triggered later)
    applyStackedLayout();
}

// Apply stacked layout (initial state)
function applyStackedLayout() {
    const containers = document.querySelectorAll('.card-container');
    const { cardWidth, cardHeight } = getEllipseParams();

    containers.forEach((container, index) => {
        // Small random offset for natural stack look
        const offsetX = (Math.random() - 0.5) * 6;
        const offsetY = (Math.random() - 0.5) * 3;
        const rotation = (Math.random() - 0.5) * 8;

        container.classList.add('stacked');
        container.classList.remove('spread');
        container.style.width = `${cardWidth}px`;
        container.style.height = `${cardHeight}px`;
        container.style.left = `calc(50% - ${cardWidth/2}px + ${offsetX}px)`;
        container.style.top = `calc(50% - ${cardHeight/2}px + ${offsetY}px)`;
        container.style.transform = `rotate(${rotation}deg)`;
        container.style.zIndex = index;
        container.style.transition = 'none';
    });
}

// Animate cards from stack to ellipse
function animateToEllipse() {
    // Play card spread sound effect
    playSoundEffect('cardSpread');

    const containers = document.querySelectorAll('.card-container');
    const totalCards = containers.length;
    const { radiusX, radiusY, cardWidth, cardHeight, offsetY } = getEllipseParams();

    containers.forEach((container, index) => {
        // Stagger the animation
        const delay = index * 15;

        setTimeout(() => {
            container.classList.remove('stacked');
            container.classList.add('spread');
            container.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

            const anglePerCard = (2 * Math.PI) / totalCards;
            const angle = index * anglePerCard - Math.PI / 2;

            const x = radiusX * Math.cos(angle);
            const y = radiusY * Math.sin(angle) + offsetY;
            const rotationDeg = (angle * 180 / Math.PI) + 90;

            container.style.left = `calc(50% + ${x}px - ${cardWidth/2}px)`;
            container.style.top = `calc(50% + ${y}px - ${cardHeight/2}px)`;
            container.style.transform = `rotate(${rotationDeg}deg)`;
            container.style.zIndex = index;

            // Reset transition and add floating animation after spread completes
            setTimeout(() => {
                // Set up CSS variables for animation
                container.style.setProperty('--card-rotation', `rotate(${rotationDeg}deg)`);
                container.style.setProperty('--float-delay', `${(index % 10) * 0.3}s`);
                // Clear inline transform and add floating class in same frame
                container.style.transition = 'none';
                container.style.transform = '';
                requestAnimationFrame(() => {
                    container.classList.add('floating');
                });
            }, 600);
        }, delay);
    });
}

// Get responsive elliptical parameters
function getEllipseParams() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Account for footer height
    const availableHeight = height - 50;
    if (width <= 480) {
        // Mobile: tall ellipse along screen height
        return {
            radiusX: Math.min(width * 0.36, 140),   // Narrow horizontal
            radiusY: Math.min(availableHeight * 0.30, 200),  // Tall vertical, fit within screen
            cardWidth: 40,
            cardHeight: 71,
            offsetY: 0
        };
    } else if (width <= 768) {
        return {
            radiusX: 150,   // Narrow
            radiusY: Math.min(availableHeight * 0.35, 260),   // Fit within screen
            cardWidth: 50,
            cardHeight: 89,
            offsetY: 0
        };
    }
    return {
        radiusX: 180,   // Narrow
        radiusY: Math.min(availableHeight * 0.38, 340),   // Fit within screen
        cardWidth: 65,
        cardHeight: 116,
        offsetY: 0
    };
}

// Get card transform based on index for elliptical layout
function getCardTransform(index) {
    const totalCards = 78;
    const anglePerCard = (2 * Math.PI) / totalCards;
    const angle = index * anglePerCard - Math.PI / 2; // Start from top
    const rotationDeg = (angle * 180 / Math.PI) + 90; // Point outward
    return `rotate(${rotationDeg}deg)`;
}

// Apply elliptical layout
function applyCircularLayout() {
    const containers = document.querySelectorAll('.card-container');
    const totalCards = containers.length;
    const { radiusX, radiusY, cardWidth, cardHeight, offsetY } = getEllipseParams();

    containers.forEach((container, index) => {
        const anglePerCard = (2 * Math.PI) / totalCards;
        const angle = index * anglePerCard - Math.PI / 2; // Start from top

        // Calculate position on ellipse
        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle) + offsetY;

        // Rotation to point outward from center
        const rotationDeg = (angle * 180 / Math.PI) + 90;

        container.style.width = `${cardWidth}px`;
        container.style.height = `${cardHeight}px`;
        container.style.left = `calc(50% + ${x}px - ${cardWidth/2}px)`;
        container.style.top = `calc(50% + ${y}px - ${cardHeight/2}px)`;
        container.style.transformOrigin = 'center center';
        container.style.transform = `rotate(${rotationDeg}deg)`;
        container.style.zIndex = index;
    });
}

// Create sparkle particles for card selection
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        // Random angle for each sparkle
        const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const distance = 60 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        sparkle.style.setProperty('--sparkle-x', `${x}px`);
        sparkle.style.setProperty('--sparkle-y', `${y}px`);
        sparkle.style.animationDelay = `${Math.random() * 0.2}s`;
        sparkle.style.width = `${6 + Math.random() * 6}px`;
        sparkle.style.height = sparkle.style.width;

        document.body.appendChild(sparkle);

        // Remove sparkle after animation
        setTimeout(() => sparkle.remove(), 1000);
    }
}

// Select card
function selectCard(cardId, cardElement) {
    if (isAnimating) return;
    isAnimating = true;

    const card = tarotData.cards.find(c => c.id === cardId);
    if (!card) {
        isAnimating = false;
        return;
    }

    selectedCardElement = cardElement;

    // Play card flip sound effect when picking a card
    playSoundEffect('cardFlip');

    // Reset hover scale immediately to prevent visual jump
    const index = parseInt(cardElement.dataset.index);
    const originalTransform = getCardTransform(index);
    cardElement.style.transition = 'none';
    cardElement.style.transform = originalTransform;
    // Force reflow to apply the change immediately
    cardElement.offsetHeight;

    // Set center card image
    document.getElementById('centerCardImage').src = `images/tarot/${card.image}`;

    // Reset center card flip state
    document.getElementById('centerCardInner').classList.remove('flipped');

    // Get current rotation from CSS variable or computed style
    const currentRotation = cardElement.style.getPropertyValue('--card-rotation') ||
                           cardElement.style.transform || 'rotate(0deg)';
    const rotationMatch = currentRotation.match(/rotate\(([-\d.]+)deg\)/);
    const rotationDeg = rotationMatch ? parseFloat(rotationMatch[1]) : 0;

    // Track card pick journey and timing
    if (window.cardCounter) {
        window.cardCounter.trackJourneyStep('pick');
        window.cardCounter.trackTimeToFirstPick();
        // Track card position (convert rotation to angle on circle)
        const cardAngle = (rotationDeg - 90 + 360) % 360;
        window.cardCounter.trackCardPosition(cardAngle);
    }

    // Step 1: Add selecting class for golden glow
    cardElement.classList.add('selecting');

    // Create sparkle particles
    createSparkles(cardElement);

    // Calculate slide direction - move outward from ellipse center
    const slideDistance = 40;
    // The card's rotation is (angle + 90), so subtract 90 to get the radial angle
    const radialAngle = (rotationDeg - 90) * Math.PI / 180;
    // Slide outward along the radial direction (away from center)
    const slideX = Math.cos(radialAngle) * slideDistance;
    const slideY = Math.sin(radialAngle) * slideDistance;

    // Apply slide animation - card moves outward while keeping its rotation
    cardElement.style.transition = 'transform 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out';
    // Update position to slide outward
    const currentLeft = cardElement.style.left;
    const currentTop = cardElement.style.top;
    cardElement.style.left = `calc(${currentLeft} + ${slideX}px)`;
    cardElement.style.top = `calc(${currentTop} + ${slideY}px)`;

    // Disable other cards
    document.querySelectorAll('.card-container').forEach(c => {
        if (c !== cardElement) {
            c.classList.add('disabled');
        }
    });

    // Step 2: Fade out card and show overlay
    setTimeout(() => {
        cardElement.classList.add('slide-out');
    }, 300);

    // Step 3: Show overlay and center card slides down
    setTimeout(() => {
        document.getElementById('overlay').classList.add('active');
        document.getElementById('centerCard').classList.add('active');

        // Step 4: Flip center card
        setTimeout(() => {
            document.getElementById('centerCardInner').classList.add('flipped');

            // Step 5: Show result panel
            setTimeout(() => {
                currentCardData = card; // Store for save image
                document.getElementById('resultCardName').textContent = card.name;
                document.getElementById('resultQuote').textContent = `"${card.quote}"`;
                document.getElementById('resultInterpretation').textContent = card.interpretation;
                document.getElementById('resultPanel').classList.add('active');
                isAnimating = false;

                // Track card pick in Firebase
                if (window.cardCounter && window.cardCounter.increment) {
                    window.cardCounter.increment(card.id, card.name, getUserId());
                }

                // Track journey step: result
                if (window.cardCounter) {
                    window.cardCounter.trackJourneyStep('result');
                }

                // Check if this card has comments and update button visibility
                checkCardComments(card.id);
            }, 800);
        }, 500);
    }, 600);
}

// Close and reset
function closeResult() {
    if (isAnimating) return;
    isAnimating = true;

    // Track retry
    if (window.cardCounter) window.cardCounter.trackRetry();

    const cardGrid = document.getElementById('cardGrid');

    // Reset comment form and buttons
    const commentForm = document.getElementById('commentForm');
    const commentToggleBtn = document.getElementById('commentToggleBtn');
    const viewCommentsBtn = document.getElementById('viewCommentsBtn');
    if (commentForm) commentForm.classList.remove('show');
    if (commentToggleBtn) {
        commentToggleBtn.classList.remove('active');
        commentToggleBtn.classList.remove('commented');
        commentToggleBtn.disabled = false;
        const btnText = commentToggleBtn.querySelector('span');
        if (btnText) btnText.textContent = 'คุณอยากบอกแม่หมอว่า ...';
        // Restore original text bubble icon
        const svgIcon = commentToggleBtn.querySelector('svg');
        if (svgIcon) {
            svgIcon.innerHTML = '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>';
        }
    }
    // Reset view comments button
    if (viewCommentsBtn) {
        viewCommentsBtn.style.display = 'none';
    }
    if (typeof resetCommentForm === 'function') resetCommentForm();

    // Hide result panel
    document.getElementById('resultPanel').classList.remove('active');

    setTimeout(() => {
        // Hide center card
        document.getElementById('centerCard').classList.remove('active');

        // Hide overlay
        document.getElementById('overlay').classList.remove('active');

        // Reshuffle and re-render
        setTimeout(() => {
            cardGrid.classList.add('stacked');
            renderCards();
            selectedCardElement = null;
            isAnimating = false;

            // Animate cards from stack to fan
            setTimeout(() => {
                cardGrid.classList.remove('stacked');
                animateToEllipse();
            }, 100);
        }, 400);
    }, 300);
}

// Event listeners
document.getElementById('spinningCardContainer').addEventListener('click', startExperience);
document.getElementById('resultClose').addEventListener('click', closeResult);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeResult();
    }
    if (e.key === 'Enter' || e.key === ' ') {
        const landingPage = document.getElementById('landingPage');
        if (!landingPage.classList.contains('hidden')) {
            startExperience();
        }
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        applyCircularLayout();
    }, 100);
});

// Share Functions
const siteUrl = 'https://pimfahmaprod.github.io/love-tarot/';

function getShareText() {
    const cardName = document.getElementById('resultCardName').textContent;
    const quote = document.getElementById('resultQuote').textContent.replace(/[""]/g, '');
    return `ฉันจับได้ไพ่ ${cardName}\n"${quote}"\n\nมาดูดวงความรักวาเลนไทน์กัน!`;
}

function showToast(message) {
    const toast = document.getElementById('copyToast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Try Web Share API first (best for mobile)
function tryWebShare() {
    if (navigator.share) {
        navigator.share({
            title: 'ดูดวงความรักวาเลนไทน์',
            text: getShareText(),
            url: siteUrl
        }).catch(() => {});
        return true;
    }
    return false;
}

function shareToFacebook() {
    // Track share
    if (window.cardCounter) window.cardCounter.trackShare('messenger');

    // Share to Facebook Messenger
    const text = getShareText() + '\n\n' + siteUrl;
    navigator.clipboard.writeText(text).then(() => {
        showToast('คัดลอกข้อความแล้ว! วางใน Messenger ได้เลย');
        setTimeout(() => {
            // Try Messenger deep link first (works on mobile), fallback to web
            const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(siteUrl)}&redirect_uri=${encodeURIComponent(siteUrl)}`;
            window.open(messengerUrl, '_blank', 'width=600,height=400');
        }, 500);
    });
}

function shareToLine() {
    // Track share
    if (window.cardCounter) window.cardCounter.trackShare('line');

    // LINE already opens chat/messaging
    const text = encodeURIComponent(getShareText() + '\n' + siteUrl);
    window.open(`https://line.me/R/share?text=${text}`, '_blank', 'width=600,height=400');
}

function copyLink() {
    // Track share
    if (window.cardCounter) window.cardCounter.trackShare('copylink');

    const text = getShareText() + '\n\n' + siteUrl;
    navigator.clipboard.writeText(text).then(() => {
        showToast('คัดลอกข้อความแล้ว!');
    });
}

// Comment Functions
const SAVED_NAME_KEY = 'tarot_user_name';
const USER_ID_KEY = 'tarot_user_id';

function generateUserId() {
    return 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

function getUserId() {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
}

function getSavedUserName() {
    return localStorage.getItem(SAVED_NAME_KEY) || '';
}

function saveUserName(name) {
    localStorage.setItem(SAVED_NAME_KEY, name.trim());
}

function toggleCommentForm() {
    const form = document.getElementById('commentForm');
    const btn = document.getElementById('commentToggleBtn');
    const nameGroup = document.getElementById('commentNameGroup');
    const savedName = getSavedUserName();

    form.classList.toggle('show');
    btn.classList.toggle('active');

    if (form.classList.contains('show')) {
        // Track comment form opened
        if (window.cardCounter) {
            window.cardCounter.trackCommentFormStart();
        }
        // Check if name is already saved
        if (savedName && nameGroup) {
            nameGroup.style.display = 'none';
        } else if (nameGroup) {
            nameGroup.style.display = 'block';
        }
    } else {
        // Track comment form abandoned (if had content)
        const commentInput = document.getElementById('commentText');
        if (commentInput && commentInput.value.trim() && window.cardCounter) {
            window.cardCounter.trackCommentFormAbandon();
        }
        // Reset form when closing
        resetCommentForm();
    }
}

// Check if current card has comments and update button visibility
async function checkCardComments(cardId) {
    const viewCommentsBtn = document.getElementById('viewCommentsBtn');
    const commentToggleBtn = document.getElementById('commentToggleBtn');
    const commentToggleBtnText = document.getElementById('commentToggleBtnText');

    if (!viewCommentsBtn || !commentToggleBtn || !commentToggleBtnText) return;

    // Default state: hide view button, show normal text
    viewCommentsBtn.style.display = 'none';
    commentToggleBtnText.textContent = 'คุณอยากบอกแม่หมอว่า ...';

    // Check if Firebase is available
    if (!window.cardCounter || !window.cardCounter.fetchCommentsByCardId) {
        return;
    }

    try {
        const comments = await window.cardCounter.fetchCommentsByCardId(cardId, null, 1);

        if (comments && comments.length > 0) {
            // Card has comments: show both buttons
            viewCommentsBtn.style.display = 'inline-flex';
            commentToggleBtnText.textContent = 'คุณอยากบอกแม่หมอว่า ...';
        } else {
            // Card has no comments: hide view button, change text
            viewCommentsBtn.style.display = 'none';
            commentToggleBtnText.textContent = 'เป็นคนแรกที่บอกแม่หมอ';
        }
    } catch (error) {
        console.warn('Failed to check card comments:', error);
    }
}

// View comments for the current card (creates gold-bordered navigated card)
async function viewCardComments() {
    if (!currentCardData) return;

    const cardId = currentCardData.id;

    // Open comments panel first
    openCommentsPanel();

    // Wait for comments to load, then create navigated card
    setTimeout(async () => {
        if (!window.cardCounter || !window.cardCounter.fetchCommentsByCardId) return;

        try {
            // Find the most recent comment for this card
            const comments = await window.cardCounter.fetchCommentsByCardId(cardId, null, 1);

            if (comments && comments.length > 0) {
                const latestComment = comments[0];

                // Use navigateToRelatedComment to create gold-bordered card
                await navigateToRelatedComment(latestComment);
            } else {
                // No comments found for this card
                showToast('ยังไม่มีความคิดเห็นบนไพ่ใบนี้');
            }
        } catch (error) {
            console.warn('Failed to view card comments:', error);
            showToast('ไม่สามารถโหลดความคิดเห็นได้');
        }
    }, 500);
}

function resetCommentForm() {
    const savedName = getSavedUserName();
    const nameInput = document.getElementById('commentName');
    const nameGroup = document.getElementById('commentNameGroup');

    if (!savedName && nameInput) {
        nameInput.value = '';
        document.getElementById('nameCharCount').textContent = '0';
    }
    if (nameGroup) {
        nameGroup.style.display = savedName ? 'none' : 'block';
    }

    document.getElementById('commentText').value = '';
    document.getElementById('commentCharCount').textContent = '0';
    document.getElementById('commentSubmitBtn').disabled = false;
    document.getElementById('commentSubmitBtn').classList.remove('success');
    document.getElementById('commentSubmitText').textContent = 'ส่งความคิดเห็น';
}

// Character count listeners
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('commentName');
    const commentInput = document.getElementById('commentText');

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            document.getElementById('nameCharCount').textContent = nameInput.value.length;
        });
    }

    if (commentInput) {
        commentInput.addEventListener('input', () => {
            document.getElementById('commentCharCount').textContent = commentInput.value.length;
        });
    }

    // Track interpretation scroll depth
    const resultPanel = document.getElementById('resultPanel');
    if (resultPanel) {
        let maxScrollTracked = 0;
        resultPanel.addEventListener('scroll', () => {
            const scrollTop = resultPanel.scrollTop;
            const scrollHeight = resultPanel.scrollHeight - resultPanel.clientHeight;
            if (scrollHeight > 0) {
                const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
                // Only track when reaching new milestones (25%, 50%, 75%, 100%)
                const milestones = [25, 50, 75, 100];
                for (const milestone of milestones) {
                    if (scrollPercent >= milestone && maxScrollTracked < milestone) {
                        maxScrollTracked = milestone;
                        if (window.cardCounter) {
                            window.cardCounter.trackInterpretationScroll(milestone);
                        }
                    }
                }
            }
        });
        // Reset max scroll when panel closes (detected by class change)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && !resultPanel.classList.contains('active')) {
                    maxScrollTracked = 0;
                }
            });
        });
        observer.observe(resultPanel, { attributes: true });
    }
});

async function submitComment() {
    const nameInput = document.getElementById('commentName');
    const commentInput = document.getElementById('commentText');
    const submitBtn = document.getElementById('commentSubmitBtn');
    const submitText = document.getElementById('commentSubmitText');

    // Use saved name or input value
    const savedName = getSavedUserName();
    const userName = savedName || nameInput.value.trim();
    const commentText = commentInput.value.trim();

    // Validation
    if (!userName) {
        showToast('กรุณาใส่ชื่อของคุณ');
        nameInput.focus();
        return;
    }

    if (!commentText) {
        showToast('กรุณาใส่ความคิดเห็น');
        commentInput.focus();
        return;
    }

    if (!currentCardData) {
        showToast('เกิดข้อผิดพลาด กรุณาลองใหม่');
        return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitText.textContent = 'กำลังส่ง...';

    // Submit to Firebase
    if (window.cardCounter && window.cardCounter.submitComment) {
        const userId = getUserId();
        const result = await window.cardCounter.submitComment(
            currentCardData.id,
            currentCardData.name,
            currentCardData.image,
            userId,
            userName,
            commentText
        );

        if (result.success) {
            // Track comment form submitted
            if (window.cardCounter) {
                window.cardCounter.trackCommentFormSubmit();
            }

            // Save name for future comments
            saveUserName(userName);

            submitBtn.classList.add('success');
            submitText.textContent = 'ส่งสำเร็จ!';
            showToast('ขอบคุณสำหรับความคิดเห็น!');

            // Close form and disable button for this round
            setTimeout(() => {
                const form = document.getElementById('commentForm');
                const toggleBtn = document.getElementById('commentToggleBtn');

                form.classList.remove('show');
                toggleBtn.classList.remove('active');
                toggleBtn.classList.add('commented');
                toggleBtn.disabled = true;
                toggleBtn.querySelector('span').textContent = 'บอกแม่หมอแล้ว';
                // Change icon to checkmark
                const svgIcon = toggleBtn.querySelector('svg');
                if (svgIcon) {
                    svgIcon.innerHTML = '<path d="M20 6L9 17l-5-5"/>';
                }

                // Auto-open comments panel to show user's comment
                setTimeout(() => {
                    openCommentsPanel();
                }, 300);
            }, 1500);
        } else {
            submitBtn.disabled = false;
            submitText.textContent = 'ส่งความคิดเห็น';
            showToast('เกิดข้อผิดพลาด กรุณาลองใหม่');
        }
    } else {
        submitBtn.disabled = false;
        submitText.textContent = 'ส่งความคิดเห็น';
        showToast('ระบบยังไม่พร้อม กรุณาลองใหม่');
    }
}

// ========================================
// Comments Panel
// ========================================
let commentsLastKey = null;
let commentsHasMore = true;
let isLoadingComments = false;
let currentCommentsTab = 'new'; // 'new', 'hot', 'me'

function initCommentsPanel() {
    const commentsBtn = document.getElementById('commentsBtn');
    const commentsPanel = document.getElementById('commentsPanel');
    const commentsOverlay = document.getElementById('commentsOverlay');
    const commentsPanelClose = document.getElementById('commentsPanelClose');
    const commentsList = document.getElementById('commentsList');
    const commentsTabs = document.getElementById('commentsTabs');

    if (commentsBtn) {
        commentsBtn.addEventListener('click', openCommentsPanel);
    }

    if (commentsPanelClose) {
        commentsPanelClose.addEventListener('click', closeCommentsPanel);
    }

    if (commentsOverlay) {
        commentsOverlay.addEventListener('click', closeCommentsPanel);
    }

    // Tab click handlers
    if (commentsTabs) {
        commentsTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.comments-tab');
            if (!tab) return;

            const tabName = tab.dataset.tab;
            if (tabName === currentCommentsTab) return;

            // Update active tab
            commentsTabs.querySelectorAll('.comments-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Track tab switch
            if (window.cardCounter) {
                window.cardCounter.trackCommentsPanel('tabSwitch_' + tabName);
            }

            // Switch tab content
            currentCommentsTab = tabName;
            switchCommentsTab(tabName);
        });
    }

    // Lazy loading on scroll DOWN (load older comments) - only for 'new' tab
    if (commentsList) {
        commentsList.addEventListener('scroll', () => {
            if (isLoadingComments || !commentsHasMore || currentCommentsTab !== 'new') return;

            // Load more when scrolling near bottom
            const { scrollTop, scrollHeight, clientHeight } = commentsList;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                loadMoreComments();
            }
        });
    }

    // Subscribe to comments count for badge
    setTimeout(() => {
        if (window.cardCounter && window.cardCounter.subscribeToCommentsCount) {
            window.cardCounter.subscribeToCommentsCount(updateCommentsCountBadge);
        }
    }, 1000);
}

function switchCommentsTab(tabName) {
    // Reset state
    commentsLastKey = null;
    commentsHasMore = true;
    displayedCommentIds.clear();
    expandedCommentCard = null;
    navigatedCommentCard = null;

    // Unsubscribe from real-time updates
    if (window.cardCounter && window.cardCounter.unsubscribeFromNewComments) {
        window.cardCounter.unsubscribeFromNewComments();
    }

    // Load content for the selected tab
    if (tabName === 'new') {
        newestCommentTimestamp = 0;
        loadComments(true);
    } else if (tabName === 'hot') {
        loadHotComments();
    } else if (tabName === 'me') {
        loadMyComments();
    }
}

function updateCommentsCountBadge(count) {
    const badge = document.getElementById('commentsCount');
    if (!badge) return;

    if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.classList.add('show');
    } else {
        badge.classList.remove('show');
    }
}

// Track displayed comment IDs to avoid duplicates
let displayedCommentIds = new Set();

// Track the newest comment timestamp from initial load (to filter real-time updates)
let newestCommentTimestamp = 0;

// Track currently expanded comment card
let expandedCommentCard = null;
let navigatedCommentCard = null; // Track the card that was navigated from related comments

function openCommentsPanel() {
    const commentsPanel = document.getElementById('commentsPanel');
    const commentsOverlay = document.getElementById('commentsOverlay');
    const commentsTabs = document.getElementById('commentsTabs');

    commentsPanel.classList.add('show');
    commentsOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Track comments panel opened
    if (window.cardCounter) {
        window.cardCounter.trackCommentsPanel('opened');
    }

    // Update user name display
    updateCommentsPanelUser();

    // Reset tab to "new"
    currentCommentsTab = 'new';
    if (commentsTabs) {
        commentsTabs.querySelectorAll('.comments-tab').forEach(t => t.classList.remove('active'));
        const newTab = commentsTabs.querySelector('[data-tab="new"]');
        if (newTab) newTab.classList.add('active');
    }

    // Check if user has comments and show/hide "ของฉัน" tab
    checkUserHasComments();

    // Reset and load comments (subscription happens after load completes)
    commentsLastKey = null;
    commentsHasMore = true;
    displayedCommentIds.clear();
    newestCommentTimestamp = 0;
    loadComments(true);
}

// Check if user has any comments and show/hide the "Me" tab
async function checkUserHasComments() {
    const commentsTabs = document.getElementById('commentsTabs');
    if (!commentsTabs) return;

    const meTab = commentsTabs.querySelector('[data-tab="me"]');
    if (!meTab) return;

    // Hide by default first
    meTab.style.display = 'none';

    // Check if user has a saved name - if not, don't show the tab
    const savedName = getSavedUserName();
    if (!savedName) {
        return;
    }

    // Check if Firebase is ready
    if (!window.cardCounter || !window.cardCounter.fetchCommentsByUserId) {
        return;
    }

    // Check if user has any comments
    const userId = getUserId();
    const userComments = await window.cardCounter.fetchCommentsByUserId(userId, 1);

    if (userComments.length > 0) {
        meTab.style.display = '';
    }
}

function updateCommentsPanelUser() {
    const userElement = document.getElementById('commentsPanelUser');
    if (!userElement) return;

    const savedName = getSavedUserName();
    if (savedName) {
        userElement.textContent = savedName;
        userElement.classList.remove('anonymous');
    } else {
        userElement.textContent = 'Anonymous';
        userElement.classList.add('anonymous');
    }
}

function closeCommentsPanel() {
    const commentsPanel = document.getElementById('commentsPanel');
    const commentsOverlay = document.getElementById('commentsOverlay');

    commentsPanel.classList.remove('show');
    commentsOverlay.classList.remove('show');
    document.body.style.overflow = '';

    // Track comments panel closed
    if (window.cardCounter) {
        window.cardCounter.trackCommentsPanel('closed');
    }

    // Reset expanded card state
    expandedCommentCard = null;
    navigatedCommentCard = null;

    // Unsubscribe from real-time updates
    if (window.cardCounter && window.cardCounter.unsubscribeFromNewComments) {
        window.cardCounter.unsubscribeFromNewComments();
    }
}

// Handle new comment from real-time listener
function handleNewComment(comment) {
    // Skip if already displayed
    if (displayedCommentIds.has(comment.id)) return;

    // Skip older comments that are coming from child_added for existing data
    // Only prepend comments that are truly new (timestamp > newestCommentTimestamp)
    const commentTimestamp = comment.timestamp || 0;
    if (commentTimestamp <= newestCommentTimestamp) return;

    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;

    // Remove empty message if exists
    const emptyMsg = commentsList.querySelector('.comments-empty');
    if (emptyMsg) {
        emptyMsg.remove();
    }

    // Create and prepend new comment card at the top
    const card = createCommentCard(comment);
    card.classList.add('new-comment');

    // Insert at top (after loading element if visible)
    const loadingEl = document.getElementById('commentsLoading');
    if (loadingEl && loadingEl.style.display !== 'none') {
        loadingEl.after(card);
    } else if (commentsList.firstChild) {
        commentsList.insertBefore(card, commentsList.firstChild);
    } else {
        commentsList.appendChild(card);
    }

    // Track this comment as displayed
    displayedCommentIds.add(comment.id);

    // Update newest timestamp
    newestCommentTimestamp = commentTimestamp;

    // Scroll to top to show new comment
    commentsList.scrollTop = 0;

    // Remove animation class after animation
    setTimeout(() => {
        card.classList.remove('new-comment');
    }, 500);
}

async function loadComments(reset = false) {
    if (isLoadingComments) return;
    isLoadingComments = true;

    const commentsList = document.getElementById('commentsList');
    const loadingEl = document.getElementById('commentsLoading');

    if (reset) {
        commentsList.innerHTML = '';
        commentsList.appendChild(loadingEl);
        loadingEl.style.display = 'block';
        expandedCommentCard = null; // Reset expanded card state
        commentsLastKey = null;
    }

    if (!window.cardCounter || !window.cardCounter.fetchComments) {
        loadingEl.innerHTML = '<span>ไม่สามารถโหลดความคิดเห็นได้</span>';
        isLoadingComments = false;
        return;
    }

    // On first load, fetch top comments by replies first
    if (reset && window.cardCounter.fetchTopCommentsByReplies) {
        const topComments = await window.cardCounter.fetchTopCommentsByReplies(3);

        if (topComments.length > 0) {
            // Create top comments section header
            const topSection = document.createElement('div');
            topSection.className = 'comments-top-section';
            topSection.innerHTML = '<div class="comments-section-title">✦ ยอดนิยม</div>';
            commentsList.appendChild(topSection);

            // Add top comments
            topComments.forEach(comment => {
                const card = createCommentCard(comment, true); // true = show reply count
                commentsList.appendChild(card);
                displayedCommentIds.add(comment.id);
            });

            // Add separator for recent comments
            const recentHeader = document.createElement('div');
            recentHeader.className = 'comments-section-title recent';
            recentHeader.innerHTML = '✦ ล่าสุด';
            commentsList.appendChild(recentHeader);
        }
    }

    const result = await window.cardCounter.fetchComments(commentsLastKey, 10);

    loadingEl.style.display = 'none';

    if (result.comments.length === 0 && reset && displayedCommentIds.size === 0) {
        // Set timestamp to current time so older existing comments won't be prepended
        newestCommentTimestamp = Date.now();

        commentsList.innerHTML = `
            <div class="comments-empty">
                <div class="comments-empty-icon">💬</div>
                <div class="comments-empty-text">ยังไม่มีความคิดเห็น<br>เป็นคนแรกที่แสดงความคิดเห็นกันเถอะ!</div>
            </div>
        `;
        isLoadingComments = false;

        // Subscribe to real-time updates even when empty
        if (window.cardCounter && window.cardCounter.subscribeToNewComments) {
            window.cardCounter.subscribeToNewComments(handleNewComment);
        }
        return;
    }

    // Track the newest comment timestamp for real-time filtering
    if (reset && result.comments.length > 0) {
        newestCommentTimestamp = result.comments[0].timestamp || Date.now();
    }

    // Show newest at top, oldest at bottom (default order from fetchComments)
    result.comments.forEach(comment => {
        // Skip if already displayed (from top section or real-time update)
        if (displayedCommentIds.has(comment.id)) return;

        const card = createCommentCard(comment);
        commentsList.appendChild(card);
        displayedCommentIds.add(comment.id);
    });

    commentsLastKey = result.lastKey;
    commentsHasMore = result.hasMore;

    isLoadingComments = false;

    // Subscribe to real-time updates after initial load (only on reset/first load)
    if (reset && window.cardCounter && window.cardCounter.subscribeToNewComments) {
        window.cardCounter.subscribeToNewComments(handleNewComment);
    }
}

function loadMoreComments() {
    if (commentsHasMore && !isLoadingComments) {
        loadComments(false);
    }
}

// Load comments for Hot tab (sorted by most replies)
async function loadHotComments() {
    if (isLoadingComments) return;
    isLoadingComments = true;

    const commentsList = document.getElementById('commentsList');
    const loadingEl = document.getElementById('commentsLoading');

    commentsList.innerHTML = '';
    commentsList.appendChild(loadingEl);
    loadingEl.style.display = 'block';

    if (!window.cardCounter || !window.cardCounter.fetchHotComments) {
        loadingEl.innerHTML = '<span>ไม่สามารถโหลดความคิดเห็นได้</span>';
        isLoadingComments = false;
        return;
    }

    const comments = await window.cardCounter.fetchHotComments(30);

    loadingEl.style.display = 'none';

    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="comments-empty">
                <div class="comments-empty-icon">🔥</div>
                <div class="comments-empty-text">ยังไม่มีความคิดเห็นยอดนิยม<br>ลองตอบกลับความคิดเห็นสิ!</div>
            </div>
        `;
        isLoadingComments = false;
        return;
    }

    // Display all hot comments with reply count badge
    comments.forEach(comment => {
        const card = createCommentCard(comment, true);
        commentsList.appendChild(card);
        displayedCommentIds.add(comment.id);
    });

    isLoadingComments = false;
}

// Load comments for Me tab (user's own comments)
async function loadMyComments() {
    if (isLoadingComments) return;
    isLoadingComments = true;

    const commentsList = document.getElementById('commentsList');
    const loadingEl = document.getElementById('commentsLoading');

    commentsList.innerHTML = '';
    commentsList.appendChild(loadingEl);
    loadingEl.style.display = 'block';

    const userId = getUserId();

    if (!window.cardCounter || !window.cardCounter.fetchCommentsByUserId) {
        loadingEl.innerHTML = '<span>ไม่สามารถโหลดความคิดเห็นได้</span>';
        isLoadingComments = false;
        return;
    }

    const comments = await window.cardCounter.fetchCommentsByUserId(userId, 50);

    loadingEl.style.display = 'none';

    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="comments-empty">
                <div class="comments-empty-icon">✨</div>
                <div class="comments-empty-text">คุณยังไม่เคยแสดงความคิดเห็น<br>ลองจับไพ่และบอกแม่หมอสิ!</div>
            </div>
        `;
        isLoadingComments = false;
        return;
    }

    // Display user's comments
    comments.forEach(comment => {
        const card = createCommentCard(comment);
        commentsList.appendChild(card);
        displayedCommentIds.add(comment.id);
    });

    isLoadingComments = false;
}

function createCommentCard(comment, showReplyBadge = false) {
    const card = document.createElement('div');
    card.className = 'comment-card';

    // Add top-comment class if it has reply count
    if (showReplyBadge && comment.replyCount > 0) {
        card.classList.add('top-comment');
    }

    const date = comment.timestamp ? new Date(comment.timestamp) : new Date();
    const dateStr = formatCommentDate(date);

    // Get card image - use cardImage if available, otherwise construct from cardName
    let cardImagePath = '';
    if (comment.cardImage && comment.cardImage.length > 0) {
        cardImagePath = comment.cardImage;
    } else if (comment.cardName && comment.cardName.length > 0) {
        // Backward compatibility: construct image path from card name
        // Image files are named like "THE LOVERS.png", "THE STAR.png", etc.
        cardImagePath = comment.cardName + '.png';
    }

    const hasImage = cardImagePath.length > 0;
    const imageHtml = hasImage
        ? `<div class="comment-card-image"><img src="images/tarot/${escapeHtml(cardImagePath)}" alt="${escapeHtml(comment.cardName || 'Tarot')}" onerror="this.parentElement.style.display='none'"></div>`
        : '';

    // Reply count badge for top comments
    const replyBadgeHtml = (showReplyBadge && comment.replyCount > 0)
        ? `<div class="comment-reply-badge">💬 ${comment.replyCount} ตอบกลับ</div>`
        : '';

    card.innerHTML = `
        ${imageHtml}
        <div class="comment-card-content">
            <div class="comment-card-header">
                <span class="comment-card-name">${escapeHtml(comment.userName || 'Anonymous')}</span>
                ${replyBadgeHtml}
            </div>
            <div class="comment-card-text">${escapeHtml(comment.comment || '')}</div>
            <div class="comment-card-date">${dateStr}</div>

            <!-- Expanded content: Interpretation first -->
            <div class="comment-card-full">
                <div class="comment-card-full-title">
                    <span class="comment-card-tarot">${escapeHtml(comment.cardName || 'ไพ่ทาโรต์')}</span>
                    <span class="comment-card-full-label">คำทำนาย</span>
                </div>
                <div class="comment-card-full-interpretation"></div>
            </div>

            <!-- Replies section -->
            <div class="comment-card-replies-section">
                <div class="comment-card-replies-title">การตอบกลับ</div>
                <div class="replies-list"></div>
                <button class="replies-empty-btn" style="display: none;">✦ ตอบกลับคนแรก</button>

                <!-- Reply button and form at bottom -->
                <div class="comment-card-actions">
                    <button class="reply-btn" data-comment-id="${comment.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                        <span>ตอบกลับ</span>
                        <span class="reply-count" style="display: none;">0</span>
                    </button>
                </div>
                <div class="reply-form">
                    <div class="reply-input-wrapper">
                        <input type="text" class="reply-input" placeholder="เขียนตอบกลับ..." maxlength="150">
                        <button class="reply-submit-btn" disabled>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Related comments at the end -->
            <div class="comment-card-related">
                <div class="comment-card-related-title">ความคิดเห็นอื่นๆ บนไพ่ใบนี้</div>
                <div class="related-comments-list">
                    <div class="related-comment-loading">กำลังโหลด...</div>
                </div>
            </div>
        </div>
    `;

    // Add class for styling when image is present
    if (hasImage) {
        card.classList.add('with-image');
    }

    // Store comment data for expand functionality
    card.dataset.commentId = comment.id;
    card.dataset.cardId = comment.cardId;
    card.dataset.cardName = comment.cardName || '';

    // Setup reply functionality
    setupReplyFeature(card, comment);

    // Load reply count
    loadReplyCount(card, comment.id);

    // Add click handler for expand (no collapse on same card)
    card.addEventListener('click', (e) => {
        // Don't expand if clicking on interactive elements
        if (e.target.closest('.reply-btn') ||
            e.target.closest('.reply-form') ||
            e.target.closest('.replies-list') ||
            e.target.closest('.comment-card-replies-section') ||
            e.target.closest('.comment-card-related')) {
            return;
        }
        // Don't do anything if already expanded
        if (card.classList.contains('expanded')) {
            return;
        }
        e.stopPropagation();
        toggleCommentCardExpand(card, comment);
    });

    return card;
}

// Setup reply feature for a comment card
function setupReplyFeature(card, comment) {
    const replyBtn = card.querySelector('.reply-btn');
    const replyForm = card.querySelector('.reply-form');
    const replyInput = card.querySelector('.reply-input');
    const replySubmitBtn = card.querySelector('.reply-submit-btn');
    const repliesEmptyBtn = card.querySelector('.replies-empty-btn');

    // Toggle reply form
    replyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        replyForm.classList.toggle('show');
        if (replyForm.classList.contains('show')) {
            replyInput.focus();
        }
    });

    // "Reply first" button - same as reply button
    if (repliesEmptyBtn) {
        repliesEmptyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            replyForm.classList.add('show');
            replyInput.focus();
        });
    }

    // Enable/disable submit button based on input
    replyInput.addEventListener('input', () => {
        replySubmitBtn.disabled = replyInput.value.trim().length === 0;
    });

    // Submit reply
    replySubmitBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const text = replyInput.value.trim();
        if (!text) return;

        replySubmitBtn.disabled = true;
        replyInput.disabled = true;

        const userId = getUserId();
        const userName = getSavedUserName() || 'Anonymous';

        if (window.cardCounter && window.cardCounter.submitReply) {
            const result = await window.cardCounter.submitReply(comment.id, userId, userName, text);

            if (result.success) {
                // Clear input and hide form
                replyInput.value = '';
                replyForm.classList.remove('show');

                // Reload replies
                await loadReplies(card, comment.id);

                showToast('ตอบกลับสำเร็จ');
            } else {
                showToast('เกิดข้อผิดพลาด กรุณาลองใหม่');
            }
        }

        replySubmitBtn.disabled = false;
        replyInput.disabled = false;
    });

    // Enter key to submit
    replyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !replySubmitBtn.disabled) {
            replySubmitBtn.click();
        }
    });
}

// Load reply count for a comment
async function loadReplyCount(card, commentId) {
    if (!window.cardCounter || !window.cardCounter.getReplyCount) return;

    const count = await window.cardCounter.getReplyCount(commentId);
    const replyCountEl = card.querySelector('.reply-count');

    if (count > 0) {
        replyCountEl.textContent = count;
        replyCountEl.style.display = 'inline';
    }
}

// Load replies for a comment
async function loadReplies(card, commentId) {
    if (!window.cardCounter || !window.cardCounter.fetchReplies) return;

    const repliesList = card.querySelector('.replies-list');
    const repliesEmptyBtn = card.querySelector('.replies-empty-btn');

    repliesList.innerHTML = '<div class="related-comment-loading">กำลังโหลด...</div>';
    if (repliesEmptyBtn) repliesEmptyBtn.style.display = 'none';

    const replies = await window.cardCounter.fetchReplies(commentId);

    if (replies.length > 0) {
        repliesList.innerHTML = replies.map(reply => {
            const replyDate = reply.timestamp ? new Date(reply.timestamp) : new Date();
            const replyDateStr = formatCommentDate(replyDate);
            return `
                <div class="reply-item">
                    <div class="reply-header">
                        <span class="reply-name">${escapeHtml(reply.userName || 'Anonymous')}</span>
                        <span class="reply-date">${replyDateStr}</span>
                    </div>
                    <div class="reply-text">${escapeHtml(reply.text || '')}</div>
                </div>
            `;
        }).join('');

        // Update count on reply button
        const replyCountEl = card.querySelector('.reply-count');
        if (replyCountEl) {
            replyCountEl.textContent = replies.length;
            replyCountEl.style.display = 'inline';
        }

        if (repliesEmptyBtn) repliesEmptyBtn.style.display = 'none';
    } else {
        repliesList.innerHTML = '';
        if (repliesEmptyBtn) repliesEmptyBtn.style.display = 'block';
    }
}

async function toggleCommentCardExpand(card, comment) {
    // If clicking the same card that's expanded, collapse it
    if (expandedCommentCard === card) {
        collapseCommentCard(card);
        expandedCommentCard = null;
        return;
    }

    // Collapse previously expanded card
    if (expandedCommentCard) {
        collapseCommentCard(expandedCommentCard);
    }

    // Expand the clicked card
    await expandCommentCard(card, comment);
    expandedCommentCard = card;

    // Scroll the card into view smoothly
    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

async function expandCommentCard(card, comment) {
    card.classList.add('expanded');

    // Load full interpretation from tarotData
    const interpretationEl = card.querySelector('.comment-card-full-interpretation');
    if (interpretationEl) {
        if (tarotData && tarotData.cards) {
            const tarotCard = tarotData.cards.find(c => c.id === comment.cardId || c.name === comment.cardName);
            if (tarotCard) {
                interpretationEl.textContent = tarotCard.interpretation;
            } else {
                interpretationEl.textContent = 'ไม่พบคำทำนายสำหรับไพ่ใบนี้';
            }
        } else {
            interpretationEl.textContent = 'กำลังโหลดข้อมูล...';
        }
    }

    // Auto-load replies
    await loadReplies(card, comment.id);

    // Load related comments
    const relatedListEl = card.querySelector('.related-comments-list');
    if (!relatedListEl) {
        console.warn('relatedListEl not found in card');
        return;
    }
    relatedListEl.innerHTML = '<div class="related-comment-loading">กำลังโหลด...</div>';

    if (window.cardCounter && window.cardCounter.fetchCommentsByCardId) {
        const relatedComments = await window.cardCounter.fetchCommentsByCardId(
            comment.cardId,
            comment.id,
            5
        );

        if (relatedComments.length > 0) {
            // Fetch reply counts for all related comments
            const relatedWithReplyCounts = await Promise.all(
                relatedComments.map(async (rc) => {
                    let replyCount = 0;
                    if (window.cardCounter && window.cardCounter.getReplyCount) {
                        replyCount = await window.cardCounter.getReplyCount(rc.id);
                    }
                    return { ...rc, replyCount };
                })
            );

            relatedListEl.innerHTML = relatedWithReplyCounts.map(rc => {
                const rcDate = rc.timestamp ? new Date(rc.timestamp) : new Date();
                const rcDateStr = formatCommentDate(rcDate);
                const replyBadge = rc.replyCount > 0
                    ? `<span class="related-comment-replies">💬 ${rc.replyCount}</span>`
                    : '';
                // Store full comment data as JSON for direct use
                const commentDataJson = JSON.stringify({
                    id: rc.id,
                    cardId: rc.cardId,
                    cardName: rc.cardName,
                    cardImage: rc.cardImage || '',
                    userName: rc.userName || 'Anonymous',
                    comment: rc.comment || '',
                    timestamp: rc.timestamp
                });
                return `
                    <div class="related-comment" data-comment-id="${rc.id}" data-comment='${commentDataJson.replace(/'/g, "&#39;")}' style="cursor: pointer;">
                        <div class="related-comment-header">
                            <span class="related-comment-name">${escapeHtml(rc.userName || 'Anonymous')}</span>
                            ${replyBadge}
                            <span class="related-comment-date">${rcDateStr}</span>
                        </div>
                        <div class="related-comment-text">${escapeHtml(rc.comment || '')}</div>
                    </div>
                `;
            }).join('');

            // Add click handlers to navigate to related comments
            relatedListEl.querySelectorAll('.related-comment').forEach((el, index) => {
                const commentData = relatedWithReplyCounts[index];
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigateToRelatedComment(commentData);
                });
            });
        } else {
            relatedListEl.innerHTML = '<div class="related-comment-empty">ยังไม่มีความคิดเห็นอื่นบนไพ่ใบนี้</div>';
        }
    } else {
        relatedListEl.innerHTML = '<div class="related-comment-empty">ไม่สามารถโหลดความคิดเห็นได้</div>';
    }
}

function collapseCommentCard(card) {
    card.classList.remove('expanded');

    // If this is a navigated card, fade it out and remove it
    if (card.classList.contains('navigated-card')) {
        card.classList.add('fading-out');
        setTimeout(() => {
            if (card.parentNode) card.remove();
        }, 300);
        if (navigatedCommentCard === card) {
            navigatedCommentCard = null;
        }
    }
}

async function navigateToRelatedComment(commentData) {
    try {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;

        // Collapse any currently expanded card first
        if (expandedCommentCard) {
            collapseCommentCard(expandedCommentCard);
            expandedCommentCard = null;
        }

        // Remove previous navigated card with fade animation (keep original cards intact)
        if (navigatedCommentCard && navigatedCommentCard.parentNode) {
            navigatedCommentCard.classList.add('fading-out');
            const oldCard = navigatedCommentCard;
            navigatedCommentCard = null;
            await new Promise(resolve => setTimeout(resolve, 300));
            if (oldCard.parentNode) oldCard.remove();
        }

        // Create a duplicated card (don't remove original) and insert in "ล่าสุด" (Recent) section
        const newCard = createCommentCard(commentData, false);
        newCard.classList.add('navigated-card'); // Mark as navigated

        // Find the "ล่าสุด" section header and insert after it
        const recentHeader = commentsList.querySelector('.comments-section-title.recent');
        if (recentHeader) {
            // Insert right after the recent header
            recentHeader.after(newCard);
        } else {
            // Fallback: append to list if no recent section found
            commentsList.appendChild(newCard);
        }

        // Track displayed ID and navigated card
        displayedCommentIds.add(commentData.id);
        navigatedCommentCard = newCard;

        // Scroll to the card
        newCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Wait for scroll, then expand
        await new Promise(resolve => setTimeout(resolve, 300));
        await expandCommentCard(newCard, commentData);
        expandedCommentCard = newCard;

    } catch (error) {
        console.error('Error navigating to related comment:', error);
        showToast('เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
}

function formatCommentDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    if (days < 7) return `${days} วันที่แล้ว`;

    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize comments panel on DOM ready
document.addEventListener('DOMContentLoaded', initCommentsPanel);

// Save Image Functions
let currentCardData = null;

function saveImage(platform) {
    if (!currentCardData) {
        showToast('กรุณาเลือกไพ่ก่อน');
        return;
    }

    // Track save image
    if (window.cardCounter) window.cardCounter.trackSaveImage(platform);

    const sizes = {
        'ig-story': { width: 1080, height: 1920 },
        'square': { width: 1080, height: 1080 },
        'facebook': { width: 1200, height: 630 },
        'wide': { width: 1200, height: 630 }
    };

    const size = sizes[platform];
    if (!size) return;

    showToast('กำลังสร้างรูป...');

    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');

    // Load card image
    const cardImg = new Image();
    cardImg.crossOrigin = 'anonymous';
    cardImg.onload = () => {
        drawShareImage(ctx, cardImg, size, platform);

        // Download
        const link = document.createElement('a');
        link.download = `valentine-tarot-${currentCardData.name.toLowerCase().replace(/\s+/g, '-')}-${platform}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        showToast('บันทึกรูปสำเร็จ!');
    };
    cardImg.onerror = () => {
        // Draw without card image
        drawShareImage(ctx, null, size, platform);

        const link = document.createElement('a');
        link.download = `valentine-tarot-${currentCardData.name.toLowerCase().replace(/\s+/g, '-')}-${platform}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        showToast('บันทึกรูปสำเร็จ!');
    };
    cardImg.src = `images/tarot/${currentCardData.image}`;
}

function drawShareImage(ctx, cardImg, size, platform) {
    const { width, height } = size;
    const isVertical = height > width;
    const isWide = width > height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#FDF8F3');
    gradient.addColorStop(0.5, '#FAF0E6');
    gradient.addColorStop(1, '#F5E6D3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative border
    ctx.strokeStyle = '#722F37';
    ctx.lineWidth = isWide ? 6 : 8;
    const borderPadding = isWide ? 20 : 30;
    ctx.strokeRect(borderPadding, borderPadding, width - borderPadding * 2, height - borderPadding * 2);

    // Inner decorative line
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.3)';
    ctx.lineWidth = 2;
    const innerPadding = borderPadding + 15;
    ctx.strokeRect(innerPadding, innerPadding, width - innerPadding * 2, height - innerPadding * 2);

    // Layout based on platform
    if (isVertical) {
        // Story layout (vertical)
        drawVerticalLayout(ctx, cardImg, width, height);
    } else if (isWide) {
        // Facebook layout (wide)
        drawWideLayout(ctx, cardImg, width, height);
    } else {
        // Square layout (IG post, LINE)
        drawSquareLayout(ctx, cardImg, width, height);
    }
}

// Draw social media icons (4 icons: IG, TikTok, FB, YouTube)
function drawSocialIcons(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.07;

    const gap = size * 1.4; // Gap between icons
    let currentX = x;
    const radius = size * 0.2;

    // Instagram icon
    ctx.beginPath();
    ctx.roundRect(currentX, y, size, size, radius);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(currentX + size/2, y + size/2, size * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(currentX + size * 0.75, y + size * 0.25, size * 0.07, 0, Math.PI * 2);
    ctx.fill();

    currentX += gap;

    // TikTok icon
    ctx.beginPath();
    ctx.roundRect(currentX, y, size, size, radius);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currentX + size * 0.58, y + size * 0.15);
    ctx.lineTo(currentX + size * 0.58, y + size * 0.65);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(currentX + size * 0.42, y + size * 0.7, size * 0.18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currentX + size * 0.58, y + size * 0.22);
    ctx.quadraticCurveTo(currentX + size * 0.85, y + size * 0.18, currentX + size * 0.85, y + size * 0.38);
    ctx.stroke();

    currentX += gap;

    // Facebook icon
    ctx.beginPath();
    ctx.roundRect(currentX, y, size, size, radius);
    ctx.stroke();
    ctx.font = `bold ${size * 0.65}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('f', currentX + size/2, y + size * 0.72);

    currentX += gap;

    // Youtube icon
    ctx.beginPath();
    ctx.roundRect(currentX, y, size, size, radius);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currentX + size * 0.38, y + size * 0.3);
    ctx.lineTo(currentX + size * 0.38, y + size * 0.7);
    ctx.lineTo(currentX + size * 0.72, y + size * 0.5);
    ctx.closePath();
    ctx.fill();

    return currentX + size;
}

// Draw LINE icon only
function drawLineIcon(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.07;
    const radius = size * 0.2;

    ctx.beginPath();
    ctx.roundRect(x, y, size, size, radius);
    ctx.stroke();
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('L', x + size/2, y + size * 0.68);
}

function drawVerticalLayout(ctx, cardImg, width, height) {
    // Card image - large and centered at top
    let cardBottomY = 100;
    if (cardImg) {
        const cardWidth = 520;
        const cardHeight = cardWidth * (cardImg.height / cardImg.width);
        const cardX = (width - cardWidth) / 2;
        const cardY = 100;

        // Card shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 20;

        ctx.drawImage(cardImg, cardX, cardY, cardWidth, cardHeight);
        ctx.shadowColor = 'transparent';
        cardBottomY = cardY + cardHeight;
    }

    // Card name - right after card
    const nameY = cardBottomY + 80;
    ctx.fillStyle = '#722F37';
    ctx.font = 'bold 64px "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentCardData.name, width / 2, nameY);

    // Decorative line under name
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 180, nameY + 25);
    ctx.lineTo(width / 2 + 180, nameY + 25);
    ctx.stroke();

    // Quote
    ctx.font = 'italic 36px "Cormorant Garamond", serif';
    ctx.fillStyle = 'rgba(114, 47, 55, 0.85)';
    const quote = `"${currentCardData.quote}"`;
    wrapText(ctx, quote, width / 2, nameY + 90, width - 160, 48);

    // Interpretation section
    const interpretY = nameY + 200;

    // Divider
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.3)';
    ctx.beginPath();
    ctx.moveTo(120, interpretY);
    ctx.lineTo(width - 120, interpretY);
    ctx.stroke();

    // Interpretation label
    ctx.font = 'bold 28px "Prompt", sans-serif';
    ctx.fillStyle = '#722F37';
    ctx.fillText('คำทำนาย', width / 2, interpretY + 50);

    // Interpretation text - full text with bounds (preserve paragraph breaks)
    ctx.font = '26px "Prompt", sans-serif';
    ctx.fillStyle = '#722F37';
    const maxInterpretY = height - 180; // Leave space for footer
    wrapTextWithParagraphsCenter(ctx, currentCardData.interpretation, width / 2, interpretY + 110, width - 160, 38, maxInterpretY);

    // Footer - 2 columns layout with divider
    const iconSize = 26;
    const footerColor = 'rgba(114, 47, 55, 0.6)';
    const footerY = height - 120;

    // Calculate widths for centering
    const leftIconsWidth = iconSize * 1.4 * 3 + iconSize; // 4 icons
    const rightIconWidth = iconSize;
    const gap = 100; // Gap between two columns
    const totalWidth = leftIconsWidth + gap + rightIconWidth;
    const startX = (width - totalWidth) / 2;

    // Left column: 4 social icons + Pimfahmaprod
    drawSocialIcons(ctx, startX, footerY, iconSize, footerColor);
    ctx.textAlign = 'center';
    ctx.font = '20px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Pimfahmaprod', startX + leftIconsWidth / 2, footerY + iconSize + 28);

    // Right column: LINE icon + Line: @Pimfah
    const lineIconX = startX + leftIconsWidth + gap;
    drawLineIcon(ctx, lineIconX, footerY, iconSize, footerColor);
    ctx.textAlign = 'center';
    ctx.font = '20px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Line: @Pimfah', lineIconX + iconSize / 2, footerY + iconSize + 28);
}

function drawSquareLayout(ctx, cardImg, width, height) {
    // Border padding for safe area - generous margin from border
    const safePadding = 80;

    // Card image - left side, large and vertically centered
    let cardRightX = 450;
    if (cardImg) {
        const cardHeight = height - 200; // More vertical padding
        const cardWidth = cardHeight * (cardImg.width / cardImg.height);
        const cardX = safePadding + 10;
        const cardY = 100;

        // Card shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 15;

        ctx.drawImage(cardImg, cardX, cardY, cardWidth, cardHeight);
        ctx.shadowColor = 'transparent';
        cardRightX = cardX + cardWidth + 35;
    }

    // Right side - Text area with safe margins
    const textX = cardRightX;
    const textWidth = width - textX - safePadding - 10; // More right padding

    // Title small
    ctx.fillStyle = 'rgba(114, 47, 55, 0.6)';
    ctx.font = '22px "Cormorant Garamond", serif';
    ctx.textAlign = 'left';
    ctx.fillText('Valentine Tarot', textX, 140);

    // Card name - large (with dynamic sizing to fit)
    ctx.fillStyle = '#722F37';
    let nameFontSize = 48;
    ctx.font = `bold ${nameFontSize}px "Cormorant Garamond", serif`;
    let nameWidth = ctx.measureText(currentCardData.name).width;
    while (nameWidth > textWidth && nameFontSize > 26) {
        nameFontSize -= 2;
        ctx.font = `bold ${nameFontSize}px "Cormorant Garamond", serif`;
        nameWidth = ctx.measureText(currentCardData.name).width;
    }
    ctx.fillText(currentCardData.name, textX, 195);

    // Decorative line
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(textX, 220);
    ctx.lineTo(textX + Math.min(180, textWidth - 20), 220);
    ctx.stroke();

    // Quote
    ctx.font = 'italic 22px "Cormorant Garamond", serif';
    ctx.fillStyle = 'rgba(114, 47, 55, 0.85)';
    const quote = `"${currentCardData.quote}"`;
    wrapTextLeft(ctx, quote, textX, 265, textWidth, 30);

    // Interpretation - full text with bounds (preserve paragraph breaks)
    ctx.font = '17px "Prompt", sans-serif';
    ctx.fillStyle = '#722F37';
    const maxInterpretY = height - safePadding - 100; // Leave space for footer within safe area
    wrapTextWithParagraphs(ctx, currentCardData.interpretation, textX, 360, textWidth, 25, maxInterpretY);

    // Footer - 2 columns layout with divider
    const iconSize = 18;
    const footerColor = 'rgba(114, 47, 55, 0.55)';
    const footerY = height - safePadding - 40;
    const gap = 50;

    // Left column: 4 social icons + Pimfahmaprod
    drawSocialIcons(ctx, textX, footerY, iconSize, footerColor);
    const leftIconsWidth = iconSize * 1.4 * 3 + iconSize;
    ctx.textAlign = 'center';
    ctx.font = '14px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Pimfahmaprod', textX + leftIconsWidth / 2, footerY + iconSize + 20);

    // Right column: LINE icon + Line: @Pimfah
    const lineIconX = textX + leftIconsWidth + gap;
    drawLineIcon(ctx, lineIconX, footerY, iconSize, footerColor);
    ctx.textAlign = 'center';
    ctx.font = '14px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Line: @Pimfah', lineIconX + iconSize / 2, footerY + iconSize + 20);
}

function drawWideLayout(ctx, cardImg, width, height) {
    // Left side: Card image - fill height
    let cardRightX = 350;
    if (cardImg) {
        const cardHeight = height - 100;
        const cardWidth = cardHeight * (cardImg.width / cardImg.height);
        const cardX = 50;
        const cardY = 50;

        // Card shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 12;

        ctx.drawImage(cardImg, cardX, cardY, cardWidth, cardHeight);
        ctx.shadowColor = 'transparent';
        cardRightX = cardX + cardWidth + 50;
    }

    // Right side: Text - starts after card
    const textX = cardRightX;
    const textWidth = width - textX - 60;

    // Title small
    ctx.fillStyle = 'rgba(114, 47, 55, 0.6)';
    ctx.font = '20px "Cormorant Garamond", serif';
    ctx.textAlign = 'left';
    ctx.fillText('Valentine Tarot', textX, 80);

    // Card name - prominent (with dynamic sizing to fit)
    ctx.fillStyle = '#722F37';
    let nameFontSize = 42;
    ctx.font = `bold ${nameFontSize}px "Cormorant Garamond", serif`;
    let nameWidth = ctx.measureText(currentCardData.name).width;
    while (nameWidth > textWidth && nameFontSize > 24) {
        nameFontSize -= 2;
        ctx.font = `bold ${nameFontSize}px "Cormorant Garamond", serif`;
        nameWidth = ctx.measureText(currentCardData.name).width;
    }
    ctx.fillText(currentCardData.name, textX, 125);

    // Decorative line
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(textX, 145);
    ctx.lineTo(textX + 200, 145);
    ctx.stroke();

    // Quote
    ctx.font = 'italic 20px "Cormorant Garamond", serif';
    ctx.fillStyle = 'rgba(114, 47, 55, 0.9)';
    const quote = `"${currentCardData.quote}"`;
    wrapTextLeft(ctx, quote, textX, 180, textWidth, 26);

    // Interpretation - full text with bounds (preserve paragraph breaks)
    ctx.font = '16px "Prompt", sans-serif';
    ctx.fillStyle = '#722F37';
    const maxInterpretY = height - 90; // Leave space for footer
    wrapTextWithParagraphs(ctx, currentCardData.interpretation, textX, 260, textWidth, 22, maxInterpretY);

    // Footer - 2 columns layout with divider
    const iconSize = 14;
    const footerColor = 'rgba(114, 47, 55, 0.55)';
    const footerY = height - 62;
    const gap = 40;

    // Left column: 4 social icons + Pimfahmaprod
    drawSocialIcons(ctx, textX, footerY, iconSize, footerColor);
    const leftIconsWidth = iconSize * 1.4 * 3 + iconSize;
    ctx.textAlign = 'center';
    ctx.font = '12px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Pimfahmaprod', textX + leftIconsWidth / 2, footerY + iconSize + 16);

    // Right column: LINE icon + Line: @Pimfah
    const lineIconX = textX + leftIconsWidth + gap;
    drawLineIcon(ctx, lineIconX, footerY, iconSize, footerColor);
    ctx.textAlign = 'center';
    ctx.font = '12px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Line: @Pimfah', lineIconX + iconSize / 2, footerY + iconSize + 16);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxY = Infinity) {
    const words = text.split(' ');
    let line = '';
    let testLine = '';

    for (let i = 0; i < words.length; i++) {
        testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            if (y > maxY) {
                // Add ellipsis to last visible line
                ctx.fillText(line.trim() + '...', x, y - lineHeight);
                return y;
            }
            ctx.fillText(line.trim(), x, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    if (y <= maxY + lineHeight) {
        ctx.fillText(line.trim(), x, y);
    }
    return y;
}

// Text wrapping with paragraph support (centered) - for Story layout
function wrapTextWithParagraphsCenter(ctx, text, x, y, maxWidth, lineHeight, maxY = Infinity) {
    ctx.textAlign = 'center';
    const paragraphs = text.split('\n\n');
    const paragraphGap = lineHeight * 0.5;

    for (let p = 0; p < paragraphs.length; p++) {
        const paragraph = paragraphs[p].replace(/\n/g, ' ').trim();
        if (!paragraph) continue;

        const words = paragraph.split(' ');
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth) {
                if (line.length > 0) {
                    if (y + lineHeight > maxY) {
                        ctx.fillText(line.trim() + '...', x, y);
                        return y;
                    }
                    ctx.fillText(line.trim(), x, y);
                    y += lineHeight;
                    line = '';
                }

                // Handle long words
                if (ctx.measureText(word).width > maxWidth) {
                    let charLine = '';
                    for (let j = 0; j < word.length; j++) {
                        const testCharLine = charLine + word[j];
                        if (ctx.measureText(testCharLine).width > maxWidth && charLine.length > 0) {
                            if (y + lineHeight > maxY) {
                                ctx.fillText(charLine + '...', x, y);
                                return y;
                            }
                            ctx.fillText(charLine, x, y);
                            y += lineHeight;
                            charLine = word[j];
                        } else {
                            charLine = testCharLine;
                        }
                    }
                    line = charLine + ' ';
                } else {
                    line = word + ' ';
                }
            } else {
                line = testLine;
            }
        }

        // Draw remaining text of this paragraph
        if (line.trim().length > 0 && y <= maxY) {
            ctx.fillText(line.trim(), x, y);
            y += lineHeight;
        }

        // Add paragraph gap
        if (p < paragraphs.length - 1 && y <= maxY) {
            y += paragraphGap;
        }
    }
    return y;
}

// Text wrapping with paragraph support - adds extra space for \n\n
function wrapTextWithParagraphs(ctx, text, x, y, maxWidth, lineHeight, maxY = Infinity) {
    ctx.textAlign = 'left';
    const paragraphs = text.split('\n\n');
    const paragraphGap = lineHeight * 0.5; // Extra space between paragraphs

    for (let p = 0; p < paragraphs.length; p++) {
        const paragraph = paragraphs[p].replace(/\n/g, ' ').trim();
        if (!paragraph) continue;

        const words = paragraph.split(' ');
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth) {
                if (line.length > 0) {
                    // Check boundary before drawing
                    if (y + lineHeight > maxY) {
                        ctx.fillText(line.trim() + '...', x, y);
                        return y;
                    }
                    ctx.fillText(line.trim(), x, y);
                    y += lineHeight;
                    line = '';
                }

                // Handle long words by breaking at character level
                if (ctx.measureText(word).width > maxWidth) {
                    let charLine = '';
                    for (let j = 0; j < word.length; j++) {
                        const testCharLine = charLine + word[j];
                        if (ctx.measureText(testCharLine).width > maxWidth && charLine.length > 0) {
                            if (y + lineHeight > maxY) {
                                ctx.fillText(charLine + '...', x, y);
                                return y;
                            }
                            ctx.fillText(charLine, x, y);
                            y += lineHeight;
                            charLine = word[j];
                        } else {
                            charLine = testCharLine;
                        }
                    }
                    line = charLine + ' ';
                } else {
                    line = word + ' ';
                }
            } else {
                line = testLine;
            }
        }

        // Draw remaining text of this paragraph
        if (line.trim().length > 0 && y <= maxY) {
            ctx.fillText(line.trim(), x, y);
            y += lineHeight;
        }

        // Add paragraph gap (except for last paragraph)
        if (p < paragraphs.length - 1 && y <= maxY) {
            y += paragraphGap;
        }
    }
    return y;
}

// Thai-aware text wrapping - handles long Thai words by breaking at character level
function wrapTextThaiAware(ctx, text, x, y, maxWidth, lineHeight, maxY = Infinity) {
    ctx.textAlign = 'left';
    const words = text.split(' ');
    let line = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth) {
            if (line.length > 0) {
                // Check if next line would exceed boundary
                if (y + lineHeight > maxY) {
                    ctx.fillText(line.trim() + '...', x, y);
                    return y;
                }
                ctx.fillText(line.trim(), x, y);
                y += lineHeight;
                line = '';
            }

            // If single word is too long, break it character by character
            if (ctx.measureText(word).width > maxWidth) {
                let charLine = '';
                for (let j = 0; j < word.length; j++) {
                    const testCharLine = charLine + word[j];
                    if (ctx.measureText(testCharLine).width > maxWidth && charLine.length > 0) {
                        if (y + lineHeight > maxY) {
                            ctx.fillText(charLine + '...', x, y);
                            return y;
                        }
                        ctx.fillText(charLine, x, y);
                        y += lineHeight;
                        charLine = word[j];
                    } else {
                        charLine = testCharLine;
                    }
                }
                line = charLine + ' ';
            } else {
                line = word + ' ';
            }
        } else {
            line = testLine;
        }
    }

    // Draw remaining text only if within bounds
    if (line.trim().length > 0 && y <= maxY) {
        ctx.fillText(line.trim(), x, y);
    }
    return y;
}

function wrapTextLeft(ctx, text, x, y, maxWidth, lineHeight, maxY = Infinity) {
    ctx.textAlign = 'left';
    const words = text.split(' ');
    let line = '';
    let testLine = '';

    for (let i = 0; i < words.length; i++) {
        testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            // Check if next line would exceed boundary
            if (y + lineHeight > maxY) {
                ctx.fillText(line.trim() + '...', x, y);
                return y;
            }
            ctx.fillText(line.trim(), x, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    // Draw remaining text only if within bounds
    if (y <= maxY) {
        ctx.fillText(line.trim(), x, y);
    }
    return y;
}

// Initialize - wait for all resources before showing the page
waitForResources();

// ========================================
// Setup mute button and audio (runs immediately since script is at end of body)
// ========================================
(function setupAudioControls() {
    // Initialize audio element
    const audio = initAudioElement();

    const muteBtn = document.getElementById('muteBtn');

    if (muteBtn) {
        // Handle both click and touch
        function handleMuteClick(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMute(e);
        }

        muteBtn.addEventListener('click', handleMuteClick);
        muteBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleMuteClick(e);
        });

        console.log('Mute button initialized');
    }

    // Add audio event listeners for indicator
    if (audio) {
        audio.addEventListener('play', () => {
            console.log('Audio play event');
            updateSoundIndicator(true);
        });
        audio.addEventListener('pause', () => {
            console.log('Audio pause event');
            updateSoundIndicator(false);
        });
        audio.addEventListener('ended', () => {
            console.log('Audio ended event');
            updateSoundIndicator(false);
        });
        audio.addEventListener('error', (e) => {
            console.log('Audio error:', e);
            updateSoundIndicator(false);
        });
    }

    // Add one-time listener to start music on first user interaction
    function startMusicOnInteraction() {
        tryPlayMusic();
        // Remove listeners after first interaction
        document.removeEventListener('click', startMusicOnInteraction);
        document.removeEventListener('touchstart', startMusicOnInteraction);
    }

    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('touchstart', startMusicOnInteraction);

    console.log('Audio setup complete - waiting for user interaction');
})();

// =============================================
// Ranking Panel
// =============================================
(function initRankingPanel() {
    const totalCounter = document.getElementById('totalCounter');
    const rankingPanel = document.getElementById('rankingPanel');
    const rankingOverlay = document.getElementById('rankingOverlay');
    const rankingList = document.getElementById('rankingList');

    if (!totalCounter || !rankingPanel || !rankingOverlay) return;

    // Trophy icons for each rank
    const trophyIcons = ['🥇', '🥈', '🥉', '🏅', '🎖️'];

    // Open ranking panel
    totalCounter.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!totalCounter.classList.contains('show')) return;

        rankingPanel.classList.add('show');
        rankingOverlay.classList.add('show');

        // Track ranking panel opened
        if (window.cardCounter) {
            window.cardCounter.trackRankingPanel('opened');
        }

        await loadRankings();
    });

    // Close ranking panel
    rankingOverlay.addEventListener('click', closeRankingPanel);

    function closeRankingPanel() {
        rankingPanel.classList.remove('show');
        rankingOverlay.classList.remove('show');

        // Track ranking panel closed
        if (window.cardCounter) {
            window.cardCounter.trackRankingPanel('closed');
        }
    }

    // Load and display rankings
    async function loadRankings() {
        if (!window.cardCounter || !window.cardCounter.fetchCardRankings) {
            rankingList.innerHTML = '<div class="ranking-loading">ไม่สามารถโหลดข้อมูลได้</div>';
            return;
        }

        rankingList.innerHTML = '<div class="ranking-loading">กำลังโหลด...</div>';

        try {
            const rankings = await window.cardCounter.fetchCardRankings(5);

            if (rankings.length === 0) {
                rankingList.innerHTML = '<div class="ranking-loading">ยังไม่มีข้อมูล</div>';
                return;
            }

            // Get total picks for percentage calculation
            const totalPicks = await window.cardCounter.getTotal();
            const totalCount = totalPicks || rankings.reduce((sum, r) => sum + r.count, 0);

            // Get card data from tarotData
            const rankingHTML = rankings.map((rank, index) => {
                const cardData = (tarotData && tarotData.cards) ? tarotData.cards.find(c => c.id == rank.cardId) : null;
                const cardName = cardData ? cardData.name : `การ์ด ${rank.cardId}`;
                const cardImage = cardData ? `images/tarot/${cardData.image}` : '';
                const percentage = totalCount > 0 ? ((rank.count / totalCount) * 100).toFixed(1) : 0;

                return `
                    <div class="ranking-item">
                        <span class="ranking-trophy">${trophyIcons[index] || '🎖️'}</span>
                        ${cardImage ? `<img src="${cardImage}" alt="${cardName}" class="ranking-card-image">` : ''}
                        <span class="ranking-card-name">${escapeHtml(cardName)}</span>
                        <span class="ranking-count">${percentage}%</span>
                    </div>
                `;
            }).join('');

            rankingList.innerHTML = rankingHTML;
        } catch (error) {
            console.error('Error loading rankings:', error);
            rankingList.innerHTML = '<div class="ranking-loading">เกิดข้อผิดพลาด</div>';
        }
    }
})();

// ========================================
// Analytics Page - Secret Access
// ========================================
(function() {
    let brandClickCount = 0;
    let lastClickTime = 0;
    const REQUIRED_CLICKS = 10;
    const CLICK_TIMEOUT = 3000; // Reset if no click within 3 seconds

    // Initialize analytics secret access
    function initAnalyticsAccess() {
        const landingBrand = document.querySelector('.landing-brand');
        if (!landingBrand) return;

        landingBrand.style.cursor = 'pointer';
        landingBrand.addEventListener('click', handleBrandClick);
    }

    function handleBrandClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();

        // Reset count if too much time passed
        if (now - lastClickTime > CLICK_TIMEOUT) {
            brandClickCount = 0;
        }

        lastClickTime = now;
        brandClickCount++;

        // Subtle feedback
        if (brandClickCount >= 5 && brandClickCount < REQUIRED_CLICKS) {
            e.target.style.transform = `scale(${1 + (brandClickCount * 0.02)})`;
            setTimeout(() => {
                e.target.style.transform = '';
            }, 100);
        }

        // Open analytics when reached
        if (brandClickCount >= REQUIRED_CLICKS) {
            brandClickCount = 0;
            openAnalytics();
        }
    }

    // Open analytics page
    window.openAnalytics = async function() {
        const analyticsPage = document.getElementById('analyticsPage');
        if (!analyticsPage) return;

        // Pause background music
        if (audioElement && !audioElement.paused) {
            audioElement.pause();
        }

        analyticsPage.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Load analytics data
        await loadAnalyticsData();
    };

    // Close analytics page
    window.closeAnalytics = function() {
        const analyticsPage = document.getElementById('analyticsPage');
        if (!analyticsPage) return;

        analyticsPage.classList.remove('show');
        document.body.style.overflow = '';

        // Resume music if was playing
        if (audioElement && !isMuted && musicStarted) {
            audioElement.play().catch(() => {});
        }
    };

    // Load all analytics data
    async function loadAnalyticsData() {
        if (!window.cardCounter || !window.cardCounter.isEnabled()) {
            showAnalyticsError('Firebase ยังไม่ได้เชื่อมต่อ');
            return;
        }

        // Load all data in parallel
        await Promise.all([
            loadOverviewStats(),
            loadTopCards(),
            loadSaveFormatStats(),
            loadShareStats(),
            loadSocialStats(),
            loadJourneyFunnel(),
            loadTimeToPickStats(),
            loadDeviceStats(),
            loadFeatureUsageStats(),
            loadPositionHeatmap(),
            loadScrollDepthStats(),
            loadHotComments()
        ]);
    }

    // Load overview statistics
    async function loadOverviewStats() {
        try {
            const database = firebase.database();

            // Total card picks
            const totalPicks = await window.cardCounter.getTotal();
            document.getElementById('statTotalPicks').textContent =
                totalPicks ? totalPicks.toLocaleString('th-TH') : '0';

            // Total comments
            const commentsCount = await window.cardCounter.getCommentsCount();
            document.getElementById('statTotalComments').textContent =
                commentsCount ? commentsCount.toLocaleString('th-TH') : '0';

            // Total replies
            const repliesSnapshot = await database.ref('replies').once('value');
            let totalReplies = 0;
            if (repliesSnapshot.exists()) {
                repliesSnapshot.forEach(commentReplies => {
                    totalReplies += commentReplies.numChildren();
                });
            }
            document.getElementById('statTotalReplies').textContent =
                totalReplies.toLocaleString('th-TH');

            // Total saves
            const savesSnapshot = await database.ref('buttonClicks/save').once('value');
            let totalSaves = 0;
            if (savesSnapshot.exists()) {
                savesSnapshot.forEach(format => {
                    totalSaves += format.val() || 0;
                });
            }
            document.getElementById('statTotalSaves').textContent =
                totalSaves.toLocaleString('th-TH');

        } catch (error) {
            console.error('Error loading overview stats:', error);
        }
    }

    // Load top 10 cards
    async function loadTopCards() {
        const container = document.getElementById('topCardsList');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('cardPicks').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            // Convert to array and sort
            const cardPicks = Object.entries(data)
                .map(([key, count]) => ({
                    cardId: key.replace('card_', ''),
                    count: count || 0
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            const maxCount = cardPicks[0]?.count || 1;

            let html = '';
            cardPicks.forEach((card, index) => {
                const cardData = (tarotData && tarotData.cards) ?
                    tarotData.cards.find(c => c.id == card.cardId) : null;
                const cardName = cardData ? cardData.name : `Card ${card.cardId}`;
                const cardImage = cardData ? `images/tarot/${cardData.image}` : '';
                const percentage = ((card.count / maxCount) * 100).toFixed(0);

                let rankClass = 'normal';
                if (index === 0) rankClass = 'gold';
                else if (index === 1) rankClass = 'silver';
                else if (index === 2) rankClass = 'bronze';

                html += `
                    <div class="top-card-item">
                        <div class="top-card-rank ${rankClass}">${index + 1}</div>
                        ${cardImage ? `<img src="${cardImage}" alt="${cardName}" class="top-card-image">` : ''}
                        <div class="top-card-info">
                            <div class="top-card-name">${escapeHtml(cardName)}</div>
                            <div class="top-card-count">${card.count.toLocaleString('th-TH')} picks</div>
                        </div>
                        <div class="top-card-bar">
                            <div class="top-card-bar-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading top cards:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load save format statistics
    async function loadSaveFormatStats() {
        const container = document.getElementById('saveFormatChart');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('buttonClicks/save').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const formats = [
                { key: 'ig-story', label: 'IG Story', class: 'ig-story' },
                { key: 'square', label: 'IG Post', class: 'square' },
                { key: 'facebook', label: 'Facebook', class: 'facebook' },
                { key: 'wide', label: 'Wide', class: 'wide' }
            ];

            const maxValue = Math.max(...formats.map(f => data[f.key] || 0), 1);

            let html = '<div class="chart-bar-container">';
            formats.forEach(format => {
                const value = data[format.key] || 0;
                const percentage = ((value / maxValue) * 100).toFixed(0);

                html += `
                    <div class="chart-bar-item">
                        <span class="chart-bar-label">${format.label}</span>
                        <div class="chart-bar-track">
                            <div class="chart-bar-fill ${format.class}" style="width: ${percentage}%">
                                <span class="chart-bar-value">${value.toLocaleString('th-TH')}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading save format stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load share platform statistics
    async function loadShareStats() {
        const container = document.getElementById('sharePlatformChart');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('buttonClicks/share').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const platforms = [
                { key: 'messenger', label: 'Messenger', class: 'messenger' },
                { key: 'line', label: 'LINE', class: 'line' },
                { key: 'copy', label: 'Copy Link', class: 'copy' }
            ];

            const maxValue = Math.max(...platforms.map(p => data[p.key] || 0), 1);

            let html = '<div class="chart-bar-container">';
            platforms.forEach(platform => {
                const value = data[platform.key] || 0;
                const percentage = ((value / maxValue) * 100).toFixed(0);

                html += `
                    <div class="chart-bar-item">
                        <span class="chart-bar-label">${platform.label}</span>
                        <div class="chart-bar-track">
                            <div class="chart-bar-fill ${platform.class}" style="width: ${percentage}%">
                                <span class="chart-bar-value">${value.toLocaleString('th-TH')}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading share stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load social link click statistics
    async function loadSocialStats() {
        const container = document.getElementById('socialStatsGrid');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('buttonClicks/social').once('value');
            const data = snapshot.val() || {};

            const socials = [
                {
                    key: 'instagram',
                    label: 'Instagram',
                    class: 'instagram',
                    icon: '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
                },
                {
                    key: 'tiktok',
                    label: 'TikTok',
                    class: 'tiktok',
                    icon: '<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>'
                },
                {
                    key: 'facebook',
                    label: 'Facebook',
                    class: 'facebook',
                    icon: '<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
                },
                {
                    key: 'youtube',
                    label: 'YouTube',
                    class: 'youtube',
                    icon: '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
                }
            ];

            let html = '';
            socials.forEach(social => {
                const value = data[social.key] || 0;
                html += `
                    <div class="social-stat-card ${social.class}">
                        <div class="social-stat-icon">${social.icon}</div>
                        <div class="social-stat-value">${value.toLocaleString('th-TH')}</div>
                        <div class="social-stat-label">${social.label}</div>
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading social stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load hot comments
    async function loadHotComments() {
        const container = document.getElementById('hotCommentsList');

        try {
            const hotComments = await window.cardCounter.fetchHotComments(5);

            if (!hotComments || hotComments.length === 0) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีความคิดเห็น</div>';
                return;
            }

            let html = '';
            hotComments.forEach(comment => {
                html += `
                    <div class="hot-comment-card">
                        <div class="hot-comment-header">
                            <span class="hot-comment-user">${escapeHtml(comment.userName || 'Anonymous')}</span>
                            <span class="hot-comment-replies">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 15a4 4 0 0 0 4 4h9a5 5 0 0 0 0-10H9a3 3 0 0 0 0 6h9"/>
                                </svg>
                                ${comment.replyCount || 0} replies
                            </span>
                        </div>
                        <div class="hot-comment-card-name">${escapeHtml(comment.cardName || '')}</div>
                        <div class="hot-comment-text">${escapeHtml(comment.comment || '')}</div>
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading hot comments:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load user journey funnel
    async function loadJourneyFunnel() {
        const container = document.getElementById('journeyFunnel');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/journey').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const steps = [
                { key: 'landing', label: 'Landing Page' },
                { key: 'pick', label: 'Card Pick' },
                { key: 'result', label: 'View Result' }
            ];

            const landingCount = data.landing || 0;

            let html = '';
            steps.forEach(step => {
                const value = data[step.key] || 0;
                const percentage = landingCount > 0 ? ((value / landingCount) * 100).toFixed(1) : 0;
                const barWidth = landingCount > 0 ? (value / landingCount) * 100 : 0;

                html += `
                    <div class="funnel-step" style="--bar-width: ${barWidth}%">
                        <span class="funnel-step-label">${step.label}</span>
                        <span class="funnel-step-value">${value.toLocaleString('th-TH')}</span>
                        <span class="funnel-step-percent">${percentage}%</span>
                    </div>
                `;
            });

            container.innerHTML = html;

            // Apply bar widths after render
            setTimeout(() => {
                container.querySelectorAll('.funnel-step').forEach(el => {
                    const width = el.style.getPropertyValue('--bar-width');
                    el.style.setProperty('--bar-width', width);
                    el.querySelector('::before')?.style?.setProperty('width', width);
                });
            }, 100);

        } catch (error) {
            console.error('Error loading journey funnel:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load time to first pick statistics
    async function loadTimeToPickStats() {
        const container = document.getElementById('timeToPickChart');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/timeToFirstPick').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const buckets = [
                { key: 'instant', label: '< 5s', class: 'instant' },
                { key: 'quick', label: '5-9s', class: 'quick' },
                { key: 'normal', label: '10-29s', class: 'normal' },
                { key: 'medium', label: '30-59s', class: 'medium' },
                { key: 'slow', label: '60s+', class: 'slow' }
            ];

            const maxValue = Math.max(...buckets.map(b => data[b.key] || 0), 1);

            let html = '<div class="chart-bar-container">';
            buckets.forEach(bucket => {
                const value = data[bucket.key] || 0;
                const percentage = ((value / maxValue) * 100).toFixed(0);

                html += `
                    <div class="chart-bar-item">
                        <div class="chart-bar-label">${bucket.label}</div>
                        <div class="chart-bar">
                            <div class="chart-bar-fill ${bucket.class}" style="width: ${percentage}%"></div>
                        </div>
                        <div class="chart-bar-value">${value.toLocaleString('th-TH')}</div>
                    </div>
                `;
            });
            html += '</div>';

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading time to pick stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load device breakdown statistics
    async function loadDeviceStats() {
        const container = document.getElementById('deviceStatsGrid');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/devices').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const devices = [
                {
                    key: 'mobile',
                    label: 'Mobile',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>'
                },
                {
                    key: 'tablet',
                    label: 'Tablet',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>'
                },
                {
                    key: 'desktop',
                    label: 'Desktop',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
                }
            ];

            const total = devices.reduce((sum, d) => sum + (data[d.key] || 0), 0);

            let html = '';
            devices.forEach(device => {
                const value = data[device.key] || 0;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

                html += `
                    <div class="device-stat">
                        <div class="device-icon">${device.icon}</div>
                        <div class="device-name">${device.label}</div>
                        <div class="device-value">${value.toLocaleString('th-TH')}</div>
                        <div class="device-percent">${percentage}%</div>
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading device stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load feature usage statistics
    async function loadFeatureUsageStats() {
        const container = document.getElementById('featureUsageGrid');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/features').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const features = [
                {
                    key: 'music',
                    label: 'Music Control',
                    actions: ['muted', 'unmuted']
                },
                {
                    key: 'commentsPanel',
                    label: 'Comments Panel',
                    actions: ['opened', 'closed']
                },
                {
                    key: 'rankingPanel',
                    label: 'Ranking Panel',
                    actions: ['opened', 'closed']
                },
                {
                    key: 'commentForm',
                    label: 'Comment Form',
                    actions: ['started', 'submitted', 'abandoned']
                }
            ];

            let html = '';
            features.forEach(feature => {
                const featureData = data[feature.key] || {};
                const total = Object.values(featureData).reduce((sum, v) => sum + (v || 0), 0);

                let actionsHtml = '';
                feature.actions.forEach(action => {
                    const value = featureData[action] || 0;
                    actionsHtml += `
                        <div class="feature-action">
                            <span>${action}</span>
                            <span>${value.toLocaleString('th-TH')}</span>
                        </div>
                    `;
                });

                html += `
                    <div class="feature-item">
                        <div class="feature-header">
                            <span class="feature-name">${feature.label}</span>
                            <span class="feature-total">${total.toLocaleString('th-TH')} total</span>
                        </div>
                        <div class="feature-breakdown">
                            ${actionsHtml}
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading feature usage stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load position heatmap
    async function loadPositionHeatmap() {
        const container = document.getElementById('positionHeatmap');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/cardPositions').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const positions = [
                { key: 'top', label: 'Top', x: 95, y: 0 },
                { key: 'top-right', label: 'TR', x: 165, y: 30 },
                { key: 'right', label: 'Right', x: 190, y: 95 },
                { key: 'bottom-right', label: 'BR', x: 165, y: 160 },
                { key: 'bottom', label: 'Bottom', x: 95, y: 190 },
                { key: 'bottom-left', label: 'BL', x: 25, y: 160 },
                { key: 'left', label: 'Left', x: 0, y: 95 },
                { key: 'top-left', label: 'TL', x: 25, y: 30 }
            ];

            const total = Object.values(data).reduce((sum, v) => sum + (v || 0), 0);
            const maxValue = Math.max(...Object.values(data), 1);

            let html = '<div class="heatmap-circle">';

            positions.forEach(pos => {
                const value = data[pos.key] || 0;
                const intensity = value / maxValue;
                let heatClass = 'cool';
                if (intensity > 0.7) heatClass = 'hot';
                else if (intensity > 0.4) heatClass = 'warm';

                html += `
                    <div class="heatmap-section ${heatClass}" style="left: ${pos.x}px; top: ${pos.y}px;">
                        <span class="heatmap-section-label">${pos.label}</span>
                        <span class="heatmap-section-value">${value}</span>
                    </div>
                `;
            });

            html += `
                <div class="heatmap-center">
                    <span class="heatmap-center-label">Total</span>
                    <span class="heatmap-center-value">${total.toLocaleString('th-TH')}</span>
                </div>
            `;
            html += '</div>';

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading position heatmap:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load scroll depth statistics
    async function loadScrollDepthStats() {
        const container = document.getElementById('scrollDepthChart');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/interpretationScroll').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const buckets = [
                { key: '0-25', label: '0-25%', class: 'scroll-low' },
                { key: '25-50', label: '25-50%', class: 'scroll-med' },
                { key: '50-75', label: '50-75%', class: 'scroll-high' },
                { key: '75-100', label: '75-100%', class: 'scroll-complete' }
            ];

            const maxValue = Math.max(...buckets.map(b => data[b.key] || 0), 1);

            let html = '<div class="chart-bar-container">';
            buckets.forEach(bucket => {
                const value = data[bucket.key] || 0;
                const percentage = ((value / maxValue) * 100).toFixed(0);

                html += `
                    <div class="chart-bar-item">
                        <div class="chart-bar-label">${bucket.label}</div>
                        <div class="chart-bar">
                            <div class="chart-bar-fill ${bucket.class}" style="width: ${percentage}%"></div>
                        </div>
                        <div class="chart-bar-value">${value.toLocaleString('th-TH')}</div>
                    </div>
                `;
            });
            html += '</div>';

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading scroll depth stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    function showAnalyticsError(message) {
        const content = document.getElementById('analyticsContent');
        if (content) {
            content.innerHTML = `<div class="analytics-empty" style="margin-top: 100px;">${message}</div>`;
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnalyticsAccess);
    } else {
        initAnalyticsAccess();
    }
})();

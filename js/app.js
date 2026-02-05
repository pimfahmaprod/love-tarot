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
    soundEffects.cardFlip.volume = 0.35;

    soundEffects.cardSpread = new Audio('audio/card_spread.mp3');
    soundEffects.cardSpread.volume = 1.0;
    soundEffects.cardSpread.gainBoost = 2.5; // Amplify 250%

    soundEffects.cardSelect = new Audio('audio/card_select.mp3');
    soundEffects.cardSelect.volume = 0.35;
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

    // Wait for fonts
    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }

    // Wait for tarot data to load first
    if (!tarotData) {
        try {
            const response = await fetch('valentine_tarot.json');
            tarotData = await response.json();
        } catch (error) {
            console.error('Error loading tarot data:', error);
        }
    }

    // Collect all images to preload
    const imagesToPreload = [
        'images/card_back_red.png',
        'images/website_theme.jpg',
        ...spinningCardImages
    ];

    // Add all tarot card images from data
    if (tarotData && tarotData.cards) {
        tarotData.cards.forEach(card => {
            imagesToPreload.push(`images/tarot/${card.image}`);
        });
    }

    // Preload all images
    await Promise.all(imagesToPreload.map(src => preloadImage(src)));

    // Render cards after images are loaded
    renderCards();

    // Small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mark page as ready and enable clicking
    markPageReady();
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

// Expand cards to 78
function expandCardsTo78(cards) {
    const targetCount = 78;
    const baseCount = cards.length; // 22
    const timesEach = Math.floor(targetCount / baseCount); // 3
    const remainder = targetCount % baseCount; // 12

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

    // Reset comment form and button
    const commentForm = document.getElementById('commentForm');
    const commentToggleBtn = document.getElementById('commentToggleBtn');
    if (commentForm) commentForm.classList.remove('show');
    if (commentToggleBtn) {
        commentToggleBtn.classList.remove('active');
        commentToggleBtn.classList.remove('commented');
        commentToggleBtn.disabled = false;
        const btnText = commentToggleBtn.querySelector('span');
        if (btnText) btnText.textContent = 'แสดงความคิดเห็น';
        // Restore original text bubble icon
        const svgIcon = commentToggleBtn.querySelector('svg');
        if (svgIcon) {
            svgIcon.innerHTML = '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>';
        }
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
        // Check if name is already saved
        if (savedName && nameGroup) {
            nameGroup.style.display = 'none';
        } else if (nameGroup) {
            nameGroup.style.display = 'block';
        }
    } else {
        // Reset form when closing
        resetCommentForm();
    }
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
                toggleBtn.querySelector('span').textContent = 'แสดงความคิดเห็นแล้ว';
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

function initCommentsPanel() {
    const commentsBtn = document.getElementById('commentsBtn');
    const commentsPanel = document.getElementById('commentsPanel');
    const commentsOverlay = document.getElementById('commentsOverlay');
    const commentsPanelClose = document.getElementById('commentsPanelClose');
    const commentsList = document.getElementById('commentsList');

    if (commentsBtn) {
        commentsBtn.addEventListener('click', openCommentsPanel);
    }

    if (commentsPanelClose) {
        commentsPanelClose.addEventListener('click', closeCommentsPanel);
    }

    if (commentsOverlay) {
        commentsOverlay.addEventListener('click', closeCommentsPanel);
    }

    // Lazy loading on scroll DOWN (load older comments)
    if (commentsList) {
        commentsList.addEventListener('scroll', () => {
            if (isLoadingComments || !commentsHasMore) return;

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

function openCommentsPanel() {
    const commentsPanel = document.getElementById('commentsPanel');
    const commentsOverlay = document.getElementById('commentsOverlay');

    commentsPanel.classList.add('show');
    commentsOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Reset and load comments (subscription happens after load completes)
    commentsLastKey = null;
    commentsHasMore = true;
    displayedCommentIds.clear();
    loadComments(true);
}

function closeCommentsPanel() {
    const commentsPanel = document.getElementById('commentsPanel');
    const commentsOverlay = document.getElementById('commentsOverlay');

    commentsPanel.classList.remove('show');
    commentsOverlay.classList.remove('show');
    document.body.style.overflow = '';

    // Unsubscribe from real-time updates
    if (window.cardCounter && window.cardCounter.unsubscribeFromNewComments) {
        window.cardCounter.unsubscribeFromNewComments();
    }
}

// Handle new comment from real-time listener
function handleNewComment(comment) {
    // Skip if already displayed
    if (displayedCommentIds.has(comment.id)) return;

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
        commentsLastKey = null;
    }

    if (!window.cardCounter || !window.cardCounter.fetchComments) {
        loadingEl.innerHTML = '<span>ไม่สามารถโหลดความคิดเห็นได้</span>';
        isLoadingComments = false;
        return;
    }

    const result = await window.cardCounter.fetchComments(commentsLastKey, 10);

    loadingEl.style.display = 'none';

    if (result.comments.length === 0 && reset) {
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

    // Show newest at top, oldest at bottom (default order from fetchComments)
    result.comments.forEach(comment => {
        // Skip if already displayed (from real-time update)
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

function createCommentCard(comment) {
    const card = document.createElement('div');
    card.className = 'comment-card';

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

    card.innerHTML = `
        ${imageHtml}
        <div class="comment-card-content">
            <div class="comment-card-header">
                <span class="comment-card-name">${escapeHtml(comment.userName || 'ไม่ระบุชื่อ')}</span>
                <span class="comment-card-tarot">${escapeHtml(comment.cardName || 'ไพ่ทาโรต์')}</span>
            </div>
            <div class="comment-card-text">${escapeHtml(comment.comment || '')}</div>
            <div class="comment-card-date">${dateStr}</div>
        </div>
    `;

    // Add class for styling when image is present
    if (hasImage) {
        card.classList.add('with-image');
    }

    return card;
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

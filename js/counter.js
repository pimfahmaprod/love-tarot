/**
 * Valentine Tarot - Firebase Integration & Analytics
 *
 * @description Firebase Realtime Database integration for:
 * - Card pick tracking
 * - Comment system with replies
 * - Card rankings
 * - Basic analytics
 *
 * @version 1.1.0
 *
 * EXPORTS (via window.cardCounter):
 * - incrementCardPick(cardName) - Track card selection
 * - getTotalPicks() - Get total pick count
 * - submitComment(data) - Submit user comment
 * - fetchComments(limit) - Get recent comments
 * - fetchCommentsByCard(cardName) - Get comments for specific card
 * - submitReply(commentId, data) - Reply to comment
 * - fetchReplies(commentId) - Get replies for comment
 * - fetchCardRankings(limit) - Get popular cards
 * - fetchHotComments(limit) - Get most replied comments
 *
 * FIREBASE DATA PATHS:
 * - /cardPicks/{cardName} - Pick counts per card
 * - /comments/{id} - User comments
 * - /replies/{commentId}/{replyId} - Reply threads
 *
 * SETUP: See FIREBASE_SETUP.md for configuration guide
 */

// ========================================
// Firebase Configuration
// ========================================
// ดูวิธีตั้งค่าได้ที่ FIREBASE_SETUP.md

const firebaseConfig = {
    apiKey: "AIzaSyCVo5U0lntL-rB4x8GkijXew8ajtMDqmhI",
    authDomain: "love-tarot-bf13e.firebaseapp.com",
    databaseURL: "https://love-tarot-bf13e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "love-tarot-bf13e",
    storageBucket: "love-tarot-bf13e.firebasestorage.app",
    messagingSenderId: "629888519835",
    appId: "1:629888519835:web:2cd41850f36a0d4378003e"
};

let database = null;
let isFirebaseInitialized = false;

// ========================================
// Local Cache System (reduces Firebase reads)
// ========================================
const CACHE_VERSION = 'v2'; // Increment to clear old caches
const CACHE_PREFIX = `tarot_cache_${CACHE_VERSION}_`;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (default)
const CACHE_DURATION_LONG = 30 * 60 * 1000; // 30 minutes (for rankings, hot comments)
const CACHE_DURATION_MEDIUM = 15 * 60 * 1000; // 15 minutes (for user-specific data)

// Clear old cache versions on load
(function clearOldCaches() {
    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('tarot_cache_') && !key.startsWith(CACHE_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        if (keysToRemove.length > 0) {
            console.log('Cleared', keysToRemove.length, 'old cache entries');
        }
    } catch (e) {
        // ignore
    }
})();

// Cache durations per key type
const CACHE_DURATIONS = {
    totalPicks: CACHE_DURATION_LONG,
    cardRankings: CACHE_DURATION_LONG,
    hotComments: CACHE_DURATION_LONG,
    commentsFirstPage: CACHE_DURATION,
    commentsCount: CACHE_DURATION,
    userRepliedTo: CACHE_DURATION_MEDIUM
};

function getCacheDuration(key) {
    // Check if key starts with any known prefix
    for (const [prefix, duration] of Object.entries(CACHE_DURATIONS)) {
        if (key.startsWith(prefix)) return duration;
    }
    return CACHE_DURATION;
}

function getCached(key) {
    try {
        const cached = localStorage.getItem(CACHE_PREFIX + key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const duration = getCacheDuration(key);
        if (Date.now() - timestamp > duration) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

function setCache(key, data) {
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch {
        // localStorage full or unavailable
    }
}

function clearCache(key) {
    try {
        if (key) {
            localStorage.removeItem(CACHE_PREFIX + key);
        }
    } catch {
        // ignore
    }
}

// Check if Firebase is properly configured
function isFirebaseConfigured() {
    return firebaseConfig.apiKey && firebaseConfig.databaseURL;
}

// Initialize Firebase
function initializeFirebase() {
    if (!isFirebaseConfigured()) {
        console.info('Firebase not configured. Counter disabled.');
        return false;
    }

    try {
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK not loaded');
            return false;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        database = firebase.database();
        isFirebaseInitialized = true;
        console.log('Firebase initialized (optimized mode)');
        return true;
    } catch (error) {
        console.warn('Firebase initialization failed:', error.message);
        return false;
    }
}

// ========================================
// Card Counter Functions
// ========================================

// Increment counter for a specific card
async function incrementCardCounter(cardId, cardName, userId) {
    if (!isFirebaseInitialized || !database) return null;

    try {
        const cardRef = database.ref(`cardPicks/card_${cardId}`);
        const result = await cardRef.transaction((currentCount) => {
            return (currentCount || 0) + 1;
        });

        // Clear cache so next read gets fresh data
        clearCache('totalPicks');
        clearCache('cardRankings');

        if (result.committed) {
            return result.snapshot.val();
        }
        return null;
    } catch (error) {
        console.warn('Failed to increment counter:', error.message);
        return null;
    }
}

// Get current count for a specific card
async function getCardCount(cardId) {
    if (!isFirebaseInitialized || !database) return null;

    try {
        const cardRef = database.ref(`cardPicks/card_${cardId}`);
        const snapshot = await cardRef.once('value');
        return snapshot.val() || 0;
    } catch (error) {
        console.warn('Failed to get counter:', error.message);
        return null;
    }
}

// Update the counter display in the UI
function updateCounterDisplay(count) {
    const countElement = document.getElementById('pickCountNumber');
    const counterContainer = document.getElementById('pickCounter');

    if (!countElement || !counterContainer) return;

    if (count !== null && count !== undefined) {
        countElement.textContent = count.toLocaleString('th-TH');
        setTimeout(() => {
            counterContainer.classList.add('show');
        }, 300);
    } else {
        counterContainer.classList.remove('show');
    }
}

// Main function to handle card selection counter
async function handleCardPickCounter(cardId) {
    if (!isFirebaseInitialized) {
        const counterContainer = document.getElementById('pickCounter');
        if (counterContainer) counterContainer.classList.remove('show');
        return null;
    }

    const newCount = await incrementCardCounter(cardId);
    updateCounterDisplay(newCount);
    return newCount;
}

// Get total picks (with cache)
async function getTotalPicks() {
    if (!isFirebaseInitialized || !database) return null;

    // Check cache first
    const cached = getCached('totalPicks');
    if (cached !== null) return cached;

    try {
        const picksRef = database.ref('cardPicks');
        const snapshot = await picksRef.once('value');
        const data = snapshot.val();

        if (!data) return 0;

        let total = 0;
        Object.values(data).forEach(count => {
            total += count || 0;
        });

        setCache('totalPicks', total);
        return total;
    } catch (error) {
        console.warn('Failed to get total picks:', error.message);
        return null;
    }
}

// Update total counter display
function updateTotalCounterDisplayValue(total) {
    const totalCountElement = document.getElementById('totalPickCount');
    const totalCounterContainer = document.getElementById('totalCounter');

    if (!totalCountElement || !totalCounterContainer) return;

    if (total !== null && total > 0) {
        totalCountElement.textContent = total.toLocaleString('th-TH');
        totalCounterContainer.classList.add('show');
    }
}

// Load total picks once (NO real-time listener)
async function loadTotalPicks() {
    if (!isFirebaseInitialized || !database) return;

    const total = await getTotalPicks();
    updateTotalCounterDisplayValue(total);
}

// Initialize on DOM ready
async function initializeApp() {
    const success = initializeFirebase();
    if (success) {
        // Load once instead of real-time subscription
        loadTotalPicks();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ========================================
// Button Click Tracking (simplified)
// ========================================

async function trackButtonClick(category, action) {
    if (!isFirebaseInitialized || !database) return null;

    try {
        const buttonRef = database.ref(`buttonClicks/${category}/${action}`);
        const result = await buttonRef.transaction((currentCount) => {
            return (currentCount || 0) + 1;
        });

        if (result.committed) {
            return result.snapshot.val();
        }
        return null;
    } catch (error) {
        console.warn('Failed to track button click:', error.message);
        return null;
    }
}

function trackSaveImage(format) {
    return trackButtonClick('save', format);
}

function trackShare(platform) {
    return trackButtonClick('share', platform);
}

function trackRetry() {
    return trackButtonClick('actions', 'retry');
}

function trackSocialClick(platform) {
    return trackButtonClick('social', platform);
}

// ========================================
// Comments Functions
// ========================================

async function submitCommentToFirebase(cardId, cardName, cardImage, userId, userName, commentText) {
    if (!isFirebaseInitialized || !database) {
        return { success: false, error: 'Firebase not initialized' };
    }

    try {
        const commentsRef = database.ref('comments');
        const newCommentRef = commentsRef.push();

        await newCommentRef.set({
            cardId: cardId,
            cardName: cardName,
            cardImage: cardImage || '',
            userId: userId,
            userName: userName.trim(),
            comment: commentText.trim(),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        // Clear comments cache
        clearCache('commentsCount');
        clearCache('commentsFirstPage_10');
        clearCache('hotComments_20');

        return { success: true, id: newCommentRef.key };
    } catch (error) {
        console.warn('Failed to submit comment:', error.message);
        return { success: false, error: error.message };
    }
}

// Get comments count (with cache)
async function getCommentsCount() {
    if (!isFirebaseInitialized || !database) return 0;

    const cached = getCached('commentsCount');
    if (cached !== null) return cached;

    try {
        const commentsRef = database.ref('comments');
        const snapshot = await commentsRef.once('value');
        const count = snapshot.numChildren();
        setCache('commentsCount', count);
        return count;
    } catch (error) {
        console.warn('Failed to get comments count:', error.message);
        return 0;
    }
}

// Subscribe to comments count - DISABLED (use getCommentsCount instead)
function subscribeToCommentsCount(callback) {
    // Load once instead of real-time
    getCommentsCount().then(callback);
}

// Real-time comments listener (only when panel is open)
let commentsListenerRef = null;
let commentsListenerCallback = null;

function subscribeToNewComments(callback) {
    if (!isFirebaseInitialized || !database) return null;

    unsubscribeFromNewComments();

    const commentsRef = database.ref('comments');
    commentsListenerRef = commentsRef;

    commentsListenerCallback = (snapshot) => {
        const comment = {
            id: snapshot.key,
            ...snapshot.val()
        };
        callback(comment);
    };

    commentsListenerRef.on('child_added', commentsListenerCallback);
    return commentsListenerRef;
}

function unsubscribeFromNewComments() {
    if (commentsListenerRef && commentsListenerCallback) {
        commentsListenerRef.off('child_added', commentsListenerCallback);
    }
    commentsListenerRef = null;
    commentsListenerCallback = null;
}

// Fetch comments (with cache for first page)
async function fetchComments(lastKey = null, limit = 10) {
    if (!isFirebaseInitialized || !database) {
        return { comments: [], hasMore: false };
    }

    // Cache only first page (no lastKey)
    const isFirstPage = !lastKey;
    const cacheKey = `commentsFirstPage_${limit}`;

    if (isFirstPage) {
        const cached = getCached(cacheKey);
        if (cached !== null) return cached;
    }

    try {
        const commentsRef = database.ref('comments');
        let query;

        if (lastKey) {
            query = commentsRef.orderByKey().endBefore(lastKey).limitToLast(limit);
        } else {
            query = commentsRef.orderByKey().limitToLast(limit);
        }

        const snapshot = await query.once('value');
        const data = snapshot.val();

        if (!data) {
            return { comments: [], hasMore: false };
        }

        const comments = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
        })).reverse();

        const firstKey = comments.length > 0 ? comments[comments.length - 1].id : null;
        let hasMore = false;

        if (firstKey) {
            const checkMore = await commentsRef.orderByKey().endBefore(firstKey).limitToLast(1).once('value');
            hasMore = checkMore.exists();
        }

        const result = { comments, hasMore, lastKey: firstKey };

        // Cache first page only (skip caching if empty to allow retry)
        if (isFirstPage && comments.length > 0) {
            setCache(cacheKey, result);
        }

        return result;
    } catch (error) {
        console.warn('Failed to fetch comments:', error.message);
        return { comments: [], hasMore: false };
    }
}

async function fetchCommentsByCardId(cardId, excludeCommentId = null, limit = 5) {
    if (!isFirebaseInitialized || !database) return [];

    // Cache for 5 minutes per card
    const cacheKey = `cardComments_${cardId}_${limit}`;
    const cached = getCached(cacheKey);

    // Use cache but still filter excludeCommentId
    if (cached !== null) {
        return cached.filter(c => c.id !== excludeCommentId).slice(0, limit);
    }

    try {
        const commentsRef = database.ref('comments');
        const query = commentsRef.orderByChild('cardId').equalTo(cardId).limitToLast(limit + 1);

        const snapshot = await query.once('value');
        const data = snapshot.val();

        if (!data) return [];

        const comments = Object.entries(data)
            .map(([key, value]) => ({ id: key, ...value }))
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .slice(0, limit + 1);

        // Cache all fetched comments (before exclusion filter) - only if we have results
        if (comments.length > 0) {
            setCache(cacheKey, comments);
        }

        return comments.filter(c => c.id !== excludeCommentId).slice(0, limit);
    } catch (error) {
        console.warn('Failed to fetch comments by cardId:', error.message);
        return [];
    }
}

// ========================================
// Replies Functions
// ========================================

async function submitReply(commentId, userId, userName, replyText) {
    if (!isFirebaseInitialized || !database) {
        return { success: false, error: 'Firebase not initialized' };
    }

    try {
        const repliesRef = database.ref(`replies/${commentId}`);
        const newReplyRef = repliesRef.push();

        await newReplyRef.set({
            userId: userId,
            userName: userName.trim(),
            text: replyText.trim(),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        // Clear hot comments cache (reply counts changed)
        clearCache('hotComments_20');
        clearCache(`userRepliedTo_${userId}_20`);

        return { success: true, id: newReplyRef.key };
    } catch (error) {
        console.warn('Failed to submit reply:', error.message);
        return { success: false, error: error.message };
    }
}

async function fetchReplies(commentId) {
    if (!isFirebaseInitialized || !database) return [];

    try {
        const repliesRef = database.ref(`replies/${commentId}`);
        const snapshot = await repliesRef.orderByChild('timestamp').once('value');
        const data = snapshot.val();

        if (!data) return [];

        const replies = Object.entries(data)
            .map(([key, value]) => ({ id: key, ...value }))
            .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        return replies;
    } catch (error) {
        console.warn('Failed to fetch replies:', error.message);
        return [];
    }
}

async function getReplyCount(commentId) {
    if (!isFirebaseInitialized || !database) return 0;

    try {
        const repliesRef = database.ref(`replies/${commentId}`);
        const snapshot = await repliesRef.once('value');
        return snapshot.numChildren();
    } catch (error) {
        console.warn('Failed to get reply count:', error.message);
        return 0;
    }
}

// Fetch hot comments (simplified - fewer reads)
async function fetchTopCommentsByReplies(limit = 3) {
    if (!isFirebaseInitialized || !database) return [];

    try {
        // Get only last 20 comments to reduce reads
        const commentsRef = database.ref('comments');
        const snapshot = await commentsRef.orderByKey().limitToLast(20).once('value');
        const data = snapshot.val();

        if (!data) return [];

        const comments = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
        }));

        // Get reply counts
        const commentsWithReplies = await Promise.all(
            comments.map(async (comment) => {
                const replyCount = await getReplyCount(comment.id);
                return { ...comment, replyCount };
            })
        );

        return commentsWithReplies
            .filter(c => c.replyCount > 0)
            .sort((a, b) => b.replyCount - a.replyCount)
            .slice(0, limit);
    } catch (error) {
        console.warn('Failed to fetch top comments:', error.message);
        return [];
    }
}

async function fetchHotComments(limit = 20) {
    if (!isFirebaseInitialized || !database) return [];

    // Check cache first (30-min cache)
    const cacheKey = `hotComments_${limit}`;
    const cached = getCached(cacheKey);
    if (cached !== null) return cached;

    try {
        // Fetch replies node to find comments with the most replies
        const repliesRef = database.ref('replies');
        const repliesSnapshot = await repliesRef.once('value');
        const repliesData = repliesSnapshot.val();

        if (!repliesData) return [];

        // Count replies per comment and sort by count
        const topCommentIds = Object.entries(repliesData)
            .map(([commentId, replies]) => ({
                commentId,
                replyCount: Object.keys(replies).length
            }))
            .filter(c => c.replyCount > 0)
            .sort((a, b) => b.replyCount - a.replyCount)
            .slice(0, limit);

        if (topCommentIds.length === 0) return [];

        // Fetch only the top comment details
        const comments = await Promise.all(
            topCommentIds.map(async ({ commentId, replyCount }) => {
                const commentRef = database.ref(`comments/${commentId}`);
                const snapshot = await commentRef.once('value');
                const data = snapshot.val();
                if (!data) return null;
                return { id: commentId, ...data, replyCount };
            })
        );

        const result = comments.filter(c => c !== null);
        // Only cache if we have results
        if (result.length > 0) {
            setCache(cacheKey, result);
        }
        return result;
    } catch (error) {
        console.warn('Failed to fetch hot comments:', error.message);
        return [];
    }
}

async function fetchCommentsByUserId(userId, limit = 50) {
    if (!isFirebaseInitialized || !database || !userId) return [];

    try {
        const commentsRef = database.ref('comments');
        const query = commentsRef.orderByChild('userId').equalTo(userId);

        const snapshot = await query.once('value');
        const data = snapshot.val();

        if (!data) return [];

        return Object.entries(data)
            .map(([key, value]) => ({ id: key, ...value }))
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .slice(0, limit);
    } catch (error) {
        console.warn('Failed to fetch user comments:', error.message);
        return [];
    }
}

// Fetch comments that user has replied to (cards they interacted with)
async function fetchCommentsUserRepliedTo(userId, limit = 20) {
    if (!isFirebaseInitialized || !database || !userId) return [];

    // Check cache first (15-min cache per user)
    const cacheKey = `userRepliedTo_${userId}_${limit}`;
    const cached = getCached(cacheKey);
    if (cached !== null) return cached;

    try {
        // Get all replies
        const repliesRef = database.ref('replies');
        const snapshot = await repliesRef.once('value');
        const allReplies = snapshot.val();

        if (!allReplies) return [];

        // Find comment IDs where this user has replied
        const commentIdsWithUserReply = new Set();
        for (const [commentId, replies] of Object.entries(allReplies)) {
            for (const reply of Object.values(replies)) {
                if (reply.userId === userId) {
                    commentIdsWithUserReply.add(commentId);
                    break;
                }
            }
        }

        if (commentIdsWithUserReply.size === 0) return [];

        // Fetch only needed comments instead of all comments
        const repliedComments = [];
        const commentIds = Array.from(commentIdsWithUserReply);

        // Batch fetch only the needed comments (max 20)
        const idsToFetch = commentIds.slice(0, limit * 2); // Fetch extra to account for filtering

        await Promise.all(
            idsToFetch.map(async (commentId) => {
                const commentRef = database.ref(`comments/${commentId}`);
                const commentSnapshot = await commentRef.once('value');
                const commentData = commentSnapshot.val();
                if (commentData && commentData.userId !== userId) {
                    repliedComments.push({
                        id: commentId,
                        ...commentData
                    });
                }
            })
        );

        // Sort by timestamp and limit
        const result = repliedComments
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .slice(0, limit);

        // Only cache if we have results
        if (result.length > 0) {
            setCache(cacheKey, result);
        }
        return result;
    } catch (error) {
        console.warn('Failed to fetch comments user replied to:', error.message);
        return [];
    }
}

// Fetch card rankings (with cache)
async function fetchCardRankings(limit = 5) {
    if (!isFirebaseInitialized || !database) return [];

    const cached = getCached('cardRankings');
    if (cached !== null) return cached;

    try {
        const cardPicksRef = database.ref('cardPicks');
        const snapshot = await cardPicksRef.once('value');
        const data = snapshot.val();

        if (!data) return [];

        const rankings = Object.entries(data)
            .map(([key, count]) => {
                const cardId = key.replace('card_', '');
                return { cardId, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);

        setCache('cardRankings', rankings);
        return rankings;
    } catch (error) {
        console.warn('Failed to fetch card rankings:', error.message);
        return [];
    }
}

// ========================================
// Simplified Analytics (counter-based only)
// ========================================
// DISABLED detailed event tracking to save bandwidth
// Only keeping simple counter increments

async function trackFeatureUsage(feature, action = 'use') {
    if (!isFirebaseInitialized || !database) return null;

    try {
        const featureRef = database.ref(`analytics/features/${feature}/${action}`);
        await featureRef.transaction((current) => (current || 0) + 1);
        return true;
    } catch (error) {
        return null;
    }
}

// Simple tracking functions (no detailed events)
function trackMusicToggle(isMuted) {
    trackFeatureUsage('music', isMuted ? 'muted' : 'unmuted');
}

function trackCommentsPanel(action) {
    trackFeatureUsage('commentsPanel', action);
}

function trackRankingPanel(action) {
    trackFeatureUsage('rankingPanel', action);
}

// Disabled functions (return immediately to save bandwidth)
function trackEvent() { return null; }
function trackJourneyStep() { return null; }
function trackTimeToFirstPick() { return null; }
function trackInterpretationScroll() { return null; }
function trackCardPosition() { return null; }
function trackDeviceType() { return null; }
function trackCommentFormStart() { return null; }
function trackCommentFormAbandon() { return null; }
function trackCommentFormSubmit() { return null; }

async function fetchAnalyticsSummary() {
    if (!isFirebaseInitialized || !database) return null;

    try {
        const analyticsRef = database.ref('analytics');
        const snapshot = await analyticsRef.once('value');
        return snapshot.val() || {};
    } catch (error) {
        return null;
    }
}

// ========================================
// Export for use in app.js
// ========================================
window.cardCounter = {
    increment: handleCardPickCounter,
    getCount: getCardCount,
    getTotal: getTotalPicks,
    updateDisplay: updateCounterDisplay,
    isEnabled: () => isFirebaseInitialized,
    trackSaveImage: trackSaveImage,
    trackShare: trackShare,
    trackRetry: trackRetry,
    trackSocialClick: trackSocialClick,
    submitComment: submitCommentToFirebase,
    fetchComments: fetchComments,
    fetchCommentsByCardId: fetchCommentsByCardId,
    getCommentsCount: getCommentsCount,
    subscribeToCommentsCount: subscribeToCommentsCount,
    subscribeToNewComments: subscribeToNewComments,
    unsubscribeFromNewComments: unsubscribeFromNewComments,
    submitReply: submitReply,
    fetchReplies: fetchReplies,
    getReplyCount: getReplyCount,
    fetchTopCommentsByReplies: fetchTopCommentsByReplies,
    fetchHotComments: fetchHotComments,
    fetchCommentsByUserId: fetchCommentsByUserId,
    fetchCommentsUserRepliedTo: fetchCommentsUserRepliedTo,
    fetchCardRankings: fetchCardRankings,
    // Analytics (mostly disabled)
    trackEvent: trackEvent,
    trackJourneyStep: trackJourneyStep,
    trackTimeToFirstPick: trackTimeToFirstPick,
    trackFeatureUsage: trackFeatureUsage,
    trackMusicToggle: trackMusicToggle,
    trackCommentsPanel: trackCommentsPanel,
    trackRankingPanel: trackRankingPanel,
    trackInterpretationScroll: trackInterpretationScroll,
    trackCardPosition: trackCardPosition,
    trackDeviceType: trackDeviceType,
    trackCommentFormStart: trackCommentFormStart,
    trackCommentFormAbandon: trackCommentFormAbandon,
    trackCommentFormSubmit: trackCommentFormSubmit,
    fetchAnalyticsSummary: fetchAnalyticsSummary
};

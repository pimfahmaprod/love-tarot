// Firebase Configuration for Card Counter
// ========================================
// ดูวิธีตั้งค่าได้ที่ FIREBASE_SETUP.md
//
// ขั้นตอนย่อ:
// 1. สร้าง Firebase Project ที่ https://console.firebase.google.com/
// 2. เปิด Realtime Database
// 3. สร้าง Web App แล้วคัดลอก config มาใส่ด้านล่าง

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

// Check if Firebase is properly configured
function isFirebaseConfigured() {
    return firebaseConfig.apiKey && firebaseConfig.databaseURL;
}

// Initialize Firebase
function initializeFirebase() {
    // Skip if not configured
    if (!isFirebaseConfigured()) {
        console.info('Firebase not configured. Counter disabled. See FIREBASE_SETUP.md for setup instructions.');
        return false;
    }

    try {
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK not loaded');
            return false;
        }

        // Initialize Firebase app
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        database = firebase.database();
        isFirebaseInitialized = true;
        console.log('Firebase counter initialized successfully');
        return true;
    } catch (error) {
        console.warn('Firebase initialization failed:', error.message);
        return false;
    }
}

// Increment counter for a specific card
async function incrementCardCounter(cardId, cardName, userId) {
    if (!isFirebaseInitialized || !database) {
        return null;
    }

    try {
        // Increment total card count
        const cardRef = database.ref(`cardPicks/card_${cardId}`);
        const result = await cardRef.transaction((currentCount) => {
            return (currentCount || 0) + 1;
        });

        // Track user's card pick history
        if (userId) {
            const userPickRef = database.ref('userPicks').push();
            await userPickRef.set({
                userId: userId,
                cardId: cardId,
                cardName: cardName || '',
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }

        if (result.committed) {
            const newCount = result.snapshot.val();
            console.log(`Card ${cardId} total picks: ${newCount}`);
            return newCount;
        }
        return null;
    } catch (error) {
        console.warn('Failed to increment counter:', error.message);
        return null;
    }
}

// Get current count for a specific card
async function getCardCount(cardId) {
    if (!isFirebaseInitialized || !database) {
        return null;
    }

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
        // Format number with commas
        countElement.textContent = count.toLocaleString('th-TH');

        // Show with animation
        setTimeout(() => {
            counterContainer.classList.add('show');
        }, 300);
    } else {
        // Hide counter if no data
        counterContainer.classList.remove('show');
    }
}

// Main function to handle card selection counter
async function handleCardPickCounter(cardId) {
    if (!isFirebaseInitialized) {
        // Hide counter if Firebase not available
        const counterContainer = document.getElementById('pickCounter');
        if (counterContainer) counterContainer.classList.remove('show');
        return null;
    }

    // Increment the counter
    const newCount = await incrementCardCounter(cardId);

    // Update display
    updateCounterDisplay(newCount);

    return newCount;
}

// Get total picks across all cards
async function getTotalPicks() {
    if (!isFirebaseInitialized || !database) {
        return null;
    }

    try {
        const picksRef = database.ref('cardPicks');
        const snapshot = await picksRef.once('value');
        const data = snapshot.val();

        if (!data) return 0;

        let total = 0;
        Object.values(data).forEach(count => {
            total += count || 0;
        });
        return total;
    } catch (error) {
        console.warn('Failed to get total picks:', error.message);
        return null;
    }
}

// Update total counter display (used by real-time listener)
function updateTotalCounterDisplayValue(total) {
    const totalCountElement = document.getElementById('totalPickCount');
    const totalCounterContainer = document.getElementById('totalCounter');

    if (!totalCountElement || !totalCounterContainer) return;

    if (total !== null && total > 0) {
        totalCountElement.textContent = total.toLocaleString('th-TH');
        totalCounterContainer.classList.add('show');
    }
}

// Subscribe to real-time updates for total picks
function subscribeToTotalPicks() {
    if (!isFirebaseInitialized || !database) return;

    const picksRef = database.ref('cardPicks');

    // Listen for real-time updates
    picksRef.on('value', (snapshot) => {
        const data = snapshot.val();

        if (!data) {
            updateTotalCounterDisplayValue(0);
            return;
        }

        let total = 0;
        Object.values(data).forEach(count => {
            total += count || 0;
        });

        updateTotalCounterDisplayValue(total);
    }, (error) => {
        console.warn('Real-time listener error:', error.message);
    });
}

// Initialize on DOM ready
async function initializeApp() {
    const success = initializeFirebase();
    if (success) {
        // Subscribe to real-time updates for landing page counter
        subscribeToTotalPicks();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Track button clicks (save, share, retry)
async function trackButtonClick(category, action) {
    if (!isFirebaseInitialized || !database) {
        return null;
    }

    try {
        const buttonRef = database.ref(`buttonClicks/${category}/${action}`);

        const result = await buttonRef.transaction((currentCount) => {
            return (currentCount || 0) + 1;
        });

        if (result.committed) {
            console.log(`Tracked: ${category}/${action} = ${result.snapshot.val()}`);
            return result.snapshot.val();
        }
        return null;
    } catch (error) {
        console.warn('Failed to track button click:', error.message);
        return null;
    }
}

// Track save image button
function trackSaveImage(format) {
    return trackButtonClick('save', format);
}

// Track share button
function trackShare(platform) {
    return trackButtonClick('share', platform);
}

// Track retry button
function trackRetry() {
    return trackButtonClick('actions', 'retry');
}

// Track social link clicks
function trackSocialClick(platform) {
    return trackButtonClick('social', platform);
}

// Submit comment to Firebase
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

        console.log('Comment submitted:', newCommentRef.key);
        return { success: true, id: newCommentRef.key };
    } catch (error) {
        console.warn('Failed to submit comment:', error.message);
        return { success: false, error: error.message };
    }
}

// Get total comments count
async function getCommentsCount() {
    if (!isFirebaseInitialized || !database) {
        return 0;
    }

    try {
        const commentsRef = database.ref('comments');
        const snapshot = await commentsRef.once('value');
        return snapshot.numChildren();
    } catch (error) {
        console.warn('Failed to get comments count:', error.message);
        return 0;
    }
}

// Subscribe to real-time comments count
function subscribeToCommentsCount(callback) {
    if (!isFirebaseInitialized || !database) return;

    const commentsRef = database.ref('comments');
    commentsRef.on('value', (snapshot) => {
        const count = snapshot.numChildren();
        callback(count);
    });
}

// Subscribe to real-time new comments (for live updates)
let commentsListenerRef = null;
let commentsListenerCallback = null;

function subscribeToNewComments(callback) {
    if (!isFirebaseInitialized || !database) return null;

    // Unsubscribe previous listener if exists
    unsubscribeFromNewComments();

    const commentsRef = database.ref('comments');
    commentsListenerRef = commentsRef;

    // Listen for ALL child_added events - duplicates filtered by callback
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

// Unsubscribe from new comments listener
function unsubscribeFromNewComments() {
    if (commentsListenerRef && commentsListenerCallback) {
        commentsListenerRef.off('child_added', commentsListenerCallback);
    }
    commentsListenerRef = null;
    commentsListenerCallback = null;
}

// Fetch comments from Firebase (for lazy loading)
async function fetchComments(lastKey = null, limit = 10) {
    if (!isFirebaseInitialized || !database) {
        return { comments: [], hasMore: false };
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

        // Convert to array and reverse (newest first)
        const comments = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
        })).reverse();

        // Check if there are more comments
        const firstKey = comments.length > 0 ? comments[comments.length - 1].id : null;
        let hasMore = false;

        if (firstKey) {
            const checkMore = await commentsRef.orderByKey().endBefore(firstKey).limitToLast(1).once('value');
            hasMore = checkMore.exists();
        }

        return { comments, hasMore, lastKey: firstKey };
    } catch (error) {
        console.warn('Failed to fetch comments:', error.message);
        return { comments: [], hasMore: false };
    }
}

// Fetch comments by cardId (for related comments)
async function fetchCommentsByCardId(cardId, excludeCommentId = null, limit = 5) {
    if (!isFirebaseInitialized || !database) {
        return [];
    }

    try {
        const commentsRef = database.ref('comments');
        const query = commentsRef.orderByChild('cardId').equalTo(cardId).limitToLast(limit + 1);

        const snapshot = await query.once('value');
        const data = snapshot.val();

        if (!data) {
            return [];
        }

        // Convert to array, exclude the current comment, and reverse (newest first)
        const comments = Object.entries(data)
            .map(([key, value]) => ({ id: key, ...value }))
            .filter(c => c.id !== excludeCommentId)
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .slice(0, limit);

        return comments;
    } catch (error) {
        console.warn('Failed to fetch comments by cardId:', error.message);
        return [];
    }
}

// Submit reply to a comment
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

        console.log('Reply submitted:', newReplyRef.key);
        return { success: true, id: newReplyRef.key };
    } catch (error) {
        console.warn('Failed to submit reply:', error.message);
        return { success: false, error: error.message };
    }
}

// Fetch replies for a comment
async function fetchReplies(commentId) {
    if (!isFirebaseInitialized || !database) {
        return [];
    }

    try {
        const repliesRef = database.ref(`replies/${commentId}`);
        const snapshot = await repliesRef.orderByChild('timestamp').once('value');
        const data = snapshot.val();

        if (!data) {
            return [];
        }

        // Convert to array (oldest first for replies)
        const replies = Object.entries(data)
            .map(([key, value]) => ({ id: key, ...value }))
            .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        return replies;
    } catch (error) {
        console.warn('Failed to fetch replies:', error.message);
        return [];
    }
}

// Get reply count for a comment
async function getReplyCount(commentId) {
    if (!isFirebaseInitialized || !database) {
        return 0;
    }

    try {
        const repliesRef = database.ref(`replies/${commentId}`);
        const snapshot = await repliesRef.once('value');
        return snapshot.numChildren();
    } catch (error) {
        console.warn('Failed to get reply count:', error.message);
        return 0;
    }
}

// Fetch top comments sorted by reply count
async function fetchTopCommentsByReplies(limit = 3) {
    if (!isFirebaseInitialized || !database) {
        return [];
    }

    try {
        // Get recent comments (last 50 to find top ones)
        const commentsRef = database.ref('comments');
        const snapshot = await commentsRef.orderByKey().limitToLast(50).once('value');
        const data = snapshot.val();

        if (!data) {
            return [];
        }

        // Convert to array with IDs
        const comments = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
        }));

        // Get reply counts for all comments in parallel
        const commentsWithReplies = await Promise.all(
            comments.map(async (comment) => {
                const replyCount = await getReplyCount(comment.id);
                return { ...comment, replyCount };
            })
        );

        // Filter to only those with at least 1 reply, sort by reply count (descending)
        const topComments = commentsWithReplies
            .filter(c => c.replyCount > 0)
            .sort((a, b) => b.replyCount - a.replyCount)
            .slice(0, limit);

        return topComments;
    } catch (error) {
        console.warn('Failed to fetch top comments:', error.message);
        return [];
    }
}

// Fetch all comments sorted by reply count (for Hot tab)
async function fetchHotComments(limit = 20) {
    if (!isFirebaseInitialized || !database) {
        return [];
    }

    try {
        // Get all comments
        const commentsRef = database.ref('comments');
        const snapshot = await commentsRef.once('value');
        const data = snapshot.val();

        if (!data) {
            return [];
        }

        // Convert to array with IDs
        const comments = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
        }));

        // Get reply counts for all comments in parallel
        const commentsWithReplies = await Promise.all(
            comments.map(async (comment) => {
                const replyCount = await getReplyCount(comment.id);
                return { ...comment, replyCount };
            })
        );

        // Sort by reply count (descending), then by timestamp (newest first)
        const sortedComments = commentsWithReplies
            .sort((a, b) => {
                if (b.replyCount !== a.replyCount) {
                    return b.replyCount - a.replyCount;
                }
                return (b.timestamp || 0) - (a.timestamp || 0);
            })
            .slice(0, limit);

        return sortedComments;
    } catch (error) {
        console.warn('Failed to fetch hot comments:', error.message);
        return [];
    }
}

// Fetch comments by user ID (for Me tab)
async function fetchCommentsByUserId(userId, limit = 50) {
    if (!isFirebaseInitialized || !database || !userId) {
        return [];
    }

    try {
        const commentsRef = database.ref('comments');
        const query = commentsRef.orderByChild('userId').equalTo(userId);

        const snapshot = await query.once('value');
        const data = snapshot.val();

        if (!data) {
            return [];
        }

        // Convert to array and sort by timestamp (newest first)
        const comments = Object.entries(data)
            .map(([key, value]) => ({ id: key, ...value }))
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .slice(0, limit);

        return comments;
    } catch (error) {
        console.warn('Failed to fetch user comments:', error.message);
        return [];
    }
}

// Fetch card pick rankings (top cards by pick count)
async function fetchCardRankings(limit = 5) {
    if (!isFirebaseInitialized || !database) {
        return [];
    }

    try {
        const cardPicksRef = database.ref('cardPicks');
        const snapshot = await cardPicksRef.once('value');
        const data = snapshot.val();

        if (!data) {
            return [];
        }

        // Convert to array and sort by count (descending)
        const rankings = Object.entries(data)
            .map(([key, count]) => {
                // Extract card ID from key (e.g., "card_1" -> "1")
                const cardId = key.replace('card_', '');
                return { cardId, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);

        return rankings;
    } catch (error) {
        console.warn('Failed to fetch card rankings:', error.message);
        return [];
    }
}

// Export for use in app.js
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
    fetchCardRankings: fetchCardRankings
};

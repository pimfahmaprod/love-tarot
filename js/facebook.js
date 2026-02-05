// Facebook Login Integration for Valentine Tarot
// ============================================

// Facebook App ID
const FACEBOOK_APP_ID = '917069127345024';

// User state
let fbUser = null;

// Initialize Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
    });

    // Check login status on page load
    FB.getLoginStatus(function(response) {
        handleStatusChange(response);
    });
};

// Handle login status changes
function handleStatusChange(response) {
    if (response.status === 'connected') {
        // User is logged in and has authorized the app
        fbUser = response.authResponse;
        fetchUserProfile();
    } else {
        // User is not logged in or hasn't authorized
        fbUser = null;
        updateFacebookButton(false);
    }
}

// Fetch user profile info
function fetchUserProfile() {
    FB.api('/me', { fields: 'id,name,picture' }, function(response) {
        if (response && !response.error) {
            fbUser = {
                ...fbUser,
                id: response.id,
                name: response.name,
                picture: response.picture?.data?.url
            };
            updateFacebookButton(true, response.name);
            console.log('Facebook connected:', response.name);
        }
    });
}

// Main connect function - called from button click
function connectWithFacebook() {
    if (FACEBOOK_APP_ID === 'YOUR_FACEBOOK_APP_ID') {
        alert('กรุณาตั้งค่า Facebook App ID ก่อน\n\nPlease configure your Facebook App ID first.');
        console.error('Facebook App ID not configured. Get one at https://developers.facebook.com');
        return;
    }

    if (fbUser && fbUser.id) {
        // Already logged in - show options
        showFacebookOptions();
    } else {
        // Not logged in - initiate login
        loginWithFacebook();
    }
}

// Login with Facebook
function loginWithFacebook() {
    FB.login(function(response) {
        handleStatusChange(response);
    }, {
        scope: 'public_profile,user_friends',
        return_scopes: true
    });
}

// Logout from Facebook
function logoutFromFacebook() {
    FB.logout(function(response) {
        fbUser = null;
        updateFacebookButton(false);
        console.log('Logged out from Facebook');
    });
}

// Show options when already connected
function showFacebookOptions() {
    const choice = confirm(`เชื่อมต่อเป็น ${fbUser.name} อยู่\n\nกด OK เพื่อดูไพ่ของเพื่อน\nกด Cancel เพื่อออกจากระบบ`);

    if (choice) {
        // View friends' cards (feature to be implemented)
        viewFriendsCards();
    } else {
        logoutFromFacebook();
    }
}

// View friends' cards (placeholder for future feature)
function viewFriendsCards() {
    alert('ฟีเจอร์ดูไพ่ของเพื่อนกำลังพัฒนา\n\nFriends\' cards feature coming soon!');
    // TODO: Implement friends list and their card picks
}

// Update button appearance based on login state
function updateFacebookButton(isLoggedIn, userName = '') {
    const btn = document.getElementById('facebookConnectBtn');
    const btnText = document.getElementById('fbBtnText');

    if (!btn || !btnText) return;

    if (isLoggedIn) {
        btn.classList.add('connected');
        btnText.textContent = userName ? `${userName}` : 'เชื่อมต่อแล้ว';
    } else {
        btn.classList.remove('connected');
        btnText.textContent = 'เชื่อมต่อ Facebook';
    }
}

// Get current user (for use by other scripts)
function getFacebookUser() {
    return fbUser;
}

// Check if user is connected
function isFacebookConnected() {
    return fbUser && fbUser.id ? true : false;
}

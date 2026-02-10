/**
 * In-App Browser (WebView) Detection Utility
 *
 * Detects when the site is opened inside social media in-app browsers
 * (Facebook Messenger, Instagram, LinkedIn, etc.) where Google OAuth
 * popups and One Tap sign-in are blocked.
 *
 * Used to show "Open in Browser" prompts instead of broken login buttons.
 */

/**
 * Detects if the current browser is an in-app WebView
 * @returns {boolean} true if running inside an in-app browser
 */
export function isInAppBrowser() {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent || navigator.vendor || '';

  // Facebook (Messenger, Facebook app)
  if (/FBAN|FBAV|FB_IAB|FBIOS|FBSS/i.test(ua)) return true;

  // Instagram
  if (/Instagram/i.test(ua)) return true;

  // LinkedIn
  if (/LinkedInApp/i.test(ua)) return true;

  // Twitter / X
  if (/Twitter/i.test(ua)) return true;

  // Snapchat
  if (/Snapchat/i.test(ua)) return true;

  // TikTok
  if (/BytedanceWebview|TikTok/i.test(ua)) return true;

  // Pinterest
  if (/Pinterest/i.test(ua)) return true;

  // Line
  if (/\bLine\b/i.test(ua)) return true;

  // WeChat
  if (/MicroMessenger/i.test(ua)) return true;

  // Generic WebView detection (Android)
  if (/; wv\)/.test(ua)) return true;

  // iOS standalone WebView (not Safari, not Chrome)
  if (/iPhone|iPad|iPod/.test(ua) && !(/Safari/.test(ua)) && !(/CriOS/.test(ua))) {
    return true;
  }

  return false;
}

/**
 * Gets the name of the in-app browser for display purposes
 * @returns {string|null} Name of the app, or null if not in-app
 */
export function getInAppBrowserName() {
  if (typeof navigator === 'undefined') return null;

  const ua = navigator.userAgent || navigator.vendor || '';

  if (/FBAN|FBAV|FB_IAB|FBIOS|FBSS/i.test(ua)) return 'Facebook';
  if (/Instagram/i.test(ua)) return 'Instagram';
  if (/LinkedInApp/i.test(ua)) return 'LinkedIn';
  if (/Twitter/i.test(ua)) return 'Twitter';
  if (/Snapchat/i.test(ua)) return 'Snapchat';
  if (/BytedanceWebview|TikTok/i.test(ua)) return 'TikTok';
  if (/Pinterest/i.test(ua)) return 'Pinterest';
  if (/\bLine\b/i.test(ua)) return 'Line';
  if (/MicroMessenger/i.test(ua)) return 'WeChat';

  return null;
}

/**
 * Determines the operating system for platform-specific instructions
 * @returns {'ios' | 'android' | 'other'}
 */
export function getMobilePlatform() {
  if (typeof navigator === 'undefined') return 'other';

  const ua = navigator.userAgent || '';

  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}

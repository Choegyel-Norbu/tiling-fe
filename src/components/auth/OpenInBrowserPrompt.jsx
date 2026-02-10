import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Globe } from 'lucide-react';
import { getInAppBrowserName, getMobilePlatform } from '../../utils/inAppBrowser';

/**
 * OpenInBrowserPrompt - Shown in place of Google Login when inside an in-app browser
 *
 * In-app browsers (Facebook Messenger, Instagram, etc.) block Google OAuth popups.
 * This component guides users to open the page in their default browser instead.
 */
export function OpenInBrowserPrompt() {
  const [copied, setCopied] = useState(false);
  const appName = getInAppBrowserName() || 'this app';
  const platform = getMobilePlatform();

  const currentUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenInBrowser = () => {
    // Try to open in external browser using intent (Android)
    if (platform === 'android') {
      window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;end`;
      return;
    }

    // For iOS and others, try window.open (may work in some WebViews)
    window.open(currentUrl, '_system');
  };

  const getPlatformInstructions = () => {
    if (platform === 'ios') {
      return 'Tap the Safari icon or "Open in Safari" option from the menu (•••) at the bottom.';
    }
    if (platform === 'android') {
      return 'Tap the three dots menu (⋮) and select "Open in Chrome" or "Open in Browser".';
    }
    return 'Use the menu option to open this page in your default browser.';
  };

  return (
    <div className="text-center">
      {/* Warning icon */}
      <div className="flex justify-center mb-4">
        <div className="bg-amber-100 p-3 rounded-full">
          <Globe className="h-7 w-7 text-amber-600" />
        </div>
      </div>

      {/* Explanation */}
      <h4 className="text-base font-semibold text-slate-900 mb-2">
        Open in Your Browser
      </h4>
      <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-xs mx-auto">
        Google Sign-In doesn't work inside {appName}'s browser.
        Please open this page in{' '}
        {platform === 'ios' ? 'Safari' : platform === 'android' ? 'Chrome' : 'your browser'}{' '}
        to sign in.
      </p>

      {/* Open in Browser button */}
      <button
        onClick={handleOpenInBrowser}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white font-medium rounded-lg hover:bg-yellow-600 active:scale-[0.98] transition-all mb-3 text-sm"
      >
        <ExternalLink className="h-4 w-4" />
        Open in {platform === 'ios' ? 'Safari' : 'Browser'}
      </button>

      {/* Copy link button */}
      <button
        onClick={handleCopyLink}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 active:scale-[0.98] transition-all text-sm"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Link Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Link
          </>
        )}
      </button>

      {/* Platform-specific help text */}
      <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-[260px] mx-auto">
        {getPlatformInstructions()}
      </p>
    </div>
  );
}

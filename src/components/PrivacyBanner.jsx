// PrivacyBanner.jsx - Privacy and data handling information

import { useState, useEffect } from 'react';

export default function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('privacy-banner-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    } else {
      setIsDismissed(true);
    }
  }, []);

  function handleDismiss() {
    localStorage.setItem('privacy-banner-dismissed', 'true');
    setIsVisible(false);
    setIsDismissed(true);
  }

  if (!isVisible && isDismissed) {
    return null;
  }

  return (
    <div className={`bg-sage-700 text-white ${isVisible ? 'animate-slide-up' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <svg className="h-6 w-6 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium mb-1">Your data stays private</p>
              <p className="text-sm text-sage-100">
                All processing happens in your browser. Nothing is sent to any server. 
                Your financial data never leaves your device.
              </p>
            </div>
          </div>
          
          {isVisible && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-sage-100 hover:text-white transition-colors"
              aria-label="Dismiss privacy banner"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

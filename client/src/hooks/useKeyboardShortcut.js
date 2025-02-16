import { useEffect } from 'react';

export const useKeyboardShortcut = (key, ctrlKey, callback) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.altKey && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [key, callback]);
};
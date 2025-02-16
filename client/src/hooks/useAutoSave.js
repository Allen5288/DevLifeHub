import { useEffect, useRef } from 'react';

export const useAutoSave = (data, saveFunction, delay = 1000) => {
  const timeoutRef = useRef(null);
  const previousDataRef = useRef(data);

  useEffect(() => {
    // Only trigger save if data has changed
    if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        saveFunction(data);
        previousDataRef.current = data;
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFunction, delay]);
};
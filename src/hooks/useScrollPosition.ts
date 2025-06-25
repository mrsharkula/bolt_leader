import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollPosition {
  x: number;
  y: number;
}

const scrollPositions = new Map<string, ScrollPosition>();

export const useScrollPosition = (key: string) => {
  const location = useLocation();
  const savedPosition = useRef<ScrollPosition | null>(null);

  // Save current scroll position when component unmounts or route changes
  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositions.set(key, {
        x: window.scrollX,
        y: window.scrollY
      });
    };

    // Save position before route change
    return () => {
      saveScrollPosition();
    };
  }, [key, location.pathname]);

  // Restore scroll position when component mounts
  useEffect(() => {
    const restoreScrollPosition = () => {
      const saved = scrollPositions.get(key);
      if (saved) {
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          window.scrollTo({
            left: saved.x,
            top: saved.y,
            behavior: 'instant'
          });
        }, 0);
      }
    };

    // Only restore if we're coming back to this route (not on initial load)
    if (scrollPositions.has(key)) {
      restoreScrollPosition();
    }
  }, [key]);

  // Clear saved position when explicitly requested
  const clearScrollPosition = () => {
    scrollPositions.delete(key);
  };

  return { clearScrollPosition };
};
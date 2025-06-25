import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top for product detail pages and home page
    // Don't scroll for mattresses/beds pages as they use scroll restoration
    if (pathname.startsWith('/product/') || pathname === '/') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
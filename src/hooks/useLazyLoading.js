import { useEffect, useRef } from 'react';

export const useLazyLoading = (imageSelector, items) => {
  const observerRef = useRef(null);

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
              }
              observerRef.current.unobserve(img);
            }
          });
        },
        { 
          threshold: 0.1,
          rootMargin: '50px 0px'
        }
      );
    }

    const images = document.querySelectorAll(imageSelector);
    images.forEach(img => observerRef.current.observe(img));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [imageSelector, items]);
};
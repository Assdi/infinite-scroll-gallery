import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (callback) => {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (isFetching) return;
    
    const sentinel = document.querySelector('#scroll-sentinel');
    if (!sentinel) return;

    const rect = sentinel.getBoundingClientRect();
    const isVisible = rect.top <= window.innerHeight * 0.8; // Load when within 80% of viewport height

    if (isVisible) {
      console.log('Sentinel is visible, triggering load more');
      setIsFetching(true);
    }
  }, [isFetching]);

  useEffect(() => {
    const sentinel = document.querySelector('#scroll-sentinel');
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching) {
          console.log('Sentinel intersected, triggering load more');
          setIsFetching(true);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    
    callback().then(() => {
      setIsFetching(false);
    });
  }, [isFetching, callback]);

  return [isFetching, setIsFetching];
};
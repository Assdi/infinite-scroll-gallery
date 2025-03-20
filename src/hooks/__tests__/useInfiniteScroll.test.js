import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../useInfiniteScroll';

describe('useInfiniteScroll', () => {
  let mockCallback;
  let mockSentinel;
  let mockObserver;
  let mockObserve;
  let mockDisconnect;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock the callback function
    mockCallback = jest.fn().mockResolvedValue(undefined);

    // Mock the sentinel element
    mockSentinel = {
      getBoundingClientRect: jest.fn(),
    };

    // Create mock observer methods
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();

    // Create mock observer
    mockObserver = {
      observe: mockObserve,
      disconnect: mockDisconnect,
    };

    // Mock document.querySelector
    document.querySelector = jest.fn().mockReturnValue(mockSentinel);

    // Mock window.innerHeight
    window.innerHeight = 1000;

    // Mock IntersectionObserver
    window.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      return mockObserver;
    });
  });

  it('should initialize with isFetching as false', () => {
    const { result } = renderHook(() => useInfiniteScroll(mockCallback));
    expect(result.current[0]).toBe(false);
  });

  it('should create an IntersectionObserver with correct options', () => {
    renderHook(() => useInfiniteScroll(mockCallback));

    expect(window.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1 }
    );
  });

  it('should observe the sentinel element', () => {
    renderHook(() => useInfiniteScroll(mockCallback));

    expect(document.querySelector).toHaveBeenCalledWith('#scroll-sentinel');
    expect(mockObserve).toHaveBeenCalledWith(mockSentinel);
  });

  it('should trigger callback when sentinel becomes visible', async () => {
    renderHook(() => useInfiniteScroll(mockCallback));

    // Get the callback function that was passed to IntersectionObserver
    const [[callback]] = window.IntersectionObserver.mock.calls;
    
    // Simulate intersection observer callback
    await act(async () => {
      callback([
        {
          isIntersecting: true,
          target: mockSentinel
        }
      ]);
    });

    // Wait for the callback to be resolved
    await act(async () => {
      await mockCallback();
    });

    expect(mockCallback).toHaveBeenCalled();
  });


  it('should cleanup observer on unmount', () => {
    const { unmount } = renderHook(() => useInfiniteScroll(mockCallback));
    
    unmount();
    
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should not create new observer if one already exists', () => {
    const { rerender } = renderHook(
      ({ callback }) => useInfiniteScroll(callback),
      {
        initialProps: { callback: mockCallback },
      }
    );

    // First render should create observer
    expect(window.IntersectionObserver).toHaveBeenCalledTimes(1);

    // Rerender should not create new observer
    rerender({ callback: mockCallback });
    expect(window.IntersectionObserver).toHaveBeenCalledTimes(1);
  });

  it('should handle missing sentinel element gracefully', () => {
    document.querySelector.mockReturnValue(null);
    
    renderHook(() => useInfiniteScroll(mockCallback));

    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('should handle non-intersecting sentinel', async () => {
    renderHook(() => useInfiniteScroll(mockCallback));

    // Get the callback function that was passed to IntersectionObserver
    const [[callback]] = window.IntersectionObserver.mock.calls;
    
    // Simulate non-intersecting sentinel
    await act(async () => {
      callback([
        {
          isIntersecting: false,
          target: mockSentinel
        }
      ]);
    });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should handle multiple intersection entries', async () => {
    renderHook(() => useInfiniteScroll(mockCallback));

    // Get the callback function that was passed to IntersectionObserver
    const [[callback]] = window.IntersectionObserver.mock.calls;
    
    // Simulate multiple entries
    await act(async () => {
      callback([
        {
          isIntersecting: false,
          target: mockSentinel
        },
        {
          isIntersecting: true,
          target: mockSentinel
        }
      ]);
    });

    // Wait for the callback to be resolved
    await act(async () => {
      await mockCallback();
    });

    expect(mockCallback).toHaveBeenCalled();
  });

  it('should handle undefined sentinel', async () => {
    document.querySelector.mockReturnValue(undefined);
    renderHook(() => useInfiniteScroll(mockCallback));
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('should handle null sentinel', async () => {
    document.querySelector.mockReturnValue(null);
    renderHook(() => useInfiniteScroll(mockCallback));
    expect(mockObserve).not.toHaveBeenCalled();
  });
}); 
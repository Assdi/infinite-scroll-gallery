import { renderHook } from '@testing-library/react';
import { useLazyLoading } from '../useLazyLoading';

describe('useLazyLoading', () => {
  let mockObserver;
  let mockObserve;
  let mockUnobserve;
  let mockDisconnect;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create mock functions
    mockObserve = jest.fn();
    mockUnobserve = jest.fn();
    mockDisconnect = jest.fn();

    // Create mock observer
    mockObserver = {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    };

    // Mock IntersectionObserver
    window.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      return mockObserver;
    });
    
    // Mock document.querySelectorAll
    document.querySelectorAll = jest.fn().mockReturnValue([
      {
        getAttribute: jest.fn().mockReturnValue('test-src.jpg'),
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
        src: '',
      },
    ]);
  });

  it('should create an IntersectionObserver with correct options', () => {
    renderHook(() => useLazyLoading('.gallery-image', []));

    expect(window.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
      }
    );
  });

  it('should observe all matching images', () => {
    const mockImages = [
      { src: '', getAttribute: jest.fn(), removeAttribute: jest.fn() },
      { src: '', getAttribute: jest.fn(), removeAttribute: jest.fn() },
    ];
    document.querySelectorAll.mockReturnValue(mockImages);

    renderHook(() => useLazyLoading('.gallery-image', []));

    expect(document.querySelectorAll).toHaveBeenCalledWith('.gallery-image');
    expect(mockObserve).toHaveBeenCalledTimes(2);
    mockImages.forEach(img => {
      expect(mockObserve).toHaveBeenCalledWith(img);
    });
  });

  it('should load image when it becomes visible', () => {
    const mockImage = {
      getAttribute: jest.fn().mockReturnValue('test-src.jpg'),
      removeAttribute: jest.fn(),
      src: '',
    };
    document.querySelectorAll.mockReturnValue([mockImage]);

    renderHook(() => useLazyLoading('.gallery-image', []));

    // Get the callback function that was passed to IntersectionObserver
    const [[callback]] = window.IntersectionObserver.mock.calls;
    
    // Simulate intersection observer callback
    callback([
      {
        isIntersecting: true,
        target: mockImage
      }
    ]);

    expect(mockImage.src).toBe('test-src.jpg');
    expect(mockImage.removeAttribute).toHaveBeenCalledWith('data-src');
    expect(mockUnobserve).toHaveBeenCalledWith(mockImage);
  });

  it('should not load image if data-src is not present', () => {
    const mockImage = {
      getAttribute: jest.fn().mockReturnValue(null),
      removeAttribute: jest.fn(),
      src: '',
    };
    document.querySelectorAll.mockReturnValue([mockImage]);

    renderHook(() => useLazyLoading('.gallery-image', []));

    // Get the callback function that was passed to IntersectionObserver
    const [[callback]] = window.IntersectionObserver.mock.calls;
    
    // Simulate intersection observer callback
    callback([
      {
        isIntersecting: true,
        target: mockImage
      }
    ]);

    expect(mockImage.src).toBe('');
    expect(mockImage.removeAttribute).not.toHaveBeenCalled();
  });

  it('should cleanup observer on unmount', () => {
    const { unmount } = renderHook(() => useLazyLoading('.gallery-image', []));
    
    unmount();
    
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should not create new observer if one already exists', () => {
    const { rerender } = renderHook(
      ({ selector, items }) => useLazyLoading(selector, items),
      {
        initialProps: { selector: '.gallery-image', items: [] },
      }
    );

    // First render should create observer
    expect(window.IntersectionObserver).toHaveBeenCalledTimes(1);

    // Rerender should not create new observer
    rerender({ selector: '.gallery-image', items: [1, 2, 3] });
    expect(window.IntersectionObserver).toHaveBeenCalledTimes(1);
  });
}); 
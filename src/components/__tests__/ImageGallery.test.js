import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageGallery from '../ImageGallery';
import { mockImages } from '../../data/mockImages';

// Mock the hooks
jest.mock('../../hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: () => [false],
}));

jest.mock('../../hooks/useLazyLoading', () => ({
  useLazyLoading: () => {},
}));

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
});

describe('ImageGallery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScrollTo.mockClear();
  });

  it('should render initial state correctly', () => {
    render(<ImageGallery />);
    
    // Check if initial images are rendered
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(12); // IMAGES_PER_PAGE
  });

  it('should show loading spinner when loading more images', () => {
    render(<ImageGallery />);
    
    // Scroll to bottom
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
    
    // Check if loading spinner is visible
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should load more images when scrolling', async () => {
    render(<ImageGallery />);
    
    // Get initial number of images
    const initialImages = screen.getAllByRole('img');
    expect(initialImages).toHaveLength(12);
    
    // Scroll to bottom
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
    
    // Wait for more images to load
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(12);
    });
  });

  it('should handle view mode changes', () => {
    render(<ImageGallery />);
    
    // Get view mode select
    const viewSelect = screen.getByRole('combobox');
    
    // Change to list view
    fireEvent.change(viewSelect, { target: { value: 'list' } });
    
    // Check if layout changed by looking at the container's class
    const container = screen.getByTestId('image-container');
    expect(container).toHaveClass('g-4');
  });

  it('should maintain scroll position after view mode change', () => {
    render(<ImageGallery />);
    
    // Set initial scroll position
    window.pageYOffset = 500;
    
    // Change view mode
    const viewSelect = screen.getByRole('combobox');
    fireEvent.change(viewSelect, { target: { value: 'list' } });
    
    // Check if scrollTo was called with correct position
    expect(mockScrollTo).toHaveBeenCalledWith(0, 500);
  });
});
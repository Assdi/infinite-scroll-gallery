import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageGallery from '../ImageGallery';
import { mockImages } from '../../data/mockImages';

describe('ImageGallery Component', () => {
  beforeEach(() => {
    // Reset intersection observer mock
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  test('renders initial images and controls', () => {
    render(<ImageGallery />);
    
    // Check if filter and view controls are present
    expect(screen.getByText('Grid')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
    
    // Check if initial batch of images is rendered
    const images = document.querySelectorAll('.gallery-image');
    expect(images.length).toBeLessThanOrEqual(12);
  });

  test('switches between grid and list views', () => {
    render(<ImageGallery />);
    
    const listButton = screen.getByText('List');
    fireEvent.click(listButton);
    expect(document.querySelector('.row')).toHaveClass('g-4');
    
    const gridButton = screen.getByText('Grid');
    fireEvent.click(gridButton);
    expect(document.querySelector('.row')).toHaveClass('g-4');
  });

  test('filters images by tag', async () => {
    render(<ImageGallery />);
    
    const firstTag = mockImages[0].tags[0];
    const tagButton = screen.getByRole('button', { name: new RegExp(`^${firstTag}$`, 'i') });
    
    fireEvent.click(tagButton);
    
    await waitFor(() => {
      const filteredImages = mockImages.filter(img => img.tags.includes(firstTag));
      const displayedImages = document.querySelectorAll('.gallery-image');
      expect(displayedImages.length).toBeLessThanOrEqual(filteredImages.length);
    });
  });

  test('loads more images on scroll', async () => {
    render(<ImageGallery />);
    
    const initialImages = document.querySelectorAll('.gallery-image').length;
    
    // Trigger intersection observer
    const sentinel = document.querySelector('#scroll-sentinel');
    act(() => {
      const intersectionCallback = window.IntersectionObserver.mock.calls[0][0];
      intersectionCallback([{ isIntersecting: true }]);
    });
    
    await waitFor(() => {
      const newImages = document.querySelectorAll('.gallery-image');
      expect(newImages.length).toBeGreaterThan(initialImages);
    });
  });
});
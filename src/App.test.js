import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    // Reset intersection observer mock before each test
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(document.querySelector('.App')).toBeInTheDocument();
  });

  test('renders ImageGallery component', () => {
    render(<App />);
    // Look for a specific element that should be in ImageGallery
    expect(screen.getByText('Grid')).toBeInTheDocument();
  });
});

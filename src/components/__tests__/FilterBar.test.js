import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterBar from '../FilterBar';

describe('FilterBar', () => {
  const mockTags = ['nature', 'city', 'architecture'];
  const mockSelectedTags = ['nature'];
  const mockOnTagSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tags as buttons', () => {
    render(
      <FilterBar
        tags={mockTags}
        selectedTags={mockSelectedTags}
        onTagSelect={mockOnTagSelect}
      />
    );

    mockTags.forEach(tag => {
      expect(screen.getByRole('button', { name: tag })).toBeInTheDocument();
    });
  });

  it('highlights selected tags', () => {
    render(
      <FilterBar
        tags={mockTags}
        selectedTags={mockSelectedTags}
        onTagSelect={mockOnTagSelect}
      />
    );

    const selectedButton = screen.getByRole('button', { name: 'nature' });
    expect(selectedButton).toHaveClass('btn-primary');
    
    const unselectedButton = screen.getByRole('button', { name: 'city' });
    expect(unselectedButton).toHaveClass('btn-outline-primary');
  });

  it('calls onTagSelect when a tag is clicked', () => {
    render(
      <FilterBar
        tags={mockTags}
        selectedTags={mockSelectedTags}
        onTagSelect={mockOnTagSelect}
      />
    );

    const tagButton = screen.getByRole('button', { name: 'city' });
    fireEvent.click(tagButton);

    expect(mockOnTagSelect).toHaveBeenCalledWith('city');
  });

  it('renders correctly with empty tags array', () => {
    render(
      <FilterBar
        tags={[]}
        selectedTags={[]}
        onTagSelect={mockOnTagSelect}
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
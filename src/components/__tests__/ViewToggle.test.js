import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewToggle from '../ViewToggle';

describe('ViewToggle', () => {
  const mockOnViewChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both grid and list view buttons', () => {
    render(
      <ViewToggle
        viewMode="grid"
        onViewChange={mockOnViewChange}
      />
    );

    expect(screen.getByRole('button', { name: /grid/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /list/i })).toBeInTheDocument();
  });

  it('highlights the active view mode button', () => {
    render(
      <ViewToggle
        viewMode="grid"
        onViewChange={mockOnViewChange}
      />
    );

    const gridButton = screen.getByRole('button', { name: /grid/i });
    const listButton = screen.getByRole('button', { name: /list/i });

    expect(gridButton).toHaveClass('btn-primary');
    expect(listButton).toHaveClass('btn-outline-primary');
  });

  it('calls onViewChange when grid button is clicked', () => {
    render(
      <ViewToggle
        viewMode="list"
        onViewChange={mockOnViewChange}
      />
    );

    const gridButton = screen.getByRole('button', { name: /grid/i });
    fireEvent.click(gridButton);

    expect(mockOnViewChange).toHaveBeenCalledWith('grid');
  });

  it('calls onViewChange when list button is clicked', () => {
    render(
      <ViewToggle
        viewMode="grid"
        onViewChange={mockOnViewChange}
      />
    );

    const listButton = screen.getByRole('button', { name: /list/i });
    fireEvent.click(listButton);

    expect(mockOnViewChange).toHaveBeenCalledWith('list');
  });

  it('renders icons in buttons', () => {
    render(
      <ViewToggle
        viewMode="grid"
        onViewChange={mockOnViewChange}
      />
    );

    expect(screen.getByRole('button', { name: /grid/i }).querySelector('.bi-grid-3x3-gap')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /list/i }).querySelector('.bi-list')).toBeInTheDocument();
  });
});
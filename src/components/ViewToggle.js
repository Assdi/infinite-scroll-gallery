import React from 'react';
import { Button } from 'react-bootstrap';

const ViewToggle = ({ viewMode, onViewChange }) => {
  return (
    <div className="d-flex gap-2">
      <Button
        variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
        onClick={() => onViewChange('grid')}
        className="px-4"
      >
        <i className="bi bi-grid-3x3-gap me-2"></i>
        Grid
      </Button>
      <Button
        variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
        onClick={() => onViewChange('list')}
        className="px-4"
      >
        <i className="bi bi-list me-2"></i>
        List
      </Button>
    </div>
  );
};

export default ViewToggle;
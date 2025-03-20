import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

const FilterBar = ({ tags, selectedTags, onTagSelect }) => {
  return (
    <div className="mb-4">
      <div className="d-flex flex-wrap gap-2">
        {tags.map(tag => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? 'primary' : 'outline-primary'}
            onClick={() => onTagSelect(tag)}
            className="mb-2"
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
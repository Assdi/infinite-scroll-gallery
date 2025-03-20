import React from 'react';
import { Form } from 'react-bootstrap';

const MultiSelect = ({ options, selected, onChange, label }) => {
  const handleSelectChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    onChange(selectedOptions);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Select 
        multiple
        value={selected}
        onChange={handleSelectChange}
        className="custom-select"
        style={{ minHeight: '120px' }}
      >
        {options.map(option => (
          <option 
            key={option} 
            value={option}
          >
            {option}
          </option>
        ))}
      </Form.Select>
      <Form.Text className="text-muted">
        Hold Ctrl (Windows) or Cmd (Mac) to select multiple items
      </Form.Text>
    </Form.Group>
  );
};

export default MultiSelect;
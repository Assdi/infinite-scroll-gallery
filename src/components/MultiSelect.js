import React from 'react';
import { Form } from 'react-bootstrap';

const MultiSelect = ({ options, selected, onChange, label }) => {
  const selectId = `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor={selectId}>{label}</Form.Label>
      <Form.Select
        id={selectId}
        multiple
        value={selected}
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
          onChange(selectedOptions);
        }}
        className="custom-select"
        style={{ minHeight: '120px' }}
      >
        {options.map(option => (
          <option key={option} value={option}>
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
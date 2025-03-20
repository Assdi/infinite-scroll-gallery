import React from 'react';
import { Form } from 'react-bootstrap';

const ViewModeSelect = ({ viewMode, onChange, label }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Select
        value={viewMode}
        onChange={(e) => onChange(e.target.value)}
        className="custom-select"
      >
        <option value="grid">Grid</option>
        <option value="list">List</option>
      </Form.Select>
    </Form.Group>
  );
};

export default ViewModeSelect;
import React from 'react';
import { Card } from 'react-bootstrap';

const ImageCard = ({ image, viewMode }) => {
  return (
    <Card className={`mb-3 ${viewMode === 'grid' ? 'h-100' : 'flex-row'}`}>
      <Card.Img 
        className="gallery-image"
        variant={viewMode === 'grid' ? "top" : "left"} 
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // Placeholder
        data-src={image.url}
        style={viewMode === 'list' ? { width: '200px' } : {}}
      />
      <Card.Body>
        <Card.Title>{image.title}</Card.Title>
        <div className="mb-2">
          {image.tags.map(tag => (
            <span key={tag} className="badge bg-secondary me-1">{tag}</span>
          ))}
        </div>
        <Card.Text>{image.description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ImageCard;
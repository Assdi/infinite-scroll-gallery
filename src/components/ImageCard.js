import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import '../styles/animations.css';

const ImageCard = ({ image, viewMode }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Card 
      className={`image-card ${isLoaded ? 'loaded' : ''} view-transition`}
      style={{ height: viewMode === 'grid' ? '100%' : 'auto' }}
    >
      <div className="position-relative">
        {!isLoaded && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="loading-spinner" />
          </div>
        )}
        <Card.Img
          variant="top"
          src={image.url}
          className="gallery-image fade-in"
          onLoad={handleImageLoad}
          style={{ opacity: isLoaded ? 1 : 0 }}
          loading="lazy"
        />
      </div>
      <Card.Body className={`fade-in ${isLoaded ? 'loaded' : ''}`}>
        <Card.Title>{image.title}</Card.Title>
        <Card.Text>{image.description}</Card.Text>
        <div className="d-flex flex-wrap gap-2">
          {image.tags.map(tag => (
            <span 
              key={tag} 
              className="badge bg-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ImageCard;
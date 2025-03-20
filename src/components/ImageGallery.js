import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ImageCard from './ImageCard';
import MultiSelect from './MultiSelect';
import { mockImages } from '../data/mockImages';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useLazyLoading } from '../hooks/useLazyLoading';
import ViewModeSelect from './ViewModeSelect';

const IMAGES_PER_PAGE = 12;

const ImageGallery = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const galleryRef = useRef(null);

  const allTags = useMemo(() => 
    [...new Set(mockImages.flatMap(img => img.tags))],
    []
  );

  const filteredImages = useMemo(() => 
    mockImages.filter(img =>
      selectedTags.length === 0 || 
      selectedTags.some(tag => img.tags.includes(tag))
    ),
    [selectedTags]
  );

  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);

  const displayedImages = useMemo(() => 
    filteredImages.slice(0, page * IMAGES_PER_PAGE),
    [filteredImages, page]
  );

  const loadMoreImages = useCallback(async () => {
    if (isLoading || page >= totalPages) {
      console.log('Skipping load: isLoading:', isLoading, 'page:', page, 'totalPages:', totalPages);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`Starting to load page ${page + 1} of ${totalPages}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Only update page if we haven't reached the end
      if (page < totalPages) {
        setPage(prev => {
          const nextPage = prev + 1;
          console.log(`Loaded page ${nextPage} of ${totalPages}, total images: ${filteredImages.length}`);
          return nextPage;
        });
      }
    } catch (error) {
      console.error('Error loading more images:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, page, totalPages, filteredImages.length]);

  const [isFetching] = useInfiniteScroll(loadMoreImages);
  useLazyLoading('.gallery-image', displayedImages);

  // Debug effect to log current state
  useEffect(() => {
    console.log(`Current state: ${displayedImages.length} images loaded, page ${page} of ${totalPages}, total images: ${filteredImages.length}`);
  }, [displayedImages.length, page, totalPages, filteredImages.length]);

  const handleTagSelect = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setPage(1); // Reset page when filters change
  };

  const hasMoreImages = displayedImages.length < filteredImages.length;

  // Save scroll position before view change
  const handleViewChange = (newView) => {
    setScrollPosition(window.pageYOffset);
    setViewMode(newView);
  };

  // Restore scroll position after view change
  useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [viewMode, scrollPosition]);

  return (
    <Container className="py-4" ref={galleryRef}>
      <div className="d-flex flex-column flex-md-row gap-4 mb-4">
        <div className="flex-grow-1">
          <MultiSelect
            options={allTags}
            selected={selectedTags}
            onChange={setSelectedTags}
            label="Filter by Tags"
          />
        </div>
        <div style={{ minWidth: '200px' }}>
          <ViewModeSelect
            viewMode={viewMode}
            onChange={handleViewChange}
            label="View Mode"
          />
        </div>
      </div>
      
      <Row xs={1} md={viewMode === 'grid' ? 3 : 1} className="g-4">
        {displayedImages.map(image => (
          <Col key={image.id}>
            <ImageCard image={image} viewMode={viewMode} />
          </Col>
        ))}
      </Row>

      {hasMoreImages && (
        <div 
          id="scroll-sentinel" 
          className="d-flex justify-content-center py-4"
          style={{ minHeight: '100px', marginTop: '20px' }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </Container>
  );
};

export default ImageGallery;
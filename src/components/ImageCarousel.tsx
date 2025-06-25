import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2 } from 'lucide-react';

interface ProductImage {
  path: string;
  alt: {
    en: string;
    sr: string;
  };
  order: number;
}

interface ImageCarouselProps {
  images: ProductImage[];
  currentLanguage: 'en' | 'sr';
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  currentLanguage,
  selectedIndex,
  onIndexChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'Escape':
          setIsFullscreen(false);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateFullscreen('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateFullscreen('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, fullscreenIndex, images.length]);

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const navigateCarousel = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      onIndexChange(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    } else {
      onIndexChange(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const navigateFullscreen = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setFullscreenIndex(fullscreenIndex === 0 ? images.length - 1 : fullscreenIndex - 1);
    } else {
      setFullscreenIndex(fullscreenIndex === images.length - 1 ? 0 : fullscreenIndex + 1);
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
  };

  return (
    <>
      {/* Main Carousel */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white group">
          <img
            src={images[selectedIndex].path}
            alt={images[selectedIndex].alt[currentLanguage]}
            className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => navigateCarousel('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => navigateCarousel('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => openFullscreen(selectedIndex)}
            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Maximize2 className="h-5 w-5" />
          </button>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`relative overflow-hidden rounded-lg aspect-square group ${
                  selectedIndex === index 
                    ? 'ring-2 ring-blue-600' 
                    : 'hover:opacity-80'
                } transition-all duration-200`}
              >
                <img
                  src={image.path}
                  alt={image.alt[currentLanguage]}
                  className="w-full h-full object-cover"
                />
                
                {/* Zoom icon on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                  <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Dots Indicator for Mobile */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 md:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  selectedIndex === index 
                    ? 'bg-blue-600 w-6' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => navigateFullscreen('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={() => navigateFullscreen('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
              {fullscreenIndex + 1} / {images.length}
            </div>
          )}

          {/* Fullscreen Image */}
          <div className="relative max-w-7xl max-h-full mx-4">
            <img
              src={images[fullscreenIndex].path}
              alt={images[fullscreenIndex].alt[currentLanguage]}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
              <div className="flex gap-2 bg-black/50 p-2 rounded-lg max-w-xs overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setFullscreenIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden ${
                      fullscreenIndex === index 
                        ? 'ring-2 ring-white' 
                        : 'opacity-60 hover:opacity-100'
                    } transition-all duration-200`}
                  >
                    <img
                      src={image.path}
                      alt={image.alt[currentLanguage]}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-4 right-4 z-10 text-white/70 text-sm">
            <div className="bg-black/50 px-3 py-2 rounded-lg">
              <p>Press ESC to close • Use arrow keys to navigate</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
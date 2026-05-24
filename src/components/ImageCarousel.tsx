import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2 } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  autoplayInterval?: number; // active if > 0
  onImageClick?: (index: number) => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function ImageCarousel({
  images,
  alt = 'Carousel Image',
  autoplayInterval = 4000,
  onImageClick,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (images.length <= 1 || !isPlaying || autoplayInterval <= 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, autoplayInterval);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPlaying, images.length, autoplayInterval]);

  // Touch & Swipe Support via simple handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group/carousel bg-slate-900"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      id="image-carousel-container"
    >
      {/* Current Slide */}
      <div className="absolute inset-0 select-none">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
            id={`slide-${currentIndex}`}
          >
            <img
              src={images[currentIndex]}
              alt={`${alt} - Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover select-none cursor-pointer"
              referrerPolicy="no-referrer"
              onClick={() => onImageClick?.(currentIndex)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark overlay top and bottom for readability of controls */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* Index Badge & Actions */}
      <div className="absolute top-4 left-6 z-10 flex items-center space-x-3 text-white text-sm font-medium">
        <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-mono">
          {currentIndex + 1} / {images.length}
        </span>
        {onImageClick && (
          <button
            onClick={() => onImageClick(currentIndex)}
            className="p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 transition-colors"
            title="Expand image"
            id="expand-image-btn"
          >
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Hover Navigation Controls */}
      {images.length > 1 && (
        <>
          {/* Previous Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white/20 active:scale-95"
            aria-label="Previous image"
            id="prev-slide-btn"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white/20 active:scale-95"
            aria-label="Next image"
            id="next-slide-btn"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Autoplay & Dot Indicators Row */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-between px-6">
        {/* Autoplay Pause/Play */}
        {images.length > 1 && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white backdrop-blur-sm transition-colors text-xs"
            aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
            id="autoplay-toggle-btn"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="flex space-x-1.5 justify-center flex-grow">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'w-6 bg-brand-light' 
                    : 'w-2 bg-white/40 hover:bg-white/65'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                id={`dot-indicator-${idx}`}
              />
            ))}
          </div>
        )}

        {/* Dummy container to keep alignment balanced */}
        <div className="w-8" />
      </div>
    </div>
  );
}

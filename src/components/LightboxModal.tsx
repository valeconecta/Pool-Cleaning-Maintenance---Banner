import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  title?: string;
}

export default function LightboxModal({
  isOpen,
  onClose,
  images,
  initialIndex,
  title = 'Gallery View',
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Sync index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePrev = () => {
    setIsZoomed(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setIsZoomed(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none" id="lightbox-modal">
        {/* Close Button / Backdrop area */}
        <div className="absolute inset-0 z-0 cursor-zoom-out" onClick={onClose} />

        {/* Header Controls */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent">
          <div className="text-white space-y-1">
            <h4 className="font-semibold tracking-tight text-lg text-slate-100">{title}</h4>
            <p className="text-sm text-slate-400 font-mono">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Zoom Action */}
            <button
              onClick={toggleZoom}
              className="p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/10"
              aria-label="Toggle Zoom"
              id="lightbox-zoom-btn"
            >
              {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
            </button>
            
            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/10"
              aria-label="Close Lightbox"
              id="lightbox-close-btn"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Image Slider Area */}
        <div className="relative z-10 flex items-center justify-center w-full h-full max-w-5xl max-h-[80vh] px-4">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`relative flex items-center justify-center h-full w-full transition-transform duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'}`}
              id={`lightbox-slide-${currentIndex}`}
              onClick={isZoomed ? toggleZoom : undefined}
            >
              <img
                src={images[currentIndex]}
                alt={`Expanded Gallery ${currentIndex + 1}`}
                className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next and Prev overlay navigation */}
        {images.length > 1 && (
          <>
            {/* Prev Trigger */}
            <button
              onClick={handlePrev}
              className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all hover:scale-105 active:scale-95"
              aria-label="Prev image"
              id="lightbox-prev-btn"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next Trigger */}
            <button
              onClick={handleNext}
              className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all hover:scale-105 active:scale-95"
              aria-label="Next image"
              id="lightbox-next-btn"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        {/* Thumbnail Preview strip at the bottom */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2 px-4 overflow-x-auto max-w-xl mx-auto py-2 scrollbar-none scroll-smooth">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsZoomed(false);
                  setCurrentIndex(idx);
                }}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === idx 
                    ? 'border-brand-light scale-105 opacity-100' 
                    : 'border-transparent opacity-40 hover:opacity-70'
                }`}
                id={`lightbox-thumb-${idx}`}
              >
                <img 
                  src={img} 
                  alt={`Thumb ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}

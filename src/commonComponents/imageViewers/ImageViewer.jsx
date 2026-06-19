import React, { useState } from 'react';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { FiZoomIn, FiZoomOut, FiRotateCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageViewer({
  isOpen,
  onClose,
  images = [], // Array of image URL strings
  startIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleNext = (e) => {
    e.stopPropagation();
    setZoom(1);
    setRotation(0);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setZoom(1);
    setRotation(0);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/90 p-4">
          {/* Header Controls */}
          <div className="flex justify-between items-center text-white z-10 py-2">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
            
            <div className="flex items-center gap-4.5 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} className="hover:text-teal-400 transition-colors">
                <FiZoomIn className="h-5 w-5" />
              </button>
              <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} className="hover:text-teal-400 transition-colors">
                <FiZoomOut className="h-5 w-5" />
              </button>
              <button onClick={() => setRotation(r => (r + 90) % 360)} className="hover:text-teal-400 transition-colors">
                <FiRotateCw className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 bg-slate-900/60 hover:bg-slate-800 text-white transition-colors border border-white/10"
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>

          {/* Active Image Box */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden my-4">
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 z-10 rounded-full p-3 bg-black/40 hover:bg-black/60 text-white transition-colors border border-white/10"
              >
                <IoChevronBack className="h-6 w-6" />
              </button>
            )}

            <motion.div
              style={{ scale: zoom, rotate: `${rotation}deg` }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="max-h-[75vh] max-w-[85vw] flex items-center justify-center select-none"
            >
              <img
                src={images[currentIndex]}
                alt={`Viewer item ${currentIndex}`}
                className="max-h-[70vh] max-w-[80vw] object-contain rounded-lg shadow-2xl pointer-events-none"
              />
            </motion.div>

            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 z-10 rounded-full p-3 bg-black/40 hover:bg-black/60 text-white transition-colors border border-white/10"
              >
                <IoChevronForward className="h-6 w-6" />
              </button>
            )}
          </div>
          
          <div className="h-4" />
        </div>
      )}
    </AnimatePresence>
  );
}

import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title?: string;
  description?: string;
  price?: string;
  url?: string;
  theme?: string;
}

export function Lightbox({ 
  isOpen, 
  onClose, 
  imageSrc, 
  title, 
  description, 
  price, 
  url,
  theme = "#4299e1"
}: LightboxProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleActionClick = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div className="relative">
          <img
            src={imageSrc}
            alt={title || "Direct Ad"}
            className="w-full h-auto max-h-[60vh] object-contain"
          />
        </div>

        {/* Content */}
        {(title || description || price || url) && (
          <div className="p-6">
            {title && (
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
            )}
            
            {description && (
              <p className="text-gray-600 mb-4">{description}</p>
            )}
            
            {price && (
              <p className="text-lg font-bold mb-4" style={{ color: theme }}>
                {price}
              </p>
            )}
            
            {url && (
              <button
                onClick={handleActionClick}
                className="w-full py-3 px-6 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: theme }}
              >
                Learn More
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

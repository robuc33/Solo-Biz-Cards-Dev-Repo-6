import React from 'react';
import { createPortal } from 'react-dom';
import { NextLink } from '@/components/ui/NextLink';

interface ThankYouPopupProps {
  isOpen: boolean;
  onClose: () => void;
  animateClass: string;
  customTitle?: string;
  customMessage?: string;
  customButtonText?: string;
  theme: string;
  username?: string;
  profilePhoto?: string;
}

export function ThankYouPopup({
  isOpen,
  onClose,
  animateClass,
  customTitle = "Great Job!!!",
  customMessage = "The first digital business card that turns networking into passive income.",
  customButtonText = "Get a BizCard Free!",
  theme,
  username,
  profilePhoto
}: ThankYouPopupProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 flex justify-center items-end bg-black/20 -mb-4"
    >
      <div
        className={`
          relative bg-white p-4 mb-4 transform transition-all duration-500 
          ${animateClass} pointer-events-auto mx-auto  
          w-[calc(100%-1rem)] max-w-[448px] rounded-t-3xl shadow-2xl text-center
        `}
      >
        {/* Close (x) button in top-right */}
        <button
          onClick={handleClose}
          className="
            absolute
            top-0
            right-1
            text-gray-700
            hover:scale-110
            transition-transform
            text-3xl
            cursor-pointer
            font-bold
            leading-none
            p-[10px]
          "
          aria-label="Close"
        >
          ×
        </button>

        {/* Profile Picture Overlap */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-13 z-10">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-26 h-26 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="w-26 h-26 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-sm text-gray-600">
              No image
            </div>
          )}
        </div>

        {/* Stars */}
        <div className="flex justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-red-500 text-xl mr-0.5">
              ★
            </span>
          ))}
        </div>

        {/* Heading */}
        <p className="text-center text-lg font-bold mb-1">
          {customTitle}
        </p>
        
        {/* Subtext with the name */}
        <span className="text-center text-gray-500">
          ***************************************
        </span>
        
        <div className="max-w-[18rem] mx-auto">
          <p className="text-center text-gray-500 border-dashed max-w-xs -mx-3">
            {username ? 
              `${username}'s contact details were downloaded to your phone.` : 
              customMessage
            }
          </p>
        </div>
        
        <span className="text-center text-gray-500">
          ***************************************
        </span>

        {/* Button */}
        <NextLink to="/">
          <button
            className="mt-3 block mx-auto text-white font-medium py-1 px-6 rounded-full w-full max-w-[20rem] cursor-pointer"
            style={{ backgroundColor: theme }}
          >
            {customButtonText}
          </button>
        </NextLink>
      </div>
    </div>,
    document.body
  );
}

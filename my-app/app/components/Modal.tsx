"use client";
import { FC, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="relative bg-white p-6 rounded-md shadow-lg w-full max-w-md pointer-events-auto">
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
      {/* Optional: Add semi-transparent overlay to highlight modal */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-[-1]"></div>
    </div>
  );
};

export default Modal;

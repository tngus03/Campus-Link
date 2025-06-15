'use client';

import { ReactNode } from 'react';

export default function ModalWrapper({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-black text-white p-8 rounded-xl w-[90%] max-w-md shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-gray-300"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
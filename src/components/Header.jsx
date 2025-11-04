import React from 'react';
import { QrCode } from 'lucide-react';

const Header = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-primary-600 rounded-xl shadow-lg animate-pulse-slow">
          <QrCode className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          QR Code Generator
        </h1>
      </div>
      <p className="text-gray-600 text-lg">
        Gerador Profissional de QR Codes para Links e Google Reviews
      </p>
    </header>
  );
};

export default Header;

import React from 'react';
import { PageId } from '../types';

interface FooterProps {
  onNavigate: (pageId: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
      <footer className="w-full py-12 border-t border-[#584237]/40 bg-[#0b1326] relative z-10 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto px-6 gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <span className="font-extrabold text-lg text-[#f8fafc]">Laravel API Module</span>
            <p className="text-[#94a3b8] text-xs">
              © 2024 Laravel API Module. Engineered for domain-driven backend scalability.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm text-[#94a3b8]">
            <button
                onClick={() => onNavigate('issues')}
                className="hover:text-[#7bd0ff] transition-colors"
            >
              GitHub
            </button>
            <button
                onClick={() => onNavigate('instructions')}
                className="hover:text-[#7bd0ff] transition-colors"
            >
              MIT License
            </button>
          </div>
        </div>
      </footer>
  );
};


import React, { useState, useRef, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../types';
import { Globe, ChevronDown } from 'lucide-react';

interface Props {
  selected: Language;
  onSelect: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 px-4 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-all"
      >
        <Globe className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-bold text-slate-700">{selected}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[100] animate-in zoom-in-95 duration-200">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                onSelect(lang);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                selected === lang
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

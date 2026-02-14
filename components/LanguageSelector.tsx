
import React from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../types';
import { Globe } from 'lucide-react';

interface Props {
  selected: Language;
  onSelect: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-slate-200">
      <Globe className="w-4 h-4 text-slate-500" />
      <div className="flex flex-wrap gap-1">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            className={`px-3 py-1 text-xs rounded-full transition-all ${
              selected === lang
                ? 'bg-indigo-600 text-white font-medium shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../hooks/useLanguage';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const languageNames = {
    en: 'English',
    sr: 'Srpski',
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
        <Globe className="h-4 w-4" />
        <span>{languageNames[currentLanguage]}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors duration-200 first:rounded-t-md last:rounded-b-md ${
              currentLanguage === lang ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
            }`}
          >
            {languageNames[lang]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
import { useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import srTranslations from '../locales/sr.json';

export type Language = 'en' | 'sr';

const translations = {
  en: enTranslations,
  sr: srTranslations,
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('dreamrest-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('dreamrest-language', currentLanguage);
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const changeLanguage = (language: Language) => {
    if (language !== currentLanguage) {
      localStorage.setItem('dreamrest-language', language);
      window.location.reload();
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations) as Language[],
  };
};
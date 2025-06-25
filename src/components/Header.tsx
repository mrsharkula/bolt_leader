import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-blue-600 bg-blue-50'
        : 'text-slate-700 hover:text-blue-600'
    }`;
  };

  const mobileNavLinkClass = (path: string) => {
    return `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-blue-600 bg-blue-50'
        : 'text-slate-700 hover:text-blue-600'
    }`;
  };

  return (
    <header className="bg-white shadow-lg relative z-50">
      {/* Top Bar */}
      <div className="bg-slate-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{t('header.phone')}</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{t('header.email')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/leader_logo-removebg-preview.png" 
                alt="Leader Logo" 
                className="w-12 h-12 mr-3"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{t('header.companyName')}</h1>
                <p className="text-sm text-slate-600 -mt-1">{t('header.tagline')}</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={navLinkClass('/')}>
                {t('header.nav.home')}
              </Link>
              <Link to="/mattresses" className={navLinkClass('/mattresses')}>
                {t('header.nav.mattresses')}
              </Link>
              <Link to="/beds" className={navLinkClass('/beds')}>
                {t('header.nav.beds')}
              </Link>
              <a href="#" className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                {t('header.nav.about')}
              </a>
              <a href="#" className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                {t('header.nav.contact')}
              </a>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200">
              <Link to="/" className={mobileNavLinkClass('/')} onClick={() => setIsMenuOpen(false)}>
                {t('header.nav.home')}
              </Link>
              <Link to="/mattresses" className={mobileNavLinkClass('/mattresses')} onClick={() => setIsMenuOpen(false)}>
                {t('header.nav.mattresses')}
              </Link>
              <Link to="/beds" className={mobileNavLinkClass('/beds')} onClick={() => setIsMenuOpen(false)}>
                {t('header.nav.beds')}
              </Link>
              <a href="#" className="text-slate-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
                {t('header.nav.about')}
              </a>
              <a href="#" className="text-slate-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
                {t('header.nav.contact')}
              </a>
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
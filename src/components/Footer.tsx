import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/leader_logo-removebg-preview.png" 
                alt="Leader Logo" 
                className="w-12 h-12 mr-3 bg-white rounded-lg p-1"
              />
              <div>
                <h3 className="text-xl font-bold">{t('footer.companyName')}</h3>
              </div>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                <Facebook className="h-8 w-8" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                <Instagram className="h-8 w-8" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity duration-200">
                <img 
                  src="/unnamed-removebg-preview (Custom).png" 
                  alt="KupujemProdajem" 
                  className="h-[52px] w-[52px] object-contain"
                />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">{t('footer.contactUs')}</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm whitespace-pre-line">
                    {t('footer.address')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-slate-400 text-sm">{t('footer.phone')}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-slate-400 text-sm">{t('footer.email')}</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm whitespace-pre-line">
                    {t('footer.hours')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">{t('footer.visitShowroom')}</h4>
            <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.3207!2d-74.0059413!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316e2a5c2f%3A0x2b2b2b2b2b2b2b2b!2s123%20Sleep%20Street%2C%20New%20York%2C%20NY%2010013!5e0!3m2!1sen!2sus!4v1635959999999!5m2!1sen!2sus"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-48"
                title="Leader Store Location"
              ></iframe>
            </div>
            <p className="text-slate-400 text-xs">
              {t('footer.experienceText')}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-slate-400 text-sm">
                {t('footer.copyright')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                  {t('footer.privacyPolicy')}
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                  {t('footer.termsOfService')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
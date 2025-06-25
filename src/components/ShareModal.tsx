import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Download, Copy, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { useLanguage } from '../hooks/useLanguage';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  description: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
  description
}) => {
  const { currentLanguage } = useLanguage();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [isGenerating, setIsGenerating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Generate QR code when modal opens
  useEffect(() => {
    if (isOpen && url) {
      setIsGenerating(true);
      QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e293b', // slate-800
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      })
        .then(dataUrl => {
          setQrCodeDataUrl(dataUrl);
          setIsGenerating(false);
        })
        .catch(error => {
          console.error('Error generating QR code:', error);
          setIsGenerating(false);
        });
    }
  }, [isOpen, url]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } catch (fallbackError) {
        console.error('Copy failed:', fallbackError);
      }
      
      document.body.removeChild(textArea);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr_code.png`;
      link.href = qrCodeDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getText = (key: string) => {
    const translations = {
      en: {
        shareProduct: 'Share Product',
        scanQRCode: 'Scan QR Code',
        scanWithPhone: 'Scan with your phone camera to open this product page',
        copyLink: 'Copy Link',
        linkCopied: 'Link Copied!',
        downloadQR: 'Download QR Code',
        generatingQR: 'Generating QR Code...',
        close: 'Close'
      },
      sr: {
        shareProduct: 'Podeli proizvod',
        scanQRCode: 'Skeniraj QR kod',
        scanWithPhone: 'Skeniraj kamerom telefona da otvoriš ovu stranicu proizvoda',
        copyLink: 'Kopiraj link',
        linkCopied: 'Link kopiran!',
        downloadQR: 'Preuzmi QR kod',
        generatingQR: 'Generiše se QR kod...',
        close: 'Zatvori'
      }
    };
    
    return translations[currentLanguage][key as keyof typeof translations['en']] || key;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            {getText('shareProduct')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="text-center">
            <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
          </div>

          {/* QR Code Section */}
          <div className="text-center">
            <h4 className="font-medium text-slate-800 mb-3">{getText('scanQRCode')}</h4>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-4">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                  <p className="text-slate-600 text-sm">{getText('generatingQR')}</p>
                </div>
              ) : qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code"
                  className="w-64 h-64 mx-auto rounded-lg shadow-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  <QrCode className="h-16 w-16" />
                </div>
              )}
            </div>
            
            <p className="text-xs text-slate-500 mb-4">
              {getText('scanWithPhone')}
            </p>

            {/* QR Actions */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleDownloadQR}
                disabled={!qrCodeDataUrl || isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                {getText('downloadQR')}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">or</span>
            </div>
          </div>

          {/* Copy Link Section */}
          <div>
            <h4 className="font-medium text-slate-800 mb-3 text-center">{getText('copyLink')}</h4>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  copyStatus === 'copied'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copyStatus === 'copied' ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {getText('linkCopied')}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {getText('copyLink')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 font-medium"
          >
            {getText('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
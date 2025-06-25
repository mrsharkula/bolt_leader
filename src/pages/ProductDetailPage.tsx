import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Share2, CheckCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import ImageCarousel from '../components/ImageCarousel';
import ShareModal from '../components/ShareModal';
import mattressesData from '../data/mattresses.json';
import bedsData from '../data/beds.json';

interface ProductImage {
  path: string;
  alt: {
    en: string;
    sr: string;
  };
  order: number;
}

// Separate interface for cover image (without order)
interface CoverImage {
  path: string;
  alt: {
    en: string;
    sr: string;
  };
}

interface ProductPrice {
  currency: string;
  amount: number;
  originalAmount?: number;
}

interface ProductDimension {
  size: string;
  measurements: string;
  price: ProductPrice;
}

interface Product {
  id: string;
  order: number;
  coverImage: CoverImage; // Use CoverImage instead of ProductImage
  name: {
    en: string;
    sr: string;
  };
  description: {
    en: string;
    sr: string;
  };
  shortDescription: {
    en: string;
    sr: string;
  };
  dimensions: ProductDimension[];
  features: {
    en: string[];
    sr: string[];
  };
  specifications: {
    [key: string]: any;
  };
  images: ProductImage[];
  category: string;
  inStock: boolean;
  featured: boolean;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentLanguage, t } = useLanguage();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<string>('');
  const [selectedDimension, setSelectedDimension] = useState<ProductDimension | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareButtonState, setShareButtonState] = useState<'idle' | 'copying' | 'copied'>('idle');

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    setLoading(true);
    
    // Find product from both data sources
    let foundProduct: Product | null = null;
    let foundCategory = '';
    
    // Check mattresses first
    foundProduct = mattressesData.mattresses.find(p => p.id === id) || null;
    if (foundProduct) {
      foundCategory = 'mattresses';
    } else {
      // Check beds
      foundProduct = bedsData.beds.find(p => p.id === id) || null;
      if (foundProduct) {
        foundCategory = 'beds';
      }
    }

    if (foundProduct) {
      setProduct(foundProduct);
      setCategory(foundCategory);
      // Don't auto-select any dimension - start with null to show price range
      setSelectedDimension(null);
    } else {
      // Product not found, redirect to home
      navigate('/');
      return;
    }
    
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h2>
          <p className="text-slate-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Convert cover image to ProductImage format for the carousel
  const coverImageAsProductImage: ProductImage = {
    ...product.coverImage,
    order: 0
  };

  const allImages = [coverImageAsProductImage, ...product.images];
  const discountPercentage = selectedDimension?.price.originalAmount 
    ? Math.round(((selectedDimension.price.originalAmount - selectedDimension.price.amount) / selectedDimension.price.originalAmount) * 100)
    : 0;

  // Check if any dimension has a discount
  const hasAnyDiscount = product.dimensions.some(dimension => dimension.price.originalAmount);

  // Calculate price range for when no dimension is selected
  const prices = product.dimensions.map(dim => dim.price.amount);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const handleShare = async () => {
    // Start the copying animation
    setShareButtonState('copying');
    
    // Copy the link
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (fallbackError) {
        console.error('Copy failed:', fallbackError);
      }
    }
    
    // Show copied state
    setShareButtonState('copied');
    
    // Wait a moment to show the copied state, then open modal
    setTimeout(() => {
      setIsShareModalOpen(true);
      // Reset button state after modal opens
      setTimeout(() => {
        setShareButtonState('idle');
      }, 500);
    }, 800);
  };

  // Format currency based on the product's currency
  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'RSD') {
      return `${amount.toLocaleString()} RSD`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Get translated specification key
  const getSpecificationKey = (key: string) => {
    const keyTranslations: { [key: string]: { en: string; sr: string } } = {
      'height': { en: 'Height', sr: 'Visina' },
      'firmness': { en: 'Firmness', sr: 'Čvrstoća' },
      'warranty': { en: 'Warranty', sr: 'Garancija' },
      'cover': { en: 'Cover', sr: 'Presvlaka' },
      'core': { en: 'Core', sr: 'Jezgro' },
      'foam': { en: 'Foam', sr: 'Pena' },
      'tolerances': { en: 'Tolerances', sr: 'Tolerancije' },
      'care': { en: 'Care Instructions', sr: 'Uputstva za održavanje' }
    };
    
    return keyTranslations[key]?.[currentLanguage] || 
           key.replace(/([A-Z])/g, ' $1').trim();
  };

  // Get share button content based on state
  const getShareButtonContent = () => {
    switch (shareButtonState) {
      case 'copying':
        return {
          icon: <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />,
          text: currentLanguage === 'sr' ? 'Kopira...' : 'Copying...',
          className: 'bg-blue-100 text-blue-600 cursor-wait'
        };
      case 'copied':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          text: currentLanguage === 'sr' ? 'Kopirano!' : 'Copied!',
          className: 'bg-green-100 text-green-600'
        };
      default:
        return {
          icon: <Share2 className="h-5 w-5" />,
          text: currentLanguage === 'sr' ? 'Podeli' : 'Share',
          className: 'bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600'
        };
    }
  };

  const shareButtonContent = getShareButtonContent();

  // Handle dimension selection/deselection
  const handleDimensionClick = (dimension: ProductDimension) => {
    if (selectedDimension?.size === dimension.size) {
      // If clicking the same dimension, deselect it
      setSelectedDimension(null);
    } else {
      // Select the new dimension
      setSelectedDimension(dimension);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            {t('header.nav.home')}
          </Link>
          <span>/</span>
          <Link 
            to={`/${category}`} 
            className="hover:text-blue-600 transition-colors capitalize"
          >
            {t(`header.nav.${category}`)}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">
            {product.name[currentLanguage]}
          </span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(`/${category}`)}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to {category}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery with Carousel */}
          <div className="relative">
            {/* Product Badges - Positioned over the carousel */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.featured && (
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {t('products.featured')}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  -{discountPercentage}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="absolute top-4 right-4 z-10">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? t('products.inStock') : t('products.outOfStock')}
              </div>
            </div>

            <ImageCarousel
              images={allImages}
              currentLanguage={currentLanguage}
              selectedIndex={selectedImageIndex}
              onIndexChange={setSelectedImageIndex}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 flex-1 mr-4">
                  {product.name[currentLanguage]}
                </h1>
                <button
                  onClick={handleShare}
                  disabled={shareButtonState !== 'idle'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none ${shareButtonContent.className}`}
                  title={currentLanguage === 'sr' ? 'Podeli proizvod' : 'Share product'}
                >
                  {shareButtonContent.icon}
                  <span className="hidden sm:inline">
                    {shareButtonContent.text}
                  </span>
                </button>
              </div>
              
              <p className="text-blue-600 font-medium capitalize mb-4">
                {product.category.replace('-', ' ')}
              </p>
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              {selectedDimension ? (
                // Show specific dimension price
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-slate-800">
                      {formatPrice(selectedDimension.price.amount, selectedDimension.price.currency)}
                    </span>
                    {selectedDimension.price.originalAmount && (
                      <span className="text-xl text-slate-500 line-through">
                        {formatPrice(selectedDimension.price.originalAmount, selectedDimension.price.currency)}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">
                    {t('productDetail.dimensions')}: {selectedDimension.measurements}
                  </p>
                </>
              ) : (
                // Show price range
                <>
                  <div className="flex items-center gap-3 mb-2">
                    {minPrice === maxPrice ? (
                      <span className="text-3xl font-bold text-slate-800">
                        {formatPrice(minPrice, product.dimensions[0].price.currency)}
                      </span>
                    ) : (
                      <span className="text-3xl font-bold text-slate-800">
                        {formatPrice(minPrice, product.dimensions[0].price.currency)} - {formatPrice(maxPrice, product.dimensions[0].price.currency)}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">
                    {currentLanguage === 'sr' ? 'Cena zavisi od veličine' : 'Price depends on size'}
                  </p>
                </>
              )}
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {currentLanguage === 'sr' ? 'Izaberite veličinu' : 'Select Size'}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {product.dimensions.map((dimension, index) => (
                  <button
                    key={index}
                    onClick={() => handleDimensionClick(dimension)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-center hover:shadow-md ${
                      selectedDimension?.size === dimension.size
                        ? 'border-blue-600 bg-blue-50 shadow-md transform scale-105'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-slate-800 text-sm">{dimension.measurements}</div>
                    <div className="text-xs font-medium text-blue-600 mt-1">
                      {formatPrice(dimension.price.amount, dimension.price.currency)}
                    </div>
                    {dimension.price.originalAmount && (
                      <div className="text-xs text-slate-500 line-through">
                        {formatPrice(dimension.price.originalAmount, dimension.price.currency)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information - Split into Two Columns */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('productDetail.contactForPurchase')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Call Us Column */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-blue-600 text-white rounded-full p-3 flex-shrink-0">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-lg mb-1">{t('productDetail.callUs')}</p>
                    <p className="text-blue-600 font-bold text-lg">+381636621775</p>
                  </div>
                </div>
                
                {/* Email Us Column */}
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-600 text-white rounded-full p-3 flex-shrink-0">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-lg mb-1">{t('productDetail.emailUs')}</p>
                    <p className="text-green-600 font-bold text-lg">info@leader.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Description */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('productDetail.description')}</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                {product.description[currentLanguage]}
              </p>
            </div>

            <div className="border-t border-slate-200"></div>

            {/* Features */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">{t('productDetail.features')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features[currentLanguage].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200"></div>

            {/* Specifications */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">{t('productDetail.specifications')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b border-slate-100 pb-3">
                    <dt className="text-sm font-medium text-slate-500 capitalize mb-1">
                      {getSpecificationKey(key)}
                    </dt>
                    <dd className="text-slate-800">
                      {typeof value === 'object' && value !== null
                        ? typeof value[currentLanguage] === 'string'
                          ? value[currentLanguage]
                          : Array.isArray(value[currentLanguage])
                          ? value[currentLanguage].join(', ')
                          : JSON.stringify(value)
                        : Array.isArray(value)
                        ? value.join(', ')
                        : String(value)}
                    </dd>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200"></div>

            {/* Dimensions Table */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">{t('productDetail.availableSizesPricing')}</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-800">{t('productDetail.dimensions')}</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-800">{t('productDetail.price')}</th>
                      {hasAnyDiscount && (
                        <>
                          <th className="text-left py-3 px-4 font-semibold text-slate-800">{t('productDetail.originalPrice')}</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-800">{t('productDetail.savings')}</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {product.dimensions.map((dimension, index) => {
                      const savings = dimension.price.originalAmount 
                        ? dimension.price.originalAmount - dimension.price.amount 
                        : 0;
                      const savingsPercent = dimension.price.originalAmount 
                        ? Math.round((savings / dimension.price.originalAmount) * 100)
                        : 0;
                      
                      const isSelected = selectedDimension?.size === dimension.size;
                      
                      return (
                        <tr 
                          key={index} 
                          className={`border-b border-slate-100 transition-colors duration-200 ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className={`py-3 px-4 font-medium ${
                            isSelected ? 'text-blue-800' : 'text-slate-800'
                          }`}>
                            {dimension.measurements}
                            {isSelected && (
                              <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                {currentLanguage === 'sr' ? 'Izabrano' : 'Selected'}
                              </span>
                            )}
                          </td>
                          <td className={`py-3 px-4 font-semibold ${
                            isSelected ? 'text-blue-800' : 'text-slate-800'
                          }`}>
                            {formatPrice(dimension.price.amount, dimension.price.currency)}
                          </td>
                          {hasAnyDiscount && (
                            <>
                              <td className="py-3 px-4 text-slate-500">
                                {dimension.price.originalAmount 
                                  ? formatPrice(dimension.price.originalAmount, dimension.price.currency)
                                  : '—'
                                }
                              </td>
                              <td className="py-3 px-4">
                                {savings > 0 ? (
                                  <span className="text-green-600 font-medium">
                                    {formatPrice(savings, dimension.price.currency)} ({savingsPercent}%)
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
        title={product.name[currentLanguage]}
        description={product.shortDescription[currentLanguage]}
      />
    </div>
  );
};

export default ProductDetailPage;
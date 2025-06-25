import React from 'react';
import { Shield, Clock } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface ProductImage {
  path: string;
  alt: {
    en: string;
    sr: string;
  };
  order: number;
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
  coverImage: ProductImage;
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
  category: string;
  inStock: boolean;
  featured: boolean;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { currentLanguage, t } = useLanguage();
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product.id);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleViewDetails();
  };

  // Calculate price range from dimensions
  const prices = product.dimensions.map(dim => dim.price.amount);
  const originalPrices = product.dimensions.map(dim => dim.price.originalAmount).filter(Boolean);
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minOriginalPrice = originalPrices.length > 0 ? Math.min(...originalPrices) : null;
  const maxOriginalPrice = originalPrices.length > 0 ? Math.max(...originalPrices) : null;

  // Check if there's any discount
  const hasDiscount = originalPrices.length > 0;
  const maxDiscountPercentage = hasDiscount && minOriginalPrice 
    ? Math.round(((minOriginalPrice - minPrice) / minOriginalPrice) * 100)
    : 0;

  // Format currency based on the product's currency
  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'RSD') {
      return `${amount.toLocaleString()} RSD`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      {/* Image Container - Now Clickable */}
      <div 
        className="relative overflow-hidden cursor-pointer"
        onClick={handleImageClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleViewDetails();
          }
        }}
        aria-label={`View details for ${product.name[currentLanguage]}`}
      >
        <img
          src={product.coverImage.path}
          alt={product.coverImage.alt[currentLanguage]}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            {t('products.viewDetails')}
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              {t('products.featured')}
            </span>
          )}
          {hasDiscount && maxDiscountPercentage > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              -{maxDiscountPercentage}%
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            product.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? t('products.inStock') : t('products.outOfStock')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Category */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-2">
            {product.name[currentLanguage]}
          </h3>
          <p className="text-sm text-blue-600 font-medium capitalize">
            {product.category.replace('-', ' ')}
          </p>
        </div>

        {/* Short Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {product.shortDescription[currentLanguage]}
        </p>

        {/* Available Sizes */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-2 font-medium">Available Sizes:</p>
          <div className="flex flex-wrap gap-1">
            {product.dimensions.slice(0, 4).map((dimension, index) => (
              <span
                key={index}
                className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-medium"
              >
                {dimension.measurements}
              </span>
            ))}
            {product.dimensions.length > 4 && (
              <span className="text-slate-500 text-xs px-2 py-1">
                +{product.dimensions.length - 4} {t('products.more')}
              </span>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>{t('products.warranty')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Sleep Trial</span>
          </div>
        </div>

        {/* Price Range */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {minPrice === maxPrice ? (
                <span className="text-2xl font-bold text-slate-800">
                  {formatPrice(minPrice, product.dimensions[0].price.currency)}
                </span>
              ) : (
                <span className="text-2xl font-bold text-slate-800">
                  {formatPrice(minPrice, product.dimensions[0].price.currency)} - {formatPrice(maxPrice, product.dimensions[0].price.currency)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-2">
                {minOriginalPrice === maxOriginalPrice ? (
                  <span className="text-sm text-slate-500 line-through">
                    {formatPrice(minOriginalPrice!, product.dimensions[0].price.currency)}
                  </span>
                ) : (
                  <span className="text-sm text-slate-500 line-through">
                    {formatPrice(minOriginalPrice!, product.dimensions[0].price.currency)} - {formatPrice(maxOriginalPrice!, product.dimensions[0].price.currency)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewDetails}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          {t('products.viewDetails')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
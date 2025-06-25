import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import ProductCard from './ProductCard';

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

interface ProductGridProps {
  products: Product[];
  title: string;
  subtitle?: string;
  onProductSelect?: (productId: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  title, 
  subtitle,
  onProductSelect 
}) => {
  const { t, currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);

  // Category translations
  const categoryTranslations: { [key: string]: { en: string; sr: string } } = {
    'memory-foam': { en: 'Memory Foam', sr: 'Memorijska pena' },
    'hybrid': { en: 'Hybrid', sr: 'Hibridni' },
    'latex': { en: 'Latex', sr: 'Lateks' },
    'spring': { en: 'Spring', sr: 'Opružni' },
    'platform': { en: 'Platform', sr: 'Platform' },
    'upholstered': { en: 'Upholstered', sr: 'Tapaciran' },
    'storage': { en: 'Storage', sr: 'Sa skladištem' },
    'pillow': { en: 'Pillow', sr: 'Jastuk' }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Get translated category name
  const getCategoryName = (category: string) => {
    return categoryTranslations[category]?.[currentLanguage] || 
           category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.name.sr.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      // Check if any dimension price falls within the range
      const matchesPrice = product.dimensions.some(dim => 
        dim.price.amount >= priceRange[0] && dim.price.amount <= priceRange[1]
      );
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'default':
          // Sort by order from JSON (this is the original order)
          return a.order - b.order;
        case 'popularity':
          // Sort by featured first, then by order
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.order - b.order;
        case 'name-az':
          return a.name[currentLanguage].localeCompare(b.name[currentLanguage]);
        case 'name-za':
          return b.name[currentLanguage].localeCompare(a.name[currentLanguage]);
        case 'price-low':
          const minPriceA = Math.min(...a.dimensions.map(d => d.price.amount));
          const minPriceB = Math.min(...b.dimensions.map(d => d.price.amount));
          return minPriceA - minPriceB;
        case 'price-high':
          const maxPriceA = Math.max(...a.dimensions.map(d => d.price.amount));
          const maxPriceB = Math.max(...b.dimensions.map(d => d.price.amount));
          return maxPriceB - maxPriceA;
        default:
          return a.order - b.order;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, priceRange, currentLanguage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mt-6"></div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="all">{t('products.allCategories')}</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryName(category)}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="default">{currentLanguage === 'sr' ? 'Podrazumevano' : 'Default Order'}</option>
            <option value="popularity">{t('products.sortPopularity')}</option>
            <option value="name-az">{t('products.sortNameAZ')}</option>
            <option value="name-za">{t('products.sortNameZA')}</option>
            <option value="price-low">{t('products.sortPriceLow')}</option>
            <option value="price-high">{t('products.sortPriceHigh')}</option>
          </select>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors duration-200"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {t('products.filters')}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('products.priceRange')}: {priceRange[0].toLocaleString()} RSD - {priceRange[1].toLocaleString()} RSD
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-8">
        <p className="text-slate-600">
          {t('products.showingResults', { count: filteredProducts.length, total: products.length })}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onProductSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {t('products.noResults')}
          </h3>
          <p className="text-slate-600">
            {t('products.noResultsDescription')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
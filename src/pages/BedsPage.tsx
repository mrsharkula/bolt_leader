import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { useLanguage } from '../hooks/useLanguage';
import { useScrollPosition } from '../hooks/useScrollPosition';
import bedsData from '../data/beds.json';

const BedsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Use scroll position restoration for this page
  useScrollPosition('beds-page');

  const handleProductSelect = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ProductGrid
        products={bedsData.beds}
        title={t('pages.beds.title')}
        subtitle={t('pages.beds.subtitle')}
        onProductSelect={handleProductSelect}
      />
    </div>
  );
};

export default BedsPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { useLanguage } from '../hooks/useLanguage';
import { useScrollPosition } from '../hooks/useScrollPosition';
import mattressesData from '../data/mattresses.json';

const MattressesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Use scroll position restoration for this page
  useScrollPosition('mattresses-page');

  const handleProductSelect = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ProductGrid
        products={mattressesData.mattresses}
        title={t('pages.mattresses.title')}
        subtitle={t('pages.mattresses.subtitle')}
        onProductSelect={handleProductSelect}
      />
    </div>
  );
};

export default MattressesPage;
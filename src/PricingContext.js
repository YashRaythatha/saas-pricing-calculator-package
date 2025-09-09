import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRICING_CONFIG } from './pricing-config';

const PricingContext = createContext();

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};

export const PricingProvider = ({ children }) => {
  const [pricingData, setPricingData] = useState(PRICING_CONFIG);

  // Load pricing data from localStorage on mount
  useEffect(() => {
    const savedPricing = localStorage.getItem('pricingData');
    if (savedPricing) {
      try {
        setPricingData(JSON.parse(savedPricing));
      } catch (error) {
        console.error('Error loading saved pricing data:', error);
      }
    }
  }, []);

  // Save pricing data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pricingData', JSON.stringify(pricingData));
  }, [pricingData]);

  const updatePricing = (newPricingData) => {
    setPricingData(newPricingData);
  };

  const resetToDefault = () => {
    setPricingData(PRICING_CONFIG);
  };

  const value = {
    pricingData,
    updatePricing,
    resetToDefault,
  };

  return (
    <PricingContext.Provider value={value}>
      {children}
    </PricingContext.Provider>
  );
};


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PricingProvider } from './PricingContext';
import { LabsProvider } from './LabsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PricingProvider>
      <LabsProvider>
        <App />
      </LabsProvider>
    </PricingProvider>
  </React.StrictMode>
);




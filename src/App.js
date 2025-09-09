import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SaasPricingCalculator from './SaasPricingCalculator';
import ContactSales from './ContactSales';
import Labs from './Labs';
import AdminPanel from './AdminPanel';
import LabsAdminPanel from './LabsAdminPanel';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SaasPricingCalculator />} />
        <Route path="/contact-sales" element={<ContactSales />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/labs-admin" element={
          <ProtectedRoute>
            <LabsAdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

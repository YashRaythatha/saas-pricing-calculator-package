import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { PRICING_CONFIG } from './pricing-config';
import { usePricing } from './PricingContext';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { pricingData, updatePricing, resetToDefault } = usePricing();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated');
    navigate('/');
  };

  // Handle Excel file import
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Parse the Excel data and update pricing
        const updatedPricing = parseExcelData(jsonData);
        if (updatedPricing) {
          updatePricing(updatedPricing);
          setMessage('Pricing updated successfully from Excel file!');
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (error) {
        setMessage('Error reading Excel file. Please check the format.');
        setTimeout(() => setMessage(''), 3000);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Parse Excel data and return updated pricing config
  const parseExcelData = (data) => {
    try {
      const updatedConfig = { ...PRICING_CONFIG };
      
      // Expected Excel format:
      // Row 1: Headers
      // Row 2+: Plan data
      const headers = data[0];
      const planData = data.slice(1);

      planData.forEach((row, index) => {
        if (row.length >= 6) {
          const planKey = row[0]?.toLowerCase();
          const planName = row[1];
          const validityDays = parseInt(row[2]);
          const maxUsers = parseInt(row[3]);
          const platformPerSeat = parseFloat(row[4]);
          const labPerSeat = parseFloat(row[5]);

          if (planKey && updatedConfig.plans[planKey]) {
            updatedConfig.plans[planKey] = {
              ...updatedConfig.plans[planKey],
              name: planName || updatedConfig.plans[planKey].name,
              validityDays: validityDays || updatedConfig.plans[planKey].validityDays,
              maxUsers: maxUsers || updatedConfig.plans[planKey].maxUsers,
              platformPerSeat: platformPerSeat || updatedConfig.plans[planKey].platformPerSeat,
              labPerSeat: labPerSeat || updatedConfig.plans[planKey].labPerSeat,
            };
          }
        }
      });

      return updatedConfig;
    } catch (error) {
      console.error('Error parsing Excel data:', error);
      return null;
    }
  };

  // Generate Excel template
  const generateTemplate = () => {
    const templateData = [
      ['Plan Key', 'Plan Name', 'Validity Days', 'Max Users', 'Platform Per Seat', 'Lab Per Seat'],
      ['free', 'Free Trial', 30, 10, 0, 0],
      ['basic', 'Basic Plan', 45, 2000, 125, 75],
      ['medium', 'Premium Plan', 45, 5000, 100, 125],
      ['enterprise', 'Enterprise Plan', 60, 10000, 75, 150]
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pricing');
    
    // Auto-size columns
    const colWidths = [
      { wch: 12 }, // Plan Key
      { wch: 15 }, // Plan Name
      { wch: 12 }, // Validity Days
      { wch: 10 }, // Max Users
      { wch: 18 }, // Platform Per Seat
      { wch: 15 }  // Lab Per Seat
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'pricing_template.xlsx');
  };

  // Manual pricing update
  const updatePlanPricing = (planKey, field, value) => {
    const updatedPricing = {
      ...pricingData,
      plans: {
        ...pricingData.plans,
        [planKey]: {
          ...pricingData.plans[planKey],
          [field]: value
        }
      }
    };
    updatePricing(updatedPricing);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition"
              >
                ← Back to Calculator
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Admin Panel - Pricing Management</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isEditing 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Pricing'}
              </button>
              <button
                onClick={generateTemplate}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
              >
                Download Template
              </button>
              <button
                onClick={() => {
                  resetToDefault();
                  setMessage('Pricing reset to default values!');
                  setTimeout(() => setMessage(''), 3000);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Reset to Default
              </button>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {/* Excel Import Section */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Import from Excel</h2>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
              >
                Choose Excel File
              </button>
              <span className="text-sm text-gray-600">
                Upload an Excel file with updated pricing data
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>Expected format: Plan Key | Plan Name | Validity Days | Max Users | Platform Per Seat | Lab Per Seat</p>
            </div>
          </div>

          {/* Current Pricing Display */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Current Pricing Configuration</h2>
            
            {Object.entries(pricingData.plans).map(([key, plan]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                    {key}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validity Days
                    </label>
                    <input
                      type="number"
                      value={plan.validityDays}
                      onChange={(e) => updatePlanPricing(key, 'validityDays', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Users
                    </label>
                    <input
                      type="number"
                      value={plan.maxUsers}
                      onChange={(e) => updatePlanPricing(key, 'maxUsers', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Per Seat ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={plan.platformPerSeat}
                      onChange={(e) => updatePlanPricing(key, 'platformPerSeat', parseFloat(e.target.value))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lab Per Seat ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={plan.labPerSeat}
                      onChange={(e) => updatePlanPricing(key, 'labPerSeat', parseFloat(e.target.value))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Agent Pricing */}
          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Agent Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Agent Per Seat ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pricingData.optionalFeatures.aiAgent.perSeat}
                  onChange={(e) => {
                    const updatedPricing = {
                      ...pricingData,
                      optionalFeatures: {
                        ...pricingData.optionalFeatures,
                        aiAgent: {
                          ...pricingData.optionalFeatures.aiAgent,
                          perSeat: parseFloat(e.target.value)
                        }
                      }
                    };
                    updatePricing(updatedPricing);
                  }}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Managed Services Per Seat ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pricingData.optionalFeatures.managedServices.perSeat}
                  onChange={(e) => {
                    const updatedPricing = {
                      ...pricingData,
                      optionalFeatures: {
                        ...pricingData.optionalFeatures,
                        managedServices: {
                          ...pricingData.optionalFeatures.managedServices,
                          perSeat: parseFloat(e.target.value)
                        }
                      }
                    };
                    updatePricing(updatedPricing);
                  }}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  // Here you would typically save to a backend or local storage
                  setMessage('Pricing changes saved successfully!');
                  setTimeout(() => setMessage(''), 3000);
                  setIsEditing(false);
                }}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

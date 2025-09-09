import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { LABS_CONFIG } from './labs-config';
import { useLabs } from './LabsContext';

const LabsAdminPanel = () => {
  const navigate = useNavigate();
  const { labsData, updateLabs, addLab, updateLab, deleteLab, resetToDefault } = useLabs();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [editingLab, setEditingLab] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
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

        // Parse the Excel data and update labs
        const updatedLabs = parseExcelData(jsonData);
        if (updatedLabs) {
          updateLabs(updatedLabs);
          setMessage('Labs updated successfully from Excel file!');
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (error) {
        setMessage('Error reading Excel file. Please check the format.');
        setTimeout(() => setMessage(''), 3000);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Parse Excel data and return updated labs config
  const parseExcelData = (data) => {
    try {
      const updatedConfig = { ...LABS_CONFIG };
      
      // Expected Excel format:
      // Row 1: Headers
      // Row 2+: Lab data
      const headers = data[0];
      const labData = data.slice(1);

      const newLabs = labData.map((row, index) => {
        if (row.length >= 5) {
          return {
            id: index + 1,
            name: row[0] || `Lab ${index + 1}`,
            description: row[1] || '',
            cost: row[2] || '$0.00/hour',
            status: row[3] || 'Available',
            features: row[4] ? row[4].split(',').map(f => f.trim()) : []
          };
        }
        return null;
      }).filter(lab => lab !== null);

      updatedConfig.labs = newLabs;
      return updatedConfig;
    } catch (error) {
      console.error('Error parsing Excel data:', error);
      return null;
    }
  };

  // Generate Excel template
  const generateTemplate = () => {
    const templateData = [
      ['Lab Name', 'Description', 'Cost', 'Status', 'Features (comma-separated)'],
      ['AI Research Lab', 'Advanced AI research environment', '$0.50/hour', 'Available', 'GPU Clusters, ML Frameworks, Data Processing'],
      ['Data Analytics Lab', 'Data analysis and visualization', '$0.30/hour', 'Available', 'Big Data Processing, Visualization Tools'],
      ['Security Testing Lab', 'Security testing environment', '$0.40/hour', 'Available', 'Penetration Testing, Vulnerability Scanning']
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Labs');
    
    // Auto-size columns
    const colWidths = [
      { wch: 20 }, // Lab Name
      { wch: 40 }, // Description
      { wch: 15 }, // Cost
      { wch: 12 }, // Status
      { wch: 50 }  // Features
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'labs_template.xlsx');
  };

  // Handle lab form submission
  const handleLabSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const labData = {
      name: formData.get('name'),
      description: formData.get('description'),
      cost: formData.get('cost'),
      status: formData.get('status'),
      features: formData.get('features').split(',').map(f => f.trim()).filter(f => f)
    };

    if (editingLab) {
      updateLab(editingLab.id, labData);
      setMessage('Lab updated successfully!');
    } else {
      addLab(labData);
      setMessage('Lab added successfully!');
    }

    setEditingLab(null);
    setShowAddForm(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition"
              >
                ← Back to Calculator
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Labs Admin Panel</h1>
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
                {isEditing ? 'Cancel Edit' : 'Edit Labs'}
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
              >
                Add New Lab
              </button>
              <button
                onClick={generateTemplate}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition"
              >
                Download Template
              </button>
              <button
                onClick={() => {
                  resetToDefault();
                  setMessage('Labs reset to default values!');
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
                Upload an Excel file with updated labs data
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>Expected format: Lab Name | Description | Cost | Status | Features (comma-separated)</p>
            </div>
          </div>

          {/* Add/Edit Lab Form */}
          {(showAddForm || editingLab) && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editingLab ? 'Edit Lab' : 'Add New Lab'}
              </h2>
              <form onSubmit={handleLabSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lab Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingLab?.name || ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost
                    </label>
                    <input
                      type="text"
                      name="cost"
                      defaultValue={editingLab?.cost || ''}
                      placeholder="$0.00/hour"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingLab?.description || ''}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={editingLab?.status || 'Available'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Features (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="features"
                      defaultValue={editingLab?.features?.join(', ') || ''}
                      placeholder="Feature 1, Feature 2, Feature 3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
                  >
                    {editingLab ? 'Update Lab' : 'Add Lab'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLab(null);
                      setShowAddForm(false);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Labs List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Current Labs ({labsData.labs.length})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labsData.labs.map((lab) => (
                <div key={lab.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{lab.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-600">{lab.cost}</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-sm text-slate-600">{lab.status}</span>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingLab(lab)}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this lab?')) {
                              deleteLab(lab.id);
                              setMessage('Lab deleted successfully!');
                              setTimeout(() => setMessage(''), 3000);
                            }
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{lab.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {lab.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabsAdminPanel;


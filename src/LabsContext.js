import React, { createContext, useContext, useState, useEffect } from 'react';
import { LABS_CONFIG } from './labs-config';

// Create the Labs Context
const LabsContext = createContext();

// Custom hook to use the Labs Context
export const useLabs = () => {
  const context = useContext(LabsContext);
  if (!context) {
    throw new Error('useLabs must be used within a LabsProvider');
  }
  return context;
};

// Labs Provider Component
export const LabsProvider = ({ children }) => {
  const [labsData, setLabsData] = useState(LABS_CONFIG);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLabs = localStorage.getItem('hackathon-labs-data');
    if (savedLabs) {
      try {
        const parsedData = JSON.parse(savedLabs);
        setLabsData(parsedData);
      } catch (error) {
        console.error('Error parsing saved labs data:', error);
        // Keep default data if parsing fails
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hackathon-labs-data', JSON.stringify(labsData));
  }, [labsData]);

  // Update all labs data
  const updateLabs = (newLabsData) => {
    setLabsData(newLabsData);
  };

  // Add a new lab
  const addLab = (labData) => {
    const newLab = {
      id: Math.max(...labsData.labs.map(lab => lab.id)) + 1,
      ...labData
    };
    setLabsData(prev => ({
      ...prev,
      labs: [...prev.labs, newLab]
    }));
  };

  // Update a specific lab
  const updateLab = (labId, updatedLabData) => {
    setLabsData(prev => ({
      ...prev,
      labs: prev.labs.map(lab => 
        lab.id === labId ? { ...lab, ...updatedLabData } : lab
      )
    }));
  };

  // Delete a lab
  const deleteLab = (labId) => {
    setLabsData(prev => ({
      ...prev,
      labs: prev.labs.filter(lab => lab.id !== labId)
    }));
  };

  // Reset to default configuration
  const resetToDefault = () => {
    setLabsData(LABS_CONFIG);
  };

  // Get labs by status
  const getLabsByStatus = (status) => {
    return labsData.labs.filter(lab => lab.status === status);
  };

  // Get available labs count
  const getAvailableLabsCount = () => {
    return getLabsByStatus('Available').length;
  };

  const value = {
    labsData,
    updateLabs,
    addLab,
    updateLab,
    deleteLab,
    resetToDefault,
    getLabsByStatus,
    getAvailableLabsCount
  };

  return (
    <LabsContext.Provider value={value}>
      {children}
    </LabsContext.Provider>
  );
};

export default LabsContext;

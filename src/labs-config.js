// Labs Configuration
// Edit this file to update lab offerings - changes will automatically reflect in the labs page
// Last updated: 2024

export const LABS_CONFIG = {
  // Lab environments data
  labs: [
    {
      id: 1,
      name: "AI Research Lab",
      description: "Advanced artificial intelligence research and development environment with GPU clusters and ML frameworks.",
      cost: "$0.50/hour",
      status: "Available",
      features: ["GPU Clusters", "ML Frameworks", "Data Processing", "Model Training"]
    },
    {
      id: 2,
      name: "Data Analytics Lab",
      description: "Comprehensive data analysis and visualization environment with big data processing capabilities.",
      cost: "$0.30/hour",
      status: "Available",
      features: ["Big Data Processing", "Visualization Tools", "Statistical Analysis", "Real-time Analytics"]
    },
    {
      id: 3,
      name: "Security Testing Lab",
      description: "Dedicated environment for security testing, penetration testing, and vulnerability assessment.",
      cost: "$0.40/hour",
      status: "Available",
      features: ["Penetration Testing", "Vulnerability Scanning", "Security Monitoring", "Compliance Testing"]
    },
    {
      id: 4,
      name: "Development Lab",
      description: "Full-stack development environment with CI/CD pipelines and deployment tools.",
      cost: "$0.25/hour",
      status: "Available",
      features: ["CI/CD Pipelines", "Container Orchestration", "Code Repositories", "Testing Frameworks"]
    },
    {
      id: 5,
      name: "Blockchain Lab",
      description: "Blockchain development and testing environment with smart contract deployment capabilities.",
      cost: "$0.60/hour",
      status: "Available",
      features: ["Smart Contracts", "Blockchain Networks", "Cryptocurrency Testing", "DeFi Protocols"]
    },
    {
      id: 6,
      name: "IoT Simulation Lab",
      description: "Internet of Things device simulation and testing environment for connected devices.",
      cost: "$0.35/hour",
      status: "Available",
      features: ["Device Simulation", "Network Testing", "Protocol Analysis", "Performance Monitoring"]
    },
    {
      id: 7,
      name: "Cloud Migration Lab",
      description: "Environment for testing and validating cloud migration strategies and tools.",
      cost: "$0.45/hour",
      status: "Available",
      features: ["Migration Tools", "Cloud Platforms", "Performance Testing", "Cost Optimization"]
    },
    {
      id: 8,
      name: "Mobile Testing Lab",
      description: "Comprehensive mobile application testing environment with device emulation.",
      cost: "$0.20/hour",
      status: "Available",
      features: ["Device Emulation", "Cross-platform Testing", "Performance Testing", "User Experience Testing"]
    }
  ],

  // Page configuration
  pageConfig: {
    title: "Available Labs",
    subtitle: "Choose from our comprehensive selection of specialized lab environments",
    customLabTitle: "Need a Custom Lab Environment?",
    customLabDescription: "We can create specialized lab environments tailored to your specific requirements and use cases.",
    customLabButtonText: "Contact Sales Team"
  }
};

// Helper function to get all labs
export const getAllLabs = () => LABS_CONFIG.labs;

// Helper function to get labs by status
export const getLabsByStatus = (status) => LABS_CONFIG.labs.filter(lab => lab.status === status);

// Helper function to get page config
export const getPageConfig = () => LABS_CONFIG.pageConfig;


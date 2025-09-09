// Hackathon Pricing Configuration
// Edit this file to update pricing - changes will automatically reflect in the calculator
// Last updated: 2024

export const PRICING_CONFIG = {
  // Plan configurations
  plans: {
    free: {
      key: "free",
      name: "Free Trial",
      validityDays: 30,
      maxUsers: 10,
      platformPerSeat: 0,
      labPerSeat: 0
    },
    basic: {
      key: "basic",
      name: "Basic Plan",
      validityDays: 45,
      maxUsers: 2000,
      platformPerSeat: 125,
      labPerSeat: 75
    },
    medium: {
      key: "medium",
      name: "Premium Plan",
      validityDays: 45,
      maxUsers: 5000,
      platformPerSeat: 100,
      labPerSeat: 125
    },
    enterprise: {
      key: "enterprise",
      name: "Enterprise Plan",
      validityDays: 60,
      maxUsers: 10000,
      unlimited: true,
      platformPerSeat: 75,
      labPerSeat: 150
    }
  },

  // Addon configurations
  addons: [
    {
      key: "m365",
      name: "M365 Copilot",
      perSeat: 0,
      enabled: false
    },
    {
      key: "d365",
      name: "D365 License",
      perSeat: 150,
      enabled: false
    },
    {
      key: "security",
      name: "Security Copilot",
      perSeat: 265,
      enabled: false
    },
    {
      key: "studio",
      name: "Copilot Studio",
      perSeat: 250,
      enabled: false
    },
    {
      key: "fabric",
      name: "Fabric Service",
      perSeat: 0,
      enabled: false
    },
    {
      key: "azurevmw",
      name: "Azure VMWare",
      perSeat: 0,
      enabled: false
    },
    {
      key: "ghcopilot",
      name: "GitHub Copilot",
      perSeat: 0,
      enabled: false
    }
  ],

  // Optional features pricing
  optionalFeatures: {
    aiAgent: {
      name: "AI Agent",
      perSeat: 70
    },
    managedServices: {
      name: "Managed Services",
      perSeat: 0
    }
  },

  // AI Agent core features
  aiAgentFeatures: [
    "Agentic Scoring",
    "Idea Generator",
    "Synthetic Data Creation",
    "AI Mentor"
  ],

  // UI Configuration
  ui: {
    accentColor: "#3B82F6",      // Modern blue (like the post buttons)
    accentColorDark: "#1D4ED8",  // Darker blue
    accentCyan: "#0EA5E9",       // Light blue accent
    primaryGradient: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 25%, #7DD3FC 50%, #38BDF8 75%, #0EA5E9 100%)",
    backgroundGradient: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 25%, #BAE6FD 50%, #7DD3FC 75%, #38BDF8 100%)"
  }
};

// Helper function to get plan by key
export const getPlan = (planKey) => PRICING_CONFIG.plans[planKey];

// Helper function to get all plans
export const getAllPlans = () => Object.values(PRICING_CONFIG.plans);

// Helper function to get paid plans only
export const getPaidPlans = () => Object.values(PRICING_CONFIG.plans).filter(plan => plan.key !== 'free');

// Helper function to get addons
export const getAddons = () => PRICING_CONFIG.addons;

// Helper function to get optional features
export const getOptionalFeatures = () => PRICING_CONFIG.optionalFeatures;

// Helper function to get AI Agent features
export const getAiAgentFeatures = () => PRICING_CONFIG.aiAgentFeatures;

# SaaS Pricing Calculator - Client Integration Package

A professional, feature-rich pricing calculator component for React applications with Tailwind CSS styling.

## 🚀 Quick Start

### Option 1: Drop-in Component (Recommended)
Copy `SaasPricingCalculator.jsx` into your React project and import it:

```jsx
import SaasPricingCalculator from './components/SaasPricingCalculator';

function App() {
  return (
    <div>
      <SaasPricingCalculator />
    </div>
  );
}
```

### Option 2: Embedded in Existing Page
```jsx
import SaasPricingCalculator from './components/SaasPricingCalculator';

function PricingPage() {
  return (
    <div className="your-existing-layout">
      <h1>Our Pricing</h1>
      <SaasPricingCalculator />
    </div>
  );
}
```

## 📦 Dependencies

### Required Dependencies
```bash
npm install react react-dom
```

### Required Dev Dependencies (for Tailwind CSS)
```bash
npm install -D tailwindcss postcss autoprefixer
```

## 🎨 Styling Setup

### 1. Initialize Tailwind CSS
```bash
npx tailwindcss init -p
```

### 2. Configure `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. Add Tailwind directives to your CSS
```css
/* In your main CSS file (e.g., src/index.css) */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🔧 Configuration

### Customizing Pricing Data
Edit the constants in `SaasPricingCalculator.jsx`:

```javascript
const PLANS = {
  free: { 
    key: "free", 
    name: "Free Trial", 
    validityDays: 30, 
    maxUsers: 10, 
    platformPerSeat: 0, 
    labPerSeat: 0 
  },
  // Add your custom plans...
};

const DEFAULT_ADDONS = [
  { key: "addon1", name: "Custom Addon", perSeat: 100, enabled: false },
  // Add your custom add-ons...
];
```

### Customizing Colors
Update the `ACCENT` object:
```javascript
const ACCENT = { 
  primary: "#7C3AED",      // Main purple
  primaryDark: "#5B21B6",  // Darker purple
  cyan: "#7dd3fc"          // Accent cyan
};
```

## 🎯 Features

- **Dual Pricing Models**: Freemium vs Tiered Pricing
- **4 Pricing Tiers**: Free Trial, Basic, Medium, Enterprise
- **Lab Usage Toggle**: Separate platform and lab costs
- **Optional Features**: AI Agent and Managed Services
- **7 Pre-configured Add-ons**: Including D365, Security Copilot, etc.
- **Real-time Calculations**: Instant cost updates
- **Export to PDF**: Print functionality for quotes
- **Responsive Design**: Works on all screen sizes
- **Professional UI**: Purple gradient theme with glassmorphism

## 🔌 Integration Examples

### With Next.js
```jsx
// pages/pricing.js or app/pricing/page.js
import SaasPricingCalculator from '../components/SaasPricingCalculator';

export default function PricingPage() {
  return <SaasPricingCalculator />;
}
```

### With Create React App
```jsx
// src/App.js
import SaasPricingCalculator from './components/SaasPricingCalculator';

function App() {
  return (
    <div className="App">
      <SaasPricingCalculator />
    </div>
  );
}
```

### As Modal/Popup
```jsx
import { useState } from 'react';
import SaasPricingCalculator from './components/SaasPricingCalculator';

function PricingModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Pricing Calculator
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="max-h-screen overflow-auto">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 text-white"
            >
              ✕
            </button>
            <SaasPricingCalculator />
          </div>
        </div>
      )}
    </>
  );
}
```

## 🎨 Customization Options

### Remove Background Gradient
Replace the inline style in the main div:
```jsx
<div className="min-h-screen p-6 bg-slate-900" style={{ color: "#e5e7eb" }}>
```

### Custom Container Width
Modify the max-width classes:
```jsx
<main className="mx-auto grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-3">
```

### Hide Specific Features
```jsx
// Hide the tabs (always show paid plans)
// Remove or comment out: <Tabs active={activeTab} onChange={setActiveTab} />

// Hide optional features section
// Remove the entire "Optional features" div

// Hide add-ons section
// Remove the entire "Add-ons" div
```

## 📱 Mobile Responsiveness

The component is fully responsive and includes:
- Collapsible sections on mobile
- Touch-friendly controls
- Optimized layout for small screens
- Readable typography at all sizes

## 🔒 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 File Structure

```
your-project/
├── src/
│   ├── components/
│   │   └── SaasPricingCalculator.jsx  # Main component
│   ├── index.css                      # Tailwind imports
│   └── App.js                         # Your app
├── tailwind.config.js                 # Tailwind config
├── postcss.config.js                  # PostCSS config
└── package.json                       # Dependencies
```

## 🛠️ Troubleshooting

### Styles not loading
- Ensure Tailwind CSS is properly configured
- Check that your build process includes PostCSS
- Verify the content paths in `tailwind.config.js`

### Component not rendering
- Check React version compatibility (18+)
- Ensure all dependencies are installed
- Verify the import path is correct

### Print functionality not working
- The component includes print-specific CSS
- Ensure the browser allows printing
- The quote section (#quote) will be isolated when printing

## 📞 Support

For integration support or customization requests, contact your development team with:
- Browser console errors (if any)
- Your current React/Next.js version
- Specific customization requirements

## 📝 License

This component is provided for client integration. Modify as needed for your specific use case.

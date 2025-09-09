import React from 'react';
import { useNavigate } from 'react-router-dom';

const Labs = () => {
  const navigate = useNavigate();

  const labs = [
    {
      id: 1,
      name: "Data Science Lab",
      description: "Advanced analytics and machine learning environment with Jupyter notebooks, R Studio, and Python libraries.",
      features: ["Jupyter Notebooks", "R Studio", "Python 3.9+", "TensorFlow", "PyTorch", "Scikit-learn"],
      pricing: "Usage-based pricing + 2% service charges"
    },
    {
      id: 2,
      name: "AI Development Lab",
      description: "Specialized environment for AI model development, training, and deployment with GPU acceleration.",
      features: ["GPU Acceleration", "MLflow", "Kubeflow", "Docker", "Kubernetes", "Model Registry"],
      pricing: "Usage-based pricing + 2% service charges"
    },
    {
      id: 3,
      name: "Security Testing Lab",
      description: "Comprehensive security testing environment with penetration testing tools and vulnerability scanners.",
      features: ["OWASP ZAP", "Nessus", "Metasploit", "Burp Suite", "Nmap", "Wireshark"],
      pricing: "Usage-based pricing + 2% service charges"
    },
    {
      id: 4,
      name: "Cloud Infrastructure Lab",
      description: "Multi-cloud environment for testing and deploying applications across AWS, Azure, and GCP.",
      features: ["AWS Integration", "Azure Integration", "GCP Integration", "Terraform", "Ansible", "Kubernetes"],
      pricing: "Usage-based pricing + 2% service charges"
    },
    {
      id: 5,
      name: "DevOps Lab",
      description: "Complete CI/CD pipeline environment with automated testing, deployment, and monitoring tools.",
      features: ["Jenkins", "GitLab CI", "Docker", "Kubernetes", "Prometheus", "Grafana"],
      pricing: "Usage-based pricing + 2% service charges"
    },
    {
      id: 6,
      name: "Blockchain Lab",
      description: "Development environment for blockchain applications with smart contract testing and deployment.",
      features: ["Ethereum", "Hyperledger", "Solidity", "Web3.js", "Truffle", "Ganache"],
      pricing: "Usage-based pricing + 2% service charges"
    }
  ];

  return (
    <div className="min-h-screen p-6" style={{
      background: "radial-gradient(800px 500px at 65% 60%, rgba(59,130,246,0.15), transparent 60%), linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 25%, #BAE6FD 50%, #7DD3FC 75%, #38BDF8 100%)",
      color: "#1E293B",
    }}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Pricing Calculator
          </button>
          <h1 className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-4xl font-extrabold text-transparent">
            Available Labs
          </h1>
          <p className="text-slate-600 mt-4 text-lg">
            Explore our comprehensive lab environments designed for modern development and testing needs.
          </p>
        </header>

        {/* Pricing Note */}
        <div className="mb-8 rounded-2xl border border-blue-200/30 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Lab Pricing</h3>
              <p className="text-slate-600">
                All labs are priced based on actual usage with a 2% service charge. You only pay for what you use, 
                making it cost-effective for both small projects and large-scale development.
              </p>
            </div>
          </div>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <div key={lab.id} className="rounded-2xl border border-blue-200/30 bg-white/80 p-6 shadow-sm backdrop-blur hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{lab.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{lab.description}</p>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {lab.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-blue-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Pricing:</span>
                  <span className="text-sm font-medium text-slate-800">{lab.pricing}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 rounded-2xl border border-blue-200/30 bg-white/80 p-8 shadow-sm backdrop-blur text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready to Get Started?</h2>
          <p className="text-slate-600 mb-6">
            Choose your plan and start using our labs today. All labs are available with any paid subscription.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            View Pricing Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default Labs;

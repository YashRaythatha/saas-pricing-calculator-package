import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactSales = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    businessEmail: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your interest! Our sales team will contact you soon.');
    navigate('/');
  };

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
            Contact Our Sales Team
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-blue-200/30 bg-white/80 p-8 shadow-sm backdrop-blur">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Why Choose Our Platform?</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Enterprise-Grade Security</h3>
                    <p className="text-slate-600">Bank-level encryption and compliance with industry standards to keep your data secure.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                      <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">24/7 Expert Support</h3>
                    <p className="text-slate-600">Dedicated support team available around the clock to help you succeed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Custom Solutions</h3>
                    <p className="text-slate-600">Tailored implementations that fit your specific business needs and workflows.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trusted Companies */}
            <div className="rounded-2xl border border-blue-200/30 bg-white/80 p-8 shadow-sm backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Trusted by Leading Companies</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600 font-semibold">Microsoft</span>
                </div>
                <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600 font-semibold">Google</span>
                </div>
                <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600 font-semibold">Amazon</span>
                </div>
                <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600 font-semibold">Salesforce</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="rounded-2xl border border-blue-200/30 bg-white/80 p-8 shadow-sm backdrop-blur">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Get Started Today</h2>
            <p className="text-slate-600 mb-8">Fill out the form below and our sales team will contact you within 24 hours to discuss your needs.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-blue-200/50 rounded-xl bg-white/80 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label htmlFor="businessEmail" className="block text-sm font-medium text-slate-700 mb-2">
                  Business Email *
                </label>
                <input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-blue-200/50 rounded-xl bg-white/80 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="Enter your business email"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue
              </button>
            </form>

            <p className="text-xs text-slate-500 mt-4 text-center">
              By submitting this form, you agree to our privacy policy and terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSales;

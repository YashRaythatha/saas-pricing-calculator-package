import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabs } from './LabsContext';

export default function Labs() {
  const navigate = useNavigate();
  const { labsData } = useLabs();

  return (
    <div className="min-h-screen p-6" style={{
      background: "radial-gradient(800px 500px at 65% 60%, rgba(59,130,246,0.15), transparent 60%), linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 25%, #BAE6FD 50%, #7DD3FC 75%, #38BDF8 100%)",
      color: "#1E293B",
    }}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-start mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Pricing Calculator
            </button>
          </div>
          <h1 className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-3xl font-extrabold text-transparent">
            Available Labs
          </h1>
          <p className="text-lg text-slate-600 mt-2">Choose from our comprehensive selection of specialized lab environments</p>
        </header>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labsData.labs.map((lab) => (
            <div key={lab.id} className="bg-white/90 rounded-xl border border-slate-200/50 p-6 shadow-sm backdrop-blur hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">{lab.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">{lab.cost}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-sm text-slate-600">{lab.status}</span>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{lab.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Key Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {lab.features.map((feature, index) => (
                    <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full mt-4 rounded-lg bg-blue-600 text-white py-2 px-4 text-sm font-medium hover:bg-blue-700 transition">
                Select Lab
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white/90 rounded-xl border border-slate-200/50 p-8 shadow-sm backdrop-blur">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Need a Custom Lab Environment?</h2>
            <p className="text-slate-600 mb-6">We can create specialized lab environments tailored to your specific requirements and use cases.</p>
            <button
              onClick={() => navigate('/contact-sales')}
              className="rounded-lg bg-blue-600 text-white py-3 px-8 font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Contact Sales Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

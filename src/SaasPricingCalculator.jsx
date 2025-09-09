import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePricing } from "./PricingContext";
import VectorSenseLogo from "./VectorSenseLogo";

/* ---------- Utils ---------- */
const usd = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

/* ---------- Data ---------- */

/* ---------- Small UI atoms ---------- */
const Info = ({ text }) => (
  <span className="relative group inline-flex items-center align-middle">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="ml-1 text-slate-400">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
      <path d="M12 7.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-1.25 4.25h2v5h-2v-5Z" fill="currentColor" />
    </svg>
    <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-200 shadow group-hover:block">
      {text}
    </span>
  </span>
);

const NumberInput = ({ id, label, value, onChange, min = 0, step = 1, disabled = false, prefix = "$", rightLabel }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <div className={`flex items-center rounded-xl border border-blue-200/50 bg-white/80 px-4 py-3 shadow-sm backdrop-blur transition-colors focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 ${disabled ? "opacity-60" : ""}`}>
      {prefix ? <span className="mr-3 text-slate-600 font-medium">{prefix}</span> : null}
      <input
        id={id}
        type="number"
        min={min}
        step={step}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="w-full bg-transparent text-slate-800 outline-none text-lg font-medium"
        placeholder="0"
      />
      {rightLabel ? <span className="ml-3 text-sm text-slate-600">{rightLabel}</span> : null}
    </div>
  </div>
);

// Toggle with standalone label block (for lab usage alignment)
const ToggleField = ({ label, checked, onChange, hint }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <div className="flex items-center rounded-xl border border-blue-200/50 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
      <label className="flex items-center gap-4 cursor-pointer select-none">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e)=>onChange(e.target.checked)} />
        <span className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-slate-300 transition peer-checked:bg-blue-500 shadow-inner" aria-hidden>
          <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow-lg transition peer-checked:translate-x-5" />
        </span>
        <span className="text-sm font-medium text-slate-700">{checked ? "Included" : "Excluded"}</span>
      </label>
    </div>
    {hint ? <span className="text-xs text-slate-600 mt-1">{hint}</span> : null}
  </div>
);

const Toggle = ({ label, checked, onChange, hint, disabled=false }) => (
  <label className={`flex items-start gap-3 select-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
    <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e)=>onChange(e.target.checked)} disabled={disabled} />
    <span className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-slate-300 transition peer-checked:bg-blue-500" aria-hidden>
      <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
    </span>
    <span className="flex flex-col -mt-0.5">
      <span className="font-medium text-slate-800">{label}</span>
      {hint ? <span className="text-xs text-slate-600">{hint}</span> : null}
    </span>
  </label>
);

const Tabs = ({ active, onChange }) => (
  <div className="mb-4 grid w-full max-w-xl grid-cols-2 gap-3">
    {[
      { key: "free", title: "Freemium", subtitle: "Free tier with paid upgrades", icon: "user-group" },
      { key: "paid", title: "Tiered Pricing", subtitle: "Multiple pricing tiers", icon: "chart" },
    ].map((t) => (
      <button
        key={t.key}
        onClick={() => onChange(t.key)}
        className={`group flex items-start gap-3 rounded-2xl border p-4 text-left transition backdrop-blur ${
          active === t.key
            ? "bg-blue-50/80 border-blue-500 ring-2 ring-blue-500 shadow"
            : "border-blue-200/50 hover:border-blue-300/50 bg-white/60"
        }`}
      >
        <span className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 ${active === t.key ? "" : "opacity-80"}`}>
          {t.icon === "user-group" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11Zm-8 0c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11Zm0 2c-2.761 0-5 1.79-5 4v1h10v-1c0-2.21-2.239-4-5-4Zm8 0c-.7 0-1.36.12-1.96.33A5.49 5.49 0 0 1 17 18v1h5v-1c0-2.21-2.239-4-5-4Z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M4 13h4v7H4v-7Zm6-6h4v13h-4V7Zm6 3h4v10h-4V10Z"/>
            </svg>
          )}
        </span>
        <span>
          <span className="block text-base font-semibold text-slate-800">{t.title}</span>
          <span className="block text-xs text-slate-600">{t.subtitle}</span>
        </span>
      </button>
    ))}
  </div>
);

/* ---------- Main Component ---------- */
export default function SaasPricingCalculator() {
  const navigate = useNavigate();
  const { pricingData } = usePricing();
  const [activeTab, setActiveTab] = useState("paid"); // "free" | "paid"
  const [planKey, setPlanKey] = useState("basic");
  
  // Use config data from context
  const plans = pricingData.plans;
  const plan = plans[planKey];

  useEffect(() => {
    if (activeTab === "free") {
      setPlanKey("free");
      setUseLab(false); // Disable lab usage for freemium
    }
    if (activeTab === "paid" && planKey === "free") {
      setPlanKey("basic");
      setUseLab(true); // Auto-enable lab usage for tiered plans
    }
  }, [activeTab]); // eslint-disable-line

  const [seats, setSeats] = useState(0);
  const [useLab, setUseLab] = useState(true);

  const [aiAgentOn, setAiAgentOn] = useState(false);
  const [managedOn, setManagedOn] = useState(false);

  // Validation for seat limits
  const getPlanValidation = (seatCount, currentPlan) => {
    if (seatCount === 0) return null;
    
    if (currentPlan === "basic" && seatCount > 2000) {
      return "Basic plan supports up to 2,000 seats. Please select an appropriate plan.";
    }
    if (currentPlan === "medium" && seatCount > 5000) {
      return "Premium plan supports up to 5,000 seats. Please select an appropriate plan.";
    }
    if (currentPlan === "enterprise" && seatCount <= 10000) {
      return "Enterprise plan is for 10,000+ seats. Please select an appropriate plan.";
    }
    return null;
  };

  const validationMessage = getPlanValidation(seats, planKey);
  
  // Get optional features pricing from context
  const aiAgentPerSeat = pricingData.optionalFeatures.aiAgent.perSeat;
  const managedPerSeat = pricingData.optionalFeatures.managedServices.perSeat;

  const isFree = activeTab === "free";

  /* ---- Pricing math (no flat platform fees) ---- */
  const labCostWithTax = useLab ? plan.labPerSeat * 1.2 : 0; // 20% service tax on lab cost
  const perSeatBase      = plan.platformPerSeat + labCostWithTax;
  const perSeatOptionals = isFree ? 0 : ((aiAgentOn ? aiAgentPerSeat : 0) + (managedOn ? managedPerSeat : 0));
  const perSeatTotal     = perSeatBase + perSeatOptionals;

  const seatCostTotal = useMemo(() => perSeatTotal * (Number.isFinite(seats) ? seats : 0), [perSeatTotal, seats]);
  const grandTotal    = seatCostTotal;

  const resetAll = () => {
    setActiveTab("paid");
    setPlanKey("basic");
    setSeats(0);
    setUseLab(true);
    setAiAgentOn(false);
    setManagedOn(false);
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: "radial-gradient(800px 500px at 65% 60%, rgba(59,130,246,0.15), transparent 60%), linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 25%, #BAE6FD 50%, #7DD3FC 75%, #38BDF8 100%)",
      color: "#1E293B",
    }}>
      {/* Print CSS: only print the quote card */}
      <style>{`@media print { body * { visibility: hidden; } #quote, #quote * { visibility: visible; } #quote { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>

      {/* Header */}
      <header className="mx-auto mb-6 max-w-6xl">
        <div className="flex items-center gap-4 mb-4">
          <VectorSenseLogo width="140" height="35" />
          <h1 className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-3xl font-extrabold text-transparent">
            Hackathon Pricing Calculator
          </h1>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: selectors */}
        <section className="space-y-5 lg:col-span-2">

          {/* Tabs OUTSIDE the card */}
          <Tabs active={activeTab} onChange={setActiveTab} />

          {/* Plan chooser */}
          <div className="rounded-xl border border-slate-200/50 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Plan Selection</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(activeTab === "free" ? ["free"] : Object.keys(plans).filter(k => k !== "free" && k !== "custom")).map((key) => {
                const p = plans[key];
                return (
                  <div
                    key={p.key}
                    className={`flex flex-col h-full rounded-xl border p-4 text-left transition hover:shadow-sm backdrop-blur ${
                      planKey === p.key
                        ? "border-blue-500 ring-2 ring-blue-500/50 bg-blue-50/80"
                        : "border-slate-200/50 hover:border-slate-300/50 bg-white/90"
                    }`}
                  >
                    <button
                          onClick={() => {
                            setPlanKey(p.key);
                            if (activeTab === "paid") {
                              setUseLab(true); // Auto-enable lab usage for tiered plans
                            }
                          }}
                          className="text-left space-y-3 flex-1"
                        >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${p.key === 'basic' ? 'bg-green-500' : p.key === 'premium' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                      <div className="font-semibold text-lg text-slate-800">{p.name}</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>Validity: {p.validityDays} days</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span>{p.unlimited ? `${p.maxUsers.toLocaleString()}+` : `Up to ${p.maxUsers.toLocaleString()}`} users</span>
                        </div>
                      </div>
                    </button>
                    
                    <div className="space-y-2.5 pt-3 border-t border-slate-200/50">
                        <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Platform Cost:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-slate-800">{usd(p.platformPerSeat)}</span>
                          <span className="text-xs text-slate-500">/seat</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Lab Cost:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-slate-800">{usd(p.labPerSeat)}</span>
                          <span className="text-xs text-slate-500">/seat</span>
                        </div>
                      </div>
                      {p.labPricingNote && (
                        <div className="text-xs text-slate-600 bg-blue-50 p-2 rounded-md">
                          {p.labPricingNote}
                        </div>
                      )}
                      </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Pricing Section - Clean and Aligned */}
            {activeTab === "paid" && (
              <div className="mt-4">
                <div className="rounded-xl border border-slate-200/50 p-4 text-center transition hover:shadow-sm backdrop-blur bg-slate-50/50">
                  <div className="space-y-3">
                    <div className="font-semibold text-lg text-slate-800">Custom Pricing</div>
                    <div className="text-sm text-slate-600">Need a tailored solution for your organization?</div>
                    <button 
                      onClick={() => navigate('/contact-sales')}
                      className="rounded-lg bg-blue-600 text-white py-2.5 px-6 text-sm font-medium hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                    >
                      Contact sales team
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Seats + Lab row */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <NumberInput
                  id="seats-input"
                  label="Number of seats"
                  value={seats}
                  onChange={setSeats}
                  min={0}
                  step={1}
                  prefix=""
                />
                {validationMessage && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
                    ⚠️ {validationMessage}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    <button
                      onClick={() => navigate('/labs')}
                      className="text-blue-600 hover:text-blue-700 underline transition"
                    >
                      Include Lab Usage
                    </button>
                  </label>
                  <div className="flex items-center rounded-xl border border-blue-200/50 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                    <label className="flex items-center gap-4 cursor-pointer select-none">
                      <input type="checkbox" className="peer sr-only" checked={useLab} onChange={(e)=>setUseLab(e.target.checked)} />
                      <span className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-slate-300 transition peer-checked:bg-blue-500 shadow-inner" aria-hidden>
                        <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow-lg transition peer-checked:translate-x-5" />
                      </span>
                      <span className="text-sm font-medium text-slate-700">{useLab ? "Included" : "Excluded"}</span>
                    </label>
                  </div>
                  <span className="text-xs text-slate-600 mt-1">{useLab ? "Adds lab cost per seat" : "Excluded from per-seat price"}</span>
                </div>
              </div>

              <div className="flex items-end justify-end">
                <button
                  onClick={resetAll}
                  className="rounded-xl px-6 py-2.5 font-medium text-white shadow-lg transition bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          {/* Optional Features */}
          <div className="rounded-xl border border-slate-200/50 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-800">
                Optional Features
              </h2>
              <Info text={isFree ? "Available on paid tiers." : "Additional per-seat features."} />
            </div>

            <fieldset disabled={isFree} className={isFree ? "opacity-50" : ""}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* AI Agent */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200/50 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={aiAgentOn}
                        onChange={(e) => setAiAgentOn(e.target.checked)}
                        className="h-4 w-4 accent-blue-500"
                        disabled={isFree}
                      />
                      <div>
                        <div className="font-medium text-slate-800">AI Agent</div>
                        <div className="text-sm text-slate-600">${aiAgentPerSeat}/seat</div>
                </div>
              </div>
                    <Info text="Advanced AI capabilities with 4 core features" />
          </div>

                  {aiAgentOn && (
                    <div className="ml-6 space-y-2">
                      <div className="text-sm font-medium text-slate-700 mb-2">Core Features:</div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {pricingData.aiAgentFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
              </div>
                  )}
            </div>

                {/* Managed Services */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200/50 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                        checked={managedOn}
                        onChange={(e) => setManagedOn(e.target.checked)}
                        className="h-4 w-4 accent-blue-500"
                          disabled={isFree}
                        />
                        <div>
                        <div className="font-medium text-slate-800">Managed Services</div>
                        <div className="text-sm text-slate-600">${managedPerSeat}/seat</div>
                      </div>
                    </div>
                    <Info text="Dedicated support and management services" />
                  </div>
                </div>
                </div>
              </fieldset>
          </div>

        </section>

        {/* Right column: summary */}
        <aside className="space-y-4">
          <div id="quote" className="sticky top-6 rounded-xl border border-slate-200/50 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Pricing Summary
              </h2>
              <button
                onClick={() => window.print()}
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition"
              >
                Export PDF
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Plan</span>
                <span className="font-medium text-slate-800">{plan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Validity</span>
                <span className="font-medium text-slate-800">{plan.validityDays} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Seats</span>
                <span className="font-medium text-slate-800">{Number(seats || 0).toLocaleString()}</span>
              </div>

              <hr className="my-2 border-blue-200/50" />

              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  Platform / seat <Info text="Core platform price per seat for the selected plan." />
                </span>
                <span className="font-medium text-slate-800">{usd(plan.platformPerSeat)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  Lab usage <Info text="Base lab cost per seat when enabled." />
                </span>
                <span className="font-medium text-slate-800">{useLab ? usd(plan.labPerSeat) : "$0.00"}</span>
              </div>
              {useLab && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1">
                    Service tax (20%) <Info text="20% service tax applied to lab usage." />
                  </span>
                  <span className="font-medium text-slate-800">{usd(plan.labPerSeat * 0.2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  AI Agent / seat <Info text="AI Agent features per-seat cost." />
                </span>
                <span className="font-medium text-slate-800">{usd(aiAgentOn ? aiAgentPerSeat : 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  Managed Services / seat <Info text="Managed Services per-seat cost." />
                </span>
                <span className="font-medium text-slate-800">{usd(managedOn ? managedPerSeat : 0)}</span>
              </div>

              <div className="mt-2 rounded-xl border border-blue-500 bg-blue-50/80 p-3">
                <div className="flex items-center justify-between text-slate-800">
                  <span className="font-medium">Total per seat</span>
                  <span className="font-semibold">{usd(perSeatTotal)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Seat cost subtotal</span>
                <span className="font-medium text-slate-800">{usd(seatCostTotal)}</span>
              </div>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Grand total (monthly)</span>
                  <span className="font-bold text-lg text-slate-900">{usd(grandTotal)}</span>
                </div>
              </div>

              <details className="mt-2 text-xs text-slate-400">
                <summary className="cursor-pointer select-none font-medium text-slate-300">Breakdown math</summary>
                <p className="mt-1 leading-relaxed">
                  per-seat = platform + lab + service tax (20% of lab) + AI Agent features. <br />
                  grand total = per-seat × seats.
                </p>
              </details>
            </div>
          </div>

          {/* CTA Buttons Section */}
          <div className="rounded-xl border border-slate-200/50 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="text-center space-y-3">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-800">Ready to get started?</h3>
                <p className="text-sm text-slate-600">Choose how you'd like to proceed</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded-lg py-2 px-4 text-sm font-medium transition bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md">
                  Book a demo
                </button>
                <button 
                  onClick={() => navigate('/contact-sales')}
                  className="flex-1 rounded-lg py-2 px-4 text-sm font-medium transition bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 shadow-sm hover:shadow-md"
                >
                  Contact sales team
                </button>
              </div>
            </div>
          </div>

        </aside>
      </main>

      <footer className="mx-auto mt-10 max-w-6xl text-center text-xs text-slate-400" />
    </div>
  );
}

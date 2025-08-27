import React, { useEffect, useMemo, useState } from "react";
import { PRICING_CONFIG, getPaidPlans } from "./pricing-config";

/* ---------- Utils ---------- */
const usd = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

/* ---------- Data ---------- */
const ACCENT = PRICING_CONFIG.ui;

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
  const [activeTab, setActiveTab] = useState("paid"); // "free" | "paid"
  const [planKey, setPlanKey] = useState("basic");
  
  // Use config data directly
  const plans = PRICING_CONFIG.plans;
  const plan = plans[planKey];

  useEffect(() => {
    if (activeTab === "free") setPlanKey("free");
    if (activeTab === "paid" && planKey === "free") setPlanKey("basic");
  }, [activeTab]); // eslint-disable-line

  const [seats, setSeats] = useState(0);
  const [useLab, setUseLab] = useState(true);

  const [aiAgentOn, setAiAgentOn] = useState(false);
  const [managedOn, setManagedOn] = useState(false);
  
  // Get optional features pricing from config
  const aiAgentPerSeat = PRICING_CONFIG.optionalFeatures.aiAgent.perSeat;
  const managedPerSeat = PRICING_CONFIG.optionalFeatures.managedServices.perSeat;

  const [addons, setAddons] = useState(PRICING_CONFIG.addons);
  const [showAddons, setShowAddons] = useState(false);
  
  // Function to update addon enabled state only (not pricing)
  const updateAddonEnabled = (addonKey, enabled) => {
    setAddons(prev => prev.map(addon => 
      addon.key === addonKey ? { ...addon, enabled } : addon
    ));
  };

  // Auto-collapse Add-ons on Freemium
  useEffect(() => { if (activeTab === "free") setShowAddons(false); }, [activeTab]);

  const isFree = activeTab === "free";

  /* ---- Pricing math (no flat platform fees) ---- */
  const perSeatBase      = plan.platformPerSeat + (useLab ? plan.labPerSeat : 0);
  const perSeatAddons    = isFree ? 0 : addons.filter(a => a.enabled).reduce((s,a)=> s + (a.perSeat||0), 0);
  const perSeatOptionals = isFree ? 0 : ((aiAgentOn ? aiAgentPerSeat : 0) + (managedOn ? managedPerSeat : 0));
  const perSeatTotal     = perSeatBase + perSeatAddons + perSeatOptionals;

  const seatCostTotal = useMemo(() => perSeatTotal * (Number.isFinite(seats) ? seats : 0), [perSeatTotal, seats]);
  const grandTotal    = seatCostTotal;

  const resetAll = () => {
    setActiveTab("paid");
    setPlanKey("basic");
    setSeats(0);
    setUseLab(true);
    setAiAgentOn(false);
    setAiAgentPerSeat(0);
    setManagedOn(false);
    setManagedPerSeat(0);
    setAddons(PRICING_CONFIG.addons);
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: "radial-gradient(800px 500px at 65% 60%, rgba(59,130,246,0.15), transparent 60%), linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 25%, #BAE6FD 50%, #7DD3FC 75%, #38BDF8 100%)",
      color: "#1E293B",
    }}>
      {/* Print CSS: only print the quote card */}
      <style>{`@media print { body * { visibility: hidden; } #quote, #quote * { visibility: visible; } #quote { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>

      {/* Header */}
      <header className="mx-auto mb-8 max-w-6xl">
        <h1 className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-3xl font-extrabold text-transparent">
          SaaS Pricing Calculator
        </h1>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: selectors */}
        <section className="space-y-6 lg:col-span-2">

          {/* Tabs OUTSIDE the card */}
          <Tabs active={activeTab} onChange={setActiveTab} />

          {/* Plan chooser */}
          <div className="rounded-2xl border border-blue-200/30 bg-white/80 p-5 shadow-sm backdrop-blur">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-blue-600">Plan Selection</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(activeTab === "free" ? ["free"] : Object.keys(plans).filter(k => k !== "free")).map((key) => {
                const p = plans[key];
                return (
                  <div
                    key={p.key}
                    className={`flex flex-col gap-3 rounded-xl border p-5 text-left transition hover:shadow-sm backdrop-blur ${
                      planKey === p.key
                        ? "border-blue-500 ring-2 ring-blue-500/50 bg-blue-50/80"
                        : "border-blue-200/50 hover:border-blue-300/50 bg-white/60"
                    }`}
                  >
                    <button
                      onClick={() => setPlanKey(p.key)}
                      className="text-left space-y-2"
                    >
                      <div className="font-semibold text-lg text-slate-800">{p.name}</div>
                      <div className="space-y-1">
                        <div className="text-sm text-slate-600">Validity: {p.validityDays} days</div>
                        <div className="text-sm text-slate-600">Up to {p.maxUsers.toLocaleString()} users</div>
                      </div>
                    </button>
                    
                                          <div className="space-y-3 pt-2 border-t border-blue-200/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Platform Cost:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-800">{usd(p.platformPerSeat)}</span>
                            <span className="text-xs text-slate-600">/seat</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Lab Cost:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-800">{usd(p.labPerSeat)}</span>
                            <span className="text-xs text-slate-600">/seat</span>
                          </div>
                        </div>
                      </div>
                  </div>
                );
              })}
            </div>

            {/* Seats + Lab row */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
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
              </div>

              <div className="flex items-center">
                <ToggleField
                  label="Include Lab Usage"
                  checked={useLab}
                  onChange={setUseLab}
                  hint={useLab ? "Adds lab cost per seat" : "Excluded from per-seat price"}
                />
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

          {/* Optional features (auto-disabled on Freemium) */}
          <div className="rounded-2xl border border-blue-200/30 bg-white/80 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold text-blue-600">
                Optional features
              </h2>
              <Info text={isFree ? "Available on paid tiers." : "Per-seat extras like AI Agent and Managed Services."} />
            </div>

            <fieldset disabled={isFree} className={isFree ? "opacity-50" : ""}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Toggle label="AI Agent" checked={aiAgentOn} onChange={setAiAgentOn} hint={`$${aiAgentPerSeat}/seat`} disabled={isFree} />
                </div>
                <div className="space-y-3">
                  <Toggle label="Managed Services" checked={managedOn} onChange={setManagedOn} hint={`$${managedPerSeat}/seat`} disabled={isFree} />
                </div>
              </div>
            </fieldset>
          </div>

          {/* Add-ons (collapsible, read-only prices; auto-disabled on Freemium) */}
          <div className="rounded-2xl border border-blue-200/30 bg-white/80 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-blue-600">
                  Add-ons (per seat)
                </h2>
                <Info text={isFree ? "Available on paid tiers." : "Additional per-seat services."} />
              </div>
              <button
                onClick={() => setShowAddons((v) => !v)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-blue-200/50 bg-white/80 text-xl leading-none text-blue-600 hover:border-blue-300/50"
              >
                {showAddons ? "−" : "+"}
              </button>
            </div>

            {showAddons && (
              <fieldset disabled={isFree} className={isFree ? "opacity-50" : ""}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {addons.map((a, idx) => (
                    <div
                      key={a.key}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-4 backdrop-blur ${
                        a.enabled ? "border-blue-500" : "border-blue-200/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={a.enabled}
                          onChange={(e) => updateAddonEnabled(a.key, e.target.checked)}
                          className="h-5 w-5 accent-blue-500"
                          disabled={isFree}
                        />
                        <div>
                          <div className="font-medium text-slate-800">{a.name}</div>
                          <div className="text-xs text-slate-600">{a.enabled ? "Included" : "Not included"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">$/seat</div>
                        <div className="font-medium text-slate-800">{usd(a.perSeat)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        </section>

        {/* Right column: summary */}
        <aside className="space-y-6">
          <div id="quote" className="sticky top-6 rounded-2xl border border-blue-200/30 bg-white/80 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-600">
                Pricing Summary
              </h2>
              <button
                onClick={() => window.print()}
                className="rounded-lg border border-blue-200/50 bg-white/80 px-3 py-1.5 text-sm text-slate-700 hover:border-blue-300/50"
              >
                Export PDF
              </button>
            </div>

            <div className="space-y-3 text-sm">
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
                  Lab usage <Info text="Additional lab cost per seat when enabled." />
                </span>
                <span className="font-medium text-slate-800">{useLab ? usd(plan.labPerSeat) : "$0.00"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  Add-ons / seat <Info text="Sum of selected add-ons per seat." />
                </span>
                <span className="font-medium text-slate-800">{usd(perSeatAddons)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1">
                  Optional features / seat <Info text="AI Agent and Managed Services per-seat totals." />
                </span>
                <span className="font-medium text-slate-800">{usd(perSeatOptionals)}</span>
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

              <div className="mt-2 rounded-xl p-3 text-white bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Grand total (monthly)</span>
                  <span className="font-bold">{usd(grandTotal)}</span>
                </div>
              </div>

              <details className="mt-2 text-xs text-slate-400">
                <summary className="cursor-pointer select-none font-medium text-slate-300">Breakdown math</summary>
                <p className="mt-1 leading-relaxed">
                  per-seat = platform + (lab if enabled) + add-ons + optional features. <br />
                  grand total = per-seat × seats.
                </p>
              </details>
            </div>
          </div>
        </aside>
      </main>

      <footer className="mx-auto mt-10 max-w-6xl text-center text-xs text-slate-400" />
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";

/* ---------- Utils ---------- */
const usd = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

/* ---------- Data ---------- */
const PLANS = {
  free:   { key: "free",   name: "Free Trial",     validityDays: 30, maxUsers: 10,   platformPerSeat: 0,   labPerSeat: 0   },
  basic:  { key: "basic",  name: "Basic Plan",     validityDays: 45, maxUsers: 500,  platformPerSeat: 125, labPerSeat: 75  },
  medium: { key: "medium", name: "Medium Plan",    validityDays: 45, maxUsers: 2000, platformPerSeat: 100, labPerSeat: 125 },
  enterprise: { key: "enterprise", name: "Enterprise Plan", validityDays: 60, maxUsers: 5000, platformPerSeat: 75, labPerSeat: 150 },
};

const DEFAULT_ADDONS = [
  { key: "m365",     name: "M365 Copilot",     perSeat: 0,   enabled: false },
  { key: "d365",     name: "D365 License",     perSeat: 150, enabled: false },
  { key: "security", name: "Security Copilot", perSeat: 265, enabled: false },
  { key: "studio",   name: "Copilot Studio",   perSeat: 250, enabled: false },
  { key: "fabric",   name: "Fabric Service",   perSeat: 0,   enabled: false },
  { key: "azurevmw", name: "Azure VMWare",     perSeat: 0,   enabled: false },
  { key: "ghcopilot",name: "GitHub Copilot",   perSeat: 0,   enabled: false },
];

const ACCENT = { primary: "#7C3AED", primaryDark: "#5B21B6", cyan: "#7dd3fc" };
const PAID_PLAN_KEYS = ["basic", "medium", "enterprise"];

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
  <div className="flex flex-col gap-1">
    <label className="text-sm text-slate-300">{label}</label>
    <div className={`flex items-center rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 shadow-sm backdrop-blur ${disabled ? "opacity-60" : ""}`}>
      {prefix ? <span className="mr-2 text-slate-400">{prefix}</span> : null}
      <input
        id={id}
        type="number"
        min={min}
        step={step}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="w-full bg-transparent text-slate-100 outline-none"
      />
      {rightLabel ? <span className="ml-2 text-xs text-slate-400">{rightLabel}</span> : null}
    </div>
  </div>
);

// Toggle with standalone label block (for lab usage alignment)
const ToggleField = ({ label, checked, onChange, hint }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-slate-300">{label}</label>
    <div className="flex items-center rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 shadow-sm backdrop-blur">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e)=>onChange(e.target.checked)} />
        <span className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-slate-600/40 transition peer-checked:bg-violet-600" aria-hidden>
          <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
        </span>
        <span className="text-sm text-slate-300">{checked ? "Included" : "Excluded"}</span>
      </label>
    </div>
    {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
  </div>
);

const Toggle = ({ label, checked, onChange, hint, disabled=false }) => (
  <label className={`flex items-start gap-3 select-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
    <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e)=>onChange(e.target.checked)} disabled={disabled} />
    <span className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-slate-600/40 transition peer-checked:bg-violet-600" aria-hidden>
      <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
    </span>
    <span className="flex flex-col -mt-0.5">
      <span className="font-medium text-slate-100">{label}</span>
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
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
            ? "bg-white/8 border-violet-600 ring-2 ring-violet-600 shadow"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <span className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-100 ${active === t.key ? "" : "opacity-80"}`}>
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
          <span className="block text-base font-semibold text-slate-100">{t.title}</span>
          <span className="block text-xs text-slate-400">{t.subtitle}</span>
        </span>
      </button>
    ))}
  </div>
);

/* ---------- Main Component ---------- */
export default function SaasPricingCalculator() {
  const [activeTab, setActiveTab] = useState("paid"); // "free" | "paid"
  const [planKey, setPlanKey] = useState("basic");
  const plan = PLANS[planKey];

  useEffect(() => {
    if (activeTab === "free") setPlanKey("free");
    if (activeTab === "paid" && planKey === "free") setPlanKey("basic");
  }, [activeTab]); // eslint-disable-line

  const [seats, setSeats] = useState(0);
  const [useLab, setUseLab] = useState(true);

  const [aiAgentOn, setAiAgentOn] = useState(false);
  const [aiAgentPerSeat, setAiAgentPerSeat] = useState(0);
  const [managedOn, setManagedOn] = useState(false);
  const [managedPerSeat, setManagedPerSeat] = useState(0);

  const [addons, setAddons] = useState(DEFAULT_ADDONS);
  const [showAddons, setShowAddons] = useState(false);

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
    setAddons(DEFAULT_ADDONS);
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: "radial-gradient(800px 500px at 65% 60%, rgba(124,58,237,0.25), transparent 60%), linear-gradient(135deg, #0B0F1A 0%, #111338 55%, #0B0F1A 100%)",
      color: "#e5e7eb",
    }}>
      {/* Print CSS: only print the quote card */}
      <style>{`@media print { body * { visibility: hidden; } #quote, #quote * { visibility: visible; } #quote { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>

      {/* Header */}
      <header className="mx-auto mb-8 max-w-6xl">
        <h1 className="bg-gradient-to-r from-slate-100 via-cyan-300 to-blue-400 bg-clip-text text-3xl font-extrabold text-transparent">
          SaaS Pricing Calculator
        </h1>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: selectors */}
        <section className="space-y-6 lg:col-span-2">

          {/* Tabs OUTSIDE the card */}
          <Tabs active={activeTab} onChange={setActiveTab} />

          {/* Plan chooser */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(activeTab === "free" ? ["free"] : PAID_PLAN_KEYS).map((key) => {
                const p = PLANS[key];
                return (
                  <button
                    key={p.key}
                    onClick={() => setPlanKey(p.key)}
                    className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition hover:shadow-sm backdrop-blur ${
                      planKey === p.key
                        ? "border-violet-600 ring-2 ring-white/10"
                        : "border-white/10"
                    }`}
                  >
                    <span className="font-medium text-slate-100">{p.name}</span>
                    <span className="text-xs text-slate-400">Validity: {p.validityDays} days</span>
                    <span className="text-xs text-slate-400">Up to {p.maxUsers.toLocaleString()} users</span>
                    <div className="mt-2 flex flex-col text-xs text-slate-300">
                      <span>Platform / seat: <b className="text-slate-100">{usd(p.platformPerSeat)}</b></span>
                      <span>Lab / seat: <b className="text-slate-100">{usd(p.labPerSeat)}</b></span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Seats + Lab row */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <NumberInput
                  id="seats-input"
                  label={"Number of seats"}
                  value={seats}
                  onChange={setSeats}
                  min={0}
                  step={1}
                  prefix={""}
                />
                
              </div>

              <ToggleField
                label="Include Lab Usage"
                checked={useLab}
                onChange={setUseLab}
                hint={useLab ? "Adds lab cost per seat" : "Excluded from per-seat price"}
              />

              <div className="flex items-end justify-end">
                <button
                  onClick={resetAll}
                  className="rounded-xl px-4 py-2 font-medium text-white shadow transition bg-gradient-to-r from-violet-600 to-violet-800"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Optional features (auto-disabled on Freemium) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold text-cyan-300">
                Optional features
              </h2>
              <Info text={isFree ? "Available on paid tiers." : "Per-seat extras like AI Agent and Managed Services."} />
            </div>

            <fieldset disabled={isFree} className={isFree ? "opacity-50" : ""}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Toggle label="AI Agent" checked={aiAgentOn} onChange={setAiAgentOn} hint="Per-seat pricing" disabled={isFree} />
                  <NumberInput
                    label="AI Agent cost per seat"
                    value={aiAgentPerSeat}
                    onChange={setAiAgentPerSeat}
                    disabled={!aiAgentOn || isFree}
                  />
                </div>
                <div className="space-y-3">
                  <Toggle label="Managed Services" checked={managedOn} onChange={setManagedOn} hint="Per-seat pricing" disabled={isFree} />
                  <NumberInput
                    label="Managed Services cost per seat"
                    value={managedPerSeat}
                    onChange={setManagedPerSeat}
                    disabled={!managedOn || isFree}
                  />
                </div>
              </div>
            </fieldset>
          </div>

          {/* Add-ons (collapsible, read-only prices; auto-disabled on Freemium) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-cyan-300">
                  Add-ons (per seat)
                </h2>
                <Info text={isFree ? "Available on paid tiers." : "Additional per-seat services."} />
              </div>
              <button
                onClick={() => setShowAddons((v) => !v)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-xl leading-none text-slate-100 hover:border-white/20"
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
                        a.enabled ? "border-violet-600" : "border-white/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={a.enabled}
                          onChange={(e) => {
                            const next = [...addons];
                            next[idx] = { ...a, enabled: e.target.checked };
                            setAddons(next);
                          }}
                          className="h-5 w-5 accent-violet-600"
                          disabled={isFree}
                        />
                        <div>
                          <div className="font-medium text-slate-100">{a.name}</div>
                          <div className="text-xs text-slate-400">{a.enabled ? "Included" : "Not included"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">$/seat</div>
                        <div className="font-medium text-slate-100">{usd(a.perSeat)}</div>
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
          <div id="quote" className="sticky top-6 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-cyan-300">
                Pricing Summary
              </h2>
              <button
                onClick={() => window.print()}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-100 hover:border-white/20"
              >
                Export PDF
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Plan</span>
                <span className="font-medium text-slate-100">{plan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Validity</span>
                <span className="font-medium text-slate-100">{plan.validityDays} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Seats</span>
                <span className="font-medium text-slate-100">{Number(seats || 0).toLocaleString()}</span>
              </div>

              <hr className="my-2 border-white/10" />

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  Platform / seat <Info text="Core platform price per seat for the selected plan." />
                </span>
                <span className="font-medium text-slate-100">{usd(plan.platformPerSeat)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  Lab usage <Info text="Additional lab cost per seat when enabled." />
                </span>
                <span className="font-medium text-slate-100">{useLab ? usd(plan.labPerSeat) : "$0.00"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  Add-ons / seat <Info text="Sum of selected add-ons per seat." />
                </span>
                <span className="font-medium text-slate-100">{usd(perSeatAddons)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  Optional features / seat <Info text="AI Agent and Managed Services per-seat totals." />
                </span>
                <span className="font-medium text-slate-100">{usd(perSeatOptionals)}</span>
              </div>

              <div className="mt-2 rounded-xl border border-violet-600 bg-violet-600/15 p-3">
                <div className="flex items-center justify-between text-slate-100">
                  <span className="font-medium">Total per seat</span>
                  <span className="font-semibold">{usd(perSeatTotal)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Seat cost subtotal</span>
                <span className="font-medium text-slate-100">{usd(seatCostTotal)}</span>
              </div>

              <div className="mt-2 rounded-xl p-3 text-white bg-gradient-to-r from-violet-600 to-violet-800">
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

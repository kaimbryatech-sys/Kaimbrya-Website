"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { pricingConfig as cfg, type Preset, type PropertyClassDraft } from "@/content/pricing-config";
import { config as site } from "@/content/site";
import { normalizeDomain, type DomainCheck } from "@/lib/domain";
import { estimate, formatJMD, formatUSD, parseUnits, standardEstimate, validateClasses, type Estimate } from "@/lib/pricing";
import { Alert, ArrowRight, Check } from "./icons";

/**
 * Pricing estimate simulator and quote request. Runs entirely in the browser; nothing is stored
 * unless the visitor sends a quote request. Every amount comes from src/lib/pricing.ts.
 */

type Mode = "standard" | "custom";
type DomainChoice = "" | (typeof cfg.domain.choices)[number]["id"];
/** The domain question keeps both typed names, so switching answers never loses what was entered. */
type DomainAnswer = { choice: DomainChoice; own: string; wanted: string };
type ClassRow = { id: string; name: string; type: string; bedrooms: string; unitsText: string; rateCents: number; description: string; showDescription: boolean };

const NOT_SPECIFIED = "Not specified";
const rateLabel = (cents: number) => `${formatUSD(cents)} per home${cents === cfg.standardRateCents ? " (standard)" : " (illustrative)"}`;
const homes = (n: number) => `${n.toLocaleString("en-US")} ${n === 1 ? "home" : "homes"}`;

export function PricingSimulator() {
  const nextId = useRef(0);
  const newId = () => `c${++nextId.current}`;
  const toRows = (classes: readonly PropertyClassDraft[]): ClassRow[] =>
    classes.map((c) => ({ id: newId(), name: c.name, type: c.type, bedrooms: c.bedrooms, unitsText: String(c.units), rateCents: c.rateCents, description: c.description ?? "", showDescription: Boolean(c.description) }));

  const [mode, setMode] = useState<Mode>("standard");
  const [unitsText, setUnitsText] = useState(String(cfg.defaultUnits));
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [dirty, setDirty] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>("gated");
  const [pending, setPending] = useState<{ id: string; label: string } | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [unsureNote, setUnsureNote] = useState(false);
  const [freshId, setFreshId] = useState<string | null>(null);
  // The domain question sits apart from the estimate: it never changes the price, and the calculator's
  // reset and presets leave it alone.
  const [domain, setDomain] = useState<DomainAnswer>({ choice: "", own: "", wanted: "" });
  const [domainTouched, setDomainTouched] = useState(false);
  const domainText = domain.choice === "own" ? domain.own : domain.choice === "new" ? domain.wanted : "";
  const domainCheck = useMemo(() => normalizeDomain(domainText), [domainText]);
  const answerDomain = (next: DomainAnswer) => { if (next.choice !== domain.choice) setDomainTouched(false); setDomain(next); };

  // ── Calculation ─────────────────────────────────────────────────────────
  const standardUnits = useMemo(() => parseUnits(unitsText, cfg.maxUnitsPerClass), [unitsText]);
  const classErrors = useMemo(() => validateClasses(classes, cfg), [classes]);
  const result: { estimate: Estimate | null; excluded: number } = useMemo(() => {
    if (mode === "standard") return { estimate: standardUnits.ok ? standardEstimate(standardUnits.value, cfg) : null, excluded: 0 };
    const valid = classes.filter((c) => !classErrors[c.id]);
    const e = estimate(valid.map((c) => ({ id: c.id, name: c.name.trim(), units: Number(c.unitsText.replace(/[,\s]/g, "")), rateCents: c.rateCents })), cfg);
    return { estimate: e, excluded: classes.length - valid.length };
  }, [mode, standardUnits, classes, classErrors]);
  const est = result.estimate;

  // A calm, delayed announcement for screen readers (not on every keystroke).
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    const t = window.setTimeout(() => {
      setAnnouncement(est ? `Estimated monthly subscription ${formatUSD(est.monthlyCents)} for ${homes(est.totalUnits)}.` : "Enter the number of homes to see an estimate.");
    }, 700);
    return () => window.clearTimeout(t);
  }, [est]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const edit = () => { setDirty(true); setActivePreset(null); setUnsureNote(false); };

  const applyPreset = (p: Preset) => {
    setPending(null);
    setTouched({});
    setUnsureNote(false);
    setMode(p.mode);
    if (p.mode === "standard") setUnitsText(String(p.units));
    else setClasses(toRows(p.classes ?? []));
    setActivePreset(p.id);
    setDirty(false);
  };
  const reset = () => {
    setPending(null); setTouched({}); setUnsureNote(false);
    setMode("standard"); setUnitsText(String(cfg.defaultUnits)); setClasses([]);
    setActivePreset("gated"); setDirty(false);
  };
  const requestPreset = (p: Preset) => (dirty ? setPending({ id: p.id, label: p.label }) : applyPreset(p));
  const requestReset = () => (dirty ? setPending({ id: "__reset", label: "the default example" }) : reset());
  const confirmPending = () => {
    if (!pending) return;
    if (pending.id === "__reset") reset();
    else { const p = cfg.presets.find((x) => x.id === pending.id); if (p) applyPreset(p); }
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setUnsureNote(false);
    if (next === "custom" && classes.length === 0) {
      const units = standardUnits.ok ? standardUnits.value : cfg.defaultUnits;
      setClasses([{ id: newId(), name: "All homes", type: NOT_SPECIFIED, bedrooms: NOT_SPECIFIED, unitsText: String(units), rateCents: cfg.standardRateCents, description: "", showDescription: false }]);
    }
    if (next === "standard" && est && est.totalUnits > 0) setUnitsText(String(est.totalUnits));
    setMode(next);
  };
  const notSure = () => {
    const total = est && est.totalUnits > 0 ? est.totalUnits : standardUnits.ok ? standardUnits.value : cfg.defaultUnits;
    setUnitsText(String(total));
    setMode("standard");
    setUnsureNote(true);
    requestAnimationFrame(() => document.getElementById("pricing-units")?.focus());
  };

  const uniqueName = (base: string) => {
    const taken = new Set(classes.map((c) => c.name.trim().toLowerCase()));
    if (!taken.has(base.toLowerCase())) return base;
    for (let i = 2; ; i++) if (!taken.has(`${base} ${i}`.toLowerCase())) return `${base} ${i}`;
  };
  const addClass = () => {
    if (classes.length >= cfg.maxClasses) return;
    const id = newId();
    setClasses((cur) => [...cur, { id, name: uniqueName(`Class ${cur.length + 1}`), type: NOT_SPECIFIED, bedrooms: NOT_SPECIFIED, unitsText: "", rateCents: cfg.standardRateCents, description: "", showDescription: false }]);
    setFreshId(id); edit();
    requestAnimationFrame(() => document.getElementById(`${id}-name`)?.focus());
  };
  const duplicateClass = (row: ClassRow) => {
    if (classes.length >= cfg.maxClasses) return;
    const id = newId();
    const copy = { ...row, id, name: uniqueName(`${row.name.trim() || "Class"} copy`.slice(0, cfg.maxNameLength)) };
    setClasses((cur) => { const i = cur.findIndex((c) => c.id === row.id); return [...cur.slice(0, i + 1), copy, ...cur.slice(i + 1)]; });
    setFreshId(id); edit();
  };
  const removeClass = (row: ClassRow) => {
    const i = classes.findIndex((c) => c.id === row.id);
    setClasses((cur) => cur.filter((c) => c.id !== row.id));
    edit();
    requestAnimationFrame(() => {
      const next = classes[i + 1] ?? classes[i - 1];
      (next ? document.getElementById(`${next.id}-name`) : document.getElementById("pricing-add-class"))?.focus();
    });
  };
  const update = (id: string, patch: Partial<ClassRow>) => { setClasses((cur) => cur.map((c) => (c.id === id ? { ...c, ...patch } : c))); edit(); };
  const touch = (key: string) => setTouched((t) => (t[key] ? t : { ...t, [key]: true }));

  // ── Quote form ──────────────────────────────────────────────────────────
  const scenario = useMemo(() => describeScenario(mode, est, classes, classErrors), [mode, est, classes, classErrors]);

  const sliderValue = standardUnits.ok ? Math.min(cfg.slider.max, Math.max(cfg.slider.min, standardUnits.value)) : cfg.defaultUnits;

  return (
    <>
      <section id="estimate" className="section bg-paper pricing" aria-labelledby="estimate-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Estimate your price</p>
            <h2 id="estimate-title" className="title">See what Kaimbrya would cost your community.</h2>
            <p className="lead">{cfg.copy.shortDisclaimer}</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-config">
              <fieldset className="mode-switch">
                <legend className="sr-only">How would you like to estimate?</legend>
                {([
                  ["standard", "Standard community", "Just enter the number of homes"],
                  ["custom", "Customize your community", "Different property classes and rates"],
                ] as const).map(([value, label, hint]) => (
                  <label key={value} className="mode-option" data-checked={mode === value}>
                    <input type="radio" name="pricing-mode" value={value} checked={mode === value} onChange={() => switchMode(value)} />
                    <span className="mode-label">{label}</span>
                    <span className="mode-hint">{hint}</span>
                  </label>
                ))}
              </fieldset>

              <div className="presets" role="group" aria-labelledby="presets-label">
                <p id="presets-label" className="field-label">Start from an example <span className="opt">(illustrative)</span></p>
                <div className="preset-list">
                  {cfg.presets.map((p) => (
                    <button key={p.id} type="button" className="preset" aria-pressed={activePreset === p.id} onClick={() => requestPreset(p)}>
                      <strong>{p.label}</strong>
                      <span>{p.summary}</span>
                    </button>
                  ))}
                </div>
                {pending ? (
                  <div className="replace-confirm" role="alert">
                    <p id="replace-text">Replace your current setup with {pending.label}? Your changes will be lost.</p>
                    <div>
                      <button type="button" className="btn btn-primary btn-sm" onClick={confirmPending}>Replace</button>
                      <button type="button" className="btn btn-quiet btn-sm" onClick={() => setPending(null)}>Keep my changes</button>
                    </div>
                  </div>
                ) : null}
              </div>

              {mode === "standard" ? (
                <div className="mode-panel" key="standard">
                  <label htmlFor="pricing-units" className="field-label">Number of homes in your community</label>
                  <div className="units-row">
                    <input
                      id="pricing-units"
                      className="units-input"
                      inputMode="numeric"
                      autoComplete="off"
                      value={unitsText}
                      onChange={(e) => { setUnitsText(e.target.value); edit(); }}
                      aria-invalid={!standardUnits.ok}
                      aria-describedby={standardUnits.ok ? "units-help" : "units-error"}
                    />
                    <input
                      type="range"
                      className="units-slider"
                      min={cfg.slider.min}
                      max={cfg.slider.max}
                      step={cfg.slider.step}
                      value={sliderValue}
                      onChange={(e) => { setUnitsText(e.target.value); edit(); }}
                      aria-label="Number of homes"
                      aria-valuetext={homes(sliderValue)}
                    />
                  </div>
                  {standardUnits.ok ? (
                    <p id="units-help" className="field-help">
                      {activePreset === "gated" && !dirty ? "190 homes is an example starting point. " : ""}
                      Not sure of your property breakdown? An approximate total is all you need.
                    </p>
                  ) : (
                    <p id="units-error" className="field-error"><Alert width={16} height={16} />{standardUnits.error}</p>
                  )}
                  {unsureNote ? (
                    <p className="unsure-note" role="status">
                      We&apos;ve used the standard rate for every home. If your community has different property classes, we&apos;ll review them with you in a personalized consultation.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="mode-panel" key="custom">
                  <div className="custom-head">
                    <p className="field-label">Your property classes</p>
                    <p className="field-help">
                      Name classes the way your community does, such as Ruby, Phase A or Garden apartment. Type, bedrooms and description describe a class; only the rate you choose changes the estimate.
                    </p>
                    <button type="button" className="link-btn" onClick={notSure}>I&apos;m not sure of my community&apos;s property breakdown</button>
                  </div>

                  {classes.length === 0 ? <p className="empty-classes">No classes yet. Add your first property class to start.</p> : null}
                  <ol className="class-list">
                    {classes.map((c, i) => {
                      const err = classErrors[c.id] ?? {};
                      const showName = err.name && (touched[`${c.id}:name`] || err.name.includes("different"));
                      const showUnits = err.units && (touched[`${c.id}:units`] || c.unitsText.trim() !== "");
                      return (
                        <li key={c.id} className={`class-card${freshId === c.id ? " class-card--fresh" : ""}`}>
                          <p id={`${c.id}-legend`} className="class-index">Class {i + 1}{c.name.trim() ? `: ${c.name.trim()}` : ""}</p>
                          <div className="class-fields">
                            <div className="field cfield cfield--name">
                              <label htmlFor={`${c.id}-name`}>Class name</label>
                              <input id={`${c.id}-name`} value={c.name} maxLength={cfg.maxNameLength} placeholder="e.g. Ruby"
                                onChange={(e) => update(c.id, { name: e.target.value })} onBlur={() => touch(`${c.id}:name`)}
                                aria-invalid={Boolean(showName)} aria-describedby={showName ? `${c.id}-name-error` : undefined} />
                              {showName ? <p id={`${c.id}-name-error`} className="field-error"><Alert width={16} height={16} />{err.name}</p> : null}
                            </div>
                            <div className="field cfield">
                              <label htmlFor={`${c.id}-type`}>Property type</label>
                              <select id={`${c.id}-type`} value={c.type} onChange={(e) => update(c.id, { type: e.target.value })}>
                                {[NOT_SPECIFIED, ...cfg.propertyTypes].map((t) => <option key={t}>{t}</option>)}
                              </select>
                            </div>
                            <div className="field cfield">
                              <label htmlFor={`${c.id}-bedrooms`}>Bedrooms</label>
                              <select id={`${c.id}-bedrooms`} value={c.bedrooms} onChange={(e) => update(c.id, { bedrooms: e.target.value })}>
                                {[NOT_SPECIFIED, ...cfg.bedrooms].map((b) => <option key={b}>{b}</option>)}
                              </select>
                            </div>
                            <div className="field cfield">
                              <label htmlFor={`${c.id}-units`}>Homes</label>
                              <input id={`${c.id}-units`} inputMode="numeric" autoComplete="off" value={c.unitsText} placeholder="0"
                                onChange={(e) => update(c.id, { unitsText: e.target.value })} onBlur={() => touch(`${c.id}:units`)}
                                aria-invalid={Boolean(showUnits)} aria-describedby={showUnits ? `${c.id}-units-error` : undefined} />
                              {showUnits ? <p id={`${c.id}-units-error`} className="field-error"><Alert width={16} height={16} />{err.units}</p> : null}
                            </div>
                            <div className="field cfield cfield--rate">
                              <label htmlFor={`${c.id}-rate`}>Simulated rate</label>
                              <select id={`${c.id}-rate`} value={c.rateCents} onChange={(e) => update(c.id, { rateCents: Number(e.target.value) })}>
                                {cfg.rateOptionsCents.map((r) => <option key={r} value={r}>{rateLabel(r)}</option>)}
                              </select>
                            </div>
                          </div>
                          {c.showDescription ? (
                            <div className="field cfield cfield--desc">
                              <label htmlFor={`${c.id}-desc`}>Description <span className="opt">(optional; doesn&apos;t affect the estimate)</span></label>
                              <input id={`${c.id}-desc`} value={c.description} maxLength={cfg.maxDescriptionLength} placeholder="e.g. Larger floor area, phase 2"
                                onChange={(e) => update(c.id, { description: e.target.value })} />
                            </div>
                          ) : null}
                          <div className="class-actions">
                            {!c.showDescription ? <button type="button" className="link-btn" onClick={() => update(c.id, { showDescription: true })}>Add a description</button> : null}
                            <button type="button" className="link-btn" onClick={() => duplicateClass(c)} disabled={classes.length >= cfg.maxClasses}>Duplicate<span className="sr-only"> {c.name}</span></button>
                            <button type="button" className="link-btn link-btn--danger" onClick={() => removeClass(c)}>Remove<span className="sr-only"> {c.name}</span></button>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                  <button id="pricing-add-class" type="button" className="btn btn-secondary-light" onClick={addClass} disabled={classes.length >= cfg.maxClasses}>
                    + Add a property class
                  </button>
                  {classes.length >= cfg.maxClasses ? <p className="field-help">You can simulate up to {cfg.maxClasses} classes. For more, request a quote and we&apos;ll model it with you.</p> : null}
                  <p className="field-help">{cfg.copy.illustrativeRates}</p>
                </div>
              )}

              <button type="button" className="link-btn reset-btn" onClick={requestReset}>Reset the calculator</button>
              {est ? (
                <a href="#summary-title" className="mobile-total" aria-label={`Estimated ${formatUSD(est.monthlyCents)} a month. See the breakdown`}>
                  <span>Estimated <strong>{formatUSD(est.monthlyCents)}</strong>/month</span>
                  <span className="mobile-total-link">Breakdown</span>
                </a>
              ) : null}
            </div>

            <aside className="pricing-summary" aria-labelledby="summary-title">
              <Summary est={est} mode={mode} excluded={result.excluded} />
              <p className="sr-only" aria-live="polite">{announcement}</p>
            </aside>
          </div>
        </div>
      </section>

      <DomainSetup answer={domain} onChange={answerDomain} check={domainCheck} showError={domainTouched} onBlur={() => setDomainTouched(true)} />

      <QuoteForm domain={domain} domainCheck={domainCheck} onDomainInvalid={() => setDomainTouched(true)} scenario={scenario} defaultHomes={est?.totalUnits ?? 0} suggestedConfig={mode === "standard" ? "Standard homes" : est?.usesIllustrativeRates ? "Classified development (custom classes)" : (est?.classes.length ?? 0) > 1 ? "Mixed property types" : ""} />
    </>
  );
}

// ── Summary ─────────────────────────────────────────────────────────────────
function Summary({ est, mode, excluded }: { est: Estimate | null; mode: Mode; excluded: number }) {
  const jmd = cfg.jmd;
  return (
    <div className="summary-card">
      <h3 id="summary-title" className="summary-title">Estimated monthly subscription</h3>
      {est ? (
        <>
          <p className="summary-amount" key={est.monthlyCents}>{formatUSD(est.monthlyCents)}<span>/month</span></p>
          {jmd ? <p className="summary-jmd">About {formatJMD(est.monthlyCents, jmd.rate)} a month (indicative, at {jmd.rate} JMD per USD on {jmd.effectiveDate}; source: {jmd.source})</p> : null}
          <dl className="summary-facts">
            <div><dt>Per year</dt><dd>{formatUSD(est.annualCents)}</dd></div>
            <div><dt>Per home, per month</dt><dd>{est.perUnitCents === null ? "—" : formatUSD(est.perUnitCents)}</dd></div>
          </dl>

          <ul className="breakdown" aria-label="How the estimate is calculated">
            <li><span>Base subscription <small>per community</small></span><span>{formatUSD(est.baseCents)}</span></li>
            {mode === "standard" ? (
              <li><span>{homes(est.totalUnits)} <small>× {formatUSD(cfg.standardRateCents)}</small></span><span>{formatUSD(est.variableCents)}</span></li>
            ) : (
              est.classes.map((c) => (
                <li key={c.id}><span>{c.name} <small>{homes(c.units)} × {formatUSD(c.rateCents)}</small></span><span>{formatUSD(c.subtotalCents)}</span></li>
              ))
            )}
            {mode === "custom" ? <li className="breakdown-sub"><span>Property charges <small>{homes(est.totalUnits)}</small></span><span>{formatUSD(est.variableCents)}</span></li> : null}
            <li className="breakdown-total"><span>Monthly estimate</span><span>{formatUSD(est.monthlyCents)}</span></li>
          </ul>
          {mode === "custom" && est.classes.length === 0 ? <p className="field-help">Add a property class to include homes in the estimate.</p> : null}
          {excluded > 0 ? <p className="summary-warning"><Alert width={16} height={16} />{excluded === 1 ? "1 class isn't" : `${excluded} classes aren't`} included until {excluded === 1 ? "its fields are" : "their fields are"} completed.</p> : null}

          {mode === "custom" && est.totalUnits > 0 ? (
            est.usesIllustrativeRates ? (
              <div className="comparison">
                <p className="comparison-title">Compared with standard pricing</p>
                <dl>
                  <div><dt>Standard community estimate</dt><dd>{formatUSD(est.standard.monthlyCents)}/month</dd></div>
                  <div><dt>Your customized scenario</dt><dd>{formatUSD(est.monthlyCents)}/month</dd></div>
                  <div className="comparison-diff"><dt>Difference</dt><dd>{est.differenceCents > 0 ? "+" : ""}{formatUSD(est.differenceCents)}/month</dd></div>
                </dl>
                <p className="field-help">The difference comes only from the illustrative class rates you selected. The standard price uses {formatUSD(cfg.standardRateCents)} for every home.</p>
              </div>
            ) : (
              <p className="field-help">Every class uses the standard rate, so this matches standard pricing.</p>
            )
          ) : null}
        </>
      ) : (
        <p className="summary-empty">Enter the number of homes to see an estimate.</p>
      )}

      <div className="summary-domain">
        <p id="summary-domain-title" className="summary-subtitle">Community domain <span>Not part of the monthly estimate</span></p>
        <ul className="breakdown" aria-labelledby="summary-domain-title">
          <li><span>Community domain setup</span><span className="cost-free">Free</span></li>
          <li><span>Domain purchase, if required <small>Paid to the registrar, and renewed each year</small></span><span>Registrar&apos;s price</span></li>
        </ul>
        <a href="#domain" className="link-btn">About your community&apos;s domain</a>
      </div>

      <div className="disclaimer" role="note" aria-labelledby="disclaimer-title">
        <p id="disclaimer-title" className="disclaimer-title">{cfg.copy.disclaimerTitle}</p>
        <p>{cfg.copy.disclaimer}</p>
        <p>{cfg.copy.extras}</p>
        <p className="disclaimer-version">Rate card {cfg.version} · prices in US dollars</p>
      </div>

      <div className="summary-actions">
        <a href="#quote" className="btn btn-primary">Get a personalized quote <ArrowRight /></a>
        <a href="/demo/" className="btn btn-quiet">Book a demonstration</a>
      </div>
    </div>
  );
}

// ── Scenario text sent with a quote request ─────────────────────────────────
const clean = (s: string, max: number) => s.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

function describeScenario(mode: Mode, est: Estimate | null, classes: ClassRow[], errors: Record<string, unknown>) {
  if (!est) return { text: "", json: "" };
  const lines = [
    "PRICING INQUIRY - website estimate only, not a quotation. Recompute from the inputs before quoting.",
    `Rate card: ${cfg.version} (base ${formatUSD(cfg.baseCents)}/month, standard ${formatUSD(cfg.standardRateCents)}/home)`,
    `Mode: ${mode === "standard" ? "Standard community" : "Customized property classes"}`,
    `Total homes: ${est.totalUnits}`,
  ];
  const valid = classes.filter((c) => !errors[c.id]);
  if (mode === "custom") {
    valid.forEach((c, i) => {
      const units = Number(c.unitsText.replace(/[,\s]/g, ""));
      lines.push(`Class ${i + 1}: ${clean(c.name, cfg.maxNameLength)} | ${c.type} | ${c.bedrooms} | ${units} homes | ${formatUSD(c.rateCents)}/home${c.rateCents === cfg.standardRateCents ? "" : " (illustrative)"}${c.description.trim() ? ` | ${clean(c.description, cfg.maxDescriptionLength)}` : ""}`);
    });
    if (valid.length < classes.length) lines.push(`(${classes.length - valid.length} incomplete class(es) not included)`);
  }
  lines.push(`Monthly estimate: ${formatUSD(est.monthlyCents)} | Annual: ${formatUSD(est.annualCents)}`);
  if (mode === "custom") lines.push(`Standard comparison: ${formatUSD(est.standard.monthlyCents)}/month (difference ${formatUSD(est.differenceCents)})`);
  const json = JSON.stringify({
    rateCard: cfg.version,
    mode,
    classes: mode === "custom"
      ? valid.map((c) => ({ name: clean(c.name, cfg.maxNameLength), type: c.type, bedrooms: c.bedrooms, units: Number(c.unitsText.replace(/[,\s]/g, "")), rateCents: c.rateCents, description: clean(c.description, cfg.maxDescriptionLength) || undefined }))
      : [{ name: "Homes", units: est.totalUnits, rateCents: cfg.standardRateCents }],
    estimateCents: { monthly: est.monthlyCents, annual: est.annualCents, standardMonthly: est.standard.monthlyCents },
  });
  return { text: lines.join("\n"), json };
}

// ── Community domain ────────────────────────────────────────────────────────
function DomainSetup({ answer, onChange, check, showError, onBlur }: { answer: DomainAnswer; onChange: (a: DomainAnswer) => void; check: DomainCheck; showError: boolean; onBlur: () => void }) {
  const field = answer.choice === "own" || answer.choice === "new" ? answer.choice : null;
  const invalid = field !== null && showError && !check.ok;
  const clear = () => {
    onChange({ ...answer, choice: "" });
    requestAnimationFrame(() => document.querySelector<HTMLInputElement>('input[name="domain-choice"]')?.focus());
  };
  return (
    <section id="domain" className="section domain" aria-labelledby="domain-title">
      <div className="wrap domain-grid">
        <div>
          <p className="eyebrow">Community domain</p>
          <h2 id="domain-title" className="title" style={{ marginTop: 16 }}>Your community. Your domain. Setup on us.</h2>
          <p className="lead" style={{ marginTop: 18 }}>Give your community its own professional web address with Kaimbrya.</p>
          <ul className="domain-points">
            <li><strong>Already have a domain?</strong> We&apos;ll help you connect it for free.</li>
            <li><strong>Need a new one?</strong> We&apos;ll help you find, purchase and set it up at no additional charge.</li>
            <li><strong>Domain setup is always free.</strong> You only pay for purchasing and renewing your domain, where applicable.</li>
          </ul>
          <dl className="domain-costs" aria-label="What a community domain costs">
            {cfg.domain.costs.map((c) => (
              <div key={c.item}><dt>{c.item}</dt><dd className={c.cost === "Free" ? "cost-free" : undefined}>{c.cost}</dd></div>
            ))}
          </dl>
          <p className="field-help" style={{ marginTop: 16 }}>
            We&apos;ll guide you through it during onboarding, and confirm the timing and any registrar cost with you before anything is bought or changed. The domain stays your community&apos;s.
          </p>
        </div>

        <div className="form-card domain-card">
          <fieldset className="domain-question">
            <legend className="field-label">Do you already have a domain for your community? <span className="opt">(optional)</span></legend>
            <div className="domain-options">
              {cfg.domain.choices.map((c) => (
                <label key={c.id} className="mode-option" data-checked={answer.choice === c.id}>
                  <input type="radio" name="domain-choice" value={c.id} checked={answer.choice === c.id} onChange={() => onChange({ ...answer, choice: c.id })} />
                  <span className="mode-label">{c.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {field ? (
            <div className="field mode-panel domain-field" key={field}>
              <label htmlFor="domain-name">
                {field === "own" ? "What's your community's domain name?" : "What domain name would you prefer?"} <span className="opt">(optional)</span>
              </label>
              <input
                id="domain-name"
                value={field === "own" ? answer.own : answer.wanted}
                placeholder="yourcommunity.com"
                inputMode="url"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                maxLength={300}
                onChange={(e) => onChange(field === "own" ? { ...answer, own: e.target.value } : { ...answer, wanted: e.target.value })}
                onBlur={onBlur}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? "domain-error domain-help" : "domain-help"}
              />
              {invalid && !check.ok ? <p id="domain-error" className="field-error"><Alert width={16} height={16} />{check.error}</p> : null}
              <p id="domain-help" className="field-help">
                {field === "own"
                  ? "We'll help you work out the best way to connect it. You keep ownership, and renewals stay with you."
                  : "We'll check it's available and confirm the price with you before anything is bought. Entering a name here doesn't reserve it."}
              </p>
            </div>
          ) : null}
          {answer.choice === "unsure" ? <p className="unsure-note mode-panel">That&apos;s fine. We&apos;ll guide you through it during onboarding.</p> : null}

          <p className="domain-foot">
            {answer.choice ? (
              <>Your answer is included when you request a quote. <button type="button" className="link-btn" onClick={clear}>Clear my answer</button></>
            ) : (
              "You can skip this and still request a quote."
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/** What the team receives about the domain, whether or not the estimate is attached. */
function describeDomain(a: DomainAnswer, check: DomainCheck) {
  const choice = cfg.domain.choices.find((c) => c.id === a.choice);
  const name = choice && a.choice !== "unsure" && check.ok ? check.value : "";
  const recap = !choice
    ? "Not answered. Domain setup is free either way."
    : a.choice === "own" ? `We already have a domain${name ? `: ${name}` : ""}`
    : a.choice === "new" ? `We need help getting one${name ? ` (preferred: ${name})` : ""}`
    : "Not sure. We'd like some guidance.";
  const lines = [
    `Community domain: ${choice?.status ?? "Not answered"}${name ? ` | ${a.choice === "own" ? "existing" : "preferred"}: ${name}` : ""}`,
    `Domain assistance: ${choice?.help ?? "Not answered"}`,
    "Domain setup: free (any registrar purchase and renewal is paid by the community)",
  ];
  return { status: choice?.status ?? "Not answered", help: choice?.help ?? "Not answered", name, recap, lines };
}

// ── Quote form ──────────────────────────────────────────────────────────────
type QField = "name" | "email" | "org" | "location" | "phone" | "homes" | "configuration" | "message";
const ORDER: QField[] = ["name", "email", "org", "location", "phone", "homes", "configuration", "message"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function QuoteForm({ domain, domainCheck, onDomainInvalid, scenario, defaultHomes, suggestedConfig }: { domain: DomainAnswer; domainCheck: DomainCheck; onDomainInvalid: () => void; scenario: { text: string; json: string }; defaultHomes: number; suggestedConfig: string }) {
  const [values, setValues] = useState<Record<QField, string>>({ name: "", email: "", org: "", location: "", phone: "", homes: "", configuration: "", message: "" });
  const [homesEdited, setHomesEdited] = useState(false);
  const [attach, setAttach] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<QField, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [tried, setTried] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const dom = describeDomain(domain, domainCheck);
  const sentScenario = scenario.text ? [scenario.text, ...dom.lines].join("\n") : "";

  // Follow the calculator until the visitor types their own figure.
  const homesValue = homesEdited ? values.homes : defaultHomes > 0 ? String(defaultHomes) : "";
  const configValue = values.configuration || suggestedConfig;

  const validate = (): Partial<Record<QField, string>> => {
    const e: Partial<Record<QField, string>> = {};
    if (values.name.trim().length < 2) e.name = "Enter your name.";
    if (!values.email.trim()) e.email = "Enter your email address.";
    else if (!EMAIL.test(values.email.trim())) e.email = "Enter an email address like name@example.com.";
    if (!values.org.trim()) e.org = "Enter your community or company name.";
    if (values.phone && !/^[+()\d\s-]{7,20}$/.test(values.phone.trim())) e.phone = "Enter a phone number using digits, spaces, + or -.";
    const h = parseUnits(homesValue, 2_000_000);
    if (!h.ok) e.homes = h.error;
    else if (h.value < 1) e.homes = "Enter at least one home.";
    if (!configValue) e.configuration = "Choose the option that fits best.";
    if (values.message.length > 1000) e.message = "Keep the message under 1,000 characters.";
    return e;
  };

  const set = (f: QField) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (f === "homes") setHomesEdited(true);
    setValues((v) => ({ ...v, [f]: e.target.value }));
    if (errors[f]) setErrors((cur) => ({ ...cur, [f]: undefined }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "sending") return;
    const found = validate();
    setErrors(found);
    setTried(true);
    const first = ORDER.find((f) => found[f]);
    if (first) { formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    // The domain is optional, but a name that's been typed must be a real domain format.
    if (!domainCheck.ok) { onDomainInvalid(); document.getElementById("domain-name")?.focus(); return; }
    const honeypot = (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value;
    setState("sending");
    try {
      if (!honeypot) {
        const body = new URLSearchParams({
          "form-name": "pricing-inquiry",
          subject: `Pricing inquiry (estimate, not a quotation): ${clean(values.org, 80)}`,
          "request-type": "Pricing inquiry - website estimate, not an accepted quotation",
          name: clean(values.name, 120), email: values.email.trim(), org: clean(values.org, 160), location: clean(values.location, 160),
          phone: values.phone.trim(), homes: homesValue.replace(/[,\s]/g, ""), configuration: configValue, message: values.message.slice(0, 1000),
          "domain-status": dom.status, "domain-name": dom.name, "domain-help": dom.help,
          scenario: attach ? sentScenario : "(not attached)", "scenario-json": attach ? scenario.json.slice(0, 6000) : "",
          "rate-card": cfg.version, source: window.location.href.split("#")[0] ?? "",
        });
        const res = await fetch("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
        if (!res.ok) throw new Error(String(res.status));
      }
      setState("sent");
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch {
      setState("failed");
    }
  };

  const field = (f: QField) => ({
    id: `q-${f}`, name: f, onChange: set(f),
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `q-${f}-error` : undefined,
  });
  const error = (f: QField) => (errors[f] ? <p id={`q-${f}-error`} className="field-error"><Alert width={16} height={16} />{errors[f]}</p> : null);

  return (
    <section id="quote" className="section quote" aria-labelledby="quote-title">
      <div className="wrap quote-grid">
        <div>
          <p className="eyebrow">Personalized quote</p>
          <h2 id="quote-title" className="title" style={{ marginTop: 16 }}>Get a proposal for your community.</h2>
          <p className="lead" style={{ marginTop: 18 }}>
            Tell us about your community and we&apos;ll prepare a personalized proposal. Your estimate can come with the request, so we start from your numbers.
          </p>
          <p className="field-help" style={{ marginTop: 18 }}>This is a request for information, not an order. Nothing is charged and no subscription is created.</p>
        </div>

        {state === "sent" ? (
          <div className="form-card success" role="status">
            <div className="success-icon"><Check /></div>
            <h2 ref={doneRef} tabIndex={-1}>Your request has been received.</h2>
            <p>Thank you for your interest in Kaimbrya. Our team will review your community&apos;s requirements and contact you to discuss a personalized proposal.</p>
          </div>
        ) : (
          <form ref={formRef} className="form-card" noValidate onSubmit={submit} aria-labelledby="quote-form-title">
            <h3 id="quote-form-title" className="sr-only">Quote request</h3>
            <div className="form-grid">
              <div className="field"><label htmlFor="q-name">Contact name</label><input {...field("name")} value={values.name} autoComplete="name" required />{error("name")}</div>
              <div className="field"><label htmlFor="q-email">Email address</label><input {...field("email")} value={values.email} type="email" autoComplete="email" inputMode="email" required />{error("email")}</div>
              <div className="field field--full"><label htmlFor="q-org">Community or company</label><input {...field("org")} value={values.org} autoComplete="organization" required />{error("org")}</div>
              <div className="field"><label htmlFor="q-location">Location <span className="opt">(optional)</span></label><input {...field("location")} value={values.location} placeholder="e.g. Kingston" />{error("location")}</div>
              <div className="field"><label htmlFor="q-phone">Contact number <span className="opt">(optional)</span></label><input {...field("phone")} value={values.phone} type="tel" autoComplete="tel" inputMode="tel" />{error("phone")}</div>
              <div className="field"><label htmlFor="q-homes">Approximate number of homes</label><input {...field("homes")} value={homesValue} inputMode="numeric" required />{error("homes")}</div>
              <div className="field">
                <label htmlFor="q-configuration">Community configuration</label>
                <select {...field("configuration")} value={configValue} required>
                  <option value="">Choose one</option>
                  {cfg.configurationTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
                {error("configuration")}
              </div>
              <div className="field field--full"><label htmlFor="q-message">Anything else we should know? <span className="opt">(optional)</span></label><textarea {...field("message")} value={values.message} rows={4} maxLength={1200} />{error("message")}</div>
              <div className="field field--full domain-recap">
                <p className="field-label">Community domain <span className="opt">(optional)</span></p>
                <p className="domain-recap-value">
                  <span>{dom.recap}</span>
                  <a href="#domain" className="link-btn">{domain.choice ? "Change" : "Answer"}<span className="sr-only"> the domain question</span></a>
                </p>
                {tried && !domainCheck.ok ? <p className="field-error" role="alert"><Alert width={16} height={16} />Check the domain name above, or clear it. {domainCheck.error}</p> : null}
              </div>
              <div className="field field--full attach">
                <label className="check">
                  <input type="checkbox" checked={attach} onChange={(e) => setAttach(e.target.checked)} />
                  <span>Include my pricing estimate with this request</span>
                </label>
                {attach && sentScenario ? (
                  <details className="attach-preview">
                    <summary>What we&apos;ll receive</summary>
                    <pre>{sentScenario}</pre>
                  </details>
                ) : null}
              </div>
              <div className="hp" aria-hidden="true"><label htmlFor="q-website">Leave this empty</label><input id="q-website" name="website" tabIndex={-1} autoComplete="off" /></div>
            </div>
            <div className="form-foot">
              {state === "failed" ? (
                <p className="form-status form-status--error" role="alert">
                  We couldn&apos;t send your request. Check your connection and try again, or email us at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
                </p>
              ) : null}
              <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : <>Request my quote <ArrowRight /></>}
              </button>
              <p className="fine muted">We use these details only to respond to your request. See our <a href="/privacy/">privacy policy</a>.</p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

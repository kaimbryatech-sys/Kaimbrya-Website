"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, Alert } from "@/components/icons";
import { moduleInfo, moduleOrder, readiness, type ChoiceQuestion, type ModuleId, type Question } from "@/content/extras";
import { pricingConfig as cfg } from "@/content/pricing-config";
import { formatUSD, parseUnits, standardEstimate } from "@/lib/pricing";

type Answers = Record<string, string>;

const questions: Question[] = readiness.questions;
const total = questions.length;
/** How many modules lead the results; the rest are listed more briefly. */
const TOP = 3;

function parseHomes(raw: string): { ok: true; value: number } | { ok: false; error: string } {
  const parsed = parseUnits(raw, cfg.maxUnitsPerClass);
  if (!parsed.ok) return parsed;
  if (parsed.value < 1) return { ok: false, error: "Enter at least 1 home." };
  return parsed;
}

function optionFor(q: ChoiceQuestion, answers: Answers) {
  return q.options.find((o) => o.value === answers[q.id]);
}

/** Groups every reason from the answers by module; most reasons first, then the platform's order. */
function recommend(answers: Answers) {
  const reasons = new Map<ModuleId, string[]>();
  const add = (module: ModuleId, text: string) => {
    const list = reasons.get(module) ?? [];
    if (!list.includes(text)) list.push(text);
    reasons.set(module, list);
  };
  const notes: string[] = [];
  for (const q of questions) {
    if (q.kind !== "choice") continue;
    const opt = optionFor(q, answers);
    if (!opt) continue;
    opt.adds.forEach((r) => add(r.module, r.text));
    if (opt.note) notes.push(opt.note);
  }
  readiness.always.forEach((r) => add(r.module, r.text));
  const picked = [...reasons.entries()]
    .map(([id, list]) => ({ id, reasons: list }))
    .sort((a, b) => b.reasons.length - a.reasons.length || moduleOrder.indexOf(a.id) - moduleOrder.indexOf(b.id));
  const others = moduleOrder.filter((id) => !reasons.has(id));
  return { picked, others, notes };
}

/** Seven questions, one at a time, then recommended modules and an indicative price. Nothing leaves the page. */
export function ReadinessCheck() {
  const [step, setStep] = useState(0); // 0..total-1 = questions, total = results
  const [answers, setAnswers] = useState<Answers>({});
  const [homesText, setHomesText] = useState("");
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);

  // Move focus to the new question (or the results) after the visitor navigates, never on first load.
  useEffect(() => {
    if (!interacted.current) return;
    (step === total ? resultsRef.current : headingRef.current)?.focus();
  }, [step]);

  const go = (next: number) => {
    interacted.current = true;
    setError("");
    setStep(next);
  };

  const q = step < total ? questions[step] : undefined;
  const homes = parseHomes(homesText);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!q) return;
    if (q.kind === "homes") {
      if (!homes.ok) {
        setError(homes.error);
        document.getElementById("rc-homes")?.focus();
        return;
      }
    } else if (!answers[q.id]) {
      setError("Choose one answer to continue.");
      document.querySelector<HTMLInputElement>(`input[name="rc-${q.id}"]`)?.focus();
      return;
    }
    go(step + 1);
  };

  const restart = () => {
    setAnswers({});
    setHomesText("");
    go(0);
  };

  const result = useMemo(() => recommend(answers), [answers]);

  if (step === total) {
    const units = homes.ok ? homes.value : cfg.defaultUnits;
    const est = standardEstimate(units, cfg);
    const managed = answers.type === "managed";
    return (
      <section className="rc-results" aria-labelledby="rc-results-title">
        <div className="rc-results-head">
          <p className="eyebrow">Your results</p>
          <h2 id="rc-results-title" ref={resultsRef} tabIndex={-1} className="title rc-results-title">Where Kaimbrya would help first.</h2>
          <p className="lead">Based on your answers, these are the parts of Kaimbrya to focus on in your demo. {readiness.privacy}</p>
          <p className="rc-price-line">
            Indicative price for {est.totalUnits.toLocaleString("en-US")} homes: <strong>{formatUSD(est.monthlyCents)} a month</strong>. <a href="#rc-price">See the breakdown</a>
          </p>
        </div>

        <div className="rc-results-grid">
          <div className="rc-results-main">
            <h3 className="rc-group-title">Start here</h3>
            <ol className="rc-modules" aria-label="Start here">
              {result.picked.slice(0, TOP).map((m, i) => {
                const info = moduleInfo[m.id];
                return (
                  <li key={m.id} className="rc-module" style={{ "--accent": info.accent, "--i": i } as CSSProperties}>
                    <div className="rc-module-head">
                      <h4>{info.title}</h4>
                      <a href={info.href} className="link-arrow">See it on the platform<span className="sr-only">: {info.title}</span> <ArrowRight /></a>
                    </div>
                    <p className="rc-module-text">{info.text}</p>
                    <ul className="ticks rc-reasons" aria-label={`Why ${info.title} fits`}>
                      {m.reasons.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                  </li>
                );
              })}
            </ol>

            {result.picked.length > TOP ? (
              <>
                <h3 className="rc-group-title">Also a good fit</h3>
                <ul className="rc-rest">
                  {result.picked.slice(TOP).map((m) => {
                    const info = moduleInfo[m.id];
                    return (
                      <li key={m.id} style={{ "--accent": info.accent } as CSSProperties}>
                        <h4><a href={info.href}>{info.title}</a></h4>
                        <ul className="ticks" aria-label={`Why ${info.title} fits`}>{m.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}

            {result.notes.length || answers.decisions ? (
              <div className="rc-notes">
                {result.notes.map((n) => <p key={n} className="note">{n}</p>)}
                {answers.decisions && answers.decisions !== "unsure" ? <p className="note">{readiness.votesNote}</p> : null}
              </div>
            ) : null}

            {result.others.length ? (
              <div className="rc-others">
                <h3 className="rc-others-title">Also part of the platform</h3>
                <ul>
                  {result.others.map((id) => (
                    <li key={id}><a href={moduleInfo[id].href}>{moduleInfo[id].title}</a></li>
                  ))}
                </ul>
              </div>
            ) : null}

            <details className="rc-answers">
              <summary>Review your answers</summary>
              <dl>
                {questions.map((qq, i) => {
                  const value = qq.kind === "homes" ? (homes.ok ? `${homes.value.toLocaleString("en-US")} homes` : "Not answered") : (optionFor(qq, answers)?.label ?? "Not answered");
                  return (
                    <div key={qq.id}>
                      <dt>{qq.topic}</dt>
                      <dd>
                        <span>{value}</span>
                        <button type="button" className="link-btn" onClick={() => go(i)}>Change<span className="sr-only"> {qq.topic.toLowerCase()}</span></button>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </details>
          </div>

          <aside id="rc-price" className="rc-results-side" aria-labelledby="rc-price-title">
            <div className="summary-card">
              <p id="rc-price-title" className="summary-title">Indicative price{managed ? " for this community" : ""}</p>
              <p className="summary-amount" key={est.monthlyCents}>{formatUSD(est.monthlyCents)}<span>a month</span></p>
              <ul className="breakdown">
                <li><span>Community subscription</span><span>{formatUSD(est.baseCents)}</span></li>
                <li><span>{est.totalUnits.toLocaleString("en-US")} homes × {formatUSD(cfg.standardRateCents)}</span><span>{formatUSD(est.variableCents)}</span></li>
                <li className="breakdown-total"><span>A year</span><span>{formatUSD(est.annualCents)}</span></li>
              </ul>
              <p className="rc-domain">Setting up your community&apos;s domain is free. <a href="/pricing/#domain">About domains</a></p>
              <div className="disclaimer">
                <p className="disclaimer-title">{cfg.copy.disclaimerTitle}</p>
                <p>{cfg.copy.shortDisclaimer} {cfg.copy.extras}</p>
              </div>
              <div className="summary-actions">
                <a href="/pricing/#quote" className="btn btn-primary">Request a quote <ArrowRight /></a>
                <a href="/demo/" className="btn btn-secondary">Book a demo</a>
              </div>
            </div>
            <button type="button" className="btn btn-quiet btn-sm rc-restart" onClick={restart}>Start again</button>
          </aside>
        </div>
      </section>
    );
  }

  if (!q) return null;
  const errorId = error ? "rc-error" : undefined;

  return (
    <form className="rc-card form-card" onSubmit={onSubmit} noValidate aria-label="Community readiness check">
      <div className="rc-progress">
        <p className="rc-progress-text">Question {step + 1} of {total}<span className="rc-progress-topic" aria-hidden="true"> · {q.topic}</span></p>
        <div className="rc-bar" aria-hidden="true"><i style={{ transform: `scaleX(${(step + 1) / total})` }} /></div>
      </div>

      <div className="rc-question" key={q.id}>
        {q.kind === "homes" ? (
          <div className="rc-homes">
            <h2 ref={headingRef} tabIndex={-1} className="rc-question-title">
              <label htmlFor="rc-homes">{q.title}</label>
            </h2>
            <p id="rc-homes-help" className="field-help">{q.help}</p>
            <input
              id="rc-homes"
              className="units-input rc-homes-input"
              inputMode="numeric"
              autoComplete="off"
              placeholder={`e.g. ${cfg.defaultUnits}`}
              value={homesText}
              onChange={(e) => { setHomesText(e.target.value); if (error) setError(""); }}
              aria-invalid={error ? true : undefined}
              aria-describedby={["rc-homes-help", errorId].filter(Boolean).join(" ")}
            />
          </div>
        ) : (
          <fieldset className="rc-fieldset" aria-describedby={errorId}>
            <legend className="rc-legend">
              <h2 ref={headingRef} tabIndex={-1} className="rc-question-title">{q.title}</h2>
            </legend>
            {q.help ? <p className="field-help">{q.help}</p> : null}
            <div className="rc-options">
              {q.options.map((o) => (
                <label key={o.value} className="mode-option rc-option" data-checked={answers[q.id] === o.value}>
                  <input
                    type="radio"
                    name={`rc-${q.id}`}
                    value={o.value}
                    checked={answers[q.id] === o.value}
                    onChange={() => { setAnswers((a) => ({ ...a, [q.id]: o.value })); setError(""); }}
                  />
                  <span className="mode-label">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {error ? <p id="rc-error" className="field-error" role="alert"><Alert width={16} height={16} />{error}</p> : null}
      </div>

      <div className="rc-nav">
        <button type="button" className="btn btn-secondary" onClick={() => go(step - 1)} disabled={step === 0}>Back</button>
        <button type="submit" className="btn btn-primary">{step === total - 1 ? "See my results" : "Next"} <ArrowRight /></button>
      </div>
      <p className="rc-privacy">{readiness.privacy}</p>
    </form>
  );
}

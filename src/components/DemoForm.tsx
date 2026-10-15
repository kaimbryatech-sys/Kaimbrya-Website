"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { config, demoPage } from "@/content/site";
import { Alert, ArrowRight, Check } from "./icons";

type Field = "name" | "email" | "org" | "type" | "size" | "phone" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter an email address like name@example.com.";
  if (!v.org.trim()) e.org = "Enter your organisation or community name.";
  if (!v.type) e.type = "Choose what best describes you.";
  if (!v.size) e.size = "Choose the approximate number of homes.";
  if (v.phone && !/^[+()\d\s-]{7,20}$/.test(v.phone.trim())) e.phone = "Enter a phone number using digits, spaces, + or -.";
  if (v.message.length > 1000) e.message = "Keep the message under 1,000 characters.";
  return e;
}

const ORDER: Field[] = ["name", "email", "org", "type", "size", "phone", "message"];

export function DemoForm() {
  const params = useSearchParams();
  const preset = demoPage.orgTypes.some((t) => t.value === params.get("type")) ? params.get("type")! : "";
  const [values, setValues] = useState<Values>({ name: "", email: "", org: "", type: preset, size: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    if (touched[field]) setErrors((cur) => ({ ...cur, [field]: validate(next)[field] }));
  };
  const blur = (field: Field) => () => {
    setTouched((cur) => ({ ...cur, [field]: true }));
    setErrors((cur) => ({ ...cur, [field]: validate(values)[field] }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched(Object.fromEntries(ORDER.map((f) => [f, true])));
    const first = ORDER.find((f) => found[f]);
    if (first) { formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    const honeypot = (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value;
    setState("sending");
    try {
      if (config.demoEndpoint && !honeypot) {
        const res = await fetch(config.demoEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, source: typeof window === "undefined" ? "" : window.location.href }),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        await new Promise((r) => setTimeout(r, 500)); // prototype: nothing is sent
      }
      setState("sent");
      requestAnimationFrame(() => headingRef.current?.focus());
    } catch {
      setState("failed");
    }
  };

  if (state === "sent") {
    const first = values.name.trim().split(/\s+/)[0];
    return (
      <div className="form-card success" role="status">
        <div className="success-icon"><Check /></div>
        <h2 ref={headingRef} tabIndex={-1}>Thank you, {first}.</h2>
        <p>We&apos;ll contact you at <strong>{values.email.trim()}</strong> to arrange a time for your demonstration.</p>
        {!config.demoEndpoint ? (
          <p className="prototype-note"><strong>Prototype:</strong> this request was not sent anywhere. Connect a demo-request endpoint before launch.</p>
        ) : null}
      </div>
    );
  }

  const field = (name: Field) => ({
    id: `f-${name}`,
    name,
    value: values[name],
    onChange: set(name),
    onBlur: blur(name),
    "aria-invalid": touched[name] && errors[name] ? true : undefined,
    "aria-describedby": touched[name] && errors[name] ? `f-${name}-error` : undefined,
  });
  const error = (name: Field) =>
    touched[name] && errors[name] ? <p id={`f-${name}-error`} className="field-error"><Alert width={16} height={16} />{errors[name]}</p> : null;

  return (
    <form ref={formRef} className="form-card" noValidate onSubmit={submit} aria-labelledby="demo-form-title">
      <h2 id="demo-form-title" className="sr-only">Demo request</h2>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="f-name">Full name</label>
          <input {...field("name")} autoComplete="name" required />
          {error("name")}
        </div>
        <div className="field">
          <label htmlFor="f-email">Work email</label>
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" required />
          {error("email")}
        </div>
        <div className="field field--full">
          <label htmlFor="f-org">Organisation or community</label>
          <input {...field("org")} autoComplete="organization" required />
          {error("org")}
        </div>
        <div className="field">
          <label htmlFor="f-type">What best describes you?</label>
          <select {...field("type")} required>
            <option value="">Choose one</option>
            {demoPage.orgTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          {error("type")}
        </div>
        <div className="field">
          <label htmlFor="f-size">Approximate number of homes</label>
          <select {...field("size")} required>
            <option value="">Choose a range</option>
            {demoPage.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {error("size")}
        </div>
        <div className="field field--full">
          <label htmlFor="f-phone">Phone or WhatsApp <span className="opt">(optional)</span></label>
          <input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" />
          {error("phone")}
        </div>
        <div className="field field--full" id="message">
          <label htmlFor="f-message">Anything we should know? <span className="opt">(optional)</span></label>
          <textarea {...field("message")} rows={4} maxLength={1200} />
          {error("message")}
        </div>
        <div className="hp" aria-hidden="true">
          <label htmlFor="f-website">Leave this empty</label>
          <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      <div className="form-foot">
        {state === "failed" ? (
          <p className="form-status form-status--error" role="alert">We couldn&apos;t send your request. Check your connection and try again.</p>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : <>Request my demo <ArrowRight /></>}
        </button>
        <p className="fine muted">We use these details only to arrange your demonstration.</p>
      </div>
    </form>
  );
}

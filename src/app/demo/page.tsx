import type { Metadata } from "next";
import { Suspense } from "react";
import { DemoForm } from "@/components/DemoForm";
import { demoPage } from "@/content/site";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "Arrange a walkthrough of Kaimbrya for your community, board or management team.",
};

export default function DemoPage() {
  return (
    <section className="demo" aria-labelledby="demo-title">
      <div className="wrap demo-grid">
        <div>
          <p className="eyebrow">{demoPage.eyebrow}</p>
          <h1 id="demo-title" className="title" style={{ marginTop: 16 }}>{demoPage.title}</h1>
          <p className="lead" style={{ marginTop: 18 }}>{demoPage.lead}</p>
          <ol className="demo-next">
            {demoPage.next.map((step) => (
              <li key={step.title}><span><strong>{step.title}</strong> {step.text}</span></li>
            ))}
          </ol>
        </div>
        {/* The form reads ?type= to pre-select the organisation type, so it renders on the client. */}
        <Suspense fallback={<div className="form-card" aria-busy="true" style={{ minHeight: 640 }} />}>
          <DemoForm />
        </Suspense>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { CtaBand, FaqList, PageHero, Reveal } from "@/components/blocks";
import { PricingSimulator } from "@/components/PricingSimulator";
import { pricingConfig as cfg } from "@/content/pricing-config";
import { formatUSD, standardEstimate } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Kaimbrya costs ${formatUSD(cfg.baseCents)} a month per community plus ${formatUSD(cfg.standardRateCents)} per home. Estimate your community's price, including developments with different property classes.`,
};

const example = standardEstimate(cfg.defaultUnits, cfg);

const faq = [
  { q: "Is this estimate a quote?", a: "No. It's a preliminary estimate for planning. Final pricing is confirmed in a personalized proposal and a signed agreement, after we've looked at your community's needs." },
  { q: "Do bedrooms or property type change the price?", a: `No. The standard price is the same ${formatUSD(cfg.standardRateCents)} for every home, whatever its size or type. If your development uses classes such as Ruby, Onyx or Diamond, the simulator lets you try illustrative per-class rates, but any different pricing is only ever agreed in a proposal.` },
  { q: "What if we don't know our exact property breakdown?", a: "An approximate number of homes is all you need for an estimate. If your community has different property classes, we'll review them with you during a personalized consultation." },
  { q: "Is anything not included in the estimate?", a: "Taxes, payment-processing charges, specialized integrations and onboarding services may be additional. Your proposal sets out exactly what's included. Setting up your community's domain is always free." },
  { q: "Do you charge to set up our community's domain?", a: "No. Domain setup is free, whether you're connecting a domain you already own or need help choosing and buying a new one. If you need a new domain, you pay the registrar's price to buy it and to renew it each year. We confirm that price with you before anything is bought, and the domain belongs to your community." },
  { q: "Which currency will we be billed in?", a: "The calculator shows US dollars. The billing currency and any exchange-rate terms are set in your proposal and agreement." },
  { q: "Does the calculator work out our maintenance fees?", a: "No. It estimates what Kaimbrya costs your community. Your maintenance fees are set by your community and aren't affected by this estimate." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        variant="center"
        eyebrow="Pricing"
        title="Simple, transparent pricing"
        emphasis="for your whole community."
        lead="One monthly subscription for the community, plus a small amount for each home. Estimate yours in a few seconds."
        primary={{ label: "Estimate your price", href: "#estimate" }}
        secondary={{ label: "Get a personalized quote", href: "#quote" }}
        visual={
          <div className="price-card">
            <p className="price-card-formula">
              <span className="price-part"><em>{formatUSD(cfg.baseCents)}</em><small>a month per community</small></span>
              <span className="price-plus" aria-label="plus">+</span>
              <span className="price-part"><em>{formatUSD(cfg.standardRateCents)}</em><small>per home, per month</small></span>
            </p>
            <p className="price-card-example">
              For example, {cfg.defaultUnits} homes: {formatUSD(example.monthlyCents)} a month. Indicative pricing; final pricing is confirmed in a proposal.
            </p>
          </div>
        }
      />

      <PricingSimulator />

      <section className="section bg-paper" aria-labelledby="faq-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="title">Pricing questions</h2>
          </Reveal>
          <FaqList items={faq} />
        </div>
      </section>

      <CtaBand
        title="See Kaimbrya with your community in mind."
        text="We'll walk your board or team through the parts that matter most to you, and answer your pricing questions."
        primary={{ label: "Book a demo", href: "/demo/" }}
        secondary={{ label: "Explore the platform", href: "/platform/" }}
      />
    </>
  );
}

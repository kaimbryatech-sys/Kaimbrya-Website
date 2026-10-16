/**
 * Pricing calculator: the single source of truth for every price, rate and assumption the
 * website shows. Amounts are integer US cents. No imports, so the calculation tests can load
 * it directly with Node.
 *
 * The standard price (US$150 per community + US$0.50 per home, monthly) is the published model.
 * The other per-home rates are illustrative simulation values only, pending commercial approval.
 */

export type PropertyClassDraft = {
  name: string;
  type: string;
  bedrooms: string;
  units: number;
  rateCents: number;
  description?: string;
};

export type Preset = {
  id: string;
  label: string;
  summary: string;
  mode: "standard" | "custom";
  units?: number;
  classes?: PropertyClassDraft[];
};

export const pricingConfig = {
  /** Shown on every estimate and attached to quote requests. Bump it whenever a value changes. */
  version: "2026-10-16.2",
  currency: "USD",
  baseCents: 15000,
  standardRateCents: 50,
  /** Illustrative per-home rates for the custom simulator. Subject to commercial approval. */
  rateOptionsCents: [40, 50, 65, 80, 100],
  maxUnitsPerClass: 100_000,
  maxClasses: 20,
  maxNameLength: 40,
  maxDescriptionLength: 160,
  /** Default starting point; labelled as an example in the interface. */
  defaultUnits: 190,
  slider: { min: 10, max: 1000, step: 10 },
  /**
   * Indicative Jamaican-dollar equivalents. Off at launch (USD only). To switch on, set a rate
   * and the date it was taken from a named source; the interface then shows JMD as indicative.
   */
  jmd: null as null | { rate: number; effectiveDate: string; source: string },
  propertyTypes: ["Apartment", "Condominium unit", "Townhouse", "Detached house", "Villa", "Duplex", "Other"],
  bedrooms: ["Studio", "1 bedroom", "2 bedrooms", "3 bedrooms", "4 bedrooms", "5+ bedrooms"],
  configurationTypes: ["Standard homes", "Mixed property types", "Classified development (custom classes)", "Not sure yet"],
  /**
   * Community domain setup is always free and never changes the subscription estimate. Registrar
   * charges (buying and renewing a new domain) are the community's own and are never estimated here.
   */
  domain: {
    choices: [
      { id: "own", label: "Yes, we already have a domain", status: "Already has a domain", help: "Help connecting an existing domain" },
      { id: "new", label: "No, we need help getting one", status: "Needs a new domain", help: "Help choosing, buying and setting up a new domain" },
      { id: "unsure", label: "Not sure. We'd like some guidance.", status: "Not sure", help: "Guidance during onboarding" },
    ],
    costs: [
      { item: "Help setting up your community's domain", cost: "Free" },
      { item: "Help purchasing a new domain", cost: "Free" },
      { item: "Purchasing a new domain", cost: "Registrar's price" },
      { item: "Annual domain renewal", cost: "Registrar's price" },
    ],
  },
  presets: [
    { id: "small", label: "Small community", summary: "50 homes", mode: "standard", units: 50 },
    { id: "gated", label: "Established gated community", summary: "190 homes", mode: "standard", units: 190 },
    { id: "large", label: "Large residential development", summary: "500 homes", mode: "standard", units: 500 },
    {
      id: "mixed", label: "Mixed residential development", summary: "Apartments, townhouses and villas", mode: "custom",
      classes: [
        { name: "Garden apartments", type: "Apartment", bedrooms: "2 bedrooms", units: 120, rateCents: 50 },
        { name: "Townhouses", type: "Townhouse", bedrooms: "3 bedrooms", units: 40, rateCents: 50 },
        { name: "Villas", type: "Villa", bedrooms: "4 bedrooms", units: 20, rateCents: 50 },
      ],
    },
    {
      id: "premium", label: "Premium classified development", summary: "Ruby, Onyx and Diamond example classes", mode: "custom",
      classes: [
        { name: "Ruby", type: "Villa", bedrooms: "3 bedrooms", units: 80, rateCents: 50, description: "Standard villa layout" },
        { name: "Onyx", type: "Villa", bedrooms: "3 bedrooms", units: 60, rateCents: 65, description: "Larger floor area" },
        { name: "Diamond", type: "Villa", bedrooms: "3 bedrooms", units: 50, rateCents: 80, description: "Premium finishing and extra outdoor space" },
      ],
    },
    { id: "own", label: "Create your own", summary: "Start from an empty list", mode: "custom", classes: [] },
  ] satisfies Preset[],
  copy: {
    shortDisclaimer: "Explore estimated pricing for your community. Final pricing is confirmed through a personalized proposal and signed agreement.",
    disclaimerTitle: "Indicative pricing only",
    disclaimer:
      "The prices displayed are preliminary estimates for planning and demonstration purposes. Final pricing may vary based on your community's property classifications, operational requirements, selected services, implementation needs, and agreed commercial terms. All quotations and pricing arrangements are subject to assessment, formal proposal, and contract finalization with Kaimbrya.",
    extras: "Taxes, payment-processing charges, specialized integrations and onboarding services may be additional. Community domain setup is always free. This estimate is the cost of Kaimbrya for your community; it doesn't calculate maintenance fees or what any homeowner owes.",
    illustrativeRates: "Rates other than US$0.50 are illustrative simulation values, not approved Kaimbrya prices.",
  },
};

export type PricingConfig = typeof pricingConfig;

/**
 * Pricing calculation engine for the website's estimate simulator.
 *
 * Deterministic and UI-independent: all money is integer US cents (no floating-point
 * arithmetic on amounts), formatting happens only at the edge, and every function takes the
 * rate card as an argument so it can be tested without the rest of the site.
 * This is an estimate, never an invoice or a quotation.
 */

export type RateCard = {
  baseCents: number;
  standardRateCents: number;
  rateOptionsCents: readonly number[];
  maxUnitsPerClass: number;
  maxClasses: number;
  addons: { ledger: { name: string; monthlyCents: number } };
};

/** Optional add-ons selected for the estimate. Each is charged once per community. */
export type AddonSelection = { ledger?: boolean };

export type ClassInput = { id: string; name: string; units: number; rateCents: number };
export type ClassResult = ClassInput & { subtotalCents: number };

export type Estimate = {
  classes: ClassResult[];
  totalUnits: number;
  baseCents: number;
  variableCents: number;
  /** Add-ons, once per community per month; included in monthly, annual, per-home and the standard comparison. */
  addonCents: number;
  ledger: boolean;
  monthlyCents: number;
  annualCents: number;
  /** Effective monthly cost per home, rounded half-up to the cent; null when there are no homes. */
  perUnitCents: number | null;
  standard: { variableCents: number; monthlyCents: number; annualCents: number };
  /** Custom minus standard, per month. Zero when every class uses the standard rate. */
  differenceCents: number;
  usesIllustrativeRates: boolean;
};

export type UnitsResult = { ok: true; value: number } | { ok: false; error: string };

/** Parses a typed number of homes. Accepts digits and thousands separators only. */
export function parseUnits(raw: string, max: number): UnitsResult {
  const text = raw.trim().replace(/[,\s]/g, "");
  if (text === "") return { ok: false, error: "Enter the number of homes." };
  if (/^-/.test(text)) return { ok: false, error: "The number of homes can't be negative." };
  if (!/^\d+$/.test(text)) return { ok: false, error: "Enter a whole number of homes, without decimals." };
  const value = Number(text);
  if (!Number.isSafeInteger(value) || value > max) return { ok: false, error: `Enter ${max.toLocaleString("en-US")} homes or fewer.` };
  return { ok: true, value };
}

function assertUnits(units: number, card: RateCard): void {
  if (!Number.isSafeInteger(units) || units < 0 || units > card.maxUnitsPerClass) {
    throw new RangeError(`Invalid number of homes: ${units}`);
  }
}

function assertRate(rateCents: number, card: RateCard): void {
  if (!card.rateOptionsCents.includes(rateCents)) throw new RangeError(`Rate not on the rate card: ${rateCents}`);
}

const roundHalfUp = (numerator: number, denominator: number) => Math.floor((2 * numerator + denominator) / (2 * denominator));

/** Estimate for one or more property classes. Throws on values the interface should have rejected. */
export function estimate(classes: readonly ClassInput[], card: RateCard, addons: AddonSelection = {}): Estimate {
  if (classes.length > card.maxClasses) throw new RangeError(`Too many classes: ${classes.length}`);
  const results = classes.map((c) => {
    assertUnits(c.units, card);
    assertRate(c.rateCents, card);
    return { ...c, subtotalCents: c.units * c.rateCents };
  });
  const totalUnits = results.reduce((sum, c) => sum + c.units, 0);
  const variableCents = results.reduce((sum, c) => sum + c.subtotalCents, 0);
  const ledger = addons.ledger === true;
  const addonCents = ledger ? card.addons.ledger.monthlyCents : 0;
  const monthlyCents = card.baseCents + variableCents + addonCents;
  const standardVariable = totalUnits * card.standardRateCents;
  // Like with like: the standard comparison carries the same add-ons.
  const standardMonthly = card.baseCents + standardVariable + addonCents;
  return {
    classes: results,
    totalUnits,
    baseCents: card.baseCents,
    variableCents,
    addonCents,
    ledger,
    monthlyCents,
    annualCents: monthlyCents * 12,
    perUnitCents: totalUnits > 0 ? roundHalfUp(monthlyCents, totalUnits) : null,
    standard: { variableCents: standardVariable, monthlyCents: standardMonthly, annualCents: standardMonthly * 12 },
    differenceCents: monthlyCents - standardMonthly,
    usesIllustrativeRates: results.some((c) => c.rateCents !== card.standardRateCents),
  };
}

/** The published model: one class of homes at the standard rate. */
export function standardEstimate(units: number, card: RateCard, addons: AddonSelection = {}): Estimate {
  return estimate([{ id: "standard", name: "Homes", units, rateCents: card.standardRateCents }], card, addons);
}

export type ClassErrors = { name?: string; units?: string; rate?: string };

/** Field errors for the class editor: blank or duplicate names, bad unit counts, off-card rates. */
export function validateClasses(
  classes: readonly { id: string; name: string; unitsText: string; rateCents: number }[],
  card: RateCard,
): Record<string, ClassErrors> {
  const errors: Record<string, ClassErrors> = {};
  const seen = new Map<string, number>();
  for (const c of classes) seen.set(c.name.trim().toLowerCase(), (seen.get(c.name.trim().toLowerCase()) ?? 0) + 1);
  for (const c of classes) {
    const e: ClassErrors = {};
    const key = c.name.trim().toLowerCase();
    if (!key) e.name = "Give this class a name.";
    else if ((seen.get(key) ?? 0) > 1) e.name = "Each class needs a different name.";
    const units = parseUnits(c.unitsText, card.maxUnitsPerClass);
    if (!units.ok) e.units = units.error;
    if (!card.rateOptionsCents.includes(c.rateCents)) e.rate = "Choose a rate from the list.";
    if (e.name || e.units || e.rate) errors[c.id] = e;
  }
  return errors;
}

/** "US$1,234.50" (or "-US$24.00"). Exact: built from integer cents, not floating-point division. */
export function formatUSD(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100).toLocaleString("en-US");
  return `${sign}US$${dollars}.${String(abs % 100).padStart(2, "0")}`;
}

/** Indicative local-currency amount, rounded to whole dollars. Only for display; never stored. */
export function formatJMD(cents: number, rate: number): string {
  return `J$${Math.round((cents * rate) / 100).toLocaleString("en-US")}`;
}

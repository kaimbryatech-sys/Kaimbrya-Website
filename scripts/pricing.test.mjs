// Calculation tests for the pricing simulator (Node's built-in runner; no extra dependencies).
//   npm run test:pricing
import test from "node:test";
import assert from "node:assert/strict";
import { estimate, formatUSD, parseUnits, standardEstimate, validateClasses } from "../src/lib/pricing.ts";
import { pricingConfig as card } from "../src/content/pricing-config.ts";

const cls = (name, units, rateCents = 50, id = name) => ({ id, name, units, rateCents });
const premium = [cls("Ruby", 80, 50), cls("Onyx", 60, 65), cls("Diamond", 50, 80)];

test("190 standard homes = US$245.00/month", () => {
  const e = standardEstimate(190, card);
  assert.equal(e.monthlyCents, 24500);
  assert.equal(formatUSD(e.monthlyCents), "US$245.00");
  assert.equal(e.variableCents, 9500);
});
test("50 standard homes = US$175.00/month", () => assert.equal(standardEstimate(50, card).monthlyCents, 17500));
test("500 standard homes = US$400.00/month", () => assert.equal(standardEstimate(500, card).monthlyCents, 40000));

test("Ruby/Onyx/Diamond example: US$119.00 charges, US$269.00/month, +US$24.00 vs standard", () => {
  const e = estimate(premium, card);
  assert.deepEqual(e.classes.map((c) => c.subtotalCents), [4000, 3900, 4000]);
  assert.equal(e.variableCents, 11900);
  assert.equal(e.monthlyCents, 26900);
  assert.equal(e.standard.monthlyCents, 24500);
  assert.equal(e.differenceCents, 2400);
  assert.equal(formatUSD(e.differenceCents), "US$24.00");
  assert.equal(e.usesIllustrativeRates, true);
});

test("classes sharing type and bedrooms stay independent (Ruby and Diamond, both 3-bed villas)", () => {
  const e = estimate([cls("Ruby", 10, 50), cls("Diamond", 10, 80)], card);
  assert.equal(e.classes.length, 2);
  assert.deepEqual(e.classes.map((c) => c.subtotalCents), [500, 800]);
});

test("all custom classes at US$0.50 equal standard pricing", () => {
  const e = estimate([cls("A", 120), cls("B", 40), cls("C", 30)], card);
  assert.equal(e.monthlyCents, standardEstimate(190, card).monthlyCents);
  assert.equal(e.differenceCents, 0);
  assert.equal(e.usesIllustrativeRates, false);
});

test("adding and removing a class moves units and totals", () => {
  const two = estimate(premium.slice(0, 2), card);
  const three = estimate(premium, card);
  assert.equal(three.totalUnits - two.totalUnits, 50);
  assert.equal(three.monthlyCents - two.monthlyCents, 4000);
});

test("bedrooms, property type and name never change the rate (only rateCents is priced)", () => {
  const a = estimate([{ ...cls("Ruby", 80), type: "Villa", bedrooms: "3 bedrooms" }], card);
  const b = estimate([{ ...cls("Renamed", 80), type: "Apartment", bedrooms: "Studio" }], card);
  assert.equal(a.monthlyCents, b.monthlyCents);
});

test("zero homes: base subscription only, no per-home figure", () => {
  const e = standardEstimate(0, card);
  assert.equal(e.monthlyCents, 15000);
  assert.equal(e.perUnitCents, null);
});

test("annual = 12 x monthly", () => {
  for (const n of [0, 1, 50, 190, 999, 100000]) assert.equal(standardEstimate(n, card).annualCents, standardEstimate(n, card).monthlyCents * 12);
});

test("effective cost per home rounds half-up to the cent", () => {
  assert.equal(estimate(premium, card).perUnitCents, 142); // 26900 / 190 = 141.58
  assert.equal(standardEstimate(1, card).perUnitCents, 15050);
  assert.equal(standardEstimate(400, card).perUnitCents, 88); // 35000 / 400 = 87.5 -> 88
  assert.equal(standardEstimate(3, card).perUnitCents, 5050); // 15150 / 3 = 5050
});

test("standard comparison prices every home at US$0.50", () => {
  const e = estimate([cls("A", 100, 100), cls("B", 100, 40)], card);
  assert.equal(e.standard.variableCents, 200 * 50);
});

test("parseUnits accepts whole numbers and separators", () => {
  assert.deepEqual(parseUnits("190", 100000), { ok: true, value: 190 });
  assert.deepEqual(parseUnits(" 1,200 ", 100000), { ok: true, value: 1200 });
  assert.deepEqual(parseUnits("0", 100000), { ok: true, value: 0 });
});

test("parseUnits rejects negative, decimal, blank, malformed and excessive input", () => {
  for (const bad of ["-5", "12.5", "", "   ", "abc", "1e3", "12a", "100001", "99999999999999999999"]) {
    assert.equal(parseUnits(bad, 100000).ok, false, `should reject ${JSON.stringify(bad)}`);
  }
});

test("estimate rejects off-card rates, bad unit counts and too many classes", () => {
  assert.throws(() => estimate([cls("A", 10, 55)], card), RangeError);
  assert.throws(() => estimate([cls("A", -1)], card), RangeError);
  assert.throws(() => estimate([cls("A", 1.5)], card), RangeError);
  assert.throws(() => estimate([cls("A", 100001)], card), RangeError);
  assert.throws(() => estimate(Array.from({ length: 21 }, (_, i) => cls(`C${i}`, 1)), card), RangeError);
});

test("largest allowed scenario stays exact (20 classes x 100,000 homes at US$1.00)", () => {
  const e = estimate(Array.from({ length: 20 }, (_, i) => cls(`C${i}`, 100000, 100)), card);
  assert.equal(e.totalUnits, 2_000_000);
  assert.equal(e.monthlyCents, 15000 + 2_000_000 * 100);
  assert.equal(formatUSD(e.monthlyCents), "US$2,000,150.00");
});

test("validateClasses flags blank and duplicate names (case- and space-insensitive) and bad counts", () => {
  const errors = validateClasses([
    { id: "1", name: "Ruby", unitsText: "80", rateCents: 50 },
    { id: "2", name: " ruby ", unitsText: "60", rateCents: 65 },
    { id: "3", name: "", unitsText: "-2", rateCents: 50 },
    { id: "4", name: "Diamond", unitsText: "50", rateCents: 80 },
    { id: "5", name: "Onyx", unitsText: "5", rateCents: 70 },
  ], card);
  assert.ok(errors["1"].name && errors["2"].name);
  assert.ok(errors["3"].name && errors["3"].units);
  assert.equal(errors["4"], undefined);
  assert.ok(errors["5"].rate);
});

test("formatUSD is exact and handles negatives and rounding boundaries", () => {
  assert.equal(formatUSD(0), "US$0.00");
  assert.equal(formatUSD(5), "US$0.05");
  assert.equal(formatUSD(-2400), "-US$24.00");
  assert.equal(formatUSD(123456789), "US$1,234,567.89");
  // 0.65 x 3 is 1.9500000000000002 in floating point; integer cents keep it exact
  assert.equal(formatUSD(estimate([cls("A", 3, 65)], card).variableCents), "US$1.95");
});

test("every preset produces a valid estimate", () => {
  for (const p of card.presets) {
    const e = p.mode === "standard" ? standardEstimate(p.units, card) : estimate((p.classes ?? []).map((c, i) => ({ id: String(i), ...c })), card);
    assert.ok(e.monthlyCents >= card.baseCents, p.id);
  }
});

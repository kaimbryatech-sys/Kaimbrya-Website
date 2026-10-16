/**
 * Domain names typed into the pricing page's domain question. This only tidies and checks the
 * format of what a visitor typed; it never looks a name up, reserves it or contacts a registrar.
 * No imports, so the tests can load it directly with Node.
 */

export type DomainCheck = { ok: true; value: string } | { ok: false; error: string };

const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const TLD = /^(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;
const FORMAT = "Enter a domain like yourcommunity.com, using letters, numbers and hyphens.";

/** Empty is allowed (the question is optional). Returns the tidied name, e.g. "Https://WWW.Example.com/" → "www.example.com". */
export function normalizeDomain(raw: string): DomainCheck {
  let s = raw.trim().toLowerCase();
  if (!s) return { ok: true, value: "" };
  if (s.includes("@")) return { ok: false, error: "That looks like an email address. Enter just the domain, like yourcommunity.com." };
  if (/\s/.test(s)) return { ok: false, error: "Enter the domain without spaces, like yourcommunity.com." };
  s = (s.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").split(/[/?#]/, 1)[0] ?? "").replace(/:\d+$/, "").replace(/\.$/, "");
  if (/[^\x00-\x7f]/.test(s)) {
    // Accented names (e.g. bücher.com) become their registry form (xn--bcher-kva.com).
    try { s = new URL(`http://${s}`).hostname; } catch { return { ok: false, error: FORMAT }; }
  }
  if (s.length > 253) return { ok: false, error: "That's longer than a domain name can be." };
  const labels = s.split(".");
  if (labels.length < 2) return { ok: false, error: "Include the ending, like .com or .com.jm." };
  if (!labels.every((l) => LABEL.test(l))) return { ok: false, error: FORMAT };
  if (!TLD.test(labels[labels.length - 1] ?? "")) return { ok: false, error: "Include the ending, like .com or .com.jm." };
  return { ok: true, value: s };
}

// Format checks for the pricing page's domain question (Node's built-in runner).
//   npm test
import test from "node:test";
import assert from "node:assert/strict";
import { normalizeDomain } from "../src/lib/domain.ts";

const ok = (input, value) => assert.deepEqual(normalizeDomain(input), { ok: true, value }, input);
const bad = (input, fragment) => {
  const r = normalizeDomain(input);
  assert.equal(r.ok, false, input);
  if (fragment) assert.match(r.error, fragment, input);
};

test("empty is allowed: the question is optional", () => { ok("", ""); ok("   ", ""); });
test("plain and Jamaican domains", () => {
  ok("mahoeridge.com", "mahoeridge.com");
  ok("portal.mahoeridge.com.jm", "portal.mahoeridge.com.jm");
  ok("my-community.org.jm", "my-community.org.jm");
});
test("tidies case, spaces around, scheme, path, port and a trailing dot", () => {
  ok("  MahoeRidge.COM ", "mahoeridge.com");
  ok("https://www.mahoeridge.com/residents?x=1", "www.mahoeridge.com");
  ok("http://mahoeridge.com:8080", "mahoeridge.com");
  ok("mahoeridge.com.", "mahoeridge.com");
});
test("accented names become their registry form", () => ok("bücher.com", "xn--bcher-kva.com"));
test("needs an ending", () => { bad("mahoeridge", /ending/); bad("mahoeridge.c", /ending/); bad("mahoeridge.123", /ending/); });
test("rejects spaces and email addresses", () => { bad("mahoe ridge.com", /spaces/); bad("board@mahoeridge.com", /email/); });
test("rejects bad labels", () => {
  bad("-mahoe.com"); bad("mahoe-.com"); bad("mahoe..com"); bad(".com"); bad("mahoe_ridge.com");
  bad(`${"a".repeat(64)}.com`);
});
test("rejects names longer than 253 characters", () => bad(`${Array(64).fill("abc").join(".")}.com`, /longer/));
test("accepts the longest valid label", () => ok(`${"a".repeat(63)}.com`, `${"a".repeat(63)}.com`));

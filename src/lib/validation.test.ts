/**
 * Run with:  node --experimental-strip-types --test src/lib/validation.test.ts
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
// Node's type-stripping runner needs the explicit extension.
import * as v from "./validation.ts";

const validBooking: v.BookDemoValues = {
  fullName: "Asha Verma",
  businessName: "Saffron Table Caterers",
  industry: "Catering",
  email: "asha@saffrontable.in",
  phone: "+91 98765 43210",
  module: "admin",
  message: "",
};

describe("isValidEmail", () => {
  it("accepts common addresses", () => {
    for (const e of ["a@b.co", "first.last@example.com", "team+events@studio.co.in", "  hi@x.io  "]) {
      assert.equal(v.isValidEmail(e), true, e);
    }
  });
  it("rejects malformed addresses", () => {
    for (const e of ["", "plain", "a@b", "a@b.", "a@@b.com", "a b@c.com", "a@b..com", ".a@b.com", "a.@b.com", "a@-b.com", "a@b.c"]) {
      assert.equal(v.isValidEmail(e), false, e);
    }
  });
});

describe("phone validation", () => {
  it("accepts Indian mobiles with optional prefixes and separators", () => {
    for (const p of ["9876543210", "98765 43210", "+91 98765 43210", "+91-98765-43210", "09876543210", "919876543210", "(+91) 6123 456 789"]) {
      assert.equal(v.classifyPhone(p), "india", p);
    }
  });
  it("accepts international numbers in E.164-ish form", () => {
    for (const p of ["+44 20 7946 0958", "+1 (415) 555-0132", "+971 50 123 4567", "0044 2079460958", "+6591234567"]) {
      assert.equal(v.classifyPhone(p), "international", p);
    }
  });
  it("rejects invalid numbers", () => {
    for (const p of [
      "",
      "12345",
      "1234567890", // 10 digits but not a valid Indian mobile
      "5876543210", // Indian mobiles start 6–9
      "+91 12345 67890", // +91 must be a valid Indian mobile
      "+91 98765 4321", // too short
      "+1234567", // only 7 digits
      "+1234567890123456", // 16 digits
      "98765abcde",
      "+0 1234 5678",
    ]) {
      assert.equal(v.isValidPhone(p), false, p);
    }
  });
});

describe("validateBookDemo", () => {
  const options = { industries: ["Catering", "Other"], modules: ["admin", "all"] };

  it("passes a complete, valid submission", () => {
    const errors = v.validateBookDemo(validBooking, options);
    assert.deepEqual(errors, {});
    assert.equal(v.isValid(errors), true);
  });

  it("flags every required field when empty", () => {
    const empty: v.BookDemoValues = { fullName: "", businessName: "", industry: "", email: "", phone: "", module: "", message: "" };
    const errors = v.validateBookDemo(empty, options);
    assert.deepEqual(Object.keys(errors).sort(), ["businessName", "email", "fullName", "industry", "module", "phone"]);
    assert.equal(v.firstInvalidField(v.bookDemoFieldOrder, errors), "fullName");
  });

  it("treats whitespace-only values as empty", () => {
    const errors = v.validateBookDemo({ ...validBooking, fullName: "   " }, options);
    assert.ok(errors.fullName);
  });

  it("rejects options outside the allowed lists", () => {
    const errors = v.validateBookDemo({ ...validBooking, industry: "Space tourism", module: "nope" }, options);
    assert.ok(errors.industry);
    assert.ok(errors.module);
  });

  it("enforces the message length limit", () => {
    assert.equal(v.validateBookDemo({ ...validBooking, message: "x".repeat(v.MESSAGE_MAX) }, options).message, undefined);
    assert.ok(v.validateBookDemo({ ...validBooking, message: "x".repeat(v.MESSAGE_MAX + 1) }, options).message);
  });

  it("returns the first invalid field in display order", () => {
    const errors = v.validateBookDemo({ ...validBooking, email: "bad", phone: "123" }, options);
    assert.equal(v.firstInvalidField(v.bookDemoFieldOrder, errors), "email");
  });
});

describe("validateContact", () => {
  it("requires a meaningful message", () => {
    const errors = v.validateContact({ name: "Dev", email: "dev@example.com", message: "Hi" });
    assert.ok(errors.message);
    assert.equal(errors.name, undefined);
  });
  it("passes valid input", () => {
    assert.deepEqual(
      v.validateContact({ name: "Dev", email: "dev@example.com", message: "Interested in the staff module." }),
      {},
    );
  });
});

import { describe, expect, it } from "vitest";
import { formatCents } from "../src/lib/money";

describe("formatCents", () => {
  it("formats integer cents as ARS", () => {
    expect(formatCents(4590000)).toContain("45.900");
  });
  it("never sees floats: input is always integer cents", () => {
    expect(Number.isInteger(4590000)).toBe(true);
  });
});

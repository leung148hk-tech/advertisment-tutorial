import { describe, expect, it } from "vitest";
import { normaliseHongKongPhone } from "./ParentLeadForm";

describe("normaliseHongKongPhone", () => {
  it("accepts 8-digit Hong Kong numbers and optional +852 formatting", () => {
    expect(normaliseHongKongPhone("9123 4567")).toBe("91234567");
    expect(normaliseHongKongPhone("+852 (9123) 4567")).toBe("91234567");
  });

  it("rejects invalid length, non-Hong-Kong prefixes, and nonnumeric numbers", () => {
    expect(normaliseHongKongPhone("9123456")).toBeNull();
    expect(normaliseHongKongPhone("+8613812345678")).toBeNull();
    expect(normaliseHongKongPhone("11234567")).toBeNull();
    expect(normaliseHongKongPhone("nine1234")).toBeNull();
  });
});

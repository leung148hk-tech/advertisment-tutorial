import { describe, expect, it } from "vitest";
import { PRIMARY_MATH_FRAMEWORK, primaryMathSelectionGroup } from "./primaryMathFramework";

describe("primary mathematics framework", () => {
  it("defines five distinct parent-facing domains for every primary grade", () => {
    for (const grade of ["P1", "P2", "P3", "P4", "P5", "P6"] as const) {
      const domains = PRIMARY_MATH_FRAMEWORK[grade];
      expect(domains).toHaveLength(5);
      expect(new Set(domains.map((domain) => domain.label)).size).toBe(5);
      expect(domains.every((domain) => domain.description.length > 8)).toBe(true);
      expect(new Set(domains.map((_, index) => primaryMathSelectionGroup(grade, index))).size).toBe(5);
    }
  });

  it("keeps the requested spiral progression from P1 whole numbers to P6 equations and data", () => {
    expect(PRIMARY_MATH_FRAMEWORK.P1.map((item) => item.label).join(" ")).toMatch(/100 以內數|基本加減|港幣/);
    expect(PRIMARY_MATH_FRAMEWORK.P2.map((item) => item.label).join(" ")).toMatch(/1000|乘除|象形圖/);
    expect(PRIMARY_MATH_FRAMEWORK.P3.map((item) => item.label).join(" ")).toMatch(/10,000|分數|周界/);
    expect(PRIMARY_MATH_FRAMEWORK.P4.map((item) => item.label).join(" ")).toMatch(/因數|面積|長條圖/);
    expect(PRIMARY_MATH_FRAMEWORK.P5.map((item) => item.label).join(" ")).toMatch(/百分比|體積|代數|平均數/);
    expect(PRIMARY_MATH_FRAMEWORK.P6.map((item) => item.label).join(" ")).toMatch(/百分比|圓與坐標|速度|方程|圓形圖/);
  });
});

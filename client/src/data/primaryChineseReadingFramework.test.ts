import { describe, expect, it } from "vitest";
import { PRIMARY_CHINESE_READING_FRAMEWORK } from "./primaryChineseReadingFramework";

describe("primary Chinese reading framework", () => {
  it("gives every primary grade five curriculum-facing reading domains", () => {
    for (const [grade, framework] of Object.entries(PRIMARY_CHINESE_READING_FRAMEWORK)) {
      expect(framework.domains, `${grade} should have five domains`).toHaveLength(5);
      expect(new Set(framework.domains.map((domain) => domain.label)).size).toBe(5);
      expect(framework.domains.some((domain) => domain.label.includes("情境推理"))).toBe(false);
    }
  });

  it("keeps the requested spiral progression from early literacy to comparative reading", () => {
    expect(PRIMARY_CHINESE_READING_FRAMEWORK.P1.domains.map((domain) => domain.label)).toContain("字形、筆畫與部首");
    expect(PRIMARY_CHINESE_READING_FRAMEWORK.P2.domains.map((domain) => domain.label)).toContain("詞義辨析與查字典");
    expect(PRIMARY_CHINESE_READING_FRAMEWORK.P3.domains.map((domain) => domain.label)).toContain("複句、標點與專名");
    expect(PRIMARY_CHINESE_READING_FRAMEWORK.P3.domains.map((domain) => domain.label)).toContain("倒敘與實用文閱讀");
    expect(PRIMARY_CHINESE_READING_FRAMEWORK.P4.domains.map((domain) => domain.label)).toContain("寓言、神話與說明文");
    expect(PRIMARY_CHINESE_READING_FRAMEWORK.P5.domains.map((domain) => domain.label)).toContain("議論與散文閱讀");
    expect(PRIMARY_CHINESE_READING_FRAMEWORK.P6.domains.map((domain) => domain.label)).toContain("比較閱讀與觀點證據");
  });
});

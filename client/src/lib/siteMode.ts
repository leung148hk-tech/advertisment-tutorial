export const isGitHubPages = import.meta.env.VITE_GITHUB_PAGES === "true";

export const OFFICIAL_SITE_URL = "https://learnquiz-pe8vp32z.manus.space";
export const STATIC_CENTRAL_WHATSAPP = "85268035342";

export const STATIC_FEATURED_CENTRES = [
  {
    id: 1,
    name: "言點教育 WELITedu",
    description: "用心指導，燃點你心，陪伴學生一起成長。提供拔尖補底與分級學習支援。",
    district: "荃灣區",
    region: "新界",
    subjects: '["中文","英文","數學","Science"]',
    supportedGrades: '["小一","小六"]',
  },
] as const;

export function officialSiteUrl(path = "/") {
  return new URL(path, OFFICIAL_SITE_URL).toString();
}

export const officialLogoUrl = officialSiteUrl("/manus-storage/learning-compass-mark_3de5f85b.png");

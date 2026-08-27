/** Learning Compass / 學習航圖: true partnership coverage only. */
import { Building2, CheckCircle2, MapPin, MessageCircle, UsersRound } from "lucide-react";
import React, { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { isGitHubPages, STATIC_CENTRAL_WHATSAPP, STATIC_FEATURED_CENTRES } from "@/lib/siteMode";

type Ability = { topic: string; total: number; correct: number; percentage: number; state: string };
const GROUPS = [{ region: "港島", items: ["中西區", "灣仔區", "東區", "南區"] }, { region: "九龍", items: ["油尖旺區", "深水埗區", "九龍城區", "黃大仙區", "觀塘區"] }, { region: "新界", items: ["葵青區", "荃灣區", "屯門區", "元朗區", "北區", "大埔區", "沙田區", "西貢區", "離島區"] }];
const DISTRICT_TO_REGION = Object.fromEntries(GROUPS.flatMap((group) => group.items.map((item) => [item, group.region])));
const parseList = (value: string) => { try { return JSON.parse(value) as string[]; } catch { return []; } };
export type PublicCentreCoverage = { district: string };
export const filterCentresByCoverage = <T extends PublicCentreCoverage>(centres: T[], district: string, region: string) => centres.filter((centre) => {
  if (district) return centre.district === district;
  if (region === "全部地區") return true;
  return DISTRICT_TO_REGION[centre.district] === region;
});
const isReading = (topic: string) => /閱讀|Vocabulary|Reading comprehension|Reading details|Reading inference|Text connection|Integrated reading/.test(topic);
const isMath = (topic: string) => /數|代數|比例|Geometry|Statistics|Multi-step|Algebra|Ratio/.test(topic);
const supportFor = (topic: string) => {
  if (isMath(topic)) return { title: "數學考試支援", focus: `${topic}、常見題型與步驟檢查`, revision: "四天起步：重溫公式或概念；完成 5 題同類校內題；逐步寫出運算；最後以 2 題文字題檢查方法。" };
  if (isReading(topic)) return { title: "閱讀理解支援", focus: `${topic}、關鍵詞、證據與作答策略`, revision: "四天起步：圈出關鍵詞；回答誰、甚麼、為何；找出支持答案的句子；最後以一句完整說話回應題目。" };
  return { title: "寫作與語基支援", focus: `${topic}、句子、段落與修訂`, revision: "四天起步：寫中心句；補上一個具體例子；使用連接詞；讀出段落並修訂不清楚的表達。" };
};

export default function RegionalSupport({ gradeLabel, trackLabel, abilities, homeDistrict }: { gradeLabel: string; trackLabel: string; abilities: Ability[]; homeDistrict?: string }) {
  const [region, setRegion] = useState(homeDistrict ? DISTRICT_TO_REGION[homeDistrict] ?? "全部地區" : "全部地區");
  const [district, setDistrict] = useState(homeDistrict || "");
  const weakAreas = useMemo(() => abilities.filter((item) => item.correct < 2 && item.total >= 4), [abilities]);
  const centralContact = trpc.assessment.centralContact.useQuery(undefined, { enabled: !isGitHubPages });
  const featured = trpc.centres.featured.useQuery(undefined, { enabled: !isGitHubPages });
  const centres = isGitHubPages ? [...STATIC_FEATURED_CENTRES] : featured.data ?? [];
  const centralWhatsApp = isGitHubPages ? STATIC_CENTRAL_WHATSAPP : centralContact.data?.whatsapp;
  const visibleDistricts = region === "全部地區" ? GROUPS.flatMap((group) => group.items) : GROUPS.find((group) => group.region === region)?.items ?? [];
  const activeCentres = useMemo(() => filterCentresByCoverage(centres, district, region), [centres, district, region]);
  const coveredDistricts = useMemo(() => new Set(centres.map((centre) => centre.district)), [centres]);
  const openWhatsApp = (topic: string, centreName?: string) => { if (!centralWhatsApp) return; const area = district || region === "全部地區" ? district || "香港" : region; const text = centreName ? `你好，我想由學習航圖了解 ${centreName} 在${area}提供的 ${gradeLabel}${trackLabel}「${topic}」支援及轉介流程。` : `你好，我居住於${area}，想了解 ${gradeLabel}${trackLabel}「${topic}」的學習支援。若日後有合作中心，請通知我。`; window.open(`https://wa.me/${centralWhatsApp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer"); };
  const emptyTitle = district ? `${district}暫未有已確認合作中心` : region === "全部地區" ? "現時合作覆蓋只包括荃灣區" : `${region}地區暫未有更多已確認合作中心`;
  const pendingCount = 18 - coveredDistricts.size;

  return <section className="regional-support" data-pdf-ignore="true"><div className="regional-heading"><div><p className="eyebrow"><MapPin size={16} /> 真實合作覆蓋</p><h2>按弱項與居住地區，查看目前可安排的支援。</h2><p>現時只顯示已確認合作資料。言點教育 WELITedu 覆蓋新界荃灣區；其餘地區會清楚標示為待合作中心加入，不會以示範資料代替。</p></div><div className="region-filter"><div>{["全部地區", ...GROUPS.map((group) => group.region)].map((item) => <button key={item} className={region === item ? "region-chip region-chip-active" : "region-chip"} onClick={() => { setRegion(item); if (item !== "全部地區" && district && DISTRICT_TO_REGION[district] !== item) setDistrict(""); }}>{item}</button>)}</div><select aria-label="選擇香港十八區" value={district} onChange={(event) => setDistrict(event.target.value)}><option value="">{region === "全部地區" ? "所有十八區" : `所有${region}地區`}</option>{visibleDistricts.map((item) => <option key={item} value={item}>{item}{coveredDistricts.has(item) ? " · 已有合作" : " · 待合作"}</option>)}</select></div></div>
    <div className="coverage-summary"><span><CheckCircle2 size={16} />目前已確認覆蓋 <strong>{coveredDistricts.size} / 18</strong> 區</span><span><UsersRound size={16} />其餘 <strong>{pendingCount}</strong> 區待合作中心加入</span></div>
    {weakAreas.length && activeCentres.length ? <div className="regional-support-grid">{weakAreas.map((area, index) => { const support = supportFor(area.topic); const centre = activeCentres[index % activeCentres.length]; return <article className="regional-support-card regional-support-card-real" key={area.topic}><span>0{index + 1}</span><p className="real-centre-chip"><CheckCircle2 size={13} /> 已確認合作 · {centre.district}</p><h3>{area.topic}</h3><p className="regional-score">本次答對 <strong>{area.correct} / {area.total}</strong> 題</p><div className="revision-tip"><strong>針對性溫習建議</strong><p>{support.revision}</p></div><dl><div><dt>現有合作中心</dt><dd>{centre.name}</dd></div><div><dt>合作覆蓋</dt><dd>{centre.district}</dd></div><div><dt>推薦支援</dt><dd>{support.title}</dd></div><div><dt>支援方向</dt><dd>{support.focus}</dd></div><div><dt>中心資料</dt><dd>{parseList(centre.subjects).slice(0, 5).join("、") || "待補充"}</dd></div></dl><button disabled={(!isGitHubPages && centralContact.isLoading) || !centralWhatsApp} className="whatsapp-support-button" onClick={() => openWhatsApp(area.topic, centre.name)}><MessageCircle size={17} />由學習航圖安排轉介</button></article>; })}</div> : <div className="regional-pending"><div className="regional-pending-icon"><Building2 size={26} /></div><div><p className="pending-label">待合作中心加入</p><h3>{weakAreas.length ? emptyTitle : "本次沒有符合弱項門檻的面向"}</h3><p>{weakAreas.length ? "學習航圖現時不會以示範中心代替真實合作資料。你可先聯絡我們了解學習方向；新增該區合作中心後，才會提供正式轉介。" : "可查看完整報告，並按孩子較感興趣的能力安排延伸練習。"}</p>{weakAreas.length && <button disabled={(!isGitHubPages && centralContact.isLoading) || !centralWhatsApp} className="regional-pending-button" onClick={() => openWhatsApp(weakAreas[0].topic)}><MessageCircle size={16} />通知我有新合作支援</button>}</div></div>}
    <p className="regional-transparency"><strong>合作資料說明：</strong> 目前只有新界荃灣區的言點教育 WELITedu 為已確認合作中心。中心公開資訊僅用作介紹；所有查詢先由學習航圖處理，只有家長確認選定中心後，才會按本次安排分享最少必要資料。</p></section>;
}

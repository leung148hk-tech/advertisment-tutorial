/** Learning Compass / 學習航圖: private, filterable next-step support cards. */
import { CheckCircle2, MapPin, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

type Ability = { topic: string; total: number; correct: number; percentage: number; state: string };
type Region = "全部地區" | "港島" | "九龍" | "新界";
const REGIONS: Region[] = ["全部地區", "港島", "九龍", "新界"];

function isReading(topic: string) { return /閱讀|Vocabulary|Reading details|Reading inference|Text connection|Integrated reading/.test(topic); }
function isMath(topic: string) { return /數|分數|比例|圖形|量度|時間|統計|資料|解題/.test(topic); }
function supportFor(topic: string) {
  if (isMath(topic)) return { title: "數學弱項支援（示範推薦）", focus: `${topic}、圖像化解題與步驟檢查`, format: "小班分步策略練習", revision: "四天起步：先以圖像或實物重溫概念；完成 5 題同類短題；把方法說給家長聽；最後做 2 題生活情境題並檢查步驟。" };
  if (isReading(topic)) return { title: "閱讀理解支援（示範推薦）", focus: `${topic}、關鍵詞與證據尋找`, format: "小組閱讀策略班", revision: "四天起步：每天閱讀一小段文字；圈出關鍵詞；回答誰、甚麼、為何；找一句支持答案的證據；最後用自己的說話重述主旨。" };
  return { title: "寫作基礎支援（示範推薦）", focus: `${topic}、句子、段落與修訂`, format: "小班寫作基礎班", revision: "四天起步：先寫一個中心句；加入一個具體例子；用連接詞串連句子；讀出文章並修訂不清楚的地方。" };
}

export default function RegionalSupport({ gradeLabel, trackLabel, abilities }: { gradeLabel: string; trackLabel: string; abilities: Ability[] }) {
  const [region, setRegion] = useState<Region>("全部地區");
  const weakAreas = useMemo(() => abilities.filter((item) => item.correct < 2 && item.total >= 4), [abilities]);
  const openWhatsApp = (topic: string) => {
    const regionText = region === "全部地區" ? "港島、九龍或新界" : region;
    const text = `你好，我想了解 ${gradeLabel}${trackLabel}「${topic}」的支援安排。希望查詢 ${regionText} 的課程資料。`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };
  return <section className="regional-support" data-pdf-ignore="true"><div className="regional-heading"><div><p className="eyebrow"><MapPin size={16} /> 地區化弱項支援</p><h2>按弱項與居住地區，找下一步支援。</h2><p>以下只顯示本次符合弱項門檻的能力面向；所有機構資訊目前均為示範資料。</p></div><div className="region-filter" aria-label="選擇居住地區">{REGIONS.map((item) => <button key={item} className={region === item ? "region-chip region-chip-active" : "region-chip"} onClick={() => setRegion(item)}>{item}</button>)}</div></div>{weakAreas.length ? <div className="regional-support-grid">{weakAreas.map((area, index) => { const support = supportFor(area.topic); const serviceRegion = region === "全部地區" ? "港島、九龍、新界" : region; return <article className="regional-support-card" key={area.topic}><span>0{index + 1}</span><p className="demo-chip">合作支援示範推薦 · {serviceRegion}</p><h3>{area.topic}</h3><p className="regional-score">本次答對 <strong>{area.correct} / {area.total}</strong> 題</p><div className="revision-tip"><strong>針對性溫習建議</strong><p>{support.revision}</p></div><dl><div><dt>推薦支援</dt><dd>{support.title}</dd></div><div><dt>適合內容</dt><dd>{support.focus}</dd></div><div><dt>建議形式</dt><dd>{support.format}</dd></div></dl><button className="whatsapp-support-button" onClick={() => openWhatsApp(area.topic)}><MessageCircle size={17} /> 立即 WhatsApp 查詢（示範）</button></article>; })}</div> : <div className="regional-clear"><CheckCircle2 size={28} /><div><strong>本次沒有符合弱項門檻的面向</strong><p>可查看完整報告，並按孩子較感興趣的能力安排延伸練習。</p></div></div>}<p className="regional-transparency"><strong>合作資料說明：</strong> 地區篩選目前只調整示範支援範圍；尚未連結真實補習社名稱或 WhatsApp 號碼。按下查詢按鈕會開啟 WhatsApp 並預填不含學生個資的訊息，讓家長自行選擇對象及送出。</p></section>;
}

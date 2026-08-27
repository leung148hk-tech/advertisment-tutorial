import { CheckCircle2, CircleCheckBig, LoaderCircle, LockKeyhole, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { trpc } from "@/lib/trpc";

const DISTRICTS = [
  { region: "港島", items: ["中西區", "灣仔區", "東區", "南區"] },
  { region: "九龍", items: ["油尖旺區", "深水埗區", "九龍城區", "黃大仙區", "觀塘區"] },
  { region: "新界", items: ["葵青區", "荃灣區", "屯門區", "元朗區", "北區", "大埔區", "沙田區", "西貢區", "離島區"] },
];

export function normaliseHongKongPhone(value: string) {
  const compact = value.trim().replace(/[\s()-]/g, "");
  if (/^\+852[2-9]\d{7}$/.test(compact)) return compact.slice(4);
  if (/^[2-9]\d{7}$/.test(compact)) return compact;
  return null;
}

export default function ParentLeadForm({ grade, track, score, weaknessSummary, onComplete }: { grade: string; track: string; score: number; weaknessSummary: string; onComplete: (parentName: string, district: string) => void }) {
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [consent, setConsent] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [stage, setStage] = useState<"form" | "submitting" | "success">("form");
  const normalisedPhone = normaliseHongKongPhone(phone);
  const phoneError = phoneTouched && !normalisedPhone ? "請輸入有效香港電話：8 位數字，首位為 2 至 9；可加上 +852。" : "";
  const submit = trpc.assessment.submitParentLead.useMutation({
    onSuccess: () => { setStage("success"); window.setTimeout(() => onComplete(parentName.trim(), district), 700); },
    onError: () => setStage("form"),
  });
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setPhoneTouched(true);
    if (!consent || !normalisedPhone) return;
    setStage("submitting");
    submit.mutate({ parentName, phone: normalisedPhone, district: district as never, grade: grade as never, track: track as never, score, weaknessSummary, consent: true });
  };

  if (stage === "success") return <section className="parent-lead-stage" aria-live="polite"><div className="parent-lead-success"><CircleCheckBig size={42} /><p className="eyebrow">資料已安全提交</p><h2>正在為你整理完整報告。</h2><p>電話不會顯示在公開報告、PDF 或分享內容中。</p><div className="success-route-dots" aria-hidden="true"><i /><i /><i /></div></div></section>;
  return <section className="parent-lead-stage"><form className="parent-lead-form" onSubmit={handleSubmit} aria-busy={stage === "submitting"}><div className="lead-form-intro"><p className="eyebrow"><LockKeyhole size={16} /> 完成評估前 · 家長跟進資料</p><h2>留下聯絡方式，取得完整報告與同區支援方向。</h2><p>姓名、電話和所在十八區只會用於你同意的學習跟進。學習航圖會先直接聯絡你；只有你確認選定某一合作中心後，才會分享該次轉介所需的最少資料。</p></div><div className="lead-fields"><label>家長稱呼<input required value={parentName} disabled={stage === "submitting"} onChange={(event) => setParentName(event.target.value)} placeholder="例如：陳太" /></label><label>聯絡電話<input required aria-invalid={!!phoneError} aria-describedby={phoneError ? "hk-phone-error" : undefined} inputMode="tel" autoComplete="tel" value={phone} disabled={stage === "submitting"} onBlur={() => setPhoneTouched(true)} onChange={(event) => setPhone(event.target.value)} placeholder="例如：9123 4567 或 +852 9123 4567" />{phoneError && <small id="hk-phone-error" className="lead-field-error">{phoneError}</small>}</label><label>所在十八區<select required value={district} disabled={stage === "submitting"} onChange={(event) => setDistrict(event.target.value)}><option value="">請選擇</option>{DISTRICTS.map((group) => <optgroup key={group.region} label={group.region}>{group.items.map((item) => <option key={item} value={item}>{item}</option>)}</optgroup>)}</select></label></div><label className="lead-consent"><input required type="checkbox" checked={consent} disabled={stage === "submitting"} onChange={(event) => setConsent(event.target.checked)} /><span>我同意學習航圖先按本次評估結果、所在地區及聯絡資料與我作學習跟進；我明白只有在我確認選定某合作中心後，才會向該中心分享本次安排所需的最少資料。我可日後要求查詢、更正或刪除資料。</span></label>{submit.error && <p className="lead-error" role="alert">{submit.error.message}</p>}<div className="lead-submit-row"><span><CheckCircle2 size={16} /> 不會在公開報告、PDF 或分享內容中顯示電話。</span><button className="button button-primary" disabled={stage === "submitting" || !consent}>{stage === "submitting" ? <><LoaderCircle className="lead-spinner" size={17} /> 正在安全提交…</> : <>提交並查看完整報告 <Send size={17} /></>}</button></div></form></section>;
}

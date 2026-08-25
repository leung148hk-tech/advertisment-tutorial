import { CheckCircle2, LockKeyhole, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { trpc } from "@/lib/trpc";

const DISTRICTS = [
  { region: "港島", items: ["中西區", "灣仔區", "東區", "南區"] },
  { region: "九龍", items: ["油尖旺區", "深水埗區", "九龍城區", "黃大仙區", "觀塘區"] },
  { region: "新界", items: ["葵青區", "荃灣區", "屯門區", "元朗區", "北區", "大埔區", "沙田區", "西貢區", "離島區"] },
];

export default function ParentLeadForm({ grade, track, score, weaknessSummary, onComplete }: { grade: string; track: string; score: number; weaknessSummary: string; onComplete: (parentName: string, district: string) => void }) {
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [consent, setConsent] = useState(false);
  const submit = trpc.assessment.submitParentLead.useMutation({ onSuccess: () => onComplete(parentName, district) });
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!consent) return;
    submit.mutate({ parentName, phone, district: district as never, grade, track, score, weaknessSummary, consent: true });
  };
  return <section className="parent-lead-stage"><form className="parent-lead-form" onSubmit={handleSubmit}><div className="lead-form-intro"><p className="eyebrow"><LockKeyhole size={16} /> 完成評估前 · 家長跟進資料</p><h2>留下聯絡方式，取得完整報告與同區支援方向。</h2><p>姓名、電話和所在十八區只會用於你同意的學習跟進；提交後才生成完整報告及地區化支援資料。</p></div><div className="lead-fields"><label>家長稱呼<input required value={parentName} onChange={(event) => setParentName(event.target.value)} placeholder="例如：陳太" /></label><label>聯絡電話<input required inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="例如：9123 4567" /></label><label>所在十八區<select required value={district} onChange={(event) => setDistrict(event.target.value)}><option value="">請選擇</option>{DISTRICTS.map((group) => <optgroup key={group.region} label={group.region}>{group.items.map((item) => <option key={item} value={item}>{item}</option>)}</optgroup>)}</select></label></div><label className="lead-consent"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>我同意學習航圖及其合作補習支援按本次評估結果、所在地區及聯絡資料作學習跟進；我明白可日後要求查詢、更正或刪除資料。</span></label>{submit.error && <p className="lead-error">{submit.error.message}</p>}<div className="lead-submit-row"><span><CheckCircle2 size={16} /> 不會在公開報告、PDF 或分享內容中顯示電話。</span><button className="button button-primary" disabled={submit.isPending || !consent}>{submit.isPending ? "正在提交…" : "提交並查看完整報告"} <Send size={17} /></button></div></form></section>;
}

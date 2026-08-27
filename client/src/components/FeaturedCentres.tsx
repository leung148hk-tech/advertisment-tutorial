import { ArrowLeft, ArrowRight, Building2, MapPin, MessageCircle, Sparkles } from "lucide-react";
import React, { useRef } from "react";
import { trpc } from "@/lib/trpc";
import { isGitHubPages, STATIC_CENTRAL_WHATSAPP, STATIC_FEATURED_CENTRES } from "@/lib/siteMode";

const parseList = (value: string) => {
  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
};
const gradeRange = (value: string) => {
  const grades = parseList(value);
  if (!grades.length) return "年級待確認";
  return `${grades[0]}至${grades.at(-1)}`;
};

export default function FeaturedCentres() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featuredQuery = trpc.centres.featured.useQuery(undefined, { enabled: !isGitHubPages });
  const centralContact = trpc.assessment.centralContact.useQuery(undefined, { enabled: !isGitHubPages });
  const centres = isGitHubPages ? STATIC_FEATURED_CENTRES : featuredQuery.data;
  const centralWhatsApp = isGitHubPages ? STATIC_CENTRAL_WHATSAPP : centralContact.data?.whatsapp;
  const move = (direction: number) => scrollRef.current?.scrollBy({ left: direction * Math.min(scrollRef.current.clientWidth * 0.84, 440), behavior: "smooth" });
  const requestReferral = (centre: { name: string; district: string }) => {
    if (!centralWhatsApp) return;
    const text = `你好，我想由學習航圖安排了解${centre.name}（${centre.district}）的支援資料及轉介流程。`;
    window.open(`https://wa.me/${centralWhatsApp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return <section className="featured-centres" aria-labelledby="featured-centres-title">
    <div className="featured-centres-heading">
      <div>
        <p className="eyebrow"><Sparkles size={16} /> 精選合作 · 由學習航圖安排</p>
        <h2 id="featured-centres-title">為孩子配對下一步支援</h2>
        <p>現時只展示已確認的合作中心。課程查詢、配對與轉介一律由學習航圖專人跟進，家長不需自行逐間聯絡。</p>
      </div>
      {centres && centres.length > 1 && <div className="featured-carousel-controls"><button onClick={() => move(-1)} aria-label="查看上一間熱門補習社"><ArrowLeft size={18} /></button><button onClick={() => move(1)} aria-label="查看下一間熱門補習社"><ArrowRight size={18} /></button></div>}
    </div>
    {!isGitHubPages && featuredQuery.isLoading ? <div className="featured-skeletons" aria-label="正在載入熱門合作資料"><i /><i /><i /></div> : !isGitHubPages && featuredQuery.isError ? <div className="featured-empty"><Building2 size={25} /><strong>暫未能載入公開合作資料</strong><p>請稍後再試；評估功能不受影響。</p></div> : !centres?.length ? <div className="featured-empty"><Building2 size={25} /><strong>暫未有公開合作資料</strong><p>管理員可先加入真實合作資料，再按需要啟用公開展示與熱門推薦。</p></div> : <div className="featured-carousel" ref={scrollRef}>{centres.map((centre, index) => <article className="featured-centre-card" key={centre.id}>
      <div className="featured-card-top"><span>{index === 0 ? "現正合作" : "合作中心"}</span><span className="featured-district"><MapPin size={15} />{centre.district}</span></div>
      <div className="featured-title-row"><div><p className="featured-kicker">學習支援配對</p><h3>{centre.name}</h3></div><Building2 className="featured-building" size={35} /></div>
      <p>{centre.description}</p>
      <div className="featured-subject-pills" aria-label="支援科目">{parseList(centre.subjects).slice(0, 5).map((subject) => <span key={subject}>{subject}</span>)}{parseList(centre.subjects).length > 5 && <span>+{parseList(centre.subjects).length - 5}</span>}</div>
      <dl><div><dt>適合年級</dt><dd>{gradeRange(centre.supportedGrades)}</dd></div><div><dt>轉介安排</dt><dd>先由學習航圖了解需要</dd></div></dl>
      <button type="button" disabled={(!isGitHubPages && centralContact.isLoading) || !centralWhatsApp} onClick={() => requestReferral(centre)} className="featured-referral-button"><MessageCircle size={17} />安排學習支援配對</button>
    </article>)}</div>}
  </section>;
}

import { ArrowLeft, ArrowRight, Building2, MapPin, MessageCircle } from "lucide-react";
import { useRef } from "react";
import { trpc } from "@/lib/trpc";

const parseList = (value: string) => {
  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
};

export default function FeaturedCentres() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = trpc.centres.featured.useQuery();
  const centralContact = trpc.assessment.centralContact.useQuery();
  const move = (direction: number) => scrollRef.current?.scrollBy({ left: direction * Math.min(scrollRef.current.clientWidth * 0.84, 440), behavior: "smooth" });
  const requestReferral = (centre: { name: string; district: string }) => {
    if (!centralContact.data?.whatsapp) return;
    const text = `你好，我想由學習航圖安排了解${centre.name}（${centre.district}）的支援資料及轉介流程。`;
    window.open(`https://wa.me/${centralContact.data.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return <section className="featured-centres" aria-labelledby="featured-centres-title">
    <div className="featured-centres-heading">
      <div>
        <p className="eyebrow"><Building2 size={16} /> 合作資料</p>
        <h2 id="featured-centres-title">熱門補習社推薦</h2>
        <p>只顯示由管理員建立、已啟用、公開列出並標記為熱門的合作資料；聯絡及轉介統一由學習航圖跟進。</p>
      </div>
      {data && data.length > 1 && <div className="featured-carousel-controls"><button onClick={() => move(-1)} aria-label="查看上一間熱門補習社"><ArrowLeft size={18} /></button><button onClick={() => move(1)} aria-label="查看下一間熱門補習社"><ArrowRight size={18} /></button></div>}
    </div>
    {isLoading ? <div className="featured-skeletons" aria-label="正在載入熱門合作資料"><i /><i /><i /></div> : isError ? <div className="featured-empty"><Building2 size={25} /><strong>暫未能載入公開合作資料</strong><p>請稍後再試；評估功能不受影響。</p></div> : !data?.length ? <div className="featured-empty"><Building2 size={25} /><strong>暫未有公開合作資料</strong><p>管理員可先加入真實合作資料，再按需要啟用公開展示與熱門推薦。</p></div> : <div className="featured-carousel" ref={scrollRef}>{data.map((centre) => <article className="featured-centre-card" key={centre.id}>
      <div className="featured-card-top"><span>{centre.district}</span><MapPin size={17} /></div>
      <h3>{centre.name}</h3>
      <p>{centre.description}</p>
      <dl><div><dt>支援科目</dt><dd>{parseList(centre.subjects).join("、") || "待補充"}</dd></div><div><dt>適合年級</dt><dd>{parseList(centre.supportedGrades).join("、") || "待補充"}</dd></div></dl>
      <button type="button" disabled={centralContact.isLoading || !centralContact.data?.whatsapp} onClick={() => requestReferral(centre)} className="inline-flex items-center gap-1 text-sm font-bold text-emerald-800 underline disabled:opacity-50"><MessageCircle size={15} />由學習航圖安排轉介</button>
    </article>)}</div>}
  </section>;
}

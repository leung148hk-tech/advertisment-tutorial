import { ArrowLeft, ArrowRight, Building2, MapPin } from "lucide-react";
import { useRef } from "react";
import { trpc } from "@/lib/trpc";

const parseList = (value: string) => { try { return JSON.parse(value) as string[]; } catch { return []; } };

export default function FeaturedCentres() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = trpc.centres.featured.useQuery();
  const move = (direction: number) => scrollRef.current?.scrollBy({ left: direction * Math.min(scrollRef.current.clientWidth * 0.84, 440), behavior: "smooth" });
  return <section className="featured-centres" aria-labelledby="featured-centres-title"><div className="featured-centres-heading"><div><p className="eyebrow"><Building2 size={16} /> 合作資料</p><h2 id="featured-centres-title">熱門補習社推薦</h2><p>只顯示由管理員建立、已啟用並標記為「熱門顯示」的合作資料；沒有評分、評論或成效承諾。</p></div>{data && data.length > 1 && <div className="featured-carousel-controls"><button onClick={() => move(-1)} aria-label="查看上一間熱門補習社"><ArrowLeft size={18} /></button><button onClick={() => move(1)} aria-label="查看下一間熱門補習社"><ArrowRight size={18} /></button></div>}</div>{isLoading ? <div className="featured-skeletons" aria-label="正在載入熱門合作資料"><i /><i /><i /></div> : isError ? <div className="featured-empty"><Building2 size={25} /><strong>暫未能載入公開合作資料</strong><p>請稍後再試；評估功能不受影響。</p></div> : !data?.length ? <div className="featured-empty"><Building2 size={25} /><strong>暫未有公開合作資料</strong><p>管理員可登入新增真實合作資料，並標記為已啟用及熱門後在此顯示。</p></div> : <div className="featured-carousel" ref={scrollRef}>{data.map((centre) => <article className="featured-centre-card" key={centre.id}><div className="featured-card-top"><span>{centre.district}</span><MapPin size={17} /></div><h3>{centre.name}</h3><p>{centre.description}</p><dl><div><dt>支援科目</dt><dd>{parseList(centre.subjects).join("、") || "待補充"}</dd></div><div><dt>適合年級</dt><dd>{parseList(centre.supportedGrades).join("、") || "待補充"}</dd></div></dl>{centre.website && <a href={centre.website} target="_blank" rel="noreferrer">了解中心資料 <ArrowRight size={14} /></a>}</article>)}</div>}</section>;
}

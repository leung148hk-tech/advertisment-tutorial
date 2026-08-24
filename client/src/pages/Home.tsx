/**
 * Learning Compass / 學習航圖
 * Design reminder: contemporary educational editorial design with a calm route
 * rail, paper-like space, moss-green structure and coral action language.
 */
import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  Compass,
  Download,
  FileText,
  FlaskConical,
  Languages,
  MapPin,
  MessageCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  GRADES,
  TRACKS,
  buildQuestionPool,
  randomAssessment,
  trackForGrade,
  type AssessmentQuestion,
  type GradeId,
  type ModuleName,
  type TrackId,
} from "@/data/gradedAssessment";

type Screen = "landing" | "quiz" | "details" | "report";
const MODULES: ModuleName[] = ["基礎掌握", "理解與應用", "情境推理", "整合表達"];
const LOGO_IMAGE = "/manus-storage/learning-compass-mark_3de5f85b.png";

function trackIcon(icon: string) {
  if (icon === "math") return <Calculator size={20} />;
  if (icon === "science") return <FlaskConical size={20} />;
  if (icon === "interview") return <MessageCircle size={20} />;
  return <Languages size={20} />;
}

function bandFor(percentage: number) {
  if (percentage >= 0.82) return { title: "表現穩定，可延伸應用", note: "孩子在本次題組中已掌握多個核心面向，可加入更具情境和表達要求的練習。" };
  if (percentage >= 0.6) return { title: "正在建立，可聚焦鞏固", note: "孩子已展現部分基礎；集中整理幾個能力面向，通常會比大量重做題目更有效。" };
  return { title: "可先整理核心概念", note: "本次結果提示可由較清晰、分步的練習開始，逐步建立對題目和方法的把握。" };
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [grade, setGrade] = useState<GradeId | "">("");
  const [trackId, setTrackId] = useState<TrackId | "">("");
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [studentName, setStudentName] = useState("");
  const [district, setDistrict] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const reportRef = useRef<HTMLElement | null>(null);

  const gradeInfo = GRADES.find((item) => item.id === grade) ?? null;
  const trackInfo = TRACKS.find((item) => item.id === trackId) ?? null;
  const availableTracks = useMemo(() => (grade ? TRACKS.filter((track) => trackForGrade(track.id, grade)) : []), [grade]);
  const current = questions[questionIndex];
  const score = useMemo(() => questions.reduce((total, question) => total + (answers[question.id] === question.correct ? 1 : 0), 0), [answers, questions]);
  const percentage = questions.length ? score / questions.length : 0;
  const profile = bandFor(percentage);
  const reportDate = new Intl.DateTimeFormat("zh-HK", { year: "numeric", month: "long", day: "numeric" }).format(new Date());
  const poolSize = grade && trackId ? buildQuestionPool(trackId, grade).length : 0;

  const moduleResults = useMemo(() => MODULES.map((module) => {
    const items = questions.filter((question) => question.module === module);
    const correct = items.reduce((total, question) => total + (answers[question.id] === question.correct ? 1 : 0), 0);
    return { module, total: items.length, correct, percentage: items.length ? Math.round((correct / items.length) * 100) : 0 };
  }), [answers, questions]);

  const abilityResults = useMemo(() => Array.from(new Set(questions.map((question) => question.topic))).map((topic) => {
    const items = questions.filter((question) => question.topic === topic);
    const correct = items.reduce((total, question) => total + (answers[question.id] === question.correct ? 1 : 0), 0);
    const percentageValue = items.length ? Math.round((correct / items.length) * 100) : 0;
    return { topic, total: items.length, correct, percentage: percentageValue, state: percentageValue >= 80 ? "表現穩定" : percentageValue >= 55 ? "建立中" : "可優先整理" };
  }), [answers, questions]);

  const focusAreas = useMemo(() => [...abilityResults].sort((a, b) => a.percentage - b.percentage).slice(0, 3), [abilityResults]);

  const selectGrade = (nextGrade: GradeId) => {
    setGrade(nextGrade);
    if (trackId && !trackForGrade(trackId, nextGrade)) setTrackId("");
  };

  const start = (nextTrack: TrackId) => {
    if (!grade) return;
    const selectedQuestions = randomAssessment(nextTrack, grade);
    setTrackId(nextTrack);
    setQuestions(selectedQuestions);
    setAnswers({});
    setQuestionIndex(0);
    setStudentName("");
    setDistrict("");
    setScreen("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectAnswer = (answer: number) => setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: answer }));
  const next = () => { if (questionIndex === questions.length - 1) setScreen("details"); else setQuestionIndex((index) => index + 1); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const previous = () => { if (questionIndex > 0) setQuestionIndex((index) => index - 1); };
  const restart = () => { setScreen("landing"); setTrackId(""); setQuestions([]); setAnswers({}); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const downloadPdf = async () => {
    if (!reportRef.current || !gradeInfo || !trackInfo) return;
    setPdfBusy(true);
    try {
      await document.fonts?.ready;
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#fbf8ee",
        useCORS: true,
        ignoreElements: (element) => (element as HTMLElement).dataset.pdfIgnore === "true" || element.tagName === "IMG",
      });
      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const drawWidth = pageWidth - margin * 2;
      const drawHeight = (canvas.height * drawWidth) / canvas.width;
      const usableHeight = pageHeight - margin * 2;
      for (let offset = 0; offset < drawHeight; offset += usableHeight) {
        if (offset > 0) pdf.addPage();
        pdf.addImage(image, "PNG", margin, margin - offset, drawWidth, drawHeight, undefined, "FAST");
      }
      pdf.save(`學習航圖-${gradeInfo.label}-${trackInfo.shortLabel}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setPdfBusy(false);
    }
  };

  return <main className="site-shell graded-site">
    <header className="site-header"><button className="brand-lockup" onClick={restart} aria-label="返回學習航圖首頁"><img src={LOGO_IMAGE} alt="學習航圖標誌" className="brand-mark" /><span><strong>學習航圖</strong><small>LEARNING COMPASS</small></span></button><div className="header-note"><span className="note-dot" />{screen === "landing" ? "分級免費評估" : `${gradeInfo?.label ?? ""} · ${trackInfo?.shortLabel ?? ""}`}</div></header>

    {screen === "landing" && <>
      <section className="graded-hero"><div className="hero-copy"><p className="eyebrow"><Compass size={16} /> 不是快速猜測，是有層次的學習整理</p><h1>選對年級，<br />用 <em>20 題</em> 讀懂<br />孩子的學習位置。</h1><p className="hero-lead">小一至小六、中一至中三均可選擇；中文和英文分為閱讀及寫作兩卷。每次從更大的分級題庫隨機抽出 20 題，完成後即可下載免費完整報告。</p><div className="graded-stats"><div><strong>09</strong><span>年級分層</span></div><div><strong>20</strong><span>隨機不重複題</span></div><div><strong>PDF</strong><span>可下載完整報告</span></div></div></div><aside className="hero-assessment-note"><FileText size={27} /><p>免費完整評估</p><strong>4 個模組<br />20 道題目</strong><span>閱讀／寫作／解題／表達</span><div><CheckCircle2 size={16} /> 每次題組不同</div></aside></section>

      <section className="selection-section" aria-labelledby="grade-title"><div className="selection-intro"><p className="eyebrow">第一步 · 選擇年級</p><h2 id="grade-title">由孩子現在的<br />年級開始。</h2><p>年級會決定可選評估及報告使用的難度語言。選擇年級後，再選擇中文或英文的閱讀／寫作卷，或相應的數學、Science、升中面試評估。</p></div><div className="selection-body"><div className="grade-groups"><div><span>小學</span><div>{GRADES.filter((item) => item.stage === "小學").map((item) => <button key={item.id} className={grade === item.id ? "grade-chip grade-chip-active" : "grade-chip"} onClick={() => selectGrade(item.id)}>{item.label}</button>)}</div></div><div><span>初中</span><div>{GRADES.filter((item) => item.stage === "初中").map((item) => <button key={item.id} className={grade === item.id ? "grade-chip grade-chip-active" : "grade-chip"} onClick={() => selectGrade(item.id)}>{item.label}</button>)}</div></div></div>
        {gradeInfo ? <div className="track-choice"><div className="track-choice-heading"><div><p className="eyebrow">第二步 · 選擇評估卷</p><h3>{gradeInfo.label} 可選的學習評估</h3></div><span><RefreshCw size={14} /> 每次由 {poolSize || 30} 題池抽取 20 題</span></div><div className="track-card-grid">{availableTracks.map((track) => <button key={track.id} className="track-card" onClick={() => start(track.id)}><span className="track-icon">{trackIcon(track.icon)}</span><span><strong>{track.shortLabel}</strong><small>{track.description}</small><em>{track.id.includes("writing") ? "寫作基礎與組織" : track.id.includes("reading") ? "閱讀理解" : "20 題完整評估"}</em></span><ArrowRight size={18} /></button>)}</div></div> : <div className="track-empty"><Compass size={25} /><strong>請先選擇孩子年級</strong><p>系統會顯示對應的閱讀、寫作及學科評估。</p></div>}</div></section>
      <section className="assessment-promise"><BookOpen size={24} /><div><strong>關於免費報告</strong><p>本評估會整理本次隨機題組中的能力線索，不會代替學校評核、正式作文批改或專業診斷。報告適合作為家長與孩子討論下一步的起點。</p></div></section>
    </>}

    {(screen === "quiz" || screen === "details") && gradeInfo && trackInfo && <section className="assessment-shell graded-assessment"><aside className="journey-rail"><p className="rail-kicker">GRADED ASSESSMENT</p><div className="rail-heading"><Compass size={27} /><span>{gradeInfo.label}<br />{trackInfo.shortLabel}</span></div><div className="rail-metric"><strong>20</strong><span>隨機抽題</span></div><div className="rail-steps"><div className="rail-step rail-step-active"><i>1</i><span>20 題完整評估</span></div><div className={screen === "details" ? "rail-step rail-step-active" : "rail-step"}><i>2</i><span>生成免費報告</span></div><div className="rail-step"><i>3</i><span>下載並保存 PDF</span></div></div><button className="rail-return" onClick={restart}><ArrowLeft size={15} /> 改選年級或試卷</button></aside>
      {screen === "quiz" && current && <div className="quiz-panel"><div className="quiz-topline"><div><p className="eyebrow">{current.module} · {current.label}</p><span>第 {questionIndex + 1} / {questions.length} 題 · {current.difficulty} · {current.gradeBand}</span></div><div className="progress-line"><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></div><div className="module-progress">{MODULES.map((module) => <span key={module} className={current.module === module ? "module-progress-active" : ""}>{module}</span>)}</div><div className="question-card"><span className="question-number">{String(questionIndex + 1).padStart(2, "0")}</span><h2>{current.question}</h2><p>{current.hint}</p><div className="answer-list" role="radiogroup" aria-label={current.question}>{current.options.map((option, index) => <button key={`${current.id}-${option}`} className={answers[current.id] === index ? "answer-option answer-option-selected" : "answer-option"} onClick={() => selectAnswer(index)} role="radio" aria-checked={answers[current.id] === index}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{answers[current.id] === index && <Check size={18} />}</button>)}</div></div><div className="quiz-actions"><button className="button button-ghost" onClick={previous} disabled={questionIndex === 0}><ArrowLeft size={17} /> 上一題</button><button className="button button-primary" onClick={next} disabled={answers[current.id] === undefined}>{questionIndex === questions.length - 1 ? "生成免費報告" : "下一題"} <ArrowRight size={17} /></button></div></div>}
      {screen === "details" && <div className="quiz-panel detail-stage"><div className="detail-icon"><Sparkles size={27} /></div><p className="eyebrow">20 題已完成 · 免費完整報告</p><h2>加上稱呼，<br />讓報告更易保存。</h2><p>稱呼和所在地區均為選填，只會用於當前瀏覽器頁面的報告及 PDF，不會在此版本中被傳送或儲存。</p><div className="detail-form"><label>學生或家長稱呼 <small>（選填）</small><input value={studentName} onChange={(event) => setStudentName(event.target.value)} placeholder="例如：陳同學／陳太" /></label><label>所在區域 <small>（選填）</small><select value={district} onChange={(event) => setDistrict(event.target.value)}><option value="">不需要提供</option>{["港島", "九龍", "新界"].map((item) => <option key={item}>{item}</option>)}</select></label><div className="detail-privacy"><CheckCircle2 size={16} /> <span>此免費版本即時生成報告；不要求 WhatsApp，亦不會保存所填資料。</span></div><button className="button button-primary button-wide" onClick={() => { setScreen("report"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>查看並下載完整報告 <ArrowRight size={17} /></button></div></div>}
    </section>}

    {screen === "report" && gradeInfo && trackInfo && <><section ref={reportRef} className="download-report" aria-labelledby="report-title"><div className="report-banner"><div className="report-brand"><img src={LOGO_IMAGE} alt="學習航圖" /><span><strong>學習航圖</strong><small>FREE ASSESSMENT REPORT</small></span></div><span>{reportDate}</span></div><div className="report-identity"><div><p className="eyebrow"><Sparkles size={16} /> 免費完整評估報告</p><h1 id="report-title">{studentName ? `${studentName} 的` : "你的"}{trackInfo.label}學習報告</h1><p>{gradeInfo.label} · {trackInfo.shortLabel} · 本次由 {poolSize} 題分級題庫中隨機抽取 20 題</p></div><div className="overall-score"><span>整體答對</span><strong>{score}<small>/20</small></strong><p>{Math.round(percentage * 100)}%</p></div></div><div className="report-overview"><article><span>本次表現區間</span><h2>{profile.title}</h2><p>{profile.note}</p></article><article><span>評估範圍</span><h2>4 個模組 · {abilityResults.length} 個能力面向</h2><p>基礎掌握、理解與應用、情境推理及整合表達均已納入本次隨機題組。</p></article></div><section className="report-section"><div className="section-title"><span>01</span><div><p className="eyebrow">四個模組</p><h2>答題結構概覽</h2></div></div><div className="module-score-grid">{moduleResults.map((module) => <article key={module.module}><span>{module.module}</span><strong>{module.correct}<small> / {module.total}</small></strong><p>{module.percentage >= 80 ? "表現穩定" : module.percentage >= 55 ? "建立中" : "可優先整理"}</p></article>)}</div></section><section className="report-section"><div className="section-title"><span>02</span><div><p className="eyebrow">能力分項</p><h2>本次最值得討論的面向</h2></div></div><div className="ability-report">{abilityResults.map((ability) => <div className="ability-row" key={ability.topic}><div><strong>{ability.topic}</strong><span>{ability.correct} / {ability.total} 題 · {ability.state}</span></div><div className="ability-track"><i style={{ width: `${ability.percentage}%` }} /></div></div>)}</div></section><section className="report-section plan-section"><div className="section-title"><span>03</span><div><p className="eyebrow">兩星期起步建議</p><h2>只選一至兩個重點，慢慢建立把握。</h2></div></div><div className="focus-list">{focusAreas.map((item, index) => <article key={item.topic}><span>0{index + 1}</span><div><h3>{item.topic}</h3><p>{item.percentage < 55 ? "先以有示範、可拆步驟的短練習整理核心概念；每次完成後說出做法和原因。" : "可把概念放進較接近閱讀、解題或表達情境的題目中，練習如何選擇方法。"}</p></div></article>)}</div><div className="report-disclaimer"><CheckCircle2 size={17} /><p><strong>報告限制：</strong>本結果只反映這次 20 題隨機題組的答題情況。中文及英文的寫作卷評估寫作基礎與組織能力，並不等同完整作文批改、校內成績或任何專業診斷。</p></div></section><footer className="pdf-footer"><span>學習航圖 · 分級免費評估</span><span>{district ? `${district} · ` : ""}僅供家庭學習規劃參考</span></footer></section><section className="download-actions" data-pdf-ignore="true"><div><p className="eyebrow">保存這份報告</p><h2>下載 PDF，方便和孩子、導師一起閱讀。</h2><p>PDF 由現時頁面在瀏覽器端產生，報告資料不會被傳送或保存。</p></div><div><button className="button button-primary" onClick={downloadPdf} disabled={pdfBusy}>{pdfBusy ? "正在製作 PDF…" : "下載完整 PDF 報告"} <Download size={18} /></button><button className="button button-ghost" onClick={restart}><RefreshCw size={17} /> 重新隨機抽題</button></div></section></>}

    <footer className="site-footer"><span>© 學習航圖</span><span>小一至小六 · 中一至中三 · 分級隨機評估</span></footer>
  </main>;
}

/**
 * Learning Compass / 學習航圖
 * Design reminder: contemporary educational editorial design with a calm route
 * rail, paper-like space, moss-green structure and coral action language.
 */
import React, { useMemo, useRef, useState } from "react";
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
  Copy,
  Download,
  FileText,
  FlaskConical,
  Languages,
  MapPin,
  MessageCircle,
  RefreshCw,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  ASSESSMENT_MODULES,
  GRADES,
  TRACKS,
  buildQuestionPool,
  randomAssessment,
  trackForGrade,
  type AssessmentQuestion,
  type GradeId,
  type TrackId,
} from "@/data/gradedAssessment";
import { PRIMARY_CHINESE_READING_FRAMEWORK, type PrimaryChineseGrade } from "@/data/primaryChineseReadingFramework";
import RegionalSupport from "@/components/RegionalSupport";
import ParentLeadForm from "@/components/ParentLeadForm";
import FeaturedCentres from "@/components/FeaturedCentres";

type Screen = "landing" | "quiz" | "details" | "report";
const LOGO_IMAGE = "/manus-storage/learning-compass-mark_3de5f85b.png";
const PRIMARY_MATH_SUPPORT: Record<string, { title: string; focus: string; format: string; next: string }> = {
  "數與運算": { title: "數感與運算支援（示範推薦）", focus: "加減乘除、位值、小數及估算", format: "小班分步練習", next: "以直式、心算策略和生活情境逐步鞏固運算過程。" },
  "比較與規律": { title: "數感與規律支援（示範推薦）", focus: "大小比較、排序及數字規律", format: "遊戲化小組", next: "由具體物件和數線開始，建立比較和找規律的語言。" },
  "乘除與分組": { title: "乘除概念支援（示範推薦）", focus: "乘法意義、平均分及分組", format: "小班具體操作", next: "使用圖像和實物理解分組與平均分，再連結到算式。" },
  "乘除與分數": { title: "乘除與分數支援（示範推薦）", focus: "乘除應用、分數概念及運算", format: "主題鞏固班", next: "先整理分組與分數圖像，再練習從題意選擇合適運算。" },
  "分數與比例": { title: "分數比例支援（示範推薦）", focus: "分數、小數、百分比及比例", format: "小班策略訓練", next: "以數線、圖像和生活折扣題，建立不同表示法之間的連結。" },
  "圖形與量度": { title: "圖形量度支援（示範推薦）", focus: "周界、面積、體積、時間及單位", format: "圖像化練習", next: "先畫圖和標示已知資料，再把公式放進具體情境使用。" },
  "時間與金錢": { title: "生活數學支援（示範推薦）", focus: "時間、金錢、找贖及日常計算", format: "生活情境小組", next: "利用時鐘、價錢和購物情境，逐步整理計算與檢查答案的步驟。" },
  "數據與統計": { title: "數據判讀支援（示範推薦）", focus: "圖表、平均數、中位數及資料比較", format: "專題練習班", next: "由閱讀圖表的標題、單位和數值開始，再練習用數據回答問題。" },
  "資料與生活解題": { title: "生活解題支援（示範推薦）", focus: "圖表比較與兩步驟生活題", format: "小班策略練習", next: "先圈出已知資料和問題所問，再把文字轉換成清晰算式。" },
  "多步驟解題": { title: "綜合解題支援（示範推薦）", focus: "方程思維、多步驟及綜合文字題", format: "進階解題小組", next: "練習拆開題目、規劃算式順序，並以逆向運算檢查結果。" },
};

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
  const [shareStatus, setShareStatus] = useState("");
  const [focusMode, setFocusMode] = useState(false);
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
  const isPrimaryChineseReading = gradeInfo?.stage === "小學" && trackId === "chinese-reading";
  const primaryChineseGrade = gradeInfo?.stage === "小學" ? gradeInfo.id as PrimaryChineseGrade : null;
  const primaryChineseFramework = primaryChineseGrade && isPrimaryChineseReading ? PRIMARY_CHINESE_READING_FRAMEWORK[primaryChineseGrade] : null;
  const primaryChineseDomains = primaryChineseFramework?.domains ?? null;
  const primaryChineseDescription = primaryChineseFramework?.description ?? "";
  const reportStructureLabels = primaryChineseDomains?.map((domain) => domain.label) ?? ASSESSMENT_MODULES;

  const moduleResults = useMemo(() => reportStructureLabels.map((module) => {
    const items = questions.filter((question) => isPrimaryChineseReading ? question.topic === module : question.module === module);
    const correct = items.reduce((total, question) => total + (answers[question.id] === question.correct ? 1 : 0), 0);
    return { module, total: items.length, correct, percentage: items.length ? Math.round((correct / items.length) * 100) : 0 };
  }), [answers, isPrimaryChineseReading, questions, reportStructureLabels]);

  const abilityResults = useMemo(() => Array.from(new Set(questions.map((question) => question.topic))).map((topic) => {
    const items = questions.filter((question) => question.topic === topic);
    const correct = items.reduce((total, question) => total + (answers[question.id] === question.correct ? 1 : 0), 0);
    const percentageValue = items.length ? Math.round((correct / items.length) * 100) : 0;
    return { topic, total: items.length, correct, percentage: percentageValue, state: percentageValue >= 80 ? "表現穩定" : percentageValue >= 55 ? "建立中" : "可優先整理" };
  }), [answers, questions]);

  const focusAreas = useMemo(() => [...abilityResults].sort((a, b) => a.percentage - b.percentage).slice(0, 3), [abilityResults]);
  const isPrimaryMath = trackId === "math" && gradeInfo?.stage === "小學";
  const weakAreas = useMemo(() => isPrimaryMath ? abilityResults.filter((item) => item.correct < 2 && item.total >= 4) : [], [abilityResults, isPrimaryMath]);

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
    setFocusMode(false);
    setScreen("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectAnswer = (answer: number) => setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: answer }));
  const next = () => { if (questionIndex === questions.length - 1) setScreen("details"); else setQuestionIndex((index) => index + 1); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const previous = () => { if (questionIndex > 0) setQuestionIndex((index) => index - 1); };
  const restart = () => { setScreen("landing"); setTrackId(""); setQuestions([]); setAnswers({}); setFocusMode(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const downloadPdf = async () => {
    if (!reportRef.current || !gradeInfo || !trackInfo) return;
    setPdfBusy(true);
    try {
      await document.fonts?.ready;
      const reportFooter = reportRef.current.querySelector<HTMLElement>(".pdf-footer");
      const previousFooterDisplay = reportFooter?.style.display;
      if (reportFooter) reportFooter.style.display = "none";
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#fbf8ee",
        useCORS: true,
        ignoreElements: (element) => (element as HTMLElement).dataset.pdfIgnore === "true" || element.tagName === "IMG",
      });
      if (reportFooter) reportFooter.style.display = previousFooterDisplay ?? "";
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const drawWidth = pageWidth - margin * 2;
      const headerFooter = 13;
      const pixelsPerMillimetre = canvas.width / drawWidth;
      const sliceHeight = Math.floor((pageHeight - margin * 2 - headerFooter) * pixelsPerMillimetre);
      let offset = 0;
      let page = 1;
      while (offset < canvas.height) {
        const height = Math.min(sliceHeight, canvas.height - offset);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = height;
        pageCanvas.getContext("2d")?.drawImage(canvas, 0, offset, canvas.width, height, 0, 0, canvas.width, height);
        if (page > 1) pdf.addPage();
        pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", margin, margin, drawWidth, height / pixelsPerMillimetre, undefined, "FAST");
        pdf.setFontSize(8);
        pdf.setTextColor(69, 86, 78);
        pdf.text("Learning Compass · Free Assessment Report", margin, pageHeight - 7);
        pdf.text(`Page ${page}`, pageWidth - margin, pageHeight - 7, { align: "right" });
        offset += height;
        page += 1;
      }
      pdf.save(`學習航圖-${gradeInfo.label}-${trackInfo.shortLabel}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setPdfBusy(false);
    }
  };

  const shareText = gradeInfo && trackInfo ? `我剛完成學習航圖的分級免費評估：${gradeInfo.label}・${trackInfo.shortLabel}（20 題）。本次結果：${profile.title}。報告包含能力分項及兩星期起步建議。` : "";
  const copyShareText = async () => {
    if (!shareText) return;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(shareText);
      else {
        const textarea = document.createElement("textarea");
        textarea.value = shareText;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setShareStatus("分享文字已複製");
    } catch {
      setShareStatus("未能自動複製，請手動選取分享文字");
    }
  };
  const shareWhatsApp = () => {
    if (!shareText) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    setShareStatus("已開啟 WhatsApp 分享視窗");
  };
  const shareToDevice = async () => {
    if (!shareText) return;
    if (navigator.share) {
      try { await navigator.share({ title: "學習航圖免費評估", text: shareText }); setShareStatus("已開啟裝置分享選單"); return; } catch { setShareStatus(""); return; }
    }
    await copyShareText();
  };

  return <main className="site-shell graded-site">
    <header className="site-header"><button className="brand-lockup" onClick={restart} aria-label="返回學習航圖首頁"><img src={LOGO_IMAGE} alt="學習航圖標誌" className="brand-mark" /><span><strong>學習航圖</strong><small>LEARNING COMPASS</small></span></button><div className="header-note"><span className="note-dot" />{screen === "landing" ? "分級免費評估" : `${gradeInfo?.label ?? ""} · ${trackInfo?.shortLabel ?? ""}`}</div></header>

    {screen === "landing" && <>
      <section className="graded-hero"><div className="hero-copy"><p className="eyebrow"><Compass size={16} /> 不是快速猜測，是有層次的學習整理</p><h1>選對年級，<br />用 <em>20 題</em> 讀懂<br />孩子的學習位置。</h1><p className="hero-lead">小一至小六、中一至中三均可選擇；小學中文只設分級閱讀評估，英文分為閱讀及寫作；初中中文及英文分為閱讀及寫作。每次從更大的分級題庫隨機抽出 20 題，完成後即可下載免費完整報告。</p><div className="graded-stats"><div><strong>09</strong><span>年級分層</span></div><div><strong>20</strong><span>隨機不重複題</span></div><div><strong>PDF</strong><span>可下載完整報告</span></div></div></div><aside className="hero-assessment-note"><FileText size={27} /><p>免費完整評估</p><strong>分級題庫<br />20 道題目</strong><span>按所選年級與評估卷顯示相應能力範疇</span><div><CheckCircle2 size={16} /> 每次題組不同</div></aside></section>

      <FeaturedCentres />

      <section className="selection-section" aria-labelledby="grade-title"><div className="selection-intro"><p className="eyebrow">第一步 · 選擇年級</p><h2 id="grade-title">由孩子現在的<br />年級開始。</h2><p>年級會決定可選評估及報告使用的難度語言。小學中文只提供閱讀評估；英文提供閱讀及寫作；初中另有中文寫作、Science 和相應的數學科，並保留小五、小六升中面試評估。</p></div><div className="selection-body"><div className="grade-groups"><div><span>小學</span><div>{GRADES.filter((item) => item.stage === "小學").map((item) => <button key={item.id} className={grade === item.id ? "grade-chip grade-chip-active" : "grade-chip"} onClick={() => selectGrade(item.id)}>{item.label}</button>)}</div></div><div><span>初中</span><div>{GRADES.filter((item) => item.stage === "初中").map((item) => <button key={item.id} className={grade === item.id ? "grade-chip grade-chip-active" : "grade-chip"} onClick={() => selectGrade(item.id)}>{item.label}</button>)}</div></div></div>
        {gradeInfo ? <div className="track-choice"><div className="track-choice-heading"><div><p className="eyebrow">第二步 · 選擇評估卷</p><h3>{gradeInfo.label} 可選的學習評估</h3></div><span><RefreshCw size={14} /> 每次由分級題庫隨機抽取 20 題</span></div><div className="track-card-grid">{availableTracks.map((track) => <button key={track.id} className="track-card" onClick={() => start(track.id)}><span className="track-icon">{trackIcon(track.icon)}</span><span><strong>{track.shortLabel}</strong><small>{track.description}</small><em>{track.id === "chinese-reading" && gradeInfo.stage === "小學" ? "25 題獨立題庫 · 閱讀理解" : track.id.includes("writing") ? "寫作基礎與組織" : track.id.includes("reading") ? "閱讀理解" : "20 題完整評估"}</em></span><ArrowRight size={18} /></button>)}</div></div> : <div className="track-empty"><Compass size={25} /><strong>請先選擇孩子年級</strong><p>系統會顯示對應的閱讀、寫作及學科評估。</p></div>}</div></section>
      <section className="assessment-promise"><BookOpen size={24} /><div><strong>關於免費報告</strong><p>本評估會整理本次隨機題組中的能力線索，不會代替學校評核、正式作文批改或專業診斷。報告適合作為家長與孩子討論下一步的起點。</p></div></section>
    </>}

    {screen === "quiz" && gradeInfo && trackInfo && <section className="assessment-shell graded-assessment"><aside className="journey-rail"><p className="rail-kicker">GRADED ASSESSMENT</p><div className="rail-heading"><Compass size={27} /><span>{gradeInfo.label}<br />{trackInfo.shortLabel}</span></div><div className="rail-metric"><strong>20</strong><span>隨機抽題</span></div><div className="rail-steps"><div className="rail-step rail-step-active"><i>1</i><span>20 題完整評估</span></div><div className="rail-step"><i>2</i><span>生成免費報告</span></div><div className="rail-step"><i>3</i><span>下載並保存 PDF</span></div></div><button className="rail-return" onClick={restart}><ArrowLeft size={15} /> 改選年級或試卷</button></aside>
      {screen === "quiz" && current && <div className="quiz-panel"><div className="quiz-topline"><div><p className="eyebrow">{isPrimaryChineseReading ? current.topic : `${current.module} · ${current.label}`}</p><span>第 {questionIndex + 1} / {questions.length} 題 · {current.difficulty} · {current.gradeBand}</span></div><div className="progress-line"><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></div><div className="module-progress">{reportStructureLabels.map((label) => <span key={label} className={(isPrimaryChineseReading ? current.topic : current.module) === label ? "module-progress-active" : ""}>{label}</span>)}</div><div className="question-card"><span className="question-number">{String(questionIndex + 1).padStart(2, "0")}</span><h2>{current.question}</h2><p>{current.hint}</p><div className="answer-list" role="radiogroup" aria-label={current.question}>{current.options.map((option, index) => <button key={`${current.id}-${option}`} className={answers[current.id] === index ? "answer-option answer-option-selected" : "answer-option"} onClick={() => selectAnswer(index)} role="radio" aria-checked={answers[current.id] === index}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{answers[current.id] === index && <Check size={18} />}</button>)}</div></div><div className="quiz-actions"><button className="button button-ghost" onClick={previous} disabled={questionIndex === 0}><ArrowLeft size={17} /> 上一題</button><button className="button button-primary" onClick={next} disabled={answers[current.id] === undefined}>{questionIndex === questions.length - 1 ? "生成免費報告" : "下一題"} <ArrowRight size={17} /></button></div></div>}
    </section>}
    {screen === "details" && gradeInfo && trackInfo && <ParentLeadForm grade={gradeInfo.label} track={trackInfo.shortLabel} score={score} weaknessSummary={focusAreas.map((item) => `${item.topic}：${item.correct}/${item.total}`).join("；")} onComplete={(parentName, leadDistrict) => { setStudentName(parentName); setDistrict(leadDistrict); setScreen("report"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}

    {screen === "report" && gradeInfo && trackInfo && <><section ref={reportRef} className="download-report" aria-labelledby="report-title"><div className="report-banner"><div className="report-brand"><img src={LOGO_IMAGE} alt="學習航圖" /><span><strong>學習航圖</strong><small>FREE ASSESSMENT REPORT</small></span></div><span>{reportDate}</span></div><div className="report-identity"><div><p className="eyebrow"><Sparkles size={16} /> 免費完整評估報告</p><h1 id="report-title">{studentName ? `${studentName} 的` : "你的"}{trackInfo.label}學習報告</h1><p>{gradeInfo.label} · {trackInfo.shortLabel} · 本次由 {poolSize} 題分級題庫中隨機抽取 20 題</p></div><div className="overall-score"><span>整體答對</span><strong>{score}<small>/20</small></strong><p>{Math.round(percentage * 100)}%</p></div></div><div className="report-overview"><article><span>本次表現區間</span><h2>{profile.title}</h2><p>{profile.note}</p></article><article><span>評估範圍</span><h2>{reportStructureLabels.length} 個{isPrimaryChineseReading ? "中文閱讀範疇" : "模組"} · {abilityResults.length} 個能力面向</h2><p>{isPrimaryChineseReading ? primaryChineseDescription : "基礎掌握、理解與應用、情境推理、整合表達及溝通與協作均已納入本次隨機題組。"}</p></article></div><section className="report-section"><div className="section-title"><span>01</span><div><p className="eyebrow">{reportStructureLabels.length} 個{isPrimaryChineseReading ? "中文閱讀範疇" : "模組"}</p><h2>{isPrimaryChineseReading ? "中文閱讀範疇概覽" : "答題結構概覽"}</h2></div></div><div className="module-score-grid">{moduleResults.map((module: { module: string; total: number; correct: number; percentage: number }) => <article key={module.module}><span>{module.module}</span><strong>{module.correct}<small> / {module.total}</small></strong><p>{module.percentage >= 80 ? "表現穩定" : module.percentage >= 55 ? "建立中" : "可優先整理"}</p></article>)}</div></section><section className="report-section"><div className="section-title"><span>02</span><div><p className="eyebrow">能力分項</p><h2>本次最值得討論的面向</h2></div></div><div className="ability-report">{abilityResults.map((ability) => <div className="ability-row" key={ability.topic}><div><strong>{ability.topic}</strong><span>{ability.correct} / {ability.total} 題 · {ability.state}</span></div><div className="ability-track"><i style={{ width: `${ability.percentage}%` }} /></div></div>)}</div></section><section className="report-section plan-section"><div className="section-title"><span>03</span><div><p className="eyebrow">兩星期起步建議</p><h2>只選一至兩個重點，慢慢建立把握。</h2></div></div><div className="focus-list">{focusAreas.map((item, index) => <article key={item.topic}><span>0{index + 1}</span><div><h3>{item.topic}</h3><p>{item.percentage < 55 ? "先以有示範、可拆步驟的短練習整理核心概念；每次完成後說出做法和原因。" : "可把概念放進較接近閱讀、解題或表達情境的題目中，練習如何選擇方法。"}</p></div></article>)}</div><div className="report-disclaimer"><CheckCircle2 size={17} /><p><strong>報告限制：</strong>本結果只反映這次 20 題隨機題組的答題情況。中文及英文的寫作卷評估寫作基礎與組織能力，並不等同完整作文批改、校內成績或任何專業診斷。</p></div></section><footer className="pdf-footer"><span>學習航圖 · 分級免費評估</span><span>{district ? `${district} · ` : ""}僅供家庭學習規劃參考</span></footer></section><section className="download-actions" data-pdf-ignore="true"><div><p className="eyebrow">保存這份報告</p><h2>下載 PDF，方便和孩子、導師一起閱讀。</h2><p>PDF 由現時頁面在瀏覽器端產生，報告資料不會被傳送或保存。</p></div><div><button className="button button-primary" onClick={downloadPdf} disabled={pdfBusy}>{pdfBusy ? "正在製作 PDF…" : "下載完整 PDF 報告"} <Download size={18} /></button><button className="button button-ghost" onClick={restart}><RefreshCw size={17} /> 重新隨機抽題</button></div></section></>}

    {screen === "report" && gradeInfo && trackInfo && <section className="report-share-panel" aria-labelledby="share-title"><div><p className="eyebrow"><Share2 size={16} /> 分享結果摘要</p><h2 id="share-title">把學習方向，分享給值得一起討論的人。</h2><p>分享內容只包括年級、試卷和整體結果，不包括學生稱呼、所在地區、逐題答案或 PDF 內容。</p></div><div className="share-controls"><button className="share-button share-button-whatsapp" onClick={shareWhatsApp}><MessageCircle size={18} /> WhatsApp</button><button className="share-button" onClick={shareToDevice}><Share2 size={18} /> 分享到其他 App</button><button className="share-button" onClick={copyShareText}><Copy size={17} /> 複製文字</button>{shareStatus && <span className="share-status"><CheckCircle2 size={15} /> {shareStatus}</span>}</div></section>}
    {screen === "report" && gradeInfo && trackInfo && isPrimaryMath && <section className="focus-mode-panel" data-pdf-ignore="true"><div><p className="eyebrow"><Sparkles size={16} /> 小學數學弱項精簡模式</p><h2>只看現在需要加強的數學面向。</h2><p>系統只會在某能力面向答對少於 2 題（共 4 題）時列為需要加強，避免一次偶然失誤被過度解讀。</p></div><button className={focusMode ? "button button-ghost" : "button button-primary"} onClick={() => setFocusMode((currentMode) => !currentMode)}>{focusMode ? "返回完整報告" : "開啟精簡弱項報告"} <ArrowRight size={17} /></button></section>}
    {screen === "report" && gradeInfo && isPrimaryMath && focusMode && <section className="focus-report" aria-labelledby="focus-report-title"><div className="focus-report-header"><p className="eyebrow"><MapPin size={16} /> {gradeInfo.label} · 小學數學</p><h2 id="focus-report-title">{weakAreas.length ? "集中處理這些弱項。" : "本次未見明顯弱項。"}</h2><p>{weakAreas.length ? "以下只保留需要加強的能力面向、短期練習重點及可進一步了解的支援類型。" : "孩子在本次各能力面向至少答對 2 題；可返回完整報告查看延伸練習方向。"}</p></div>{weakAreas.length ? <div className="focus-recommendation-grid">{weakAreas.map((area, index) => { const support = PRIMARY_MATH_SUPPORT[area.topic] ?? PRIMARY_MATH_SUPPORT["多步驟解題"]; return <article className="focus-recommendation-card" key={area.topic}><span>0{index + 1}</span><p className="demo-chip">合作支援示範推薦</p><h3>{area.topic}</h3><div className="focus-score"><strong>{area.correct} / {area.total}</strong><span>本次答對</span></div><p className="support-title">{support.title}</p><dl><div><dt>適合支援</dt><dd>{support.focus}</dd></div><div><dt>建議形式</dt><dd>{support.format}</dd></div><div><dt>起步方向</dt><dd>{support.next}</dd></div></dl><button className="partner-button" disabled><MapPin size={16} /> 待加入真實合作資料</button></article>; })}</div> : <div className="focus-clear"><CheckCircle2 size={28} /><div><strong>精簡模式暫時不需列出支援建議</strong><p>這不代表孩子不需要練習；只代表本次 20 題中未出現符合弱項門檻的能力面向。</p></div></div>}<p className="focus-transparency"><strong>透明度說明：</strong>以上為按弱項和年級排列的支援類型示範，並非真實補習社名單或報讀推薦。加入真實合作資料後，才會顯示實際中心、地區、名額和聯絡方式。</p></section>}
    {screen === "report" && gradeInfo && trackInfo && ["math", "chinese-reading", "chinese-writing", "english-reading", "english-writing", "science"].includes(trackId) && <RegionalSupport gradeLabel={gradeInfo.label} trackLabel={trackInfo.shortLabel} abilities={abilityResults} homeDistrict={district} />}
    <footer className="site-footer"><span>© 學習航圖</span><span>小一至小六 · 中一至中三 · 分級隨機評估</span><a href="/admin/centres">管理合作資料</a></footer>
  </main>;
}

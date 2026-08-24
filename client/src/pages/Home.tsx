/**
 * Learning Compass / 學習航圖
 * Design reminder: contemporary educational editorial design with an asymmetric
 * route rail, generous paper-like space, moss green structure and coral actions.
 */
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Compass,
  LockKeyhole,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

type Stage = "landing" | "quiz" | "gate" | "report";
type Topic = "grammar" | "vocabulary" | "reading" | "structure";

type QuizQuestion = {
  label: string;
  topic: Topic;
  question: string;
  hint: string;
  options: string[];
  correct: number;
};

type Partner = {
  name: string;
  districts: string[];
  grades: string;
  format: string;
  focus: string;
  region: "港島" | "九龍" | "新界";
};

const HERO_IMAGE = "/manus-storage/learning-compass-hero_3d6e2df7.jpg";
const PROFILE_IMAGE = "/manus-storage/learning-profile-paper_e09f7bb6.jpg";
const SESSION_IMAGE = "/manus-storage/learning-tutor-session_fef23b65.jpg";
const ROUTE_IMAGE = "/manus-storage/learning-route-abstract_80f1c75a.jpg";
const LOGO_IMAGE = "/manus-storage/learning-compass-mark_3de5f85b.png";

const QUESTIONS: QuizQuestion[] = [
  {
    label: "句型與文法",
    topic: "grammar",
    question: "My brother ____ football every Saturday.",
    hint: "留意主語是單數時，動詞的變化。",
    options: ["play", "plays", "playing", "played"],
    correct: 1,
  },
  {
    label: "日常詞彙",
    topic: "vocabulary",
    question: "Which word is closest in meaning to “happy”?",
    hint: "想一想描述愉快心情的英文詞。",
    options: ["angry", "tired", "glad", "quiet"],
    correct: 2,
  },
  {
    label: "時態運用",
    topic: "grammar",
    question: "Yesterday, we ____ a movie after dinner.",
    hint: "句子提到昨天，動詞應配合過去時間。",
    options: ["watch", "watches", "watched", "watching"],
    correct: 2,
  },
  {
    label: "閱讀線索",
    topic: "reading",
    question: "Amy has a new bicycle. She rides it to the park. What does “it” refer to?",
    hint: "找回上一句中最合理的名詞。",
    options: ["Amy", "a bicycle", "the park", "a friend"],
    correct: 1,
  },
  {
    label: "句子組織",
    topic: "structure",
    question: "Choose the sentence with the correct word order.",
    hint: "英文句子一般先寫主語，再寫動詞和其他資訊。",
    options: [
      "Every day reads Ken books.",
      "Ken reads books every day.",
      "Books Ken every day reads.",
      "Reads every day Ken books.",
    ],
    correct: 1,
  },
];

const DISTRICTS = [
  "中西區",
  "灣仔區",
  "東區",
  "南區",
  "油尖旺區",
  "深水埗區",
  "九龍城區",
  "黃大仙區",
  "觀塘區",
  "葵青區",
  "荃灣區",
  "屯門區",
  "元朗區",
  "北區",
  "大埔區",
  "沙田區",
  "西貢區",
  "離島區",
];

const PARTNERS: Partner[] = [
  {
    name: "學習支援中心 A（示範）",
    districts: ["沙田區", "觀塘區"],
    grades: "小四至中三",
    format: "小組鞏固",
    focus: "英文基礎與句型整理",
    region: "新界",
  },
  {
    name: "學習支援中心 B（示範）",
    districts: ["油尖旺區", "深水埗區"],
    grades: "小五至中六",
    format: "主題工作坊",
    focus: "閱讀理解與寫作表達",
    region: "九龍",
  },
  {
    name: "學習支援中心 C（示範）",
    districts: ["灣仔區", "東區"],
    grades: "小一至中三",
    format: "小班及一對一",
    focus: "英文溝通與自信建立",
    region: "港島",
  },
  {
    name: "學習支援中心 D（示範）",
    districts: ["元朗區", "屯門區", "北區"],
    grades: "小三至中三",
    format: "小班追蹤",
    focus: "詞彙累積與閱讀習慣",
    region: "新界",
  },
];

const TOPIC_INSIGHTS: Record<Topic, { title: string; copy: string }> = {
  grammar: {
    title: "句型與時態",
    copy: "可以由主語、動詞和時間詞開始，利用短句練習把規則用得更自然。",
  },
  vocabulary: {
    title: "日常詞彙",
    copy: "建議從孩子熟悉的生活情境累積詞彙，並用圖片、例句和重複應用鞏固記憶。",
  },
  reading: {
    title: "閱讀線索",
    copy: "閱讀時可練習圈出人物、物件和代詞，逐步建立從上下文找線索的習慣。",
  },
  structure: {
    title: "句子組織",
    copy: "先用「誰 + 做甚麼 + 其他資訊」的順序重組句子，有助建立清晰的英文語感。",
  },
};

const REGION_BY_DISTRICT: Record<string, Partner["region"]> = {
  中西區: "港島",
  灣仔區: "港島",
  東區: "港島",
  南區: "港島",
  油尖旺區: "九龍",
  深水埗區: "九龍",
  九龍城區: "九龍",
  黃大仙區: "九龍",
  觀塘區: "九龍",
  葵青區: "新界",
  荃灣區: "新界",
  屯門區: "新界",
  元朗區: "新界",
  北區: "新界",
  大埔區: "新界",
  沙田區: "新界",
  西貢區: "新界",
  離島區: "新界",
};

function getProfile(score: number) {
  if (score === 5) {
    return {
      title: "延伸潛能",
      lead: "基礎掌握穩定，現在可以把注意力放到更有挑戰的閱讀、寫作和溝通運用。",
      action: "嘗試加入閱讀策略或主題寫作，讓已掌握的規則變成表達能力。",
    };
  }
  if (score >= 3) {
    return {
      title: "穩步提升",
      lead: "孩子已具備部分英文基礎，只要集中鞏固幾個環節，學習會更有把握。",
      action: "以短篇閱讀及主題練習建立熟練度，把每次練習變成可追蹤的小進步。",
    };
  }
  return {
    title: "建立基礎",
    lead: "這份結果提示可以先由核心詞彙、句型和閱讀線索開始，慢慢建立信心。",
    action: "安排有明確步驟的小組或一對一練習，先把最需要的概念逐一整理。",
  };
}

function progressLabel(index: number) {
  return `第 ${index + 1} / ${QUESTIONS.length} 題`;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    parentName: "",
    whatsapp: "",
    grade: "小四至小六",
    district: "",
  });

  useEffect(() => {
    if (stage !== "landing") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [stage]);

  const score = useMemo(
    () => answers.reduce((total, answer, index) => total + (answer === QUESTIONS[index]?.correct ? 1 : 0), 0),
    [answers],
  );
  const profile = getProfile(score);
  const weakTopics = useMemo(() => {
    const wrong = QUESTIONS.filter((question, index) => answers[index] !== question.correct).map(
      (question) => question.topic,
    );
    return Array.from(new Set(wrong));
  }, [answers]);
  const recommendations = useMemo(() => {
    const sameDistrict = PARTNERS.filter((partner) => partner.districts.includes(form.district));
    const sameRegion = PARTNERS.filter(
      (partner) => partner.region === REGION_BY_DISTRICT[form.district] && !sameDistrict.includes(partner),
    );
    return [...sameDistrict, ...sameRegion, ...PARTNERS.filter((partner) => !sameDistrict.includes(partner) && !sameRegion.includes(partner))].slice(0, 2);
  }, [form.district]);

  const beginQuiz = () => {
    setQuestionIndex(0);
    setAnswers([]);
    setFormError("");
    setStage("quiz");
  };

  const selectAnswer = (answerIndex: number) => {
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = answerIndex;
      return next;
    });
  };

  const nextQuestion = () => {
    if (questionIndex === QUESTIONS.length - 1) {
      setStage("gate");
      return;
    }
    setQuestionIndex((current) => current + 1);
  };

  const previousQuestion = () => {
    if (questionIndex === 0) return;
    setQuestionIndex((current) => current - 1);
  };

  const unlockReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.parentName.trim() || !form.whatsapp.trim() || !form.district) {
      setFormError("請完成家長稱呼、WhatsApp 號碼和所在區域，才可查看報告。");
      return;
    }
    setFormError("");
    setStage("report");
  };

  const currentQuestion = QUESTIONS[questionIndex];

  return (
    <main className="site-shell">
      <header className="site-header">
        <button className="brand-lockup" onClick={() => setStage("landing")} aria-label="返回學習航圖首頁">
          <img src={LOGO_IMAGE} alt="學習航圖標誌" className="brand-mark" />
          <span>
            <strong>學習航圖</strong>
            <small>LEARNING COMPASS</small>
          </span>
        </button>
        <div className="header-note">
          <span className="note-dot" />
          英文基礎小測驗
        </div>
      </header>

      {stage === "landing" && (
        <>
          <section className="hero-section">
            <div className="hero-copy">
              <p className="eyebrow"><Compass size={16} /> 為親子整理下一步</p>
              <h1>先看見孩子的<br /><em>學習節奏</em>，再決定方向。</h1>
              <p className="hero-lead">用 5 條英文問題，整理一份可與孩子一起閱讀的學習航圖；完成後，按所在區域查看合適的支援選擇。</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={beginQuiz}>
                  開始 3 分鐘小測驗 <ArrowRight size={18} />
                </button>
                <span className="micro-note"><CheckCircle2 size={17} /> 不會為孩子貼標籤</span>
              </div>
              <div className="hero-stats" aria-label="小測驗資料">
                <div><strong>05</strong><span>英文基礎題</span></div>
                <div><strong>03</strong><span>報告重點</span></div>
                <div><strong>01</strong><span>合適下一步</span></div>
              </div>
            </div>
            <div className="hero-art">
              <img src={HERO_IMAGE} alt="家長與學生一起閱讀學習資料" />
              <div className="hero-annotation annotation-top"><span>01</span> 由理解開始</div>
              <div className="hero-annotation annotation-bottom"><Sparkles size={16} /> 為孩子找對節奏</div>
            </div>
          </section>

          <section className="route-preview" aria-labelledby="route-title">
            <div className="route-photo"><img src={ROUTE_IMAGE} alt="象徵學習方向的紙藝航線" /></div>
            <div className="route-copy">
              <p className="eyebrow">不是考試，是一次整理</p>
              <h2 id="route-title">從一條問題，走到一份<br />更容易討論的建議。</h2>
              <div className="route-steps">
                <div><span>01</span><p><strong>完成小測驗</strong>以 5 條問題認識現時的英文基礎。</p></div>
                <div><span>02</span><p><strong>讀取學習航圖</strong>把答題線索轉為清晰、可行的重點。</p></div>
                <div><span>03</span><p><strong>探索支援選擇</strong>按你所在區域查看合作機構示範推薦。</p></div>
              </div>
            </div>
          </section>

          <section className="trust-strip">
            <BookOpen size={22} />
            <p><strong>給家長的一句提醒：</strong> 這份小測驗只是一個起點，結果用來打開對話，而不是定義孩子。</p>
          </section>

          <section className="session-callout">
            <div className="session-image"><img src={SESSION_IMAGE} alt="小組學習討論情景" /></div>
            <div className="session-copy">
              <p className="eyebrow">找對支援方式</p>
              <h2>當方向清楚，<br />練習才會走得更踏實。</h2>
              <p>報告會按英文能力面向與所在地區，展示可以進一步了解的合作支援選擇。此版本使用示範機構資料，正式上線前可替換為你的合作名單。</p>
              <button className="text-button" onClick={beginQuiz}>先完成小測驗 <ArrowRight size={17} /></button>
            </div>
          </section>
        </>
      )}

      {(stage === "quiz" || stage === "gate") && (
        <section className="assessment-shell">
          <aside className="journey-rail" aria-label="小測驗流程">
            <p className="rail-kicker">LEARNING ROUTE</p>
            <div className="rail-heading"><Compass size={27} /><span>你的<br />學習航線</span></div>
            <div className="rail-steps">
              <div className="rail-step rail-step-active"><i>1</i><span>英文小測驗</span></div>
              <div className={stage === "gate" ? "rail-step rail-step-active" : "rail-step"}><i>2</i><span>解鎖分析</span></div>
              <div className="rail-step"><i>3</i><span>地區建議</span></div>
            </div>
            <p className="rail-footer">每一題只需一個選擇。<br />按自己的節奏完成即可。</p>
          </aside>

          {stage === "quiz" && (
            <div className="quiz-panel">
              <div className="quiz-topline">
                <div><p className="eyebrow">{currentQuestion.label}</p><span>{progressLabel(questionIndex)}</span></div>
                <div className="progress-line" aria-label={progressLabel(questionIndex)}><i style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }} /></div>
              </div>
              <div className="question-card">
                <span className="question-number">0{questionIndex + 1}</span>
                <h2>{currentQuestion.question}</h2>
                <p>{currentQuestion.hint}</p>
                <div className="answer-list" role="radiogroup" aria-label={currentQuestion.question}>
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={option}
                      className={answers[questionIndex] === index ? "answer-option answer-option-selected" : "answer-option"}
                      onClick={() => selectAnswer(index)}
                      role="radio"
                      aria-checked={answers[questionIndex] === index}
                    >
                      <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                      <span>{option}</span>
                      {answers[questionIndex] === index && <Check size={18} />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="quiz-actions">
                <button className="button button-ghost" onClick={previousQuestion} disabled={questionIndex === 0}><ArrowLeft size={17} /> 上一題</button>
                <button className="button button-primary" onClick={nextQuestion} disabled={answers[questionIndex] === undefined}>
                  {questionIndex === QUESTIONS.length - 1 ? "查看分析報告" : "下一題"} <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}

          {stage === "gate" && (
            <div className="quiz-panel gate-stage">
              <div className="gate-intro"><span className="gate-icon"><LockKeyhole size={25} /></span><p className="eyebrow">分析即將完成</p><h2>留下最少資料，<br />解鎖你的學習航圖。</h2><p>我們會用所在區域整理相關的合作支援選擇。此示範版本不會上載或儲存所填資料。</p></div>
              <form className="lead-form" onSubmit={unlockReport}>
                <label>家長稱呼<input value={form.parentName} onChange={(event) => setForm({ ...form, parentName: event.target.value })} placeholder="例如：陳太" /></label>
                <label>WhatsApp 號碼<input inputMode="tel" value={form.whatsapp} onChange={(event) => setForm({ ...form, whatsapp: event.target.value })} placeholder="例如：9123 4567" /></label>
                <div className="form-row">
                  <label>學生年級<select value={form.grade} onChange={(event) => setForm({ ...form, grade: event.target.value })}><option>小一至小三</option><option>小四至小六</option><option>中一至中三</option><option>中四至中六</option></select></label>
                  <label>所在區域<select value={form.district} onChange={(event) => setForm({ ...form, district: event.target.value })}><option value="">請選擇</option>{DISTRICTS.map((district) => <option key={district}>{district}</option>)}</select></label>
                </div>
                {formError && <p className="form-error">{formError}</p>}
                <div className="privacy-note"><LockKeyhole size={15} /><span><strong>示範版私隱提示：</strong>資料只用於本頁即時顯示，關閉頁面後不會保留。</span></div>
                <button className="button button-primary button-wide" type="submit">解鎖我的分析報告 <ArrowRight size={17} /></button>
              </form>
            </div>
          )}
        </section>
      )}

      {stage === "report" && (
        <section className="report-shell">
          <div className="report-intro">
            <div><p className="eyebrow"><Sparkles size={16} /> {form.parentName} 的學習航圖</p><h1>{profile.title}</h1><p>{profile.lead}</p></div>
            <div className="score-card"><span>本次小測驗</span><strong>{score}<small>/ 5</small></strong><p>答對題數</p></div>
          </div>

          <div className="report-grid">
            <article className="report-summary">
              <div className="summary-photo"><img src={PROFILE_IMAGE} alt="學習檔案和紙張筆記" /></div>
              <div className="summary-copy"><p className="eyebrow">航圖摘要</p><h2>現在最值得先走的一步</h2><p>{profile.action}</p><div className="summary-line"><span>學習節奏</span><b>{score >= 3 ? "已找到部分基礎" : "由核心概念開始"}</b></div><div className="summary-line"><span>建議方式</span><b>{score === 5 ? "延伸式挑戰" : "循序式鞏固"}</b></div></div>
            </article>
            <article className="focus-card">
              <p className="eyebrow">可留意的面向</p>
              {weakTopics.length === 0 ? (
                <div className="all-clear"><CheckCircle2 size={26} /><h3>基礎題目表現穩定</h3><p>可把下一步放在閱讀策略、寫作組織或真實情境中的英文運用。</p></div>
              ) : weakTopics.map((topic, index) => (
                <div className="focus-item" key={topic}><span>0{index + 1}</span><div><h3>{TOPIC_INSIGHTS[topic].title}</h3><p>{TOPIC_INSIGHTS[topic].copy}</p></div></div>
              ))}
            </article>
          </div>

          <section className="recommendation-section">
            <div className="recommendation-heading"><div><p className="eyebrow"><MapPin size={16} /> 以 {form.district} 為起點</p><h2>可進一步了解的<br />合作支援選擇。</h2></div><p>以下為<strong>示範資料</strong>，已按所在區域排序。請於正式上線前以真實合作補習社資料替換。</p></div>
            <div className="partner-list">
              {recommendations.map((partner, index) => (
                <article className="partner-card" key={partner.name}>
                  <div className="partner-index">0{index + 1}</div>
                  <div className="partner-main"><span className="demo-chip">合作資料示範</span><h3>{partner.name}</h3><p>{partner.focus}</p></div>
                  <dl><div><dt>適合年級</dt><dd>{partner.grades}</dd></div><div><dt>教學形式</dt><dd>{partner.format}</dd></div><div><dt>服務地區</dt><dd>{partner.districts.join("、")}</dd></div></dl>
                  <button className="partner-button" disabled><Phone size={16} /> 待加入聯絡連結</button>
                </article>
              ))}
            </div>
          </section>

          <div className="report-footer"><p><strong>溫馨提示：</strong>這份結果只反映本次 5 題小測驗的答題情況，適合作為親子討論學習方向的起點。</p><button className="button button-ghost" onClick={beginQuiz}>重新完成小測驗 <ArrowRight size={17} /></button></div>
        </section>
      )}

      <footer className="site-footer"><span>© 學習航圖</span><span>英文基礎小測驗 · 示範版本</span></footer>
    </main>
  );
}

import { getSecondaryExamSeeds } from "./secondaryExamBanks";
import { primaryChineseSelectionGroup } from "./primaryChineseReadingFramework";
import { PRIMARY_ENGLISH_READING_BANKS, PRIMARY_ENGLISH_WRITING_BANKS } from "./primaryEnglishBanks";

/**
 * Learning Compass / 學習航圖
 * Design reminder: a calm, transparent diagnostic flow. Grade labels guide
 * question selection and report language; this is not a formal examination.
 */
export type GradeId = "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "S1" | "S2" | "S3";
export type TrackId = "chinese-reading" | "chinese-writing" | "english-reading" | "english-writing" | "math" | "science" | "interview";
export type ModuleName = "基礎掌握" | "理解與應用" | "情境推理" | "整合表達" | "溝通與協作";

export type AssessmentQuestion = {
  id: string;
  label: string;
  topic: string;
  selectionGroup: string;
  question: string;
  hint: string;
  options: string[];
  correct: number;
  grade: GradeId;
  gradeBand: string;
  module: ModuleName;
  difficulty: "基礎" | "核心" | "進階";
};
export type QuestionSeed = Omit<AssessmentQuestion, "id" | "grade" | "gradeBand" | "module" | "difficulty" | "selectionGroup"> & { selectionGroup?: string };

export const GRADES: { id: GradeId; label: string; stage: "小學" | "初中" }[] = [
  { id: "P1", label: "小一", stage: "小學" }, { id: "P2", label: "小二", stage: "小學" }, { id: "P3", label: "小三", stage: "小學" },
  { id: "P4", label: "小四", stage: "小學" }, { id: "P5", label: "小五", stage: "小學" }, { id: "P6", label: "小六", stage: "小學" },
  { id: "S1", label: "中一", stage: "初中" }, { id: "S2", label: "中二", stage: "初中" }, { id: "S3", label: "中三", stage: "初中" },
];

export const TRACKS: { id: TrackId; label: string; shortLabel: string; description: string; icon: "language" | "math" | "science" | "interview"; allowedStages: ("小學" | "初中")[]; grades?: GradeId[] }[] = [
  { id: "chinese-reading", label: "中文閱讀理解", shortLabel: "中文閱讀", description: "按年級評核字詞、標點、篇章閱讀、修辭與古詩文理解", icon: "language", allowedStages: ["小學", "初中"] },
  { id: "chinese-writing", label: "中文寫作基礎與組織", shortLabel: "中文寫作", description: "詞語運用、句子、段落、內容與表達組織", icon: "language", allowedStages: ["初中"], grades: ["S1", "S2", "S3"] },
  { id: "english-reading", label: "英文閱讀理解", shortLabel: "英文閱讀", description: "按年級遞進評核拼讀／詞彙、文法、文體、訊息理解與閱讀策略", icon: "language", allowedStages: ["小學", "初中"] },
  { id: "english-writing", label: "英文寫作基礎與組織", shortLabel: "英文寫作", description: "按年級評核句型與詞彙、段落組織、文體目的及修訂準備", icon: "language", allowedStages: ["小學", "初中"] },
  { id: "math", label: "數學應用與解題", shortLabel: "數學", description: "運算、比例、幾何、數據與多步驟解題", icon: "math", allowedStages: ["小學", "初中"] },
  { id: "science", label: "Science 科學探究", shortLabel: "Science", description: "探究、生命、物質、能量與力學概念", icon: "science", allowedStages: ["初中"] },
  { id: "interview", label: "升中面試準備", shortLabel: "升中面試", description: "自我介紹、聆聽、應對、協作與表達", icon: "interview", allowedStages: ["小學"], grades: ["P5", "P6"] },
];

export const ASSESSMENT_MODULES: ModuleName[] = ["基礎掌握", "理解與應用", "情境推理", "整合表達", "溝通與協作"];
const CONTEXTS = ["校園情境", "社區情境", "日常生活"];

function gradeBand(grade: GradeId) {
  if (grade === "P1" || grade === "P2") return "小學低年級基礎";
  if (grade === "P3" || grade === "P4") return "小學中年級核心";
  if (grade === "P5" || grade === "P6") return "小學高年級進階";
  return "初中基礎至應用";
}

function difficultyFor(grade: GradeId, variant: number): AssessmentQuestion["difficulty"] {
  if (grade === "P1" || grade === "P2") return variant === 0 ? "基礎" : "核心";
  if (grade === "S2" || grade === "S3") return variant === 2 ? "進階" : "核心";
  return variant === 0 ? "基礎" : variant === 1 ? "核心" : "進階";
}

function moduleForSeed(track: TrackId, seed: QuestionSeed): ModuleName {
  const skill = `${seed.topic} ${seed.label}`.toLowerCase();
  if (track === "interview") return /introduction|interest|improve|school|memorable|response|reflection|自我|興趣|反思|學校|表達/.test(skill) ? "整合表達" : "溝通與協作";
  if (track === "chinese-reading" && /字形、筆畫與部首|字詞與基本句子|基本標點與句式/.test(skill)) return "基礎掌握";
  if (track === "chinese-reading" && /兒歌與童話閱讀|簡單修辭與古詩|詞義辨析與查字典|句式與標點運用|段落大意與順敘|看圖與敘事閱讀|修辭與五言絕句/.test(skill)) return "理解與應用";
  if (track === "chinese-reading" && /詞彙、成語與字詞辨錯|複句、標點與專名/.test(skill)) return "基礎掌握";
  if (track === "chinese-reading" && /中心句與段落組織|倒敘與實用文閱讀|修辭與七言絕句/.test(skill)) return "理解與應用";
  if (track === "chinese-reading" && /字形、字音與詞義辨析|轉折複句與進階標點/.test(skill)) return "基礎掌握";
  if (track === "chinese-reading" && /寓言、神話與說明文|修辭與篇章結構|七言絕句與文學感受/.test(skill)) return "理解與應用";
  if (track === "chinese-reading" && /詞語感情色彩與詞義|條件假設複句與破折號/.test(skill)) return "基礎掌握";
  if (track === "chinese-reading" && /要點歸納與思想感情|議論與散文閱讀|律詩格式、文化與內容理解/.test(skill)) return "理解與應用";
  if (track === "chinese-reading" && /熟語與多義詞運用|讓步遞進複句與標點/.test(skill)) return "基礎掌握";
  if (track === "chinese-reading" && /比較閱讀與觀點證據|淺易文言與進階修辭|古詩宋詞賞析/.test(skill)) return "理解與應用";
  if (track === "english-reading" && /字母音素|長元音|magic e|子音群|二合字母|搭配|片語動詞|字首字尾|同反義詞|名詞、代名詞|進行式|過去式|完成式|被動語態|句首大寫|標點/.test(skill)) return "基礎掌握";
  if (track === "english-writing" && /句型範本|句子連接|完整段落|三段結構|故事高潮|多段論證|名詞、代名詞|進行式|過去式|未來式|完成式|被動語態|大寫、句號|生活詞彙|興趣、天氣|社區、職業|環境與世界|科技、災害|同反義詞/.test(skill)) return "基礎掌握";
  if ((track === "english-reading" || track === "english-writing") && /兒歌|寓言|圖畫書|資訊文章|傳記|論說文|故事|日記|書信|報告|傳單|校刊|修訂|語氣|證據|段落|主旨|訊息|觀點|批判|次序|內容檢查/.test(skill)) return "理解與應用";
  if (track === "chinese-writing" && /內容發展|觀點發展|論證|寫作規劃|應試準備|應試策略/.test(skill)) return "整合表達";
  if (track === "english-reading" && /writer's purpose|identifying writer/.test(skill)) return "理解與應用";
  if (track === "english-reading" && /inference strategies/.test(skill)) return "理解與應用";
  if (track === "english-writing" && /subject.?verb agreement|register and tone/.test(skill)) return "基礎掌握";
  if (track === "english-writing" && /sentence specificity|precision in writing/.test(skill)) return "理解與應用";
  if (track === "english-writing" && /parallelism/.test(skill)) return "理解與應用";
  if (track === "english-writing" && /identifying supporting details|supporting detail/.test(skill)) return "理解與應用";
  if (track === "chinese-reading" && /文本結構|段落組織/.test(skill)) return "理解與應用";
  if (track === "math") {
    if (/生活/.test(skill)) return "情境推理";
    if (/資料|統計|平均|中位|圖表/.test(skill)) return "理解與應用";
    if (/比例|百分|比率|代數|方程|幾何|量度|時間|金錢/.test(skill)) return "理解與應用";
    return "基礎掌握";
  }
  if (track === "science") return /探究|inquiry|實驗|experiment/.test(skill) ? "情境推理" : "理解與應用";
  if (/字詞|詞語|vocabulary|grammar|sentence|language accuracy|標點|句子組織|句子結構|語法|病句/.test(skill)) return "基礎掌握";
  if (/訊息|細節|主旨|reading details|main idea|reading purpose|閱讀|connector|連接詞|連接表達/.test(skill)) return "理解與應用";
  if (/reference word|pronoun|supporting evidence/.test(skill)) return "理解與應用";
  if (/修辭|句意/.test(skill)) return "理解與應用";
  if (/推論|inference|text connection|語境/.test(skill)) return "情境推理";
  if (/段落|整合|paragraph|purpose|tone|audience|revision|表達/.test(skill)) return "整合表達";
  return "理解與應用";
}

function selectionGroupForSeed(track: TrackId, grade: GradeId, seed: QuestionSeed, seedIndex: number, seedCount: number) {
  if (seed.selectionGroup) return seed.selectionGroup;
  const usesPrecisePrimaryGroups = grade.startsWith("P") && ["chinese-reading", "chinese-writing", "english-reading", "english-writing", "math", "interview"].includes(track);
  if (!usesPrecisePrimaryGroups) return seed.selectionGroup ?? seed.topic;
  const group = track === "english-writing" && seedCount === 11
    ? ([0, 0, 1, 1, 2, 2, 3, 3, 3, 4, 4][seedIndex] ?? seedIndex)
    : Math.floor(seedIndex / 2);
  return `${track}-${group}`;
}

const BANKS: Record<TrackId, QuestionSeed[]> = {
  "chinese-reading": [
    { label: "字詞理解", topic: "字詞", question: "「堅持不懈」最接近哪一個意思？", hint: "想想這個成語形容面對目標時的態度。", options: ["不停休息", "持續努力不放棄", "做事很急", "不理會結果"], correct: 1 },
    { label: "詞語辨析", topic: "字詞", question: "下列哪一個詞最適合形容安排得周全？", hint: "選擇有考慮周到意思的詞。", options: ["草率", "妥善", "含糊", "急促"], correct: 1 },
    { label: "訊息定位", topic: "閱讀訊息", question: "通告寫着「活動於下午二時在禮堂開始，參加者須於一時四十五分報到」。參加者最遲應何時到達？", hint: "直接找出報到時間。", options: ["下午一時", "下午一時四十五分", "下午二時", "下午三時"], correct: 1 },
    { label: "主旨辨認", topic: "閱讀訊息", question: "文章先介紹減少浪費的方法，再提出可從自備水樽開始。文章主要目的最可能是？", hint: "主旨是作者最想帶出的中心訊息。", options: ["介紹水樽的價格", "鼓勵實踐環保生活", "描述一次旅行", "比較不同商店"], correct: 1 },
    { label: "閱讀推論", topic: "閱讀推論", question: "阿朗看見同學忘記帶雨傘，便把自己的雨傘放在兩人中間。這最能反映他怎樣？", hint: "從人物行動推想特質。", options: ["細心體貼", "害怕下雨", "不想回家", "喜歡收藏雨傘"], correct: 0 },
    { label: "原因推論", topic: "閱讀推論", question: "小敏每次借書前都先翻看目錄和摘要。她這樣做最可能是為了？", hint: "思考這個行動能幫助她做甚麼。", options: ["更快選到合適的書", "令書變得更新", "避免進入圖書館", "不用閱讀內容"], correct: 0 },
    { label: "修辭理解", topic: "修辭", question: "「城市在晨光中慢慢甦醒」主要運用了甚麼手法？", hint: "城市被寫成像人一樣。", options: ["擬人", "排比", "反問", "設問"], correct: 0 },
    { label: "語境判斷", topic: "修辭", question: "「他的笑聲像清脆的鈴鐺」主要突出了笑聲的甚麼特點？", hint: "留意被比作鈴鐺的地方。", options: ["沉重", "響亮清脆", "緩慢", "悲傷"], correct: 1 },
    { label: "觀點判斷", topic: "整合表達", question: "閱讀兩段對校園午膳安排的不同意見後，哪種做法最能公平回應文章？", hint: "同時考慮兩段所提出的理由。", options: ["只重複其中一人的說法", "比較兩種理由後提出自己的取捨", "不看內容直接選擇", "把兩段文字抄下來"], correct: 1 },
    { label: "段落關係", topic: "整合表達", question: "「先閱讀題目，再找出關鍵詞，最後回到文章核對。」這段文字主要使用哪種組織方式？", hint: "留意步驟的先後。", options: ["時間順序", "因果關係", "比較對照", "問題解決"], correct: 0 },
  ],
  "chinese-writing": [
    { label: "詞語運用", topic: "詞語運用", question: "要形容同學做事認真，哪個詞最合適？", hint: "選擇能準確反映做事態度的詞。", options: ["敷衍", "勤奮", "混亂", "急躁"], correct: 1 },
    { label: "詞語搭配", topic: "詞語運用", question: "下列哪個詞語搭配最自然？", hint: "留意動詞和名詞的常見配搭。", options: ["培養習慣", "培養雨傘", "培養公路", "培養鐘錶"], correct: 0 },
    { label: "句子修正", topic: "句子組織", question: "哪一句語序最通順？", hint: "先找主語、動作和其他資訊。", options: ["在操場跑步同學們下午。", "同學們下午在操場跑步。", "下午跑步同學們操場在。", "跑步在同學們下午操場。"], correct: 1 },
    { label: "標點運用", topic: "句子組織", question: "「老師提醒大家要準時交功課」最合適的標點寫法是？", hint: "留意引用說話內容的符號。", options: ["老師提醒大家要準時交功課。", "老師提醒：「大家要準時交功課。」", "老師提醒，大家：要準時交功課。", "老師，提醒大家要準時交功課？"], correct: 1 },
    { label: "段落中心", topic: "段落組織", question: "要寫一段支持「閱讀能開闊眼界」的文字，哪個中心句最合適？", hint: "中心句要直接提出段落觀點。", options: ["昨天我去了書店。", "閱讀讓我們接觸不同人的經歷和想法。", "書本有不同顏色。", "我有一張書籤。"], correct: 1 },
    { label: "例子支援", topic: "段落組織", question: "哪一個例子最能支持「合作可以提升效率」？", hint: "例子要直接回應觀點。", options: ["大家各自等待。", "小組分工後在限時內完成海報。", "有人沒有帶文具。", "操場很大。"], correct: 1 },
    { label: "內容取材", topic: "內容發展", question: "寫「一次難忘的服務經驗」時，哪一項細節最能令內容具體？", hint: "選擇能呈現行動和感受的細節。", options: ["活動很不錯。", "我協助長者尋找座位，聽見他說謝謝後感到安心。", "那天有很多人。", "服務需要時間。"], correct: 1 },
    { label: "觀點發展", topic: "內容發展", question: "要回應「應否限制使用手機」時，哪種寫法較有說服力？", hint: "觀點後加入理由和例子。", options: ["我覺得可以。", "我支持在上課時限制使用，因為可減少分心，並可在課後安排使用時間。", "手機就是手機。", "每個人不同。"], correct: 1 },
    { label: "連接詞", topic: "表達準確", question: "「我先完成資料搜集，____ 整理重點。」填入哪個連接詞最合適？", hint: "留意兩個動作的先後。", options: ["然而", "然後", "雖然", "因此"], correct: 1 },
    { label: "語氣選擇", topic: "表達準確", question: "向老師請教問題時，哪一句最得體？", hint: "有禮、具體地提出請求。", options: ["我不明白，快講。", "老師，我嘗試過這一題，但仍不明白第二步，可否請您指導？", "這題太難。", "你應該幫我。"], correct: 1 },
    { label: "整合表達", topic: "表達準確", question: "完成一段記敘文後，哪一項檢查最能提升文章完整性？", hint: "留意事件、感受和結尾是否呼應。", options: ["只數一數字數", "檢查事件次序、具體細節和感受是否一致", "把每句改得更長", "刪去所有標點"], correct: 1 },
  ],
  "english-reading": [
    { label: "Vocabulary", topic: "Vocabulary", question: "The word “responsible” is closest in meaning to ____.", hint: "Think about someone who can be trusted to do what is needed.", options: ["careless", "reliable", "silent", "nervous"], correct: 1 },
    { label: "Grammar", topic: "Vocabulary", question: "Neither the teacher nor the students ____ ready to leave.", hint: "The verb agrees with the noun closest to it.", options: ["is", "are", "was", "be"], correct: 1 },
    { label: "Detail finding", topic: "Reading details", question: "A notice says the workshop begins at 10:30 a.m. and registration closes at 10:15 a.m. What should a student do?", hint: "Look for the earlier required time.", options: ["Arrive after 10:30", "Register by 10:15", "Wait until noon", "Bring no materials"], correct: 1 },
    { label: "Main idea", topic: "Reading details", question: "An article explains how students can reduce food waste at home and at school. Its main purpose is to ____.", hint: "Think about what the writer wants readers to do.", options: ["tell a fictional story", "encourage practical action", "advertise a restaurant", "describe a holiday"], correct: 1 },
    { label: "Inference", topic: "Reading inference", question: "Maya packed an extra charger before a long day of group work. What can we infer?", hint: "Use her preparation as a clue.", options: ["She expected to use a device for a long time", "She lost every device", "She dislikes technology", "She was staying at home"], correct: 0 },
    { label: "Writer attitude", topic: "Reading inference", question: "The writer calls a community project “a small step with a lasting effect”. The writer is most likely ____.", hint: "Notice the positive language.", options: ["doubtful", "supportive", "angry", "uninterested"], correct: 1 },
    { label: "Reference word", topic: "Text connection", question: "“The club raised money for new books. It also organised a reading day.” What does “It” refer to?", hint: "Look back to the nearest suitable noun.", options: ["The money", "The club", "The books", "The day"], correct: 1 },
    { label: "Connector", topic: "Text connection", question: "The team practised regularly; ____ , they became more confident.", hint: "The second part shows a result.", options: ["however", "therefore", "although", "unless"], correct: 1 },
    { label: "Text purpose", topic: "Integrated reading", question: "A webpage includes steps, safety reminders and a contact form for joining a beach clean-up. It is mainly designed to ____.", hint: "Think about the reader’s next action.", options: ["invite people to take part", "sell beach houses", "teach swimming", "report a storm"], correct: 0 },
    { label: "Evidence", topic: "Integrated reading", question: "Which detail best supports the idea that a student enjoys science?", hint: "Choose evidence that shows interest through action.", options: ["She owns a blue bag.", "She volunteers to explain experiments to her classmates.", "She takes the bus to school.", "She has lunch at noon."], correct: 1 },
  ],
  "english-writing": [
    { label: "Sentence structure", topic: "Sentence structure", question: "Choose the most complete sentence.", hint: "Look for a clear subject and verb.", options: ["Because the weather was rainy.", "The weather rainy yesterday.", "We stayed indoors because the weather was rainy.", "Staying indoors because rainy."], correct: 2 },
    { label: "Sentence order", topic: "Sentence structure", question: "Choose the sentence with the clearest word order.", hint: "An English sentence usually has a subject, a verb and extra information.", options: ["At the library studies Mia every day.", "Mia studies at the library every day.", "Studies Mia every day at the library.", "Every day library Mia studies at the."], correct: 1 },
    { label: "Tense accuracy", topic: "Language accuracy", question: "By the time I arrived, the meeting ____.", hint: "One past action finished before another past action.", options: ["starts", "has started", "had started", "will start"], correct: 2 },
    { label: "Word choice", topic: "Language accuracy", question: "Which word best completes the sentence: “Please ____ your ideas clearly in the report.”", hint: "Choose a verb related to communication.", options: ["express", "borrow", "carry", "sleep"], correct: 0 },
    { label: "Paragraph focus", topic: "Paragraph organisation", question: "Which topic sentence best introduces a paragraph about teamwork?", hint: "A topic sentence should state the main idea.", options: ["My group met on Tuesday.", "Good teamwork helps people combine different strengths.", "The room has four windows.", "I like many subjects."], correct: 1 },
    { label: "Supporting detail", topic: "Paragraph organisation", question: "Which sentence best supports the idea that exercise improves well-being?", hint: "Choose a specific supporting example.", options: ["Exercise is a word.", "A short walk after school can help students relax and focus on homework.", "Some shoes are expensive.", "Everyone is different."], correct: 1 },
    { label: "Linking", topic: "Paragraph organisation", question: "I revised my notes carefully. ____ , I felt more prepared for the quiz.", hint: "The second sentence is a result.", options: ["However", "As a result", "For example", "Although"], correct: 1 },
    { label: "Tone", topic: "Purpose and tone", question: "Which sentence is most suitable for an email to a teacher?", hint: "Use a polite and clear tone.", options: ["Send me the answer now.", "I am writing to ask whether you could clarify the homework deadline.", "Your homework is confusing.", "I don't care about the deadline."], correct: 1 },
    { label: "Purpose", topic: "Purpose and tone", question: "If you are writing to invite classmates to a charity event, which information should be included?", hint: "Think about information people need to attend.", options: ["The event date, place and purpose", "Only your favourite colour", "A random story", "Nothing except a greeting"], correct: 0 },
    { label: "Revision", topic: "Revision and expression", question: "Which revision makes “The event was good” more specific?", hint: "Add a meaningful action or result.", options: ["The event was good good.", "The event was good because people came.", "The event raised funds and encouraged students to work together.", "The event was an event."], correct: 2 },
    { label: "Integrated writing", topic: "Revision and expression", question: "Before submitting a short piece of writing, which check is most useful?", hint: "Look beyond spelling alone.", options: ["Check if ideas, examples and conclusion match the purpose.", "Remove every full stop.", "Use the longest possible words.", "Change every sentence to a question."], correct: 0 },
  ],
  math: [
    { label: "數感與運算", topic: "數與運算", question: "下列哪一項計算結果等於 3,600 ÷ 9？", hint: "可直接計算，或用乘法檢查答案。", options: ["40", "400", "4,000", "32,400"], correct: 1 },
    { label: "分數運算", topic: "數與運算", question: "3/4 − 1/8 = ?", hint: "先把兩個分數化成相同分母。", options: ["1/8", "3/8", "5/8", "7/8"], correct: 2 },
    { label: "比與比例", topic: "比與百分比", question: "食譜中麵粉和糖的比例是 5：2。若用了 10 杯麵粉，需要多少杯糖？", hint: "比例的兩部分要同時按相同倍數放大。", options: ["2 杯", "4 杯", "5 杯", "8 杯"], correct: 1 },
    { label: "百分比應用", topic: "比與百分比", question: "一件原價 $240 的物品減價 25%，減價後售價是多少？", hint: "可先找出原價的四分之一。", options: ["$60", "$180", "$200", "$300"], correct: 1 },
    { label: "幾何與面積", topic: "圖形與量度", question: "一個長方形長 9 厘米、闊 5 厘米，它的面積是多少？", hint: "長方形面積 = 長 × 闊。", options: ["14 平方厘米", "28 平方厘米", "45 平方厘米", "90 平方厘米"], correct: 2 },
    { label: "時間量度", topic: "圖形與量度", question: "旅程在下午 2 時 35 分開始，歷時 1 小時 45 分，會在何時結束？", hint: "先加小時，再仔細處理分鐘。", options: ["下午 3 時 20 分", "下午 4 時 10 分", "下午 4 時 20 分", "下午 5 時 10 分"], correct: 2 },
    { label: "數據整理", topic: "數據與統計", question: "數字 6、8、8、10、13 的中位數是多少？", hint: "把數據排列後，找出正中間的數值。", options: ["6", "8", "9", "13"], correct: 1 },
    { label: "長條圖判讀", topic: "數據與統計", question: "長條圖顯示 12 名同學選擇美術、18 名同學選擇音樂。選擇音樂的同學多了多少人？", hint: "找出兩個數量之間的相差數。", options: ["4 人", "6 人", "12 人", "30 人"], correct: 1 },
    { label: "代數思維", topic: "多步驟解題", question: "解方程式：4x + 7 = 31，x = ?", hint: "先把常數移到另一邊，再處理 x 的係數。", options: ["4", "5", "6", "8"], correct: 2 },
    { label: "多步驟文字題", topic: "多步驟解題", question: "一班同學買了 6 包鉛筆，每包有 8 枝。送出 11 枝後，還剩下多少枝？", hint: "先計算全部鉛筆數量，再減去送出的數量。", options: ["26 枝", "37 枝", "48 枝", "59 枝"], correct: 1 },
  ],
  science: [
    { label: "Fair testing", topic: "Scientific enquiry", question: "When testing how light affects plant growth, which variable should be changed?", hint: "A fair test changes one main factor.", options: ["Amount of light", "Type of ruler", "Student's name", "Pot label colour"], correct: 0 },
    { label: "Reliability", topic: "Scientific enquiry", question: "Which action makes an experiment more reliable?", hint: "Think about reducing the effect of chance.", options: ["Repeat the test and compare results", "Change every variable", "Use no measurements", "Ignore unexpected results"], correct: 0 },
    { label: "Life science", topic: "Life and living things", question: "Which structure controls what enters and leaves a cell?", hint: "Think about the cell’s boundary.", options: ["Cell membrane", "Nucleus", "Vacuole", "Cell wall only"], correct: 0 },
    { label: "Food chains", topic: "Life and living things", question: "In a food chain, green plants are usually called ____.", hint: "They make their own food using light.", options: ["producers", "consumers", "predators", "decomposers only"], correct: 0 },
    { label: "Matter", topic: "Matter and particles", question: "Salt dissolved evenly in water forms a ____.", hint: "The mixture is uniform.", options: ["solution", "metal", "gas only", "vacuum"], correct: 0 },
    { label: "Density", topic: "Matter and particles", question: "Density is calculated by ____.", hint: "Use mass and volume.", options: ["mass ÷ volume", "mass × volume", "volume ÷ time", "mass + temperature"], correct: 0 },
    { label: "Energy", topic: "Energy", question: "A lamp mainly changes electrical energy into ____.", hint: "Think about its useful outputs.", options: ["light and heat", "sound and gravity", "chemical and nuclear", "mass and volume"], correct: 0 },
    { label: "Energy transfer", topic: "Energy", question: "A stretched rubber band stores ____.", hint: "It is energy stored because of shape.", options: ["elastic potential energy", "sound energy", "nuclear energy", "magnetic energy"], correct: 0 },
    { label: "Forces", topic: "Forces and motion", question: "If the resultant force on an object is zero, it may ____.", hint: "Balanced forces do not change motion.", options: ["stay still or move at constant speed", "always speed up", "always turn left", "lose all mass"], correct: 0 },
    { label: "Friction", topic: "Forces and motion", question: "A bicycle slows down when brakes are used mainly because of ____.", hint: "Think about contact between surfaces.", options: ["friction", "buoyancy", "magnetism", "loss of gravity"], correct: 0 },
  ],
  interview: [
    { label: "Self introduction", topic: "Self-introduction and authentic expression", question: "Which self-introduction gives the clearest first impression?", hint: "Choose a short, structured and genuine response.", options: ["Only say your name and stop.", "Greet, state your name and school, then share one genuine interest with an example.", "List every award without context.", "Ask the interviewer to answer first."], correct: 1 },
    { label: "Listening", topic: "Listening and clarification", question: "If you do not understand a question, what is the best response?", hint: "Clarify politely instead of guessing.", options: ["Make up an answer immediately.", "Ask politely for the question to be repeated or explained.", "Stay silent until the interview ends.", "Ask a friend to answer."], correct: 1 },
    { label: "Response structure", topic: "Interview communication: answering questions", question: "Which is the strongest way to answer “What do you enjoy learning?”", hint: "A good answer includes a reason and an example.", options: ["Say only one subject name.", "Name an area, explain why, and give one related experience.", "Change the question.", "Repeat “I don't know”."], correct: 1 },
    { label: "Teamwork", topic: "Collaboration and inclusion", question: "In a group task, a quieter member has not spoken. What can you do?", hint: "Include others respectfully.", options: ["Ignore the person.", "Invite the person to share an idea and listen carefully.", "Tell everyone your idea is best.", "End the discussion."], correct: 1 },
    { label: "Different views", topic: "Collaboration and disagreement", question: "When a teammate disagrees with you, what should you do first?", hint: "Understand before responding.", options: ["Say they are wrong.", "Ask about their reason and compare ideas calmly.", "Leave the group.", "Speak louder."], correct: 1 },
    { label: "Body language", topic: "Non-verbal communication", question: "Which body language supports clear communication?", hint: "Choose a natural and respectful action.", options: ["Look at the floor all the time.", "Sit naturally and look at the speaker.", "Keep checking a phone.", "Turn away while speaking."], correct: 1 },
    { label: "Reflection", topic: "Interview communication and self-reflection", question: "How can you answer a question about something you want to improve?", hint: "Be honest and show how you are working on it.", options: ["Say you have no area to improve.", "Name one area and explain one action you are taking.", "Blame classmates.", "Refuse to respond."], correct: 1 },
    { label: "School knowledge", topic: "School awareness and motivation", question: "Why does learning about a secondary school before an interview help?", hint: "Connect what you know to your own interests.", options: ["It guarantees admission.", "It helps you give specific reasons for applying and ask thoughtful questions.", "It means no other preparation is needed.", "It lets you memorise a uniform colour."], correct: 1 },
    { label: "Situation judgement", topic: "Peer inclusion and social awareness", question: "You notice a classmate is left out during an activity. What is a constructive response?", hint: "Show awareness and practical action.", options: ["Pretend not to notice.", "Invite the classmate to join and check what role they prefer.", "Tell others to stop talking.", "Leave the activity."], correct: 1 },
    { label: "Integrated expression", topic: "Self-introduction and authentic expression", question: "What makes an interview answer memorable without sounding rehearsed?", hint: "Use a real, relevant example.", options: ["Using the longest words possible.", "Giving a clear answer supported by a genuine experience.", "Speaking as fast as possible.", "Reciting a script without listening."], correct: 1 },
  ],
};

const PRIMARY_MATH_GRADE_BANKS: Record<"P1" | "P2" | "P3" | "P4" | "P5" | "P6", QuestionSeed[]> = {
  P1: [
    { label: "加法運算", topic: "數與運算", question: "8 + 7 = ?", hint: "可先湊成 10，再繼續計算。", options: ["14", "15", "16", "17"], correct: 1 },
    { label: "減法運算", topic: "數與運算", question: "17 − 9 = ?", hint: "由 17 向後數 9 步。", options: ["7", "8", "9", "10"], correct: 1 },
    { label: "大小比較", topic: "比較與規律", question: "下列哪一個數最大？", hint: "比較十位和個位的數字。", options: ["12", "16", "15", "13"], correct: 1 },
    { label: "數字規律", topic: "比較與規律", question: "2、4、6、8、____，下一個數是甚麼？", hint: "每次都增加相同的數。", options: ["9", "10", "11", "12"], correct: 1 },
    { label: "圖形辨認", topic: "圖形與量度", question: "哪一個圖形有三條直邊？", hint: "逐一數一數圖形的邊。", options: ["圓形", "三角形", "正方形", "長方形"], correct: 1 },
    { label: "長度比較", topic: "圖形與量度", question: "下列哪一樣物件較適合用厘米量度？", hint: "想想較短的物件通常用甚麼單位。", options: ["課室長度", "鉛筆長度", "操場長度", "巴士路程"], correct: 1 },
    { label: "整點時間", topic: "時間與金錢", question: "分針指向 12，時針指向 4，是甚麼時間？", hint: "分針在 12 代表正是整點。", options: ["3 時", "4 時", "4 時半", "12 時"], correct: 1 },
    { label: "金錢計算", topic: "時間與金錢", question: "一個麵包 $5，一盒牛奶 $4，一共要多少錢？", hint: "把兩個價錢相加。", options: ["$1", "$8", "$9", "$10"], correct: 2 },
    { label: "圖表比較", topic: "資料與生活解題", question: "圖表顯示紅色氣球有 6 個，藍色氣球有 3 個。紅色氣球多多少個？", hint: "找出兩個數量之間的相差數。", options: ["2 個", "3 個", "6 個", "9 個"], correct: 1 },
    { label: "生活加減題", topic: "資料與生活解題", question: "小明有 9 粒糖，送了 4 粒給朋友，還有多少粒？", hint: "由原來數量減去送出的數量。", options: ["4 粒", "5 粒", "6 粒", "13 粒"], correct: 1 },
  ],
  P2: [
    { label: "兩位數加法", topic: "數與運算", question: "32 + 45 = ?", hint: "可先把十位和個位分開相加。", options: ["67", "77", "87", "97"], correct: 1 },
    { label: "兩位數減法", topic: "數與運算", question: "63 − 28 = ?", hint: "可先減去 20，再減去 8。", options: ["25", "35", "45", "55"], correct: 1 },
    { label: "乘法概念", topic: "乘除與分組", question: "4 組，每組有 6 粒糖，一共有多少粒？", hint: "相同數量的組可以用乘法。", options: ["10 粒", "20 粒", "24 粒", "28 粒"], correct: 2 },
    { label: "平均分組", topic: "乘除與分組", question: "18 枝鉛筆平均分給 3 位同學，每人有多少枝？", hint: "平均分可以用除法。", options: ["5 枝", "6 枝", "7 枝", "9 枝"], correct: 1 },
    { label: "半分概念", topic: "圖形與量度", question: "把一個圓平均分成 2 份，取其中 1 份，表示多少？", hint: "平均分成兩份後，每份都是一半。", options: ["1/4", "1/2", "2/1", "2/2"], correct: 1 },
    { label: "長度換算", topic: "圖形與量度", question: "1 米等於多少厘米？", hint: "記住米和厘米的基本關係。", options: ["10 厘米", "50 厘米", "100 厘米", "1,000 厘米"], correct: 2 },
    { label: "時間判讀", topic: "時間與金錢", question: "下午 2 時半再過 1 小時，是甚麼時間？", hint: "先把小時加 1，分鐘不變。", options: ["下午 2 時 30 分", "下午 3 時", "下午 3 時 30 分", "下午 4 時"], correct: 2 },
    { label: "找贖", topic: "時間與金錢", question: "一本簿售 $13，用 $20 付款，應找回多少錢？", hint: "付款金額減去價錢。", options: ["$5", "$6", "$7", "$8"], correct: 2 },
    { label: "象形圖表", topic: "資料與生活解題", question: "象形圖中每個星星代表 2 人。若有 4 個星星，表示多少人？", hint: "先看每個圖案代表多少，再相乘。", options: ["6 人", "8 人", "10 人", "12 人"], correct: 1 },
    { label: "兩步驟生活題", topic: "資料與生活解題", question: "媽媽買了 3 包餅乾，每包 4 塊，吃了 2 塊後還有多少塊？", hint: "先計算全部餅乾，再減去吃掉的數量。", options: ["8 塊", "10 塊", "12 塊", "14 塊"], correct: 1 },
  ],
  P3: [
    { label: "三位數加法", topic: "數與運算", question: "126 + 278 = ?", hint: "把百位、十位和個位逐步相加。", options: ["394", "404", "414", "424"], correct: 1 },
    { label: "三位數減法", topic: "數與運算", question: "704 − 256 = ?", hint: "需要時可由前一位借位。", options: ["438", "448", "458", "468"], correct: 1 },
    { label: "乘除運算", topic: "乘除與分數", question: "7 × 8 = ?", hint: "可用乘法口訣幫助計算。", options: ["48", "54", "56", "64"], correct: 2 },
    { label: "同分母分數", topic: "乘除與分數", question: "1/4 + 2/4 = ?", hint: "分母相同時，分子可以相加。", options: ["1/6", "2/8", "3/4", "3/8"], correct: 2 },
    { label: "周界計算", topic: "圖形與量度", question: "一個長方形長 5 厘米、闊 3 厘米，周界是多少？", hint: "周界是四條邊的總和。", options: ["8 厘米", "15 厘米", "16 厘米", "20 厘米"], correct: 2 },
    { label: "時間經過", topic: "圖形與量度", question: "由上午 9 時 20 分到上午 11 時，經過多少時間？", hint: "先由 9 時 20 分數到 10 時，再數到 11 時。", options: ["1 小時 20 分", "1 小時 40 分", "2 小時", "2 小時 20 分"], correct: 1 },
    { label: "資料比較", topic: "數據與統計", question: "長條圖中 A 組有 15 人，B 組有 9 人，兩組相差多少人？", hint: "用較大數減去較小數。", options: ["4 人", "5 人", "6 人", "24 人"], correct: 2 },
    { label: "平均概念", topic: "數據與統計", question: "三位同學各有 4、6、8 張貼紙，平均每人有多少張？", hint: "先把總數相加，再平均分。", options: ["5 張", "6 張", "7 張", "18 張"], correct: 1 },
    { label: "購物解題", topic: "多步驟解題", question: "4 包貼紙每包 6 張，送了 5 張後還有多少張？", hint: "先用乘法找出總數，再做減法。", options: ["17 張", "19 張", "21 張", "24 張"], correct: 1 },
    { label: "逆向思考", topic: "多步驟解題", question: "一個數加 18 後是 45，原來的數是多少？", hint: "可用相反運算找回原來的數。", options: ["17", "27", "37", "63"], correct: 1 },
  ],
  P4: [
    { label: "大數運算", topic: "數與運算", question: "4,500 ÷ 9 = ?", hint: "可想想 9 乘多少會等於 4,500。", options: ["50", "500", "5,000", "40,500"], correct: 1 },
    { label: "小數計算", topic: "數與運算", question: "2.75 + 1.20 = ?", hint: "小數點要對齊再相加。", options: ["3.85", "3.95", "4.05", "4.95"], correct: 1 },
    { label: "分數運算", topic: "分數與比例", question: "3/5 + 1/5 = ?", hint: "分母相同時只需處理分子。", options: ["3/10", "4/5", "4/10", "1"], correct: 1 },
    { label: "比例初步", topic: "分數與比例", question: "紅珠和藍珠的數量比是 2：3。若有 6 粒紅珠，藍珠有多少粒？", hint: "把比例的兩部分按相同倍數放大。", options: ["4 粒", "6 粒", "8 粒", "9 粒"], correct: 3 },
    { label: "面積計算", topic: "圖形與量度", question: "一個長方形長 8 厘米、闊 6 厘米，面積是多少？", hint: "面積 = 長 × 闊。", options: ["14 平方厘米", "28 平方厘米", "48 平方厘米", "56 平方厘米"], correct: 2 },
    { label: "容量換算", topic: "圖形與量度", question: "1.25 公升等於多少毫升？", hint: "1 公升等於 1,000 毫升。", options: ["125 毫升", "1,025 毫升", "1,250 毫升", "12,500 毫升"], correct: 2 },
    { label: "平均數", topic: "數據與統計", question: "三次小測驗分數是 70、80、90，平均分是多少？", hint: "把分數相加後除以次數。", options: ["75", "80", "85", "240"], correct: 1 },
    { label: "圖表總和", topic: "數據與統計", question: "圖表顯示星期一看了 12 頁、星期二看了 15 頁、星期三看了 13 頁，一共看了多少頁？", hint: "把三天的頁數相加。", options: ["30 頁", "38 頁", "40 頁", "42 頁"], correct: 2 },
    { label: "多步驟金錢題", topic: "生活應用：單步與多步運算", question: "一本書售 $28，買 3 本用 $100 付款，應找回多少錢？", hint: "先計算三本書的總價。", options: ["$14", "$16", "$72", "$84"], correct: 1 },
    { label: "單步乘法應用題", topic: "生活應用：單步與多步運算", question: "一條繩分成 4 段，每段 35 厘米，整條繩長多少厘米？", hint: "相同長度的段數可用乘法。", options: ["39 厘米", "70 厘米", "105 厘米", "140 厘米"], correct: 3 },
  ],
  P5: [
    { label: "整數除法", topic: "數與運算", question: "7,560 ÷ 12 = ?", hint: "可先估算答案約有多少百。", options: ["63", "630", "6,300", "756"], correct: 1 },
    { label: "小數運算", topic: "數與運算", question: "4.8 × 0.5 = ?", hint: "乘以 0.5 等於取一半。", options: ["0.24", "2.4", "4.3", "5.3"], correct: 1 },
    { label: "異分母分數", topic: "分數與比例", question: "3/4 − 1/8 = ?", hint: "先化成相同分母。", options: ["1/8", "3/8", "5/8", "7/8"], correct: 2 },
    { label: "百分比", topic: "分數與比例", question: "$240 的 25% 是多少？", hint: "25% 等於四分之一。", options: ["$25", "$40", "$60", "$180"], correct: 2 },
    { label: "三角形面積", topic: "圖形與量度", question: "一個三角形底 10 厘米、高 6 厘米，面積是多少？", hint: "三角形面積 = 底 × 高 ÷ 2。", options: ["16 平方厘米", "30 平方厘米", "60 平方厘米", "80 平方厘米"], correct: 1 },
    { label: "體積概念", topic: "圖形與量度", question: "長方體長 4 厘米、闊 3 厘米、高 2 厘米，體積是多少？", hint: "體積 = 長 × 闊 × 高。", options: ["9 立方厘米", "12 立方厘米", "18 立方厘米", "24 立方厘米"], correct: 3 },
    { label: "統計圖表", topic: "數據與統計", question: "圓形圖中一半代表 40 人，全體共有多少人？", hint: "一半是全體的二分之一。", options: ["20 人", "40 人", "60 人", "80 人"], correct: 3 },
    { label: "平均數應用", topic: "數據與統計", question: "四次測驗平均是 75 分，前三次共得 220 分，第四次得多少分？", hint: "先用平均數找出四次總分。", options: ["70 分", "75 分", "80 分", "85 分"], correct: 2 },
    { label: "方程思維", topic: "代數思維", question: "3x + 5 = 20，x = ?", hint: "先減去 5，再除以 3。", options: ["3", "5", "7", "15"], correct: 1 },
    { label: "比例生活題", topic: "比例推理與比的應用", question: "果汁和水的比例是 1：4。若用了 3 杯果汁，需要多少杯水？", hint: "果汁由 1 變成 3，水也要按相同倍數改變。", options: ["4 杯", "7 杯", "9 杯", "12 杯"], correct: 3 },
  ],
  P6: [
    { label: "整數除法", topic: "數與運算", question: "3,600 ÷ 9 = ?", hint: "可用乘法檢查答案。", options: ["40", "400", "4,000", "32,400"], correct: 1 },
    { label: "小數除法", topic: "數與運算", question: "1.2 ÷ 0.3 = ?", hint: "把被除數和除數同時擴大 10 倍。", options: ["0.4", "4", "9", "40"], correct: 1 },
    { label: "比例應用", topic: "分數與比例", question: "麵粉和糖的比例是 5：2。若用了 10 杯麵粉，需要多少杯糖？", hint: "兩部分要同時按相同倍數放大。", options: ["2 杯", "4 杯", "5 杯", "8 杯"], correct: 1 },
    { label: "折扣計算", topic: "百分數與應用", question: "一件原價 $240 的物品減價 25%，減價後售價是多少？", hint: "先找出減去的金額，再由原價扣除。", options: ["$60", "$180", "$200", "$300"], correct: 1 },
    { label: "立體圖形", topic: "圖形與量度", question: "長方體長 6 厘米、闊 4 厘米、高 3 厘米，體積是多少？", hint: "把三條邊長相乘。", options: ["13 立方厘米", "24 立方厘米", "48 立方厘米", "72 立方厘米"], correct: 3 },
    { label: "速度概念", topic: "速度與量度（速率與時間）", question: "單車以每小時 12 公里行駛 1.5 小時，共行駛多少公里？", hint: "路程 = 速度 × 時間。", options: ["8 公里", "12 公里", "18 公里", "24 公里"], correct: 2 },
    { label: "中位數", topic: "數據與統計", question: "數字 6、8、8、10、13 的中位數是多少？", hint: "把數據排好後找中間數。", options: ["6", "8", "9", "13"], correct: 1 },
    { label: "長條圖判讀", topic: "數據與統計", question: "長條圖顯示 12 名同學選擇美術、18 名同學選擇音樂。選擇音樂的同學多了多少人？", hint: "用較大數減去較小數。", options: ["4 人", "6 人", "12 人", "30 人"], correct: 1 },
    { label: "代數思維", topic: "一元一次方程式求解", question: "4x + 7 = 31，x = ?", hint: "先減去 7，再除以 4。", options: ["4", "5", "6", "8"], correct: 2 },
    { label: "綜合文字題", topic: "多步驟解題", question: "6 包鉛筆每包有 8 枝，送出 11 枝後，還有多少枝？", hint: "先計算全部數量，再減去送出的數量。", options: ["26 枝", "37 枝", "48 枝", "59 枝"], correct: 1 },
  ],
};

type PrimaryLanguageLevel = { zhWord: string; zhMeaning: string; zhPerson: string; zhAction: string; zhSentence: string; zhTopic: string; enWord: string; enMeaning: string; enSubject: string; enVerb: string; enTheme: string };
const PRIMARY_LANGUAGE_LEVELS: Record<"P1" | "P2" | "P3" | "P4" | "P5" | "P6", PrimaryLanguageLevel> = {
  P1: { zhWord: "快樂", zhMeaning: "開心", zhPerson: "小明", zhAction: "把玩具借給同學", zhSentence: "小狗在花園跑步。", zhTopic: "我的家人", enWord: "happy", enMeaning: "glad", enSubject: "Tom", enVerb: "plays", enTheme: "my pet" },
  P2: { zhWord: "整潔", zhMeaning: "乾淨有條理", zhPerson: "小美", zhAction: "把圖書放回書架", zhSentence: "同學們在禮堂唱歌。", zhTopic: "一次旅行", enWord: "careful", enMeaning: "not making mistakes", enSubject: "Amy", enVerb: "reads", enTheme: "my school day" },
  P3: { zhWord: "努力", zhMeaning: "認真不放棄", zhPerson: "阿朗", zhAction: "每天練習朗讀", zhSentence: "我們在操場進行接力賽。", zhTopic: "一次服務經驗", enWord: "proud", enMeaning: "pleased about doing something well", enSubject: "Kevin", enVerb: "studies", enTheme: "a helpful friend" },
  P4: { zhWord: "周全", zhMeaning: "考慮得很仔細", zhPerson: "小敏", zhAction: "出發前查看天氣和路線", zhSentence: "閱讀能讓我們認識不同的想法。", zhTopic: "我喜愛的閱讀活動", enWord: "responsible", enMeaning: "reliable", enSubject: "Mia", enVerb: "organises", enTheme: "a class activity" },
  P5: { zhWord: "堅持", zhMeaning: "持續努力不放棄", zhPerson: "嘉怡", zhAction: "遇到困難後修改計劃再嘗試", zhSentence: "合作能讓我們結合不同的長處。", zhTopic: "一個值得學習的人", enWord: "considerate", enMeaning: "thinking about other people", enSubject: "Jason", enVerb: "explains", enTheme: "a community project" },
  P6: { zhWord: "審慎", zhMeaning: "仔細考慮後才決定", zhPerson: "子晴", zhAction: "比較資料後才提出建議", zhSentence: "清晰的溝通有助小組作出合適決定。", zhTopic: "我對校園生活的建議", enWord: "effective", enMeaning: "producing a successful result", enSubject: "Sophie", enVerb: "evaluates", enTheme: "an environmental proposal" },
};

const PRIMARY_CHINESE_READING_BANKS: Partial<Record<"P1" | "P2" | "P3" | "P4" | "P5" | "P6", QuestionSeed[]>> = {
  P1: [
    { selectionGroup: primaryChineseSelectionGroup("P1", 0), label: "筆畫順序", topic: "字形、筆畫與部首", question: "「木」字的第二筆是甚麼？", hint: "「木」的筆畫次序是橫、豎、撇、捺。", options: ["橫", "豎", "撇", "捺"], correct: 1 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 0), label: "部件辨識", topic: "字形、筆畫與部首", question: "「明」字由哪兩個字組成？", hint: "把字拆開，看看左邊和右邊。", options: ["日和月", "人和木", "口和木", "山和水"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 0), label: "部首辨識", topic: "字形、筆畫與部首", question: "下列哪一個字的部首是「口」？", hint: "留意字的左邊或上面的主要部件。", options: ["唱", "林", "明", "語"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 0), label: "象形字初步", topic: "字形、筆畫與部首", question: "「山」字的字形最像下列哪一樣事物？", hint: "想想這個字像幾座高低不同的山峰。", options: ["山峰", "雨傘", "小鳥", "書本"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 0), label: "字義初步", topic: "字形、筆畫與部首", question: "「休」字有一個「人」和一個「木」，最接近哪個意思？", hint: "想想人靠在樹旁可以做甚麼。", options: ["休息", "跑步", "唱歌", "游水"], correct: 0 },

    { selectionGroup: primaryChineseSelectionGroup("P1", 1), label: "詞義理解", topic: "字詞與基本句子", question: "「快樂」最接近下列哪一個意思？", hint: "想想聽到好消息時的心情。", options: ["開心", "匆忙", "安靜", "寒冷"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 1), label: "詞語應用", topic: "字詞與基本句子", question: "下列哪一句最適合使用「整潔」？", hint: "「整潔」可以形容乾淨而有條理的地方。", options: ["書桌收拾得很整潔。", "笑聲聽起來很整潔。", "雨傘跑得很整潔。", "太陽唱得很整潔。"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 1), label: "誰做甚麼", topic: "字詞與基本句子", question: "「小鳥飛走了。」句中誰做了甚麼？", hint: "先找出人物或事物，再找動作。", options: ["小鳥飛走", "小鳥睡覺", "小鳥唱歌", "小鳥吃飯"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 1), label: "物品用途辨識", topic: "字詞與基本句子", question: "下列哪一樣物品最適合在下雨時使用？", hint: "想想甚麼物品可以遮擋雨水。", options: ["雨傘", "鉛筆", "枕頭", "足球"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 1), label: "句子排列", topic: "字詞與基本句子", question: "把「小明／在操場／跑步」排成通順的句子，應選哪一句？", hint: "句子可先說誰，再說在甚麼地方做甚麼。", options: ["小明在操場跑步。", "在操場小明跑步。", "跑步小明在操場。", "操場跑步在小明。"], correct: 0 },

    { selectionGroup: primaryChineseSelectionGroup("P1", 2), label: "句號運用", topic: "基本標點與句式", question: "下列哪一句的句號用得最合適？", hint: "說完一件事情的完整句子，句尾可用句號。", options: ["今天是星期一。", "今天。是星期一", "今。天是星期一", "今天是。星期一"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 2), label: "問號運用", topic: "基本標點與句式", question: "下列哪一句句尾最適合用問號？", hint: "問別人事情時，句尾通常用問號。", options: ["你今天好嗎？", "我今天很好？", "太陽出來了？", "小鳥正在飛？"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 2), label: "感嘆號運用", topic: "基本標點與句式", question: "下列哪一句最適合在句尾用感嘆號？", hint: "感嘆號可表達強烈的驚喜或提醒。", options: ["小心！地上很滑！", "我有一枝筆！", "今天是星期二！", "書包在椅子上！"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 2), label: "逗號運用", topic: "基本標點與句式", question: "下列哪一句的逗號用得最合適？", hint: "一句話較長時，可在意思稍停的地方加逗號。", options: ["放學後，我和媽媽回家。", "放，學後我和媽媽回家。", "放學後我，和媽媽回家。", "放學後我和，媽媽回家。"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 2), label: "完整句子", topic: "基本標點與句式", question: "下列哪一句是完整而通順的句子？", hint: "完整句子要清楚說出誰或甚麼做了甚麼。", options: ["小狗在花園跑步。", "在花園小狗。", "跑步的花園。", "小狗在。"], correct: 0 },

    { selectionGroup: primaryChineseSelectionGroup("P1", 3), label: "人物辨識", topic: "兒歌與童話閱讀", question: "童話：小兔帶着水樽到公園。牠看見小鳥在樹上唱歌。故事中的主角是誰？", hint: "找出故事中主要出現的角色。", options: ["小兔", "小鳥", "水樽", "大樹"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 3), label: "時間訊息", topic: "兒歌與童話閱讀", question: "短文：早上，爸爸送樂樂上學。太陽剛剛出來。故事在甚麼時候發生？", hint: "直接找出時間詞。", options: ["早上", "中午", "晚上", "半夜"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 3), label: "地點訊息", topic: "兒歌與童話閱讀", question: "短文：小狗在花園追皮球，妹妹站在旁邊拍手。小狗在哪裏追皮球？", hint: "找出表示地方的詞。", options: ["花園", "課室", "廚房", "巴士上"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 3), label: "直接訊息", topic: "兒歌與童話閱讀", question: "兒歌：小雨點，沙沙沙，落在花兒上。小雨點落在哪裏？", hint: "答案就在兒歌句子中。", options: ["花兒上", "書桌上", "操場上", "帽子裏"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 3), label: "事件理解", topic: "兒歌與童話閱讀", question: "短文：阿康看見同學的鉛筆掉在地上，便撿起來交還給他。阿康做了甚麼？", hint: "找出阿康的行動。", options: ["撿起鉛筆交還同學", "把鉛筆藏起來", "借走鉛筆回家", "在地上畫畫"], correct: 0 },

    { selectionGroup: primaryChineseSelectionGroup("P1", 4), label: "擬人初步", topic: "簡單修辭與古詩", question: "「微風輕輕拍着樹葉。」這句話把微風寫得像甚麼？", hint: "「拍着」本來是人會做的動作。", options: ["人", "石頭", "書本", "雨傘"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 4), label: "比喻初步", topic: "簡單修辭與古詩", question: "「白雲像棉花。」白雲被比作甚麼？", hint: "找出「像」字後面的事物。", options: ["棉花", "雨傘", "小草", "書包"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 4), label: "古詩動物", topic: "簡單修辭與古詩", question: "古詩「鵝，鵝，鵝，曲項向天歌」寫的是哪一種動物？", hint: "留意詩句第一個字。", options: ["鵝", "小狗", "金魚", "小貓"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 4), label: "古詩畫面", topic: "簡單修辭與古詩", question: "「白毛浮綠水」主要寫出鵝的哪兩種顏色？", hint: "找出詩句中的顏色字。", options: ["白色和綠色", "紅色和黃色", "藍色和黑色", "紫色和橙色"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 4), label: "擬聲詞辨識（疊字）", topic: "簡單修辭與古詩", question: "兒歌中的「小雨沙沙」，「沙沙」最能寫出甚麼？", hint: "重複的聲音詞可幫助我們想像聽到的聲音。", options: ["下雨的聲音", "跑步的聲音", "唱歌的聲音", "笑聲"], correct: 0 },
  ],
  P2: [
    { selectionGroup: primaryChineseSelectionGroup("P2", 0), label: "近義詞辨識", topic: "詞義辨析與查字典", question: "「高興」和下列哪一個詞意思最接近？", hint: "想想收到禮物時的心情。", options: ["快樂", "安靜", "寒冷", "辛苦"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 0), label: "反義詞辨識", topic: "詞義辨析與查字典", question: "「高」的反義詞是甚麼？", hint: "想想相反的意思。", options: ["低", "大", "長", "遠"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 0), label: "部首查字典", topic: "詞義辨析與查字典", question: "想查「跑」字的意思，可以先查哪一個部首？", hint: "看看「跑」字左邊的部件。", options: ["足", "包", "口", "木"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 0), label: "筆畫查字典", topic: "詞義辨析與查字典", question: "如果不知道「明」字的部首，可用甚麼方法查字典？", hint: "字典也可按筆畫數查找。", options: ["數筆畫", "背詩歌", "看圖畫", "問天氣"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 0), label: "詞語分類", topic: "詞義辨析與查字典", question: "下列哪一組都是表示心情的詞語？", hint: "心情是心裏的感受。", options: ["開心、難過", "桌子、椅子", "跑步、跳繩", "紅色、藍色"], correct: 0 },

    { selectionGroup: primaryChineseSelectionGroup("P2", 1), label: "陳述句辨識", topic: "句式與標點運用", question: "下列哪一句是陳述句？", hint: "陳述句用來說明一件事情。", options: ["今天的天氣很好。", "你今天好嗎？", "請排好隊！", "快點關門！"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 1), label: "疑問句辨識", topic: "句式與標點運用", question: "下列哪一句是疑問句？", hint: "疑問句是向別人發問的句子。", options: ["你看過這本書嗎？", "我看過這本書。", "請你看這本書。", "這本書真有趣！"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 1), label: "祈使句辨識", topic: "句式與標點運用", question: "下列哪一句是請別人做事的祈使句？", hint: "留意句子是否提出請求或指示。", options: ["請把功課放在桌上。", "功課放在桌上。", "功課放在哪裏？", "功課真多！"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 1), label: "冒號與引號運用", topic: "句式與標點運用", question: "下列哪一句的冒號和引號用得最合適？", hint: "說話內容前常用冒號，說話內容用引號。", options: ["老師說：「明天要帶圖畫簿。」", "老師：說「明天要帶圖畫簿。」", "老師說，明天：「要帶圖畫簿。」", "老師「說：明天要帶圖畫簿。」"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 1), label: "引號作用", topic: "句式與標點運用", question: "「請安靜。」一句中的引號主要有甚麼作用？", hint: "想想引號把哪一部分文字圈起來。", options: ["標示說話內容", "表示問題", "分開兩個詞", "表示停頓"], correct: 0 },

    { selectionGroup: primaryChineseSelectionGroup("P2", 2), label: "段落大意", topic: "段落大意與順敘", question: "短文：星期日早上，文文和爸爸到公園放風箏。風箏飛得很高，他們都很開心。這段主要寫甚麼？", hint: "想想人物、地方和主要事情。", options: ["文文和爸爸在公園放風箏", "文文在課室做功課", "爸爸在家煮午飯", "公園下了一場大雨"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 2), label: "順敘次序", topic: "段落大意與順敘", question: "短文：小英先洗手，然後吃早餐，最後背起書包上學。小英最後做甚麼？", hint: "「最後」後面的事情就是答案。", options: ["背起書包上學", "洗手", "吃早餐", "做功課"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 2), label: "事情先後", topic: "段落大意與順敘", question: "下列哪一個次序最合適？①穿校服 ②起床 ③上學", hint: "想想早上通常先做甚麼。", options: ["②→①→③", "①→③→②", "③→②→①", "②→③→①"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 2), label: "段落題目", topic: "段落大意與順敘", question: "短文寫小明每天餵金魚、換水和觀察金魚游泳。哪一個題目最合適？", hint: "題目要概括整段最主要的內容。", options: ["照顧金魚", "我的新書包", "下雨天上學", "操場上的比賽"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 2), label: "順敘詞語", topic: "段落大意與順敘", question: "「先洗菜，____ 切菜，最後煮菜。」填入哪一個詞最合適？", hint: "想想事情按次序發生時常用的詞。", options: ["然後", "可是", "因為", "如果"], correct: 0 },

    { selectionGroup: primaryChineseSelectionGroup("P2", 3), label: "看圖找人物", topic: "看圖與敘事閱讀", question: "看圖文字：操場上，小美和小強正在踢足球，老師在旁邊看着。誰正在踢足球？", hint: "直接找出正在做這個動作的人。", options: ["小美和小強", "老師", "校長", "家長"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 3), label: "看圖找地點", topic: "看圖與敘事閱讀", question: "看圖文字：媽媽在廚房洗菜，弟弟在客廳看書。媽媽在哪裏？", hint: "找出媽媽所在的地方。", options: ["廚房", "客廳", "花園", "課室"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 3), label: "敘事起因", topic: "看圖與敘事閱讀", question: "短文：上學時下起大雨，小安打開雨傘，沒有被雨淋濕。小安為甚麼打開雨傘？", hint: "答案在第一句。", options: ["因為下起大雨", "因為太陽很猛烈", "因為要放風箏", "因為要睡覺"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 3), label: "敘事結果", topic: "看圖與敘事閱讀", question: "短文：小玲幫奶奶把報紙拿進屋，奶奶笑着說謝謝。最後發生了甚麼？", hint: "找出故事最後的事情。", options: ["奶奶向小玲道謝", "小玲買了一把雨傘", "奶奶到公園跑步", "報紙飛到天上"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 3), label: "人物行動", topic: "看圖與敘事閱讀", question: "短文：午飯後，阿傑把餐盒洗乾淨，放回書包。阿傑做了甚麼？", hint: "找出阿傑完成的兩個動作。", options: ["洗餐盒並放回書包", "把餐盒送給同學", "在餐盒上畫畫", "把餐盒留在桌上"], correct: 0 },

    { selectionGroup: primaryChineseSelectionGroup("P2", 4), label: "排比初步", topic: "修辭與五言絕句", question: "「下課了，同學們有的跳繩，有的拍球，有的跑步。」這句話把多個相似的內容連在一起，最接近哪種寫法？", hint: "留意「有的……有的……有的……」重複出現。", options: ["排比", "問句", "對話", "書名號"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 4), label: "反覆初步", topic: "修辭與五言絕句", question: "「快來呀，快來呀，公園很熱鬧！」重複「快來呀」主要是為了甚麼？", hint: "重複一句話可加強語氣。", options: ["加強邀請的語氣", "說明時間", "標示書名", "表示問題"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 4), label: "古詩時間", topic: "修辭與五言絕句", question: "「床前明月光，疑是地上霜。」寫的是甚麼時候的景象？", hint: "有月光的夜晚才會照在床前。", options: ["晚上", "早上", "中午", "下午"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 4), label: "古詩畫面", topic: "修辭與五言絕句", question: "「疑是地上霜」把月光看成甚麼？", hint: "找出詩句中像月光的事物。", options: ["地上的霜", "天上的雲", "河裏的水", "樹上的花"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 4), label: "古詩景物", topic: "修辭與五言絕句", question: "「舉頭望明月」中，詩人抬頭看見甚麼？", hint: "直接找出詩句最後兩個字。", options: ["明月", "太陽", "白雲", "大海"], correct: 0 },
  ],
  P3: [
    { selectionGroup: primaryChineseSelectionGroup("P3", 0), label: "成語意思", topic: "詞彙、成語與字詞辨錯", question: "「專心一致」最接近下列哪一個意思？", hint: "想想做事時把注意力放在同一件事上。", options: ["集中精神做事", "很多人一起說話", "把東西排整齊", "每天都去旅行"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 0), label: "成語運用", topic: "詞彙、成語與字詞辨錯", question: "下列哪一句最適合使用「一心一意」？", hint: "「一心一意」形容專注地做一件事。", options: ["小芳一心一意地完成圖畫。", "小芳一心一意地把桌子搬走。", "今天的天氣一心一意。", "花園裏開滿一心一意。"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 0), label: "錯別字辨識", topic: "詞彙、成語與字詞辨錯", question: "下列哪一個詞語沒有錯別字？", hint: "逐個看看字形是否正確。", options: ["已經", "以經", "已京", "以京"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 0), label: "詞義理解", topic: "詞彙、成語與字詞辨錯", question: "花園裏的花草長得很「茂盛」。「茂盛」最接近甚麼意思？", hint: "想想植物長得很多、很有生氣的樣子。", options: ["生長得又多又好", "完全沒有葉子", "剛剛被剪掉", "顏色很暗"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 0), label: "詞語搭配", topic: "詞彙、成語與字詞辨錯", question: "下列哪一個詞語搭配最自然？", hint: "留意動詞和名詞的常見配搭。", options: ["欣賞風景", "欣賞書包", "欣賞雨水", "欣賞鉛筆盒"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 1), label: "因果複句", topic: "複句、標點與專名", question: "「因為天氣炎熱，____ 同學們都帶了水樽。」填入哪一個詞最合適？", hint: "前半句說原因，後半句說結果。", options: ["所以", "但是", "如果", "雖然"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 1), label: "承接複句", topic: "複句、標點與專名", question: "「小英先溫習課文，____ 完成功課。」填入哪一個詞最合適？", hint: "兩個動作按先後發生。", options: ["然後", "因為", "可是", "雖然"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 1), label: "頓號運用", topic: "複句、標點與專名", question: "下列哪一句的頓號（、）用得最合適？", hint: "頓號可分開並列的事物。", options: ["文具盒裏有鉛筆、原子筆和尺。", "文具盒、裏有鉛筆原子筆和尺。", "文具盒裏、有鉛筆原子筆和尺。", "文具盒裏有鉛筆原子筆、和尺。"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 1), label: "書名號運用", topic: "複句、標點與專名", question: "下列哪一句的書名號用得最合適？", hint: "書名號用來標示書籍名稱。", options: ["我正在讀《小王子》。", "我正在讀「小王子」。", "我正在讀〈小王子〉。", "我正在讀（小王子）。"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 1), label: "專名辨識", topic: "複句、標點與專名", question: "下列哪一個是地方名稱？", hint: "地方名稱是專有名稱。", options: ["香港", "書包", "跑步", "快樂"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 2), label: "中心句辨識", topic: "中心句與段落組織", question: "「圖書館是一個安靜又方便閱讀的地方。裏面有很多故事書和知識書。」哪一句最適合作這段的中心句？", hint: "中心句能概括段落主要意思。", options: ["圖書館是一個安靜又方便閱讀的地方。", "裏面有很多故事書和知識書。", "我昨天帶了雨傘。", "操場上有人踢球。"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 2), label: "支持細節", topic: "中心句與段落組織", question: "哪一句最能支持「運動對身體有好處」這個中心意思？", hint: "支持細節要直接說明中心意思。", options: ["每天跑步能令身體更健康。", "我的書包是藍色的。", "今天是星期三。", "課室有六扇窗。"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 2), label: "段落大意", topic: "中心句與段落組織", question: "短文寫阿明每天準時餵小貓、替牠梳毛和清潔睡墊。這段主要寫甚麼？", hint: "找出重複出現的主要事情。", options: ["阿明照顧小貓", "阿明到海邊游泳", "阿明學習畫畫", "阿明參加比賽"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 2), label: "段落次序", topic: "中心句與段落組織", question: "寫一段介紹校園花園的文字，哪個次序較合理？", hint: "可先介紹地方，再寫看見的景物和感受。", options: ["介紹花園→寫花草→說感受", "說感受→介紹花園→寫花草", "寫花草→結尾→介紹花園", "結尾→寫花草→介紹花園"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 2), label: "段落題目", topic: "中心句與段落組織", question: "一段文字介紹如何把舊報紙、膠樽和鋁罐分類回收。哪個題目最合適？", hint: "題目應概括全段內容。", options: ["垃圾分類回收", "我的新同學", "一次旅行", "雨天的街道"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 3), label: "倒敘辨識", topic: "倒敘與實用文閱讀", question: "文章一開始寫「想起昨天得獎的一刻，我仍然很興奮」，然後才交代比賽經過。這種寫法最接近甚麼？", hint: "文章先說後來的事情，再回頭交代經過。", options: ["倒敘", "順敘", "對話", "說明"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 3), label: "通知閱讀", topic: "倒敘與實用文閱讀", question: "通知：『星期五下午三時在禮堂舉行音樂會，參加者請在二時四十五分到達。』參加者最遲何時到達？", hint: "直接找出通知中的報到時間。", options: ["下午二時四十五分", "下午三時", "下午三時十五分", "下午四時"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 3), label: "便條目的", topic: "倒敘與實用文閱讀", question: "便條寫着：『媽媽，我到圖書館還書，六時回家。小敏』這張便條主要是用來做甚麼？", hint: "想想小敏想告訴媽媽甚麼。", options: ["交代去向和回家時間", "邀請媽媽看電影", "介紹一本新書", "訂購午餐"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 3), label: "書信對象", topic: "倒敘與實用文閱讀", question: "信的開頭寫「親愛的表姐：」，這封信最可能寫給誰？", hint: "稱呼就是收信人的身分。", options: ["表姐", "老師", "校長", "郵差"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 3), label: "通知事項", topic: "倒敘與實用文閱讀", question: "通知說『請同學帶備剪刀和膠水，參加手工班。』同學應帶甚麼？", hint: "直接找出通知列出的物品。", options: ["剪刀和膠水", "雨傘和水樽", "課本和字典", "足球和球拍"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 4), label: "對偶初步", topic: "修辭與七言絕句", question: "「天對地，雨對風」把兩組意思相對的詞語排在一起，最接近哪種寫法？", hint: "留意上下兩部分字數相近、意思相對。", options: ["對偶", "問句", "比喻", "書信"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 4), label: "疊字作用", topic: "修辭與七言絕句", question: "「小草青青」中的「青青」最能寫出小草怎樣？", hint: "疊字可令畫面更清楚。", options: ["又青又有生氣", "非常高大", "完全枯黃", "正在唱歌"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 4), label: "人物辨識", topic: "修辭與七言絕句", question: "「少小離家老大回」寫的是誰回到故鄉？", hint: "「我」指說話的詩人。", options: ["詩人自己", "詩人的老師", "詩人的朋友", "一隻小鳥"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 4), label: "細節辨識", topic: "修辭與七言絕句", question: "「鄉音無改鬢毛衰」中，甚麼沒有改變？", hint: "直接找出詩句中的「無改」。", options: ["說話的鄉音", "頭髮的顏色", "居住的房子", "旅途的天氣"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P3", 4), label: "七言句字數辨識", topic: "修辭與七言絕句", question: "下列哪一句有七個字，較符合七言詩一句的形式？", hint: "逐個數一數每句有多少個字。", options: ["少小離家老大回", "鵝鵝鵝曲項", "床前明月", "小雨沙沙落"], correct: 0 },
  ],
  P4: [
    { selectionGroup: primaryChineseSelectionGroup("P4", 0), label: "同音字辨識", topic: "字形、字音與詞義辨析", question: "「留」和下列哪一個字讀音相同？", hint: "讀一讀兩個字的讀音。", options: ["流", "山", "水", "雷"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 0), label: "形近字辨識", topic: "字形、字音與詞義辨析", question: "下列哪一組字的字形最相近？", hint: "比較字的部件和筆畫。", options: ["已、己", "天、地", "山、水", "大、小"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 0), label: "成語意思", topic: "字形、字音與詞義辨析", question: "「全神貫注」最接近下列哪一個意思？", hint: "想想做事時非常專心的樣子。", options: ["集中全部精神", "到處走動", "非常吵鬧", "立刻睡覺"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 0), label: "成語搭配", topic: "字形、字音與詞義辨析", question: "下列哪一句最適合使用「津津有味」？", hint: "這個成語形容對事物很有興趣。", options: ["弟弟津津有味地聽故事。", "弟弟津津有味地關上門。", "弟弟的書包很津津有味。", "今天的天氣津津有味。"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 0), label: "詞語辨析（近義詞）", topic: "字形、字音與詞義辨析", question: "「細心」和「小心」都有留意的意思。哪一種做法較能表現「細心」？", hint: "細心指做事仔細周到。", options: ["完成後逐項檢查功課", "匆忙交功課", "不看題目就回答", "把書本留在家中"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 1), label: "轉折複句", topic: "轉折複句與進階標點", question: "「雖然下着雨，____ 運動會仍然照常舉行。」填入哪一個詞最合適？", hint: "前後兩句的意思有轉折。", options: ["但是", "所以", "因為", "如果"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 1), label: "分號運用", topic: "轉折複句與進階標點", question: "下列哪一句的分號用得最合適？", hint: "分號可分開關係密切的分句。", options: ["早上我溫習；下午我做練習。", "早上；我溫習下午我做練習。", "早上我；溫習下午我做練習。", "早上我溫習下午；我做練習。"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 1), label: "省略號作用", topic: "轉折複句與進階標點", question: "「我想了很久……還是決定參加。」省略號主要表示甚麼？", hint: "留意說話時的停頓。", options: ["語句停頓和未盡的意思", "提出問題", "標示書名", "列舉物品"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 1), label: "複句判斷", topic: "轉折複句與進階標點", question: "下列哪一句是轉折複句？", hint: "找出前後意思相反或相對的句子。", options: ["雖然很累，但是他仍完成練習。", "他每天早上跑步。", "請你關上窗戶。", "天空飄着白雲。"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 1), label: "關聯詞選擇", topic: "轉折複句與進階標點", question: "「____ 路程很遠，小敏也會準時到達。」填入哪一組詞最合適？", hint: "句子表示即使有困難，結果仍然不變。", options: ["雖然……但是……", "因為……所以……", "如果……就……", "一邊……一邊……"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 2), label: "寓言寓意", topic: "寓言、神話與說明文", question: "寓言中烏鴉看見水瓶裏的水很低，便把小石頭放進瓶裏喝到水。這個故事最想說明甚麼？", hint: "想想烏鴉怎樣解決困難。", options: ["遇到困難要動腦筋想辦法", "口渴時不要喝水", "石頭一定很甜", "烏鴉不會飛"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 2), label: "人物目的與受益者", topic: "寓言、神話與說明文", question: "神話故事中，后羿射下多個太陽，是為了幫助誰？", hint: "想想故事中人間遇到的困難。", options: ["受酷熱影響的百姓", "海裏的魚", "天上的星星", "森林裏的鳥"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 2), label: "說明方法", topic: "寓言、神話與說明文", question: "「鯨魚的心臟大約有一輛小汽車那麼重。」主要運用了甚麼說明方法？", hint: "句子把重量和熟悉的事物作比較。", options: ["作比較", "講故事", "提問題", "寫對話"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 2), label: "說明文訊息", topic: "寓言、神話與說明文", question: "說明文介紹蝴蝶成長的四個階段：卵、幼蟲、蛹、成蟲。蝴蝶先經歷哪一個階段？", hint: "直接找出排列第一的階段。", options: ["卵", "幼蟲", "蛹", "成蟲"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 2), label: "文體辨識", topic: "寓言、神話與說明文", question: "下列哪一類文章主要用來介紹事物的特徵和知識？", hint: "它的目的不是講故事，而是說明。", options: ["說明文", "詩歌", "日記", "書信"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 3), label: "擬人辨識", topic: "修辭與篇章結構", question: "「小溪唱着歌，快樂地向前跑。」主要運用了甚麼修辭手法？", hint: "把沒有生命的小溪寫得像人一樣。", options: ["擬人", "比喻", "對偶", "設問"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 3), label: "誇張辨識", topic: "修辭與篇章結構", question: "「他的聲音大得把屋頂也震動了。」主要運用了甚麼手法？", hint: "句子把聲音的程度說得特別誇大。", options: ["誇張", "排比", "引用", "反問"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 3), label: "開頭作用", topic: "修辭與篇章結構", question: "一篇記敘文的開頭先交代時間、地點和人物，主要有甚麼作用？", hint: "想想讀者一開始需要知道甚麼。", options: ["讓讀者了解故事背景", "重複故事結尾", "列出所有生字", "不讓讀者明白內容"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 3), label: "段落組織／安排方法", topic: "修辭與篇章結構", question: "一段先寫公園的樹木，再寫花朵，最後寫小鳥，這段主要按甚麼方法安排？", hint: "留意作者按看到的景物逐一介紹。", options: ["按觀察景物的次序", "按問題和答案", "按人物對話", "按時間倒退"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 3), label: "結尾作用", topic: "修辭與篇章結構", question: "記敘文結尾寫「這次經驗令我明白要珍惜時間」，主要有甚麼作用？", hint: "結尾常可總結感受或收穫。", options: ["總結感受和收穫", "介紹新人物", "說明天氣", "列出地點"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 4), label: "古詩心情", topic: "七言絕句與文學感受", question: "「獨在異鄉為異客，每逢佳節倍思親」最能表現詩人甚麼心情？", hint: "留意「思親」兩字。", options: ["思念親人", "討厭節日", "害怕旅行", "喜歡下雨"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 4), label: "古詩節日", topic: "七言絕句與文學感受", question: "「遙知兄弟登高處，遍插茱萸少一人」寫的是甚麼節日習俗？", hint: "詩句提到登高和插茱萸。", options: ["登高插茱萸", "賞月吃月餅", "賽龍舟", "放煙花"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 4), label: "古詩人物", topic: "七言絕句與文學感受", question: "詩句中的「異客」最接近指甚麼人？", hint: "想想誰身處不是自己家鄉的地方。", options: ["身在外地的人", "家中的客人", "賣東西的人", "寫詩的老師"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 4), label: "詩句感受", topic: "七言絕句與文學感受", question: "「每逢佳節倍思親」中的「倍」最能表現思念親人的程度怎樣？", hint: "「倍」有更加的意思。", options: ["更加強烈", "完全沒有", "慢慢減少", "不太清楚"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 4), label: "文學畫面", topic: "七言絕句與文學感受", question: "讀古詩時，從「登高處」可以想像到甚麼畫面？", hint: "「登高」就是走到較高的地方。", options: ["人們走到高處遠望", "人們在課室寫字", "人們在海底游泳", "人們在廚房煮飯"], correct: 0 },
  ],
  P5: [
    {selectionGroup:primaryChineseSelectionGroup("P5",0),label:"褒義詞",topic:"詞語感情色彩與詞義",question:"「盡責」這個詞帶有哪種感情色彩？",hint:"想想這是否稱讚。",options:["褒義","貶義","中性","兩可"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",0),label:"貶義詞",topic:"詞語感情色彩與詞義",question:"「敷衍」這個詞帶有哪種感情色彩？",hint:"想想這是否批評。",options:["貶義","褒義","中性","兩可"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",0),label:"中性詞",topic:"詞語感情色彩與詞義",question:"下列哪個詞通常屬中性詞？",hint:"中性詞不含褒貶。",options:["書桌","英勇","自私","懶惰"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",0),label:"語境詞義",topic:"詞語感情色彩與詞義",question:"「他的說話十分尖銳，令同學不舒服。」「尖銳」最接近甚麼意思？",hint:"根據同學的感受判斷。",options:["言詞直接刺耳","聲音輕柔","樣子快樂","動作緩慢"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",0),label:"褒貶運用",topic:"詞語感情色彩與詞義",question:"要稱讚同學有責任感，選哪個詞最合適？",hint:"選正面評價的詞。",options:["盡責","魯莽","自私","敷衍"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",1),label:"條件複句",topic:"條件假設複句與破折號",question:"「只要每天溫習，____能逐步掌握課文。」填哪個詞？",hint:"前句是條件，後句是結果。",options:["就","但是","雖然","卻"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",1),label:"假設複句",topic:"條件假設複句與破折號",question:"「如果明天下雨，____遠足便會改期。」填哪個詞？",hint:"留意假設的結果。",options:["那麼","所以","可是","不過"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",1),label:"破折號作用",topic:"條件假設複句與破折號",question:"「我最期待的活動——校際朗誦比賽——快開始了。」破折號作用是甚麼？",hint:"看中間內容和前文的關係。",options:["補充說明名稱","表示問題","分開詞語","標示書名"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",1),label:"條件句判斷",topic:"條件假設複句與破折號",question:"下列哪一句是條件複句？",hint:"找條件和結果。",options:["只要守規則，就能安全使用器材。","天氣很好，我們去公園。","他跑得很快。","請你安靜。"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",1),label:"假設情況",topic:"條件假設複句與破折號",question:"「假如你是班長，你會怎樣安排工作？」主要提出甚麼？",hint:"「假如」帶出未必發生的事。",options:["假設情況","既有事實","書名","並列詞"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",2),label:"要點歸納",topic:"要點歸納與思想感情",question:"義工探望長者、陪伴聊天和協助購物。最合適的要點是甚麼？",hint:"用一句概括多個行動。",options:["關心和支援長者","喜歡買玩具","每天上學","商場關門"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",2),label:"借景抒情",topic:"要點歸納與思想感情",question:"「夕陽映着安靜的海面，我想起快畢業的同學。」景物襯托甚麼？",hint:"看景物與想到的事。",options:["對同學的不捨","海水鹹味","遊戲規則","課本內容"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",2),label:"作者感情",topic:"要點歸納與思想感情",question:"「新學期充滿希望」主要表達甚麼？",hint:"留意「希望」。",options:["對新學期的期待","對校園厭惡","害怕下雨","憤怒考試"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",2),label:"段落要點",topic:"要點歸納與思想感情",question:"文字寫節水、節電，並呼籲大家實行。主要意思是甚麼？",hint:"找共同主題。",options:["生活要節約資源","購買更多電器","只有學校要省水","下雨不用關燈"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",2),label:"抒情線索",topic:"要點歸納與思想感情",question:"散文多次寫老樹陪伴作者成長，突出甚麼？",hint:"重複事物常與主題有關。",options:["對童年陪伴的懷念","樹木價格","種樹步驟","天氣預報"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",3),label:"議論觀點",topic:"議論與散文閱讀",question:"「閱讀能擴闊眼界，學校應多舉辦閱讀活動。」作者觀點是甚麼？",hint:"找主張應做的事。",options:["學校應多舉辦閱讀活動","閱讀只適合成人","眼界是一種運動","取消所有活動"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",3),label:"論據辨識",topic:"議論與散文閱讀",question:"支持「步行上學有好處」的理由是甚麼？",hint:"理由須直接支持觀點。",options:["可增加日常活動量","書包是藍色","星期一早會","校門有大樹"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",3),label:"反問作用",topic:"議論與散文閱讀",question:"「難道我們不應珍惜食物嗎？」主要作用是甚麼？",hint:"反問用來加強語氣。",options:["加強珍惜食物主張","真的不知道答案","介紹人物","表示時間"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",3),label:"設問作用",topic:"議論與散文閱讀",question:"「為甚麼要守時？因為守時是尊重別人。」運用甚麼方法？",hint:"先問再答。",options:["設問","比喻","擬人","對偶"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",3),label:"詞義辨析",topic:"詞語感情色彩與詞義",question:"「校園響起琅琅書聲」中的「書聲」指甚麼？",hint:"想想誰發出讀書聲。",options:["同學朗讀的聲音","書本重量","校鐘聲","風聲"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",4),label:"律詩句數",topic:"律詩格式、文化與內容理解",question:"一首律詩通常有多少句？",hint:"律詩有固定格式。",options:["八句","四句","六句","十句"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",4),label:"律詩對仗",topic:"律詩格式、文化與內容理解",question:"律詩中兩句字數相同、詞性相近，稱為甚麼？",hint:"這是律詩特點。",options:["對仗","設問","敘述","引號"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",4),label:"律詩押韻",topic:"律詩格式、文化與內容理解",question:"詩句末尾讀音相近，主要形成甚麼？",hint:"留意朗讀聲音。",options:["押韻節奏感","改變人物","增加標點","說明地點"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",4),label:"詩歌感情",topic:"律詩格式、文化與內容理解",question:"「感時花濺淚，恨別鳥驚心」襯托甚麼？",hint:"留意「感時」和「恨別」。",options:["憂傷和離別之情","節日熱鬧","田園豐收","遊戲快樂"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",4),label:"詩句詞義",topic:"詞語感情色彩與詞義",question:"「家書抵萬金」最能表現家書怎樣？",hint:"「抵萬金」表示極其珍貴。",options:["十分珍貴","毫無用處","容易取得","只值一元"],correct:0},
  ],
  P6: [
    {selectionGroup:primaryChineseSelectionGroup("P6",0),label:"成語運用",topic:"熟語與多義詞運用",question:"哪句最適合用「持之以恆」？",hint:"指長久堅持。",options:["他每天練琴，持之以恆。","他持之以恆地睡着。","雨天持之以恆。","書包很持之以恆。"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",0),label:"諺語意思",topic:"熟語與多義詞運用",question:"「一分耕耘，一分收穫」說明甚麼？",hint:"想努力與結果。",options:["努力才有成果","運氣最重要","不用付出","只要等待"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",0),label:"俗語語境",topic:"熟語與多義詞運用",question:"「馬馬虎虎檢查功課」的意思是甚麼？",hint:"根據表現判斷。",options:["不仔細","很勇敢","很安靜","很準時"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",0),label:"歇後語理解",topic:"熟語與多義詞運用",question:"「芝麻開花——節節高」祝願甚麼？",hint:"「節節高」有進步意思。",options:["不斷進步","永遠不變","立刻休息","四處旅行"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",0),label:"多義詞辨析",topic:"熟語與多義詞運用",question:"「把問題看清楚」中的「看」最接近甚麼？",hint:"不是只用眼睛望。",options:["理解和分析","照相","探望病人","看守物品"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",1),label:"讓步複句",topic:"讓步遞進複句與標點",question:"「即使遇困難，____也不輕易放棄。」填哪詞？",hint:"前後有讓步關係。",options:["我們","所以","但是","因為"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",1),label:"遞進複句",topic:"讓步遞進複句與標點",question:"「他不但準時交功課，____主動幫人。」填哪詞？",hint:"後句更進一步。",options:["而且","但是","如果","因為"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",1),label:"綜合標點",topic:"讓步遞進複句與標點",question:"哪句標點最合適？",hint:"留意引號和句號。",options:["老師說：「請按時交功課。」","老師說「：請交功課。」","老師：說，「請交功課」。","老師說，請「交功課。」"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",1),label:"讓步句判斷",topic:"讓步遞進複句與標點",question:"哪句表達讓步關係？",hint:"有困難但結果不變。",options:["雖然路遠，他仍準時到達。","因為路遠，所以遲到。","如果路遠，就乘車。","一邊走一邊談。"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",1),label:"遞進作用",topic:"讓步遞進複句與標點",question:"「不但……而且……」表達甚麼？",hint:"後句程度更進一步。",options:["遞進關係","因果關係","轉折關係","假設關係"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",2),label:"比較觀點",topic:"比較閱讀與觀點證據",question:"甲文主張紙本書，乙文主張電子書，兩文共同關注甚麼？",hint:"找共同主題。",options:["閱讀習慣","運動比賽","天氣","烹飪"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",2),label:"文本證據",topic:"比較閱讀與觀點證據",question:"支持「步行有助健康」的直接證據是甚麼？",hint:"證據須說明健康好處。",options:["步行增加每天活動量。","步行鞋有不同顏色。","路邊有商店。","星期日不上課。"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",2),label:"觀點與理由",topic:"比較閱讀與觀點證據",question:"「應設閱讀角，因為能專心閱讀。」哪部分是理由？",hint:"理由支持主張。",options:["能專心閱讀","應設閱讀角","安靜兩字","同學名字"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",2),label:"比較異同",topic:"比較閱讀與觀點證據",question:"甲談節水，乙談節電，主張有何相同？",hint:"想共同目的。",options:["珍惜資源","購買電器","增加用量","只談天氣"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",2),label:"證據強弱",topic:"比較閱讀與觀點證據",question:"支持「校園應多種樹」最直接的是甚麼？",hint:"選有因果的理由。",options:["樹木提供遮蔭和改善空氣。","樹葉有形狀。","有人愛綠色。","操場有圍欄。"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",3),label:"文言句意",topic:"淺易文言與進階修辭",question:"「學而時習之，不亦說乎」主要說甚麼？",hint:"「說」通悅。",options:["常溫習很愉快","只玩樂便快樂","不用學習","只考前溫習"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",3),label:"文言實詞",topic:"淺易文言與進階修辭",question:"「三人行，必有我師焉」的「師」最接近甚麼？",hint:"不只指學校教師。",options:["值得學習的人","軍隊","課室","禮物"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",3),label:"雙關初步",topic:"淺易文言與進階修辭",question:"一句話同時有兩層相關意思，叫甚麼？",hint:"同詞可帶兩意思。",options:["雙關","排比","設問","對偶"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",3),label:"頂真初步",topic:"淺易文言與進階修辭",question:"「知識帶來力量，力量帶來改變。」用甚麼手法？",hint:"前句末詞成後句開頭。",options:["頂真","借代","比喻","誇張"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",3),label:"文言寓意",topic:"淺易文言與進階修辭",question:"「守株待兔」告訴我們甚麼？",hint:"農夫只等兔子再來。",options:["不能只靠僥倖等待","要常種樹","兔子都撞樹","不用努力"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",4),label:"宋詞畫面",topic:"古詩宋詞賞析",question:"「把酒問青天」最容易想像甚麼？",hint:"找酒和月亮。",options:["舉杯望月問天","雨中跑步","課室看書","海底游泳"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",4),label:"宋詞感情",topic:"古詩宋詞賞析",question:"「但願人長久，千里共嬋娟」表達甚麼願望？",hint:"嬋娟指明月。",options:["彼此平安共賞明月","永不回家","討厭親人","只想金錢"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",4),label:"古詩畫面",topic:"古詩宋詞賞析",question:"「大漠孤煙直，長河落日圓」描寫甚麼？",hint:"留意沙漠、河和落日。",options:["開闊壯麗邊塞景色","熱鬧市集","狹小房間","雨天課室"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",4),label:"表達效果",topic:"古詩宋詞賞析",question:"「孤、直、長、圓」描寫景物有何效果？",hint:"想這些字構成的畫面。",options:["畫面鮮明開闊","人物更多","表示問題","列出時間"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",4),label:"詩詞意象",topic:"古詩宋詞賞析",question:"古詩詞明月常寄託甚麼？",hint:"結合思念親友作品。",options:["思念和祝福","憤怒打鬥","購物計劃","運動規則"],correct:0},
  ],
};

function primaryChineseReadingSeeds(level: PrimaryLanguageLevel, grade: "P1" | "P2" | "P3" | "P4" | "P5" | "P6"): QuestionSeed[] {
  const dedicatedBank = PRIMARY_CHINESE_READING_BANKS[grade];
  if (dedicatedBank) return dedicatedBank;
  const isP2 = level.zhWord === "整潔";
  const isP3 = level.zhWord === "努力";
  const isP4 = level.zhWord === "周全";
  const isP5 = level.zhWord === "堅持";
  const isP6 = level.zhWord === "審慎";
  return [
    { label: "字詞理解", topic: "字詞理解與運用", question: `「${level.zhWord}」最接近下列哪一個意思？`, hint: "先從詞語的日常用法判斷。", options: [level.zhMeaning, "很匆忙", "不願意幫忙", "聲音很大"], correct: 0 },
    { label: "詞語運用", topic: "字詞理解與運用", question: `下列哪一句最適合使用「${level.zhWord}」？`, hint: "想想這個詞可以形容甚麼情況。", options: isP2 ? ["媽媽把廚房打掃得十分整潔。", "小明聽到好消息，感到整潔。", "雨傘的顏色很整潔。", "這首歌的旋律很整潔。"] : isP3 ? ["阿朗每天努力學習，成績進步了。", "阿朗聽見好消息，感到努力。", "雨傘的顏色很努力。", "這條路走起來很努力。"] : isP4 ? ["老師為郊遊作出周全的安排。", "小明的聲音很周全。", "這道菜的味道很周全。", "天空的顏色很周全。"] : isP5 ? ["媽媽教我寫字時，我會堅持練習，直到寫得更好。", "聽到好消息，他感到非常堅持。", "這張桌子很堅持，搬不動也放不下。", "這首歌很堅持，大家都跟着唱。"] : isP6 ? ["面對重要的決定，他會審慎考慮。", "風景畫的色彩十分審慎。", "聽到玩笑後，他不禁感到審慎起來。", "這台機器的運轉聲音非常審慎。"] : [`${level.zhPerson}完成工作後，桌面十分${level.zhWord}。`, `${level.zhPerson}聽見好消息，感到${level.zhWord}。`, `雨傘的顏色很${level.zhWord}。`, `這條路十分${level.zhWord}。`], correct: isP2 || isP3 || isP4 || isP5 || isP6 ? 0 : 1 },
    { label: "主旨大意", topic: "主旨大意", question: `${level.zhPerson}${level.zhAction}。這段文字主要說明了甚麼？`, hint: "直接找出人物做了甚麼。", options: [`${level.zhPerson}${level.zhAction}。`, `${level.zhPerson}不想參加活動。`, `${level.zhPerson}正在睡覺。`, `${level.zhPerson}不見了物品。`], correct: 0 },
    { label: "細節理解", topic: "訊息定位", question: `通告寫着「${level.zhTopic}分享會下午三時開始，參加者請在二時四十五分到達。」最遲何時到達？`, hint: "留意通告中的報到時間。", options: ["下午二時四十五分", "下午三時", "下午三時十五分", "下午四時"], correct: 0 },
    { label: "人物推論", topic: "人物與原因推論", question: `${level.zhPerson}${level.zhAction}，這最能反映他／她怎樣？`, hint: "從行動推想人物的特質。", options: isP2 ? ["有公德心", "粗心大意", "不願合作", "害怕嘗試"] : isP3 ? ["勤奮", "粗心大意", "不願合作", "害怕嘗試"] : isP4 ? ["有準備", "粗心大意", "不願合作", "害怕嘗試"] : isP5 ? ["有毅力", "害怕嘗試", "容易放棄", "不願接受別人意見"] : isP6 ? ["認真負責", "願意分享", "不願合作", "害怕嘗試"] : ["願意分享", "粗心大意", "不願合作", "害怕嘗試"], correct: 0 },
    { label: "原因推論", topic: "人物與原因推論", question: `${level.zhPerson}先了解資料才作決定，最可能是因為？`, hint: "想想這種行動可帶來甚麼好處。", options: ["希望作出較合適的選擇", "不想知道內容", "想拖延時間", "沒有任何原因"], correct: 0 },
    { label: "修辭手法", topic: "語境、修辭與句意", question: `「微風輕輕拍著樹葉」主要把微風寫成像甚麼？`, hint: "留意無生命的事物被賦予人的動作。", options: ["人", "石頭", "書本", "雨傘"], correct: 0 },
    { label: "句意理解", topic: "語境、修辭與句意", question: isP4 ? `「${level.zhSentence}」這句話的主要意思是甚麼？` : `「${level.zhSentence}」這句話中，最重要的訊息是甚麼？`, hint: isP4 || isP5 || isP6 ? "直接找出句子要表達的意思。" : "找出誰在甚麼地方做甚麼。", options: isP4 ? [level.zhSentence, "閱讀會讓我們變得更快樂。", "閱讀只適合小朋友閱讀。", "閱讀會讓書本很快破爛。"] : isP5 ? ["合作可以把不同人的長處結合起來，做成更好的事情", "合作是指大家在同一地方工作", "合作就是每個人都單獨完成自己的任務", "只有朋友之間才需要合作"] : isP6 ? ["溝通要清晰，才能幫助小組作出合適的決定。", "小組應避免溝通，以免浪費時間。", "每個成員應單獨作決定，不必討論。", "做決定時只需聽從領導者的意見。"] : ["人物、地點和主要行動", "句子的字數", "所有標點名稱", "顏色的數量"], correct: 0 },
    { label: "主旨辨認", topic: "整合閱讀", question: `文章先介紹${level.zhTopic}的準備方法，再說明參加後的收穫，主旨最可能是？`, hint: "主旨是作者最想帶出的中心訊息。", options: ["鼓勵讀者認真準備並參與活動", "介紹所有人的姓名", "比較不同天氣", "只描述食物"], correct: 0 },
    { label: "段落組織", topic: "文本結構", question: "「先找出重點，再整理想法，最後寫下回應。」這段文字主要按甚麼方式組織？", hint: "留意動作的先後。", options: ["步驟順序", "人物對話", "地點轉換", "問題與答案"], correct: 0 },
  ];
}

function primaryChineseWritingSeeds(level: PrimaryLanguageLevel): QuestionSeed[] {
  const isP1 = level.zhTopic === "我的家人";
  const isP6 = level.zhTopic === "我對校園生活的建議";
  return [
    { label: "詞語運用", topic: "詞語運用", question: `要形容${level.zhPerson}做事${level.zhMeaning}，哪個詞最合適？`, hint: "選擇能準確反映人物態度的詞。", options: [level.zhWord, "混亂", "敷衍", "急躁"], correct: 0 },
    { label: "詞語搭配", topic: "詞語運用", question: "下列哪個詞語搭配最自然？", hint: "留意動詞和名詞的常見配搭。", options: ["整理資料", "整理星星", "整理雨水", "整理聲音"], correct: 0 },
    { label: "句子組織", topic: "句子準確性", question: `哪一句語序最通順？`, hint: "先找主語、動作和其他資訊。", options: [level.zhSentence, "在我們跑步操場。", "活動同學們下午進行。", "閱讀不同想法認識能。"], correct: 0 },
    { label: "標點運用", topic: "句子準確性", question: "哪一句標點運用最合適？", hint: "說話內容前後要配合合適符號。", options: ["老師說：「請大家準時完成練習。」", "老師，說請大家：準時完成練習。", "老師說請大家準時完成練習？", "老師：說，請大家完成練習。"], correct: 0 },
    { label: "段落中心", topic: "段落組織", question: isP1 ? "要寫「我的家人」，哪一句最適合作中心句？" : `要寫「${level.zhTopic}」，哪一句最適合作中心句？`, hint: "中心句要直接點出段落重點。", options: isP1 ? ["我愛我的家人。", "我今天吃了蘋果。", "這本書很有趣。", "我家附近有公園。"] : isP6 ? ["我對校園生活有幾點建議，希望能改善同學的學習和生活環境。", "那天的天氣很好。", "我有很多個人喜好。", "學校的操場很大。"] : [`${level.zhTopic}讓我學會從不同角度觀察和思考。`, "那天的天氣很好。", "我有一枝筆。", "很多事情都不同。"], correct: 0 },
    { label: "例子支援", topic: "段落組織", question: "哪一個例子最能支持「合作能解決困難」？", hint: "例子要直接回應觀點。", options: isP1 ? ["我和同學一起搬書，終於搬到課室。", "我一個人玩遊戲。", "天氣變涼了。", "大家都不說話。"] : ["小組分工後完成了複雜任務。", "操場很大。", "有人忘記帶水。", "大家各自等待。"], correct: 0 },
    { label: "內容發展（敘述細節）", topic: "內容與觀點發展", question: isP1 ? "要令故事更清楚，哪一項細節最有幫助？" : "要令記敘內容更具體，哪一項細節最有幫助？", hint: "選擇包含行動、感受或對話的細節。", options: isP1 ? ["我把水遞給口渴的同學，他說「謝謝你！」我很開心。", "活動很好玩。", "那天很多人。", "事情發生了。"] : [`我看到同學需要幫助，便主動協助，完成後感到安心。`, "活動很好。", "那天很多人。", "事情發生了。"], correct: 0 },
    { label: "觀點發展與論證", topic: "內容與觀點發展", question: isP1 ? "想請同學每天閱讀，哪一句說得較清楚？" : "哪種寫法較有說服力？", hint: "觀點後加上理由和例子。", options: isP1 ? ["我們每天有閱讀時間，可以認識新故事，也能和同學分享。", "我覺得可以。", "每個人不同。", "閱讀就是閱讀。"] : ["我支持安排閱讀時間，因為能累積知識，也可分享心得。", "我覺得可以。", "每個人不同。", "閱讀就是閱讀。"], correct: 0 },
    { label: "連接詞選擇", topic: "表達準確：連接詞", question: isP1 ? "「我先做功課，____ 玩遊戲。」填入哪個詞最合適？" : "「我先搜集資料，____ 整理重點。」填入哪個詞最合適？", hint: "留意兩個動作的先後。", options: ["然後", "但是", "雖然", "因此"], correct: 0 },
    { label: "修訂檢查", topic: "表達準確：修訂與篇章銜接", question: isP1 ? "完成作文後，哪一項檢查最有幫助？" : "完成文章後，哪一項檢查最能提升完整性？", hint: isP1 ? "看看開頭、內容和結尾是否連在一起。" : "留意內容、例子和結語是否一致。", options: isP1 ? ["看看開頭、內容和結尾有沒有連在一起。", "只數字數。", "把所有標點刪掉。", "把每句都寫長一點。"] : ["檢查中心句、例子和結語是否呼應", "只數字數", "刪去所有標點", "把每句寫得更長"], correct: 0 },
  ];
}

function primaryEnglishReadingSeeds(level: PrimaryLanguageLevel, grade?: "P1" | "P2" | "P3" | "P4" | "P5" | "P6"): QuestionSeed[] {
  const dedicatedBank = grade ? PRIMARY_ENGLISH_READING_BANKS[grade] : undefined;
  if (dedicatedBank) return dedicatedBank;
  const isP1 = level.enWord === "happy";
  const isP2 = level.enWord === "careful";
  const isP3 = level.enWord === "proud";
  return [
    { label: "Vocabulary", topic: "Vocabulary", question: `The word “${level.enWord}” is closest in meaning to ____ .`, hint: "Choose the meaning that best matches the word.", options: [level.enMeaning, "very noisy", "always late", "easy to break"], correct: 0 },
    { label: "Word in context", topic: "Vocabulary", question: isP1 ? `${level.enSubject} is happy when doing class work. Which action shows this best?` : isP2 ? "Amy is careful when she is at school. Which action shows this best?" : isP3 ? "Kevin feels proud when he helps a friend. Which action shows this best?" : `${level.enSubject} is ${level.enWord} when working on ${level.enTheme}. Which action shows this best?`, hint: "Look for an action that matches the word.", options: isP1 ? ["He smiles and tries his best.", "He ignores the teacher.", "He leaves the room for no reason.", "He never tries again."] : isP2 ? ["Checking her work carefully and helping others", "Talking loudly during lessons", "Running in the classroom", "Ignoring the teacher's instructions"] : isP3 ? ["He checks his work carefully and helps others.", "He ignores his friend.", "He leaves without saying sorry.", "He gives up trying."] : ["Checking work carefully and helping others", "Ignoring every instruction", "Leaving without a reason", "Never trying again"], correct: 0 },
    { label: "Detail finding", topic: "Reading details and main idea", question: isP1 ? "A notice says the event starts at 10:30 and sign-up closes at 10:15. What should a student do?" : "A notice says a school event starts at 10:30 and registration closes at 10:15. What should a student do?", hint: "Find the earlier required time.", options: isP1 ? ["Sign up by 10:15", "Arrive after 10:30", "Wait until noon", "Bring nothing"] : ["Register by 10:15", "Arrive after 10:30", "Wait until noon", "Bring nothing"], correct: 0 },
    { label: "Main idea", topic: "Reading details and main idea", question: isP1 ? "A short text explains how to get ready for a class presentation. Its main purpose is to ____ ." : isP2 ? "A short text explains how to prepare for a school day. Its main purpose is to ____ ." : isP3 ? "A short text tells steps for how to be a helpful friend. What is its main purpose?" : `A short text explains how to prepare for ${level.enTheme}. Its main purpose is to ____ .`, hint: "Think about what the writer wants readers to do.", options: isP1 ? ["tell you what to do", "tell a make-believe story", "sell a uniform", "describe a storm"] : isP3 ? ["Teach useful steps to help others", "Tell a make-believe story", "Sell something", "Describe the weather"] : ["give practical guidance", "tell a fantasy story", "sell a uniform", "describe a storm"], correct: 0 },
    { label: "Inference", topic: "Reading inference", question: isP1 ? "Tom makes a plan before starting the task. What can we infer?" : `${level.enSubject} ${level.enVerb} the plan before starting the task. What can we infer?`, hint: "Use the action as a clue.", options: isP1 ? ["The task is important to Tom", "Tom dislikes every task", "The plan is missing", "We cannot infer anything"] : ["The task matters to the student", "The student dislikes every task", "The plan is missing", "Nothing can be inferred"], correct: 0 },
    { label: "Writer attitude", topic: "Reading inference", question: `The writer calls the activity “a useful chance to learn together”. The writer is most likely ____ .`, hint: "Notice the positive language.", options: isP1 ? ["happy about it", "angry", "not interested", "confused"] : ["supportive", "angry", "uninterested", "confused"], correct: 0 },
    { label: "Reference word", topic: "Text cohesion: reference and connectors", question: `“The class prepared a display. It was shown in the hall.” What does “It” refer to?`, hint: "Look back to the nearest suitable noun.", options: ["The display", "The hall", "The class", "The preparation"], correct: 0 },
    { label: "Connector", topic: "Text cohesion: reference and connectors", question: isP1 ? "Tom practised every day, ____ the presentation became clearer." : `${level.enSubject} practised regularly; ____ , the presentation became clearer.`, hint: "The second part shows a result.", options: isP1 ? ["so", "however", "although", "unless"] : ["therefore", "however", "although", "unless"], correct: 0 },
    { label: "Reading purpose", topic: "Integrated reading: purpose and evidence", question: isP1 || isP2 || isP3 ? "A webpage gives steps, reminders and a sign-up link for a school event. It is mainly designed to ____ ." : `A webpage gives steps, reminders and a sign-up link for ${level.enTheme}. It is mainly designed to ____ .`, hint: "Think about the reader’s next action.", options: isP1 ? ["invite people to join", "sell a house", "teach swimming", "report a storm"] : ["invite people to take part", "sell a house", "teach swimming", "report a storm"], correct: 0 },
    { label: "Identify supporting evidence", topic: "Integrated reading: purpose and evidence", question: `Which detail best supports the idea that ${level.enSubject} enjoys learning?`, hint: "Choose evidence that shows interest through action.", options: [`${level.enSubject} asks questions and shares ideas with classmates.`, `${level.enSubject} owns a blue bag.`, `${level.enSubject} eats lunch at noon.`, `${level.enSubject} walks home.`], correct: 0 },
  ];
}

function primaryEnglishWritingSeeds(level: PrimaryLanguageLevel, grade?: "P1" | "P2" | "P3" | "P4" | "P5" | "P6"): QuestionSeed[] {
  const dedicatedBank = grade ? PRIMARY_ENGLISH_WRITING_BANKS[grade] : undefined;
  if (dedicatedBank) return dedicatedBank;
  const isP1 = level.enWord === "happy";
  const isP2 = level.enWord === "careful";
  const isP3 = level.enWord === "proud";
  const isP4 = level.enWord === "responsible";
  const isP5 = level.enWord === "considerate";
  const isP6 = level.enWord === "effective";
  return [
    { label: "Sentence structure", topic: "Sentence structure", question: "Choose the most complete sentence.", hint: "Look for a clear subject and verb.", options: isP1 ? ["Tom kicks the ball.", "Because Tom careful.", "Kicks the ball.", "The ball carefully."] : isP2 ? ["Amy reads her book carefully.", "Because Amy careful.", "Reads her book.", "Her book carefully."] : isP3 ? ["Kevin reads the instructions carefully.", "Because Kevin careful.", "Reads the instructions.", "The instructions carefully."] : [`${level.enSubject} ${level.enVerb} the task carefully.`, `Because ${level.enSubject} careful.`, `${level.enVerb} the task.`, `The task carefully.`], correct: 0 },
    { label: "Sentence order", topic: "Sentence structure", question: "Choose the sentence with the clearest word order.", hint: "An English sentence usually has a subject, a verb and extra information.", options: isP1 ? ["Tom plays with his dog.", "Plays Tom with his dog.", "With his dog Tom plays.", "His dog with Tom plays."] : isP2 ? ["Amy reads her book every day.", "Reads Amy her book every day.", "Her book Amy reads every day.", "Every day book Amy reads her."] : isP3 ? ["Kevin helps a friend after school.", "Helps Kevin a friend after school.", "A friend Kevin helps after school.", "After school friend Kevin helps a."] : [`${level.enSubject} ${level.enVerb} ideas for ${level.enTheme}.`, `${level.enVerb} ${level.enSubject} ideas.`, `Ideas ${level.enSubject} for ${level.enVerb}.`, `For ${level.enTheme} ideas ${level.enVerb}.`], correct: 0 },
    { label: "Language accuracy", topic: "Language accuracy", question: `${level.enSubject} ____ a short note yesterday.`, hint: "The time word tells you which tense to use.", options: ["wrote", "write", "writes", "writing"], correct: 0 },
    { label: "Word choice", topic: "Language accuracy", question: isP1 || isP2 ? "Please ____ your ideas clearly." : "Please ____ your ideas clearly in the report.", hint: "Choose a verb related to communication.", options: isP1 || isP2 ? ["share", "borrow", "sleep", "hide"] : ["express", "borrow", "sleep", "hide"], correct: 0 },
    { label: "Paragraph focus", topic: "Paragraph organisation", question: isP1 ? "Which sentence could begin a short writing about my pet?" : isP2 ? "Which sentence could begin a short writing about a school day?" : isP3 ? "Which sentence could begin a short writing about a helpful friend?" : `Which topic sentence best introduces a paragraph about ${level.enTheme}?`, hint: isP1 ? "Choose a sentence that is about the pet." : isP2 ? "Choose a sentence that is about a school day." : isP3 ? "Choose a sentence that is about a helpful friend." : "A topic sentence should state the main idea.", options: isP1 ? ["My pet is a small, friendly dog.", "The room has four windows.", "I have a pencil.", "Tuesday is a day."] : isP2 ? ["My school day is busy and fun.", "The room has four windows.", "I have a pencil.", "Tuesday is a day."] : isP3 ? ["A helpful friend is kind and ready to help others.", "The room has four windows.", "I have a pencil.", "Tuesday is a day."] : isP4 ? ["A class activity can help students learn and work together.", "The room has four windows.", "I have a pencil.", "Tuesday is a day."] : isP5 ? ["A community project can help students learn and work together.", "The room has four windows.", "I have a pencil.", "Tuesday is a day."] : isP6 ? ["An environmental proposal can help students improve their school community.", "The room has four windows.", "I have a pencil.", "Tuesday is a day."] : [`${level.enTheme} can help students learn and work together.`, "The room has four windows.", "I have a pencil.", "Tuesday is a day."], correct: 0 },
    { label: "Supporting detail", topic: "Paragraph organisation", question: isP1 ? "Which sentence shows that planning helped the group?" : "Which sentence best supports the idea that planning helps a group?", hint: "Choose a specific supporting example.", options: isP1 ? ["We made a list and each person did one job, so we finished on time.", "Planning is a word.", "Some shoes are expensive.", "Everyone is different."] : ["The group shared jobs and finished each step on time.", "Planning is a word.", "Some shoes are expensive.", "Everyone is different."], correct: 0 },
    { label: "Linking", topic: "Purpose, tone and linking", question: isP1 || isP2 ? "I put on my coat ____ it was cold." : isP4 ? "I made a list. ____ , we finished on time." : isP5 ? "I forgot to study for the test. ____ , I did not do well." : isP6 ? "We checked the facts carefully. ____ , our proposal was more accurate." : "I checked my work carefully. ____ , I found two mistakes.", hint: isP1 || isP2 ? "Choose the word that gives the reason." : "The second sentence follows from the first.", options: isP1 || isP2 ? ["because", "so", "but", "or"] : isP5 ? ["As a result", "But", "If", "When"] : ["As a result", "Although", "Unless", "However"], correct: 0 },
    { label: "Purpose and tone", topic: "Purpose, tone and linking", question: "Which sentence is most suitable for an email to a teacher?", hint: "Use a polite and clear tone.", options: isP2 ? ["Can you please help me with my homework?", "Send me the answer now.", "I do not care.", "Your work is bad."] : ["Could you please explain the homework deadline?", "Send me the answer now.", "I do not care.", "Your work is bad."], correct: 0 },
    { label: "Audience awareness", topic: "Purpose, tone and linking", question: "Which opening is most suitable for a message to classmates about an activity?", hint: "Choose a friendly and clear opening for the intended reader.", options: ["Hi everyone, please join our class activity on Friday.", "You must come now.", "I do not want to explain.", "This sentence has no purpose."], correct: 0 },
    { label: "Revision", topic: "Revision, editing and proofreading", question: "Which revision makes “The activity was good” more specific?", hint: "Add a meaningful action or result.", options: isP1 || isP2 ? ["We played three fun games and made a big poster.", "The activity was good good.", "The activity was an activity.", "It was good."] : ["The activity helped classmates share ideas and solve a problem together.", "The activity was good good.", "The activity was an activity.", "It was good."], correct: 0 },
    { label: "Revision (editing and proofreading)", topic: "Revision, editing and proofreading", question: isP1 || isP2 ? "Before you hand in your writing, what should you check?" : "Before submitting writing, which check is most useful?", hint: isP1 || isP2 ? "Look for a simple writing check." : "Look beyond spelling alone.", options: isP1 ? ["Check capital letters and full stops.", "Remove every full stop.", "Use the longest words.", "Change every sentence to a question."] : isP2 ? ["Check if your ideas, examples and ending match what you want to say.", "Remove every full stop.", "Use the longest words you can.", "Change every sentence into a question."] : ["Check if ideas, examples and conclusion match the purpose.", "Remove every full stop.", "Use the longest words.", "Change every sentence to a question."], correct: 0 },
  ];
}

function primaryLanguageSeeds(track: TrackId, grade: GradeId): QuestionSeed[] | null {
  if (!grade.startsWith("P")) return null;
  const level = PRIMARY_LANGUAGE_LEVELS[grade as keyof typeof PRIMARY_LANGUAGE_LEVELS];
  if (track === "chinese-reading") return primaryChineseReadingSeeds(level, grade as "P1" | "P2" | "P3" | "P4" | "P5" | "P6");
  if (track === "chinese-writing") return primaryChineseWritingSeeds(level);
  if (track === "english-reading") return primaryEnglishReadingSeeds(level, grade as "P1" | "P2" | "P3" | "P4" | "P5" | "P6");
  if (track === "english-writing") return primaryEnglishWritingSeeds(level, grade as "P1" | "P2" | "P3" | "P4" | "P5" | "P6");
  return null;
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

export function buildQuestionPool(track: TrackId, grade: GradeId): AssessmentQuestion[] {
  const languageSeeds = primaryLanguageSeeds(track, grade);
  const secondarySeeds = grade.startsWith("S") ? getSecondaryExamSeeds(track as import("./secondaryExamBanks").SecondaryExamTrack, grade) : null;
  const seeds = track === "math" && grade.startsWith("P") ? PRIMARY_MATH_GRADE_BANKS[grade as keyof typeof PRIMARY_MATH_GRADE_BANKS] : languageSeeds ?? secondarySeeds ?? BANKS[track];
  const usesStandalonePrimaryChineseBank = track === "chinese-reading" && grade.startsWith("P") && PRIMARY_CHINESE_READING_BANKS[grade as "P1" | "P2" | "P3" | "P4" | "P5" | "P6"] === seeds;
  const usesStandalonePrimaryEnglishBank = grade.startsWith("P") && (
    (track === "english-reading" && PRIMARY_ENGLISH_READING_BANKS[grade as "P1" | "P2" | "P3" | "P4" | "P5" | "P6"] === seeds)
    || (track === "english-writing" && PRIMARY_ENGLISH_WRITING_BANKS[grade as "P1" | "P2" | "P3" | "P4" | "P5" | "P6"] === seeds)
  );
  if (usesStandalonePrimaryChineseBank || usesStandalonePrimaryEnglishBank) {
    return seeds.map((seed, seedIndex) => {
      const optionShift = usesStandalonePrimaryEnglishBank ? seedIndex % seed.options.length : 0;
      const options = optionShift ? [...seed.options.slice(optionShift), ...seed.options.slice(0, optionShift)] : [...seed.options];
      const correct = (seed.correct - optionShift + seed.options.length) % seed.options.length;
      return {
        ...seed,
        options,
        correct,
        id: `${track}-${grade}-${seedIndex}-0`,
        grade,
        gradeBand: gradeBand(grade),
        selectionGroup: selectionGroupForSeed(track, grade, seed, seedIndex, seeds.length),
        module: moduleForSeed(track, seed),
        difficulty: seedIndex % 5 === 4 ? "核心" : "基礎",
      };
    });
  }
  return seeds.flatMap((seed, seedIndex) => CONTEXTS.map((context, variant) => ({
    ...seed,
    id: `${track}-${grade}-${seedIndex}-${variant}`,
    question: variant === 0 ? seed.question : `${seed.question}（${context}延伸題）`,
    hint: variant === 0 ? seed.hint : `${seed.hint} 請留意題目在${context}中的線索。`,
    grade,
    gradeBand: gradeBand(grade),
    selectionGroup: selectionGroupForSeed(track, grade, seed, seedIndex, seeds.length),
    module: moduleForSeed(track, seed),
    difficulty: difficultyFor(grade, variant),
  })));
}

export function randomAssessment(track: TrackId, grade: GradeId) {
  const pool = buildQuestionPool(track, grade);
  const selectionGroups = Array.from(new Set(pool.map((question) => question.selectionGroup)));
  const selected = selectionGroups.flatMap((selectionGroup) => shuffle(pool.filter((question) => question.selectionGroup === selectionGroup)).slice(0, 4));
  return shuffle(selected).slice(0, 20);
}

export function trackForGrade(track: TrackId, grade: GradeId) {
  const gradeInfo = GRADES.find((item) => item.id === grade)!;
  const config = TRACKS.find((item) => item.id === track)!;
  return config.allowedStages.includes(gradeInfo.stage) && (!config.grades || config.grades.includes(grade));
}

/**
 * Learning Compass / 學習航圖
 * Design reminder: a calm, transparent diagnostic flow. Grade labels guide
 * question selection and report language; this is not a formal examination.
 */
export type GradeId = "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "S1" | "S2" | "S3";
export type TrackId = "chinese-reading" | "chinese-writing" | "english-reading" | "english-writing" | "math" | "science" | "interview";
export type ModuleName = "基礎掌握" | "理解與應用" | "情境推理" | "整合表達";

export type AssessmentQuestion = {
  id: string;
  label: string;
  topic: string;
  question: string;
  hint: string;
  options: string[];
  correct: number;
  grade: GradeId;
  gradeBand: string;
  module: ModuleName;
  difficulty: "基礎" | "核心" | "進階";
};

type QuestionSeed = Omit<AssessmentQuestion, "id" | "grade" | "gradeBand" | "module" | "difficulty">;

export const GRADES: { id: GradeId; label: string; stage: "小學" | "初中" }[] = [
  { id: "P1", label: "小一", stage: "小學" }, { id: "P2", label: "小二", stage: "小學" }, { id: "P3", label: "小三", stage: "小學" },
  { id: "P4", label: "小四", stage: "小學" }, { id: "P5", label: "小五", stage: "小學" }, { id: "P6", label: "小六", stage: "小學" },
  { id: "S1", label: "中一", stage: "初中" }, { id: "S2", label: "中二", stage: "初中" }, { id: "S3", label: "中三", stage: "初中" },
];

export const TRACKS: { id: TrackId; label: string; shortLabel: string; description: string; icon: "language" | "math" | "science" | "interview"; allowedStages: ("小學" | "初中")[]; grades?: GradeId[] }[] = [
  { id: "chinese-reading", label: "中文閱讀理解", shortLabel: "中文閱讀", description: "字詞、訊息定位、推論、主旨與修辭閱讀", icon: "language", allowedStages: ["小學", "初中"] },
  { id: "chinese-writing", label: "中文寫作基礎與組織", shortLabel: "中文寫作", description: "詞語運用、句子、段落、內容與表達組織", icon: "language", allowedStages: ["小學", "初中"] },
  { id: "english-reading", label: "英文閱讀理解", shortLabel: "英文閱讀", description: "詞彙、文法、找訊息、推論及閱讀目的", icon: "language", allowedStages: ["小學", "初中"] },
  { id: "english-writing", label: "英文寫作基礎與組織", shortLabel: "英文寫作", description: "句型、連接、段落、語境與表達準確度", icon: "language", allowedStages: ["小學", "初中"] },
  { id: "math", label: "數學應用與解題", shortLabel: "數學", description: "運算、比例、幾何、數據與多步驟解題", icon: "math", allowedStages: ["小學", "初中"] },
  { id: "science", label: "Science 科學探究", shortLabel: "Science", description: "探究、生命、物質、能量與力學概念", icon: "science", allowedStages: ["初中"] },
  { id: "interview", label: "升中面試準備", shortLabel: "升中面試", description: "自我介紹、聆聽、應對、協作與表達", icon: "interview", allowedStages: ["小學"], grades: ["P5", "P6"] },
];

const MODULES: ModuleName[] = ["基礎掌握", "理解與應用", "情境推理", "整合表達"];
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
    { label: "Self introduction", topic: "Self introduction", question: "Which self-introduction gives the clearest first impression?", hint: "Choose a short, structured and genuine response.", options: ["Only say your name and stop.", "Greet, state your name and school, then share one genuine interest with an example.", "List every award without context.", "Ask the interviewer to answer first."], correct: 1 },
    { label: "Listening", topic: "Listening and response", question: "If you do not understand a question, what is the best response?", hint: "Clarify politely instead of guessing.", options: ["Make up an answer immediately.", "Ask politely for the question to be repeated or explained.", "Stay silent until the interview ends.", "Ask a friend to answer."], correct: 1 },
    { label: "Response structure", topic: "Listening and response", question: "Which is the strongest way to answer “What do you enjoy learning?”", hint: "A good answer includes a reason and an example.", options: ["Say only one subject name.", "Name an area, explain why, and give one related experience.", "Change the question.", "Repeat “I don't know”."], correct: 1 },
    { label: "Teamwork", topic: "Collaboration", question: "In a group task, a quieter member has not spoken. What can you do?", hint: "Include others respectfully.", options: ["Ignore the person.", "Invite the person to share an idea and listen carefully.", "Tell everyone your idea is best.", "End the discussion."], correct: 1 },
    { label: "Different views", topic: "Collaboration", question: "When a teammate disagrees with you, what should you do first?", hint: "Understand before responding.", options: ["Say they are wrong.", "Ask about their reason and compare ideas calmly.", "Leave the group.", "Speak louder."], correct: 1 },
    { label: "Body language", topic: "Expression", question: "Which body language supports clear communication?", hint: "Choose a natural and respectful action.", options: ["Look at the floor all the time.", "Sit naturally and look at the speaker.", "Keep checking a phone.", "Turn away while speaking."], correct: 1 },
    { label: "Reflection", topic: "Expression", question: "How can you answer a question about something you want to improve?", hint: "Be honest and show how you are working on it.", options: ["Say you have no area to improve.", "Name one area and explain one action you are taking.", "Blame classmates.", "Refuse to respond."], correct: 1 },
    { label: "School knowledge", topic: "School awareness", question: "Why does learning about a secondary school before an interview help?", hint: "Connect what you know to your own interests.", options: ["It guarantees admission.", "It helps you give specific reasons for applying and ask thoughtful questions.", "It means no other preparation is needed.", "It lets you memorise a uniform colour."], correct: 1 },
    { label: "Situation judgement", topic: "School awareness", question: "You notice a classmate is left out during an activity. What is a constructive response?", hint: "Show awareness and practical action.", options: ["Pretend not to notice.", "Invite the classmate to join and check what role they prefer.", "Tell others to stop talking.", "Leave the activity."], correct: 1 },
    { label: "Integrated expression", topic: "Self introduction", question: "What makes an interview answer memorable without sounding rehearsed?", hint: "Use a real, relevant example.", options: ["Using the longest words possible.", "Giving a clear answer supported by a genuine experience.", "Speaking as fast as possible.", "Reciting a script without listening."], correct: 1 },
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
    { label: "多步驟金錢題", topic: "多步驟解題", question: "一本書售 $28，買 3 本用 $100 付款，應找回多少錢？", hint: "先計算三本書的總價。", options: ["$14", "$16", "$72", "$84"], correct: 1 },
    { label: "數量推理", topic: "多步驟解題", question: "一條繩分成 4 段，每段 35 厘米，整條繩長多少厘米？", hint: "相同長度的段數可用乘法。", options: ["39 厘米", "70 厘米", "105 厘米", "140 厘米"], correct: 3 },
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
    { label: "方程思維", topic: "多步驟解題", question: "3x + 5 = 20，x = ?", hint: "先減去 5，再除以 3。", options: ["3", "5", "7", "15"], correct: 1 },
    { label: "比例生活題", topic: "多步驟解題", question: "果汁和水的比例是 1：4。若用了 3 杯果汁，需要多少杯水？", hint: "果汁由 1 變成 3，水也要按相同倍數改變。", options: ["4 杯", "7 杯", "9 杯", "12 杯"], correct: 3 },
  ],
  P6: [
    { label: "整數與小數", topic: "數與運算", question: "3,600 ÷ 9 = ?", hint: "可用乘法檢查答案。", options: ["40", "400", "4,000", "32,400"], correct: 1 },
    { label: "小數除法", topic: "數與運算", question: "1.2 ÷ 0.3 = ?", hint: "把被除數和除數同時擴大 10 倍。", options: ["0.4", "4", "9", "40"], correct: 1 },
    { label: "比例應用", topic: "分數與比例", question: "麵粉和糖的比例是 5：2。若用了 10 杯麵粉，需要多少杯糖？", hint: "兩部分要同時按相同倍數放大。", options: ["2 杯", "4 杯", "5 杯", "8 杯"], correct: 1 },
    { label: "折扣計算", topic: "分數與比例", question: "一件原價 $240 的物品減價 25%，減價後售價是多少？", hint: "先找出減去的金額，再由原價扣除。", options: ["$60", "$180", "$200", "$300"], correct: 1 },
    { label: "立體圖形", topic: "圖形與量度", question: "長方體長 6 厘米、闊 4 厘米、高 3 厘米，體積是多少？", hint: "把三條邊長相乘。", options: ["13 立方厘米", "24 立方厘米", "48 立方厘米", "72 立方厘米"], correct: 3 },
    { label: "速度概念", topic: "圖形與量度", question: "單車以每小時 12 公里行駛 1.5 小時，共行駛多少公里？", hint: "路程 = 速度 × 時間。", options: ["8 公里", "12 公里", "18 公里", "24 公里"], correct: 2 },
    { label: "中位數", topic: "數據與統計", question: "數字 6、8、8、10、13 的中位數是多少？", hint: "把數據排好後找中間數。", options: ["6", "8", "9", "13"], correct: 1 },
    { label: "長條圖判讀", topic: "數據與統計", question: "長條圖顯示 12 名同學選擇美術、18 名同學選擇音樂。選擇音樂的同學多了多少人？", hint: "用較大數減去較小數。", options: ["4 人", "6 人", "12 人", "30 人"], correct: 1 },
    { label: "代數思維", topic: "多步驟解題", question: "4x + 7 = 31，x = ?", hint: "先減去 7，再除以 4。", options: ["4", "5", "6", "8"], correct: 2 },
    { label: "綜合文字題", topic: "多步驟解題", question: "6 包鉛筆每包有 8 枝，送出 11 枝後，還有多少枝？", hint: "先計算全部數量，再減去送出的數量。", options: ["26 枝", "37 枝", "48 枝", "59 枝"], correct: 1 },
  ],
};

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

export function buildQuestionPool(track: TrackId, grade: GradeId): AssessmentQuestion[] {
  const seeds = track === "math" && grade.startsWith("P") ? PRIMARY_MATH_GRADE_BANKS[grade as keyof typeof PRIMARY_MATH_GRADE_BANKS] : BANKS[track];
  return seeds.flatMap((seed, seedIndex) => CONTEXTS.map((context, variant) => ({
    ...seed,
    id: `${track}-${grade}-${seedIndex}-${variant}`,
    question: variant === 0 ? seed.question : `${seed.question}（${context}延伸題）`,
    hint: variant === 0 ? seed.hint : `${seed.hint} 請留意題目在${context}中的線索。`,
    grade,
    gradeBand: gradeBand(grade),
    module: MODULES[(seedIndex + variant) % MODULES.length],
    difficulty: difficultyFor(grade, variant),
  })));
}

export function randomAssessment(track: TrackId, grade: GradeId) {
  const pool = buildQuestionPool(track, grade);
  const topics = Array.from(new Set(pool.map((question) => question.topic)));
  const selected = topics.flatMap((topic) => shuffle(pool.filter((question) => question.topic === topic)).slice(0, 4));
  return shuffle(selected).slice(0, 20);
}

export function trackForGrade(track: TrackId, grade: GradeId) {
  const gradeInfo = GRADES.find((item) => item.id === grade)!;
  const config = TRACKS.find((item) => item.id === track)!;
  return config.allowedStages.includes(gradeInfo.stage) && (!config.grades || config.grades.includes(grade));
}

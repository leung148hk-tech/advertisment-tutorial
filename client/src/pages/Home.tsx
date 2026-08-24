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
  Calculator,
  Check,
  CheckCircle2,
  Compass,
  FlaskConical,
  Languages,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { EXTENDED_QUESTIONS } from "@/data/extendedQuestions";

type Stage = "landing" | "quiz" | "gate" | "report";
type SchoolStage = "小學全科" | "升中面試" | "初中";

type QuizQuestion = {
  label: string;
  topic: string;
  question: string;
  hint: string;
  options: string[];
  correct: number;
};

type RouteConfig = {
  id: string;
  stage: SchoolStage;
  subject: string;
  eyebrow: string;
  summary: string;
  questions: QuizQuestion[];
  insights: Record<string, { title: string; copy: string }>;
};

type Partner = {
  name: string;
  districts: string[];
  grades: string;
  format: string;
  focus: string;
  stages: SchoolStage[];
  subjects: string[];
  region: "港島" | "九龍" | "新界";
};

const HERO_IMAGE = "/manus-storage/learning-compass-hero_3d6e2df7.jpg";
const PROFILE_IMAGE = "/manus-storage/learning-profile-paper_e09f7bb6.jpg";
const SESSION_IMAGE = "/manus-storage/learning-tutor-session_fef23b65.jpg";
const ROUTE_IMAGE = "/manus-storage/learning-route-abstract_80f1c75a.jpg";
const LOGO_IMAGE = "/manus-storage/learning-compass-mark_3de5f85b.png";

const ROUTES: RouteConfig[] = [
  {
    id: "primary-chinese",
    stage: "小學全科",
    subject: "中文",
    eyebrow: "小學全科 · 中文",
    summary: "從字詞、閱讀線索到句子組織，整理孩子現時的語文節奏。",
    insights: {
      字詞: { title: "字詞運用", copy: "可在日常閱讀中記錄常見詞語，配合造句和近義詞練習，慢慢建立準確的語感。" },
      閱讀: { title: "閱讀線索", copy: "閱讀短文時可先找人物、事件和原因，再用自己的說話覆述，幫助掌握重點。" },
      句子: { title: "句子組織", copy: "先辨認句子的主角、動作和結果，再練習把短句串連成完整表達。" },
    },
    questions: [
      { label: "字詞運用", topic: "字詞", question: "下列哪一句的「再」字用得最合適？", hint: "想一想「再」通常表示重複或下一次。", options: ["我再昨天去了圖書館。", "請你再說一次。", "他再是一個學生。", "這本書再桌上。"], correct: 1 },
      { label: "詞語理解", topic: "字詞", question: "「寧靜」最接近下列哪一個意思？", hint: "留意它形容環境或心情的狀態。", options: ["熱鬧", "安靜", "匆忙", "明亮"], correct: 1 },
      { label: "閱讀線索", topic: "閱讀", question: "小明看見小鳥受傷，於是把牠帶到管理處。小明這樣做最可能是為了甚麼？", hint: "從人物的行動推想原因。", options: ["想帶小鳥回家", "希望有人幫助小鳥", "想找朋友玩", "想離開公園"], correct: 1 },
      { label: "句子組織", topic: "句子", question: "哪一句的語序最通順？", hint: "想想事情發生的先後次序。", options: ["公園裡跑步我和弟弟。", "我和弟弟在公園裡跑步。", "跑步弟弟和我公園裡。", "在我公園裡弟弟跑步和。"], correct: 1 },
      { label: "標點運用", topic: "句子", question: "「你今天完成了功課嗎」句末最適合用哪一個標點符號？", hint: "這是一句需要別人回答的說話。", options: ["。", "，", "？", "！"], correct: 2 },
    ],
  },
  {
    id: "primary-english",
    stage: "小學全科",
    subject: "英文",
    eyebrow: "小學全科 · 英文",
    summary: "以生活英文、基本句型和閱讀線索，認識孩子可先鞏固的方向。",
    insights: {
      文法: { title: "句型與時態", copy: "可以由主語、動詞和時間詞開始，利用短句練習把規則用得更自然。" },
      詞彙: { title: "日常詞彙", copy: "建議從孩子熟悉的生活情境累積詞彙，並用圖片、例句和重複應用鞏固記憶。" },
      閱讀: { title: "閱讀線索", copy: "閱讀時可練習圈出人物、物件和代詞，逐步建立從上下文找線索的習慣。" },
      語序: { title: "句子組織", copy: "先用「誰 + 做甚麼 + 其他資訊」的順序重組句子，有助建立清晰的英文語感。" },
    },
    questions: [
      { label: "句型與文法", topic: "文法", question: "My brother ____ football every Saturday.", hint: "留意主語是單數時，動詞的變化。", options: ["play", "plays", "playing", "played"], correct: 1 },
      { label: "日常詞彙", topic: "詞彙", question: "Which word is closest in meaning to “happy”?", hint: "想一想描述愉快心情的英文詞。", options: ["angry", "tired", "glad", "quiet"], correct: 2 },
      { label: "時態運用", topic: "文法", question: "Yesterday, we ____ a movie after dinner.", hint: "句子提到昨天，動詞應配合過去時間。", options: ["watch", "watches", "watched", "watching"], correct: 2 },
      { label: "閱讀線索", topic: "閱讀", question: "Amy has a new bicycle. She rides it to the park. What does “it” refer to?", hint: "找回上一句中最合理的名詞。", options: ["Amy", "a bicycle", "the park", "a friend"], correct: 1 },
      { label: "句子組織", topic: "語序", question: "Choose the sentence with the correct word order.", hint: "英文句子一般先寫主語，再寫動詞和其他資訊。", options: ["Every day reads Ken books.", "Ken reads books every day.", "Books Ken every day reads.", "Reads every day Ken books."], correct: 1 },
    ],
  },
  {
    id: "primary-math",
    stage: "小學全科",
    subject: "數學",
    eyebrow: "小學全科 · 數學",
    summary: "從運算、分數、量度到文字題，看看孩子的解題步驟可如何更清晰。",
    insights: {
      運算: { title: "四則運算", copy: "可先把算式按步驟寫整齊，再以估算或逆向運算檢查答案是否合理。" },
      分數: { title: "分數概念", copy: "用圖形、日常分享情境和同分母分數練習，能幫助建立具體的份量感。" },
      量度: { title: "量度與單位", copy: "建議在生活中比較長度、重量和容量，並練習在不同單位之間作轉換。" },
      圖形: { title: "圖形與空間", copy: "可用畫圖、量度和拆分圖形的方法，把周界或面積問題一步步看清楚。" },
      文字題: { title: "文字題拆解", copy: "先圈出已知數字和問題所問，再用自己的說話重述題意，才選擇合適算式。" },
    },
    questions: [
      { label: "基本運算", topic: "運算", question: "38 + 47 = ?", hint: "可以先把十位和個位分開計算。", options: ["75", "85", "95", "105"], correct: 1 },
      { label: "分數概念", topic: "分數", question: "3/4 + 1/4 = ?", hint: "分母相同時，先處理分子。", options: ["1/2", "1", "4/8", "3/8"], correct: 1 },
      { label: "量度轉換", topic: "量度", question: "2.5 米等於多少厘米？", hint: "1 米等於 100 厘米。", options: ["25", "250", "2,500", "0.25"], correct: 1 },
      { label: "圖形與空間", topic: "圖形", question: "一個長方形長 4 厘米、闊 3 厘米，它的周界是多少？", hint: "周界是四條邊長的總和。", options: ["7 厘米", "12 厘米", "14 厘米", "24 厘米"], correct: 2 },
      { label: "生活文字題", topic: "文字題", question: "一本書售 $120，減價 25%，減了多少元？", hint: "把 25% 看作四分之一。", options: ["$20", "$25", "$30", "$90"], correct: 2 },
    ],
  },
  {
    id: "secondary-interview",
    stage: "升中面試",
    subject: "面試準備",
    eyebrow: "升中面試 · 溝通準備",
    summary: "以常見情境認識自我介紹、聆聽和表達結構，為升中面試做好準備。",
    insights: {
      自我介紹: { title: "自我介紹結構", copy: "可用「問候、姓名和學校、興趣或經驗、結語」四步練習，讓第一印象更清楚自然。" },
      應對: { title: "聆聽與應對", copy: "聽完問題後可先停一停，重述重點再回答；不知道時坦誠說明並嘗試提出想法。" },
      協作: { title: "小組協作", copy: "小組活動要兼顧聆聽、尊重和提出建議；讓隊友也有發言空間同樣重要。" },
      表達: { title: "表達禮儀", copy: "練習自然眼神接觸、清晰聲量和有禮回應，能讓想法更容易被理解。" },
    },
    questions: [
      { label: "自我介紹", topic: "自我介紹", question: "面試開始時，以下哪一個自我介紹方式最合適？", hint: "留意是否有禮、清晰和有條理。", options: ["只說自己的名字，然後沉默。", "先問候，再說姓名、就讀學校和一項真實興趣。", "不停說很多獎項，不理會面試官反應。", "要求面試官先介紹自己。"], correct: 1 },
      { label: "聆聽與應對", topic: "應對", question: "遇到需要思考的問題時，較合適的做法是甚麼？", hint: "好的回答通常先理解問題，再有條理地表達。", options: ["未聽完便搶著回答。", "先聽清楚問題，想一想再說出理由。", "完全不回答。", "一直重複同一句說話。"], correct: 1 },
      { label: "小組活動", topic: "協作", question: "小組討論時，有同學一直未發言，你可以怎樣做？", hint: "想想如何令討論更尊重和有合作感。", options: ["立即否定他的想法。", "邀請他分享想法，並認真聆聽。", "只說自己的意見。", "要求所有人停止討論。"], correct: 1 },
      { label: "表達禮儀", topic: "表達", question: "回答問題時，哪一項較能幫助別人理解你？", hint: "語氣和身體語言都會影響溝通。", options: ["全程望著地面快速說話。", "自然望向面試官，用清晰聲量回答。", "背向面試官說話。", "只用單字回答所有問題。"], correct: 1 },
      { label: "認識學校", topic: "應對", question: "被問到「為甚麼想入讀這所學校？」時，哪一種回應較有內容？", hint: "真實、具體的理由比空泛答案更有說服力。", options: ["因為人人都說這間最好。", "因為校服很好看。", "我了解過學校的學習活動，當中有我想參與的項目。", "因為家人叫我報讀。"], correct: 2 },
    ],
  },
  {
    id: "junior-chinese",
    stage: "初中",
    subject: "中文",
    eyebrow: "初中 · 中文",
    summary: "從字詞辨析、閱讀理解到寫作組織，整理初中中文學習的下一步。",
    insights: {
      字詞: { title: "字詞辨析", copy: "可把近義詞、成語放進真實句子比較，理解語境後再運用，記憶會更穩固。" },
      文言: { title: "文言基礎", copy: "先掌握常見虛詞和句式，再配合白話翻譯練習，能逐步建立閱讀文言的信心。" },
      閱讀: { title: "閱讀理解", copy: "練習分辨事實、人物感受與作者觀點，並用文中證據支持答案。" },
      修辭: { title: "修辭與表達", copy: "閱讀時可留意比喻、擬人等寫法如何營造效果，再嘗試用在短段寫作中。" },
      寫作: { title: "段落組織", copy: "先列出中心句、例子和結語，再展開段落，能令寫作觀點更清晰有層次。" },
    },
    questions: [
      { label: "字詞辨析", topic: "字詞", question: "「鍥而不捨」最接近下列哪一個意思？", hint: "想想成語形容一個人面對目標的態度。", options: ["半途而廢", "堅持不放棄", "急於求成", "隨遇而安"], correct: 1 },
      { label: "文言基礎", topic: "文言", question: "「學而時習之，不亦說乎」中的「說」最接近哪一個意思？", hint: "古文中的「說」有時通「悅」。", options: ["說話", "喜悅", "勸說", "小說"], correct: 1 },
      { label: "閱讀理解", topic: "閱讀", question: "小芳每天把看過的書記下感想，半年後發現自己更容易說出對故事的看法。這段文字主要說明甚麼？", hint: "找出行動和結果之間的關係。", options: ["看書很花時間", "記錄閱讀感想有助整理思考", "每個人都要寫日記", "故事一定要很長"], correct: 1 },
      { label: "修辭辨認", topic: "修辭", question: "「風把樹葉輕輕抱到地上」主要運用了甚麼修辭手法？", hint: "留意風被寫成像人一樣。", options: ["比喻", "擬人", "排比", "反問"], correct: 1 },
      { label: "段落組織", topic: "寫作", question: "要寫一段支持「閱讀能開闊眼界」的文字，哪個安排最有條理？", hint: "一段完整文字通常有觀點、例子和回應。", options: ["先寫結語，再隨意列詞語。", "先說觀點，再舉例，最後回應觀點。", "只抄錄名人名句。", "每句都寫不同主題。"], correct: 1 },
    ],
  },
  {
    id: "junior-english",
    stage: "初中",
    subject: "英文",
    eyebrow: "初中 · 英文",
    summary: "以語境、文法和閱讀推論，整理初中英文的準確度與運用能力。",
    insights: {
      詞彙: { title: "詞彙與語境", copy: "學習新詞時可連同搭配、例句和相反詞一起記錄，了解它在不同語境中的用法。" },
      時態: { title: "時態準確度", copy: "可先找時間提示詞，再決定動詞形式；把常見時態整理成小表格會更易溫習。" },
      閱讀: { title: "閱讀推論", copy: "閱讀時除了找直接答案，也可留意人物行動和語氣，練習從細節推論意思。" },
      文法: { title: "文法結構", copy: "把容易混淆的介詞、連接詞和句型放入短篇寫作反覆應用，能提升準確度。" },
      連接: { title: "句子連接", copy: "嘗試用 because、although、therefore 等連接詞，令句子之間的關係更清楚。" },
    },
    questions: [
      { label: "時態運用", topic: "時態", question: "If it ____ tomorrow, we will stay at home.", hint: "在這種句子中，if 子句通常用現在式。", options: ["rain", "rains", "rained", "will rain"], correct: 1 },
      { label: "詞彙與語境", topic: "詞彙", question: "A generous person is willing to ____.", hint: "從句子意思推想這個形容詞的特質。", options: ["share with others", "arrive late", "keep silent", "avoid everyone"], correct: 0 },
      { label: "閱讀推論", topic: "閱讀", question: "Mia brought an umbrella even though the sky was clear. She had read the weather report. What can we infer?", hint: "想想她的行動和天氣報告之間的關係。", options: ["She dislikes sunshine.", "She expected rain later.", "She lost her umbrella.", "She was going to school late."], correct: 1 },
      { label: "文法結構", topic: "文法", question: "Kevin is interested ____ learning how to code.", hint: "這個形容詞常配合哪一個介詞？", options: ["at", "in", "on", "with"], correct: 1 },
      { label: "句子連接", topic: "連接", question: "____ it was raining, the match continued.", hint: "句子前後有轉折關係。", options: ["Because", "Although", "Therefore", "Unless"], correct: 1 },
    ],
  },
  {
    id: "junior-math",
    stage: "初中",
    subject: "數學",
    eyebrow: "初中 · 數學",
    summary: "從代數、幾何到數據處理，整理初中數學的概念拆解與計算步驟。",
    insights: {
      代數: { title: "代數運算", copy: "移項和化簡時可逐行寫出步驟，並把未知數放在一邊、常數放在另一邊，減少遺漏。" },
      分數: { title: "分數與比例", copy: "先弄清楚運算符號，再以約分和估算檢查答案；畫圖也有助理解比例關係。" },
      幾何: { title: "幾何概念", copy: "畫出標示清楚的圖形，列出已知資料，再選擇合適公式，能讓推理更有條理。" },
      百分比: { title: "百分比應用", copy: "可把百分比轉成小數或分數處理，並在購物、折扣等情境練習辨認「部分」和「整體」。" },
      數據: { title: "數據處理", copy: "面對平均數或圖表題時，先列齊所有數值與單位，再逐步計算或比較趨勢。" },
    },
    questions: [
      { label: "代數運算", topic: "代數", question: "解方程式：3x + 4 = 19，x = ?", hint: "先把常數移到另一邊，再處理係數。", options: ["3", "5", "7", "15"], correct: 1 },
      { label: "分數運算", topic: "分數", question: "2/3 ÷ 4/5 = ?", hint: "除以分數等於乘以它的倒數。", options: ["8/15", "5/6", "6/5", "3/10"], correct: 1 },
      { label: "幾何概念", topic: "幾何", question: "一個直角三角形的兩條直角邊長為 6 cm 和 8 cm，面積是多少？", hint: "三角形面積 = 底 × 高 ÷ 2。", options: ["14 cm²", "24 cm²", "28 cm²", "48 cm²"], correct: 1 },
      { label: "百分比應用", topic: "百分比", question: "150 的 20% 是多少？", hint: "把 20% 轉為 0.2。", options: ["20", "30", "50", "120"], correct: 1 },
      { label: "數據處理", topic: "數據", question: "6、8、10 的平均數是多少？", hint: "先把所有數值相加，再除以數值的個數。", options: ["7", "8", "9", "24"], correct: 1 },
    ],
  },
  {
    id: "junior-science",
    stage: "初中",
    subject: "Science",
    eyebrow: "初中 · Science",
    summary: "從探究方法、生命科學到能量與力，整理孩子的科學思考起點。",
    insights: {
      探究: { title: "科學探究", copy: "設計實驗時可先分辨要改變、量度和保持不變的因素，讓比較結果更可靠。" },
      生命: { title: "生命科學", copy: "可把植物和人體的過程用流程圖整理，理解各部分如何互相配合。" },
      能量: { title: "能量轉換", copy: "從生活例子辨認能量由哪裡來、轉變成甚麼，有助把抽象概念連結到日常經驗。" },
      物質: { title: "物質與量度", copy: "處理密度、質量和體積時，先寫清楚公式、單位和代入數值的步驟。" },
      力學: { title: "力與運動", copy: "畫出物件受到的力和方向，能幫助理解平衡、速度改變與運動狀態。" },
    },
    questions: [
      { label: "科學探究", topic: "探究", question: "要公平比較不同肥料對植物生長的影響，哪一項做法最合適？", hint: "公平測試只改變一個因素。", options: ["每盆植物用不同種子和不同光線。", "只改變肥料種類，其他條件保持相同。", "每天隨意量度一次。", "只觀察其中一盆植物。"], correct: 1 },
      { label: "生命科學", topic: "生命", question: "植物進行光合作用時，需要下列哪一項？", hint: "想想植物製造養分所需的能量來源。", options: ["光", "塑膠", "鹽水", "金屬"], correct: 0 },
      { label: "能量轉換", topic: "能量", question: "一輛正在行駛的單車主要具有哪一種能量？", hint: "留意物件正在移動。", options: ["動能", "聲能", "核能", "化學能"], correct: 0 },
      { label: "物質與量度", topic: "物質", question: "密度的計算方法是甚麼？", hint: "想想質量和體積之間的關係。", options: ["質量 × 體積", "質量 ÷ 體積", "體積 ÷ 質量", "質量 + 體積"], correct: 1 },
      { label: "力與運動", topic: "力學", question: "一本書靜止放在桌上，哪一個描述最合理？", hint: "靜止表示向上的力和向下的力互相平衡。", options: ["書沒有受到任何力。", "桌子的支持力和重力平衡。", "只有重力存在。", "書正加速向上。"], correct: 1 },
    ],
  },
];

const FULL_ROUTES: RouteConfig[] = ROUTES.map((route) => ({
  ...route,
  questions: [...route.questions, ...(EXTENDED_QUESTIONS[route.id] ?? [])],
}));

const DISTRICTS = ["中西區", "灣仔區", "東區", "南區", "油尖旺區", "深水埗區", "九龍城區", "黃大仙區", "觀塘區", "葵青區", "荃灣區", "屯門區", "元朗區", "北區", "大埔區", "沙田區", "西貢區", "離島區"];

const REGION_BY_DISTRICT: Record<string, Partner["region"]> = {
  中西區: "港島", 灣仔區: "港島", 東區: "港島", 南區: "港島", 油尖旺區: "九龍", 深水埗區: "九龍", 九龍城區: "九龍", 黃大仙區: "九龍", 觀塘區: "九龍", 葵青區: "新界", 荃灣區: "新界", 屯門區: "新界", 元朗區: "新界", 北區: "新界", 大埔區: "新界", 沙田區: "新界", 西貢區: "新界", 離島區: "新界",
};

const PARTNERS: Partner[] = [
  { name: "學習支援中心 A（示範）", districts: ["沙田區", "觀塘區"], grades: "小一至小六", format: "小組鞏固", focus: "小學中英數基礎", stages: ["小學全科"], subjects: ["中文", "英文", "數學"], region: "新界" },
  { name: "學習支援中心 B（示範）", districts: ["油尖旺區", "深水埗區"], grades: "小四至中三", format: "主題工作坊", focus: "中文閱讀與英文表達", stages: ["小學全科", "初中"], subjects: ["中文", "英文"], region: "九龍" },
  { name: "學習支援中心 C（示範）", districts: ["灣仔區", "東區"], grades: "小五至中一", format: "小班及一對一", focus: "升中面試與溝通準備", stages: ["升中面試"], subjects: ["面試準備"], region: "港島" },
  { name: "學習支援中心 D（示範）", districts: ["元朗區", "屯門區", "北區"], grades: "小三至中三", format: "小班追蹤", focus: "數學概念與 Science 探究", stages: ["小學全科", "初中"], subjects: ["數學", "Science"], region: "新界" },
  { name: "學習支援中心 E（示範）", districts: ["九龍城區", "黃大仙區", "西貢區"], grades: "中一至中三", format: "科目專題班", focus: "初中中英數與 Science", stages: ["初中"], subjects: ["中文", "英文", "數學", "Science"], region: "九龍" },
];

function getProfile(score: number, route: RouteConfig) {
  const percentage = score / route.questions.length;
  if (percentage >= 0.8) return { title: "延伸潛能", lead: `在這份 ${route.subject} 完整評估中，孩子的基礎表現穩定，可以嘗試更有挑戰的應用與表達。`, action: "下一步可把已掌握的概念放進較真實的閱讀、解題或溝通情境中，逐步延伸深度。" };
  if (percentage >= 0.55) return { title: "穩步提升", lead: `孩子已掌握部分 ${route.subject} 基礎，只要集中鞏固幾個環節，學習會更有把握。`, action: "建議以短而有目標的練習重溫相關概念，完成後回看步驟和原因，累積可見的進步。" };
  return { title: "建立基礎", lead: `這份結果提示可先由 ${route.subject} 的核心概念開始，慢慢建立理解和信心。`, action: "可安排有明確步驟的小組或一對一練習，先把最需要的概念逐一整理，再逐步增加題目變化。" };
}

function routeIcon(subject: string) {
  if (subject === "數學") return <Calculator size={20} />;
  if (subject === "Science") return <FlaskConical size={20} />;
  if (subject === "面試準備") return <MessageCircle size={20} />;
  return <Languages size={20} />;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [activeRoute, setActiveRoute] = useState<RouteConfig>(FULL_ROUTES[1]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ parentName: "", whatsapp: "", district: "" });

  useEffect(() => {
    if (stage !== "landing") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

  const score = useMemo(() => answers.reduce((total, answer, index) => total + (answer === activeRoute.questions[index]?.correct ? 1 : 0), 0), [answers, activeRoute]);
  const profile = getProfile(score, activeRoute);
  const focusTopics = useMemo(() => Array.from(new Set(activeRoute.questions.filter((question, index) => answers[index] !== question.correct).map((question) => question.topic))), [answers, activeRoute]);
  const recommendations = useMemo(() => {
    const qualified = PARTNERS.filter((partner) => partner.stages.includes(activeRoute.stage) && partner.subjects.includes(activeRoute.subject));
    const pool = qualified.length ? qualified : PARTNERS;
    const sameDistrict = pool.filter((partner) => partner.districts.includes(form.district));
    const sameRegion = pool.filter((partner) => partner.region === REGION_BY_DISTRICT[form.district] && !sameDistrict.includes(partner));
    return [...sameDistrict, ...sameRegion, ...pool.filter((partner) => !sameDistrict.includes(partner) && !sameRegion.includes(partner))].slice(0, 2);
  }, [activeRoute, form.district]);

  const startRoute = (route: RouteConfig) => {
    const fullRoute = FULL_ROUTES.find((candidate) => candidate.id === route.id) ?? route;
    setActiveRoute(fullRoute);
    setQuestionIndex(0);
    setAnswers([]);
    setFormError("");
    setStage("quiz");
  };

  const selectAnswer = (answerIndex: number) => setAnswers((current) => { const next = [...current]; next[questionIndex] = answerIndex; return next; });
  const nextQuestion = () => { if (questionIndex === activeRoute.questions.length - 1) setStage("gate"); else setQuestionIndex((current) => current + 1); };
  const previousQuestion = () => { if (questionIndex > 0) setQuestionIndex((current) => current - 1); };
  const unlockReport = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!form.district) { setFormError("請選擇所在區域，以便顯示較相關的支援選擇。"); return; } setFormError(""); setStage("report"); };
  const currentQuestion = activeRoute.questions[questionIndex];
  const moduleResults = useMemo(() => [0, 1, 2].map((moduleIndex) => {
    const start = moduleIndex * 5;
    const questions = activeRoute.questions.slice(start, start + 5);
    const correct = questions.reduce((total, question, offset) => total + (answers[start + offset] === question.correct ? 1 : 0), 0);
    const ratio = correct / questions.length;
    return { label: ["A · 基礎掌握", "B · 理解與應用", "C · 整合與推理"][moduleIndex], correct, total: questions.length, status: ratio >= 0.8 ? "表現穩定" : ratio >= 0.55 ? "正在建立" : "優先整理" };
  }), [answers, activeRoute]);
  const abilityResults = useMemo(() => Object.entries(activeRoute.insights).map(([topic, detail]) => {
    const questions = activeRoute.questions.filter((question) => question.topic === topic);
    const correct = questions.reduce((total, question) => total + (answers[activeRoute.questions.indexOf(question)] === question.correct ? 1 : 0), 0);
    const ratio = questions.length ? correct / questions.length : 0;
    return { topic, title: detail.title, correct, total: questions.length, percentage: Math.round(ratio * 100), status: ratio >= 0.8 ? "穩定" : ratio >= 0.55 ? "建立中" : "可優先整理" };
  }).filter((item) => item.total > 0), [answers, activeRoute]);

  return (
    <main className="site-shell">
      <header className="site-header">
        <button className="brand-lockup" onClick={() => setStage("landing")} aria-label="返回學習航圖首頁"><img src={LOGO_IMAGE} alt="學習航圖標誌" className="brand-mark" /><span><strong>學習航圖</strong><small>LEARNING COMPASS</small></span></button>
        <div className="header-note"><span className="note-dot" />{stage === "landing" ? "多科學習小測驗" : activeRoute.eyebrow}</div>
      </header>

      {stage === "landing" && <>
        <section className="hero-section">
          <div className="hero-copy"><p className="eyebrow"><Compass size={16} /> 為每一段學習整理下一步</p><h1>不只一科，<br />為孩子找到<em>對的起點</em>。</h1><p className="hero-lead">由小學中英數、升中面試到初中中英數與 Science，選擇適合孩子現階段的 15 題完整評估，整理一份可一起閱讀的學習航圖。</p><div className="hero-actions"><button className="button button-primary" onClick={() => document.getElementById("assessment-routes")?.scrollIntoView({ behavior: "smooth" })}>選擇評估路線 <ArrowRight size={18} /></button><span className="micro-note"><CheckCircle2 size={17} /> 不會為孩子貼標籤</span></div><div className="hero-stats"><div><strong>08</strong><span>學習路線</span></div><div><strong>15</strong><span>每科完整題</span></div><div><strong>03</strong><span>分析模組</span></div></div></div>
          <div className="hero-art"><img src={HERO_IMAGE} alt="家長與學生一起閱讀學習資料" /><div className="hero-annotation annotation-top"><span>08</span> 條學習航線</div><div className="hero-annotation annotation-bottom"><Sparkles size={16} /> 選擇適合的起點</div></div>
        </section>

        <section className="catalogue-section" id="assessment-routes" aria-labelledby="catalogue-title">
          <div className="catalogue-heading"><p className="eyebrow">選擇你的評估路線</p><h2 id="catalogue-title">先由孩子所在的<br />學習階段出發。</h2><p>每條路線約需 10 至 13 分鐘，完成 15 題後會顯示能力分項、學習重點和地區支援選擇。</p></div>
          <div className="route-groups">
            {(["小學全科", "升中面試", "初中"] as SchoolStage[]).map((group) => <div className="route-group" key={group}><div className="route-group-title"><span>{group === "小學全科" ? "01" : group === "升中面試" ? "02" : "03"}</span><h3>{group}</h3><small>{group === "小學全科" ? "中 · 英 · 數" : group === "升中面試" ? "溝通與應對" : "中 · 英 · 數 · Science"}</small></div><div className="route-card-grid">{ROUTES.filter((route) => route.stage === group).map((route) => <button className="route-card" key={route.id} onClick={() => startRoute(route)}><span className="route-card-icon">{routeIcon(route.subject)}</span><span className="route-card-main"><strong>{route.subject}</strong><small>{route.summary}</small></span><ArrowRight size={17} /></button>)}</div></div>)}
          </div>
        </section>

        <section className="route-preview" aria-labelledby="route-title"><div className="route-photo"><img src={ROUTE_IMAGE} alt="象徵學習方向的紙藝航線" /></div><div className="route-copy"><p className="eyebrow">不是考試，是一次整理</p><h2 id="route-title">由 15 題完整評估，走到一份<br />更容易討論的建議。</h2><div className="route-steps"><div><span>01</span><p><strong>選擇對應路線</strong>按小學、升中或初中階段，選擇中文、英文、數學、Science 或面試準備。</p></div><div><span>02</span><p><strong>完成三段評估</strong>以 15 題題組整理基礎掌握、理解應用和整合推理表現。</p></div><div><span>03</span><p><strong>取得免費完整報告</strong>查看能力分項、兩星期起步建議及按科目配對的支援選擇。</p></div></div></div></section>
        <section className="trust-strip"><BookOpen size={22} /><p><strong>給家長的一句提醒：</strong> 這些小測驗只是一個起點，結果用來打開對話，而不是定義孩子。</p></section>
        <section className="session-callout"><div className="session-image"><img src={SESSION_IMAGE} alt="小組學習討論情景" /></div><div className="session-copy"><p className="eyebrow">按科目找對支援</p><h2>方向清楚，<br />練習才會更踏實。</h2><p>報告會結合所選科目與所在地區，展示可以進一步了解的合作支援選擇。此版本使用示範機構資料，正式上線前可替換為你的合作名單。</p><button className="text-button" onClick={() => document.getElementById("assessment-routes")?.scrollIntoView({ behavior: "smooth" })}>查看評估路線 <ArrowRight size={17} /></button></div></section>
      </>}

      {(stage === "quiz" || stage === "gate") && <section className="assessment-shell">
        <aside className="journey-rail" aria-label="小測驗流程"><p className="rail-kicker">LEARNING ROUTE</p><div className="rail-heading"><Compass size={27} /><span>{activeRoute.stage}<br />{activeRoute.subject}</span></div><div className="active-route-chip">{routeIcon(activeRoute.subject)}<span>{activeRoute.eyebrow}</span></div><div className="rail-steps"><div className="rail-step rail-step-active"><i>1</i><span>完成小測驗</span></div><div className={stage === "gate" ? "rail-step rail-step-active" : "rail-step"}><i>2</i><span>解鎖分析</span></div><div className="rail-step"><i>3</i><span>地區建議</span></div></div><p className="rail-footer">每一題只需一個選擇。<br />按自己的節奏完成即可。</p></aside>
        {stage === "quiz" && <div className="quiz-panel"><div className="quiz-topline"><div><p className="eyebrow">{currentQuestion.label}</p><span>第 {questionIndex + 1} / {activeRoute.questions.length} 題 · {activeRoute.eyebrow}</span></div><div className="progress-line" aria-label={`第 ${questionIndex + 1} 題`}><i style={{ width: `${((questionIndex + 1) / activeRoute.questions.length) * 100}%` }} /></div></div><div className="question-card"><span className="question-number">0{questionIndex + 1}</span><h2>{currentQuestion.question}</h2><p>{currentQuestion.hint}</p><div className="answer-list" role="radiogroup" aria-label={currentQuestion.question}>{currentQuestion.options.map((option, index) => <button key={option} className={answers[questionIndex] === index ? "answer-option answer-option-selected" : "answer-option"} onClick={() => selectAnswer(index)} role="radio" aria-checked={answers[questionIndex] === index}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{answers[questionIndex] === index && <Check size={18} />}</button>)}</div></div><div className="quiz-actions"><button className="button button-ghost" onClick={previousQuestion} disabled={questionIndex === 0}><ArrowLeft size={17} /> 上一題</button><button className="button button-primary" onClick={nextQuestion} disabled={answers[questionIndex] === undefined}>{questionIndex === activeRoute.questions.length - 1 ? "查看分析報告" : "下一題"} <ArrowRight size={17} /></button></div></div>}
        {stage === "gate" && <div className="quiz-panel gate-stage"><div className="gate-intro"><span className="gate-icon"><LockKeyhole size={25} /></span><p className="eyebrow">{activeRoute.eyebrow} · 分析即將完成</p><h2>留下最少資料，<br />解鎖你的學習航圖。</h2><p>我們會用所在地區整理相關的 {activeRoute.subject} 合作支援選擇。此示範版本不會上載或儲存所填資料。</p></div><form className="lead-form" onSubmit={unlockReport}><label>家長稱呼<input value={form.parentName} onChange={(event) => setForm({ ...form, parentName: event.target.value })} placeholder="例如：陳太" /></label><label>WhatsApp 號碼<input inputMode="tel" value={form.whatsapp} onChange={(event) => setForm({ ...form, whatsapp: event.target.value })} placeholder="例如：9123 4567" /></label><div className="route-field"><span>所選路線</span><strong>{activeRoute.stage} · {activeRoute.subject}</strong></div><label>所在區域<select value={form.district} onChange={(event) => setForm({ ...form, district: event.target.value })}><option value="">請選擇</option>{DISTRICTS.map((district) => <option key={district}>{district}</option>)}</select></label>{formError && <p className="form-error">{formError}</p>}<div className="privacy-note"><LockKeyhole size={15} /><span><strong>示範版私隱提示：</strong>資料只用於本頁即時顯示，關閉頁面後不會保留。</span></div><button className="button button-primary button-wide" type="submit">解鎖我的分析報告 <ArrowRight size={17} /></button></form></div>}
      </section>}

      {stage === "report" && <section className="report-shell"><div className="report-intro"><div><p className="eyebrow"><Sparkles size={16} /> {form.parentName} 的 {activeRoute.subject} 學習航圖</p><span className="report-route-badge">{activeRoute.stage} · {activeRoute.subject}</span><h1>{profile.title}</h1><p>{profile.lead}</p></div><div className="score-card"><span>{activeRoute.subject} 小測驗</span><strong>{score}<small>/ {activeRoute.questions.length}</small></strong><p>答對題數</p></div></div><div className="report-grid"><article className="report-summary"><div className="summary-photo"><img src={PROFILE_IMAGE} alt="學習檔案和紙張筆記" /></div><div className="summary-copy"><p className="eyebrow">航圖摘要</p><h2>現在最值得先走的一步</h2><p>{profile.action}</p><div className="summary-line"><span>評估路線</span><b>{activeRoute.stage} · {activeRoute.subject}</b></div><div className="summary-line"><span>建議方式</span><b>{score === activeRoute.questions.length ? "延伸式挑戰" : "循序式鞏固"}</b></div></div></article><article className="focus-card"><p className="eyebrow">可留意的面向</p>{focusTopics.length === 0 ? <div className="all-clear"><CheckCircle2 size={26} /><h3>這份基礎題目表現穩定</h3><p>可把下一步放在更具挑戰的情境應用、延伸閱讀或進階題型上。</p></div> : focusTopics.slice(0, 3).map((topic, index) => <div className="focus-item" key={topic}><span>0{index + 1}</span><div><h3>{activeRoute.insights[topic].title}</h3><p>{activeRoute.insights[topic].copy}</p></div></div>)}</article></div><section className="recommendation-section"><div className="recommendation-heading"><div><p className="eyebrow"><MapPin size={16} /> {form.district} · {activeRoute.subject} 支援選擇</p><h2>可進一步了解的<br />合作支援選擇。</h2></div><p>以下為<strong>示範資料</strong>，已按科目、學習階段和所在區域排序。請於正式上線前以真實合作補習社資料替換。</p></div><div className="partner-list">{recommendations.map((partner, index) => <article className="partner-card" key={partner.name}><div className="partner-index">0{index + 1}</div><div className="partner-main"><span className="demo-chip">合作資料示範</span><h3>{partner.name}</h3><p>{partner.focus}</p></div><dl><div><dt>適合年級</dt><dd>{partner.grades}</dd></div><div><dt>教學形式</dt><dd>{partner.format}</dd></div><div><dt>服務地區</dt><dd>{partner.districts.join("、")}</dd></div></dl><button className="partner-button" disabled><Phone size={16} /> 待加入聯絡連結</button></article>)}</div></section><div className="report-footer"><p><strong>溫馨提示：</strong>這份結果只反映本次 {activeRoute.questions.length} 題 {activeRoute.subject} 完整評估的答題情況，適合作為親子討論學習方向的起點。</p><button className="button button-ghost" onClick={() => setStage("landing")}>選擇另一條路線 <ArrowRight size={17} /></button></div></section>}

      {stage === "report" && <section className="report-action-panel" aria-labelledby="next-step-title"><div className="action-panel-heading"><p className="eyebrow"><Compass size={16} /> 完成報告後</p><h2 id="next-step-title">把結果變成下一步。</h2><p>這份小測驗只用作整理方向。可先由以下三步開始，和孩子一起決定合適的練習節奏。</p></div><div className="action-steps"><div><span>01</span><h3>先看答題摘要</h3><p>本次答對 <strong>{score} / {activeRoute.questions.length}</strong> 題；可留意的面向為 {focusTopics.length ? focusTopics.slice(0, 3).join("、") : "延伸應用"}。</p></div><div><span>02</span><h3>只選一個小目標</h3><p>先從一個面向安排短而有規律的練習，完成後再回顧孩子對題目的理解。</p></div><div><span>03</span><h3>理解推薦理由</h3><p>本頁建議按 <strong>{activeRoute.stage}、{activeRoute.subject} 及 {form.district}</strong> 排序；合作資料仍為示範，尚未代表可報讀名單。</p></div></div><button className="text-button" onClick={() => setStage("landing")}>選擇另一條學習路線 <ArrowRight size={17} /></button></section>}
      {stage === "report" && <section className="free-report-band" aria-labelledby="free-report-title"><div className="free-report-heading"><div><p className="eyebrow"><Sparkles size={16} /> 免費完整評估報告</p><h2 id="free-report-title">15 題結果，拆成可行的學習地圖。</h2></div><p>你已完成三個能力模組。以下數據按本網站題庫整理，用作家庭討論及安排下一步練習的參考。</p></div><div className="module-score-grid">{moduleResults.map((module) => <article key={module.label}><span>{module.label}</span><strong>{module.correct}<small> / {module.total}</small></strong><p>{module.status}</p></article>)}</div><div className="ability-report"><div className="ability-report-heading"><h3>能力分項概覽</h3><span>答題表現區間</span></div>{abilityResults.map((ability) => <div className="ability-row" key={ability.topic}><div><strong>{ability.title}</strong><span>{ability.correct} / {ability.total} 題 · {ability.status}</span></div><div className="ability-track" aria-label={`${ability.title} ${ability.percentage}%`}><i style={{ width: `${ability.percentage}%` }} /></div></div>)}</div><div className="two-week-plan"><span>兩星期起步建議</span><p>先選擇一個「可優先整理」或「建立中」面向，每週安排 3 次、每次 15 至 20 分鐘的針對練習；第二週再用相近題型回顧是否更有把握。</p></div></section>}
      <footer className="site-footer"><span>© 學習航圖</span><span>中英數 · 升中面試 · Science · 示範版本</span></footer>
    </main>
  );
}

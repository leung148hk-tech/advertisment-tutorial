import { primaryChineseSelectionGroup } from "./primaryChineseReadingFramework";
import { PRIMARY_ENGLISH_BANKS } from "./primaryEnglishCombinedBanks";
import { PRIMARY_MATH_BANKS } from "./primaryMathBanks";

/**
 * Learning Compass / 學習航圖
 * Primary-only assessment data. The results guide revision and referral
 * conversations; they are not formal examinations or IQ tests.
 */
export type GradeId = "P1" | "P2" | "P3" | "P4" | "P5" | "P6";
export type TrackId = "chinese-reading" | "english" | "math";
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

export const GRADES: { id: GradeId; label: string; stage: "小學" }[] = [
  { id: "P1", label: "小一", stage: "小學" }, { id: "P2", label: "小二", stage: "小學" }, { id: "P3", label: "小三", stage: "小學" },
  { id: "P4", label: "小四", stage: "小學" }, { id: "P5", label: "小五", stage: "小學" }, { id: "P6", label: "小六", stage: "小學" },
];

export const TRACKS: { id: TrackId; label: string; shortLabel: string; description: string; icon: "language" | "math"; allowedStages: "小學"[] }[] = [
  { id: "chinese-reading", label: "中文", shortLabel: "中文", description: "按年級評核字詞、標點、篇章閱讀、修辭與古詩文理解", icon: "language", allowedStages: ["小學"] },
  { id: "english", label: "英文", shortLabel: "英文", description: "整合閱讀理解與寫作基礎，按年級評核拼讀／詞彙、文法、文體、組織及修訂準備", icon: "language", allowedStages: ["小學"] },
  { id: "math", label: "數學應用與解題", shortLabel: "數學", description: "按年級評核數、圖形與空間、度量、數據處理及代數／解題", icon: "math", allowedStages: ["小學"] },
];

export const ASSESSMENT_MODULES: ModuleName[] = ["基礎掌握", "理解與應用", "情境推理", "整合表達", "溝通與協作"];
const PRIMARY_GRADES: GradeId[] = ["P1", "P2", "P3", "P4", "P5", "P6"];

function gradeBand(grade: GradeId) {
  if (grade === "P1" || grade === "P2") return "小學低年級基礎";
  if (grade === "P3" || grade === "P4") return "小學中年級核心";
  return "小學高年級進階";
}

function moduleForSeed(track: TrackId, seed: QuestionSeed): ModuleName {
  const skill = `${seed.topic} ${seed.label}`.toLowerCase();
  if (track === "english") {
    return /字母|元音|magic e|子音|拼讀|名詞|代名詞|進行式|過去式|未來式|完成式|被動|轉述|情態|大寫|標點|句型|詞彙|搭配|字首|字尾|同反義|comparative|grammar/.test(skill) ? "基礎掌握" : "理解與應用";
  }
  if (track === "math") return /生活|資料|統計|平均|中位|圖表|比例|百分|比率|代數|方程|幾何|量度|時間|金錢/.test(skill) ? "理解與應用" : "基礎掌握";
  if (/字形、筆畫與部首|字詞與基本句子|基本標點與句式|詞彙、成語與字詞辨錯|複句、標點與專名|字形、字音與詞義辨析|轉折複句與進階標點|詞語感情色彩與詞義|條件假設複句與破折號|熟語與多義詞運用|讓步遞進複句與標點/.test(skill)) return "基礎掌握";
  return "理解與應用";
}

const PRIMARY_CHINESE_READING_BANKS: Partial<Record<"P1" | "P2" | "P3" | "P4" | "P5" | "P6", QuestionSeed[]>> = {
  P1: [
    { selectionGroup: primaryChineseSelectionGroup("P1", 0), label: "筆畫順序", topic: "字形、筆畫與部首", question: "「木」字的第二筆是甚麼？", hint: "「木」的筆畫次序是橫、豎、撇、捺。", options: ["橫", "豎", "撇", "捺"], correct: 1 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 0), label: "部件辨識", topic: "字形、筆畫與部首", question: "「明」字由哪一組字組成？", hint: "把字拆開，看看左邊和右邊。", options: ["日和月", "人和木", "口和木", "山和水"], correct: 0 },
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
    { selectionGroup: primaryChineseSelectionGroup("P1", 4), label: "古詩畫面", topic: "簡單修辭與古詩", question: "「白毛浮綠水」主要寫出鵝的哪一組顏色？", hint: "找出詩句中的顏色字。", options: ["白色和綠色", "紅色和黃色", "藍色和黑色", "紫色和橙色"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P1", 4), label: "擬聲詞辨識（疊字）", topic: "簡單修辭與古詩", question: "兒歌中的「小雨沙沙」，「沙沙」最能寫出甚麼？", hint: "重複的聲音詞可幫助我們想像聽到的聲音。", options: ["下雨的聲音", "跑步的聲音", "唱歌的聲音", "笑聲"], correct: 0 },
  ],
  P2: [
    { selectionGroup: primaryChineseSelectionGroup("P2", 0), label: "近義詞辨識", topic: "詞義辨析與查字典", question: "「高興」和下列哪一個詞意思最接近？", hint: "想想收到禮物時的心情。", options: ["快樂", "安靜", "寒冷", "辛苦"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 0), label: "反義詞辨識", topic: "詞義辨析與查字典", question: "「高」的反義詞是甚麼？", hint: "想想相反的意思。", options: ["低", "大", "長", "遠"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 0), label: "部首查字典", topic: "詞義辨析與查字典", question: "想查「跑」字的意思，可以先查哪一個部首？", hint: "看看「跑」字左邊的部件。", options: ["足", "包", "口", "木"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 0), label: "筆畫查字典", topic: "詞義辨析與查字典", question: "如果不知道「明」字的部首，可用甚麼方法查字典？", hint: "字典也可按筆畫數查找。", options: ["數筆畫", "背詩歌", "唱歌", "問天氣"], correct: 0 },
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

    { selectionGroup: primaryChineseSelectionGroup("P2", 3), label: "短文找事件", topic: "敘事閱讀與順敘", question: "短文：小美和小強在操場踢足球，老師站在旁邊看着。他們兩人正在做甚麼？", hint: "直接找出小美和小強正在做的事。", options: ["踢足球", "看書", "洗菜", "畫畫"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 3), label: "短文找地點", topic: "敘事閱讀與順敘", question: "短文：放學後，媽媽在廚房洗菜，弟弟在客廳看書。媽媽在哪裏？", hint: "找出短文中媽媽所在的地方。", options: ["廚房", "客廳", "花園", "課室"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 3), label: "敘事起因", topic: "敘事閱讀與順敘", question: "短文：上學時下起大雨，小安打開雨傘，沒有被雨淋濕。小安為甚麼打開雨傘？", hint: "答案在第一句。", options: ["因為下起大雨", "因為太陽很猛烈", "因為要放風箏", "因為要睡覺"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 3), label: "敘事結果", topic: "敘事閱讀與順敘", question: "短文：小玲幫奶奶把報紙拿進屋，奶奶笑着說謝謝。最後發生了甚麼？", hint: "找出故事最後的事情。", options: ["奶奶向小玲道謝", "小玲買了一把雨傘", "奶奶到公園跑步", "報紙飛到天上"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 3), label: "人物行動", topic: "敘事閱讀與順敘", question: "短文：午飯後，阿傑把餐盒洗乾淨，放回書包。阿傑做了甚麼？", hint: "找出阿傑完成的兩個動作。", options: ["洗餐盒並放回書包", "把餐盒送給同學", "在餐盒上畫畫", "把餐盒留在桌上"], correct: 0 },

    { selectionGroup: primaryChineseSelectionGroup("P2", 4), label: "排比初步", topic: "修辭與五言絕句", question: "「下課了，同學們有的跳繩，有的拍球，有的跑步。」這句話把多個相似的內容連在一起，最接近哪種寫法？", hint: "留意「有的……有的……有的……」重複出現。", options: ["排比", "問句", "對話", "書名號"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 4), label: "反覆初步", topic: "修辭與五言絕句", question: "「快來呀，快來呀，公園很熱鬧！」重複「快來呀」主要是為了甚麼？", hint: "重複一句話可加強語氣。", options: ["加強邀請的語氣", "說明時間", "標示書名", "表示問題"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 4), label: "古詩時間", topic: "修辭與五言絕句", question: "「床前明月光，疑是地上霜。」寫的是甚麼時候的景象？", hint: "有月光的夜晚才會照在床前。", options: ["晚上", "早上", "中午", "下午"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 4), label: "古詩畫面", topic: "修辭與五言絕句", question: "「疑是地上霜」把月光看成甚麼？", hint: "找出詩句中像月光的事物。", options: ["地上的霜", "天上的雲", "河裏的水", "樹上的花"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P2", 4), label: "古詩景物", topic: "修辭與五言絕句", question: "「舉頭望明月」中，詩人抬頭看見甚麼？", hint: "直接找出詩句最後兩個字。", options: ["明月", "太陽", "白雲", "大海"], correct: 0 },
  ],
  P3: [
    { selectionGroup: primaryChineseSelectionGroup("P3", 0), label: "成語意思", topic: "詞彙、成語與字詞辨錯", question: "「專心致志」最接近下列哪一個意思？", hint: "想想做事時把注意力放在同一件事上。", options: ["集中精神做事", "很多人一起說話", "把東西排整齊", "每天都去旅行"], correct: 0 },
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
    { selectionGroup: primaryChineseSelectionGroup("P4", 1), label: "關聯詞選擇", topic: "轉折複句與進階標點", question: "「____ 路程很遠，____小敏仍然會準時到達。」填入哪一組詞最合適？", hint: "句子表示即使有困難，結果仍然不變。", options: ["雖然……但是……", "因為……所以……", "如果……就……", "一邊……一邊……"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 2), label: "寓言寓意", topic: "寓言、神話與說明文", question: "寓言中烏鴉看見水瓶裏的水很低，便把小石頭放進瓶裏喝到水。這個故事最想說明甚麼？", hint: "想想烏鴉怎樣解決困難。", options: ["遇到困難要動腦筋想辦法", "口渴時不要喝水", "石頭一定很甜", "烏鴉不會飛"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 2), label: "人物目的與受益者", topic: "寓言、神話與說明文", question: "神話故事中，后羿射下多個太陽，是為了幫助誰？", hint: "想想故事中人間遇到的困難。", options: ["受酷熱影響的百姓", "海裏的魚", "天上的星星", "森林裏的鳥"], correct: 0 },
    { selectionGroup: primaryChineseSelectionGroup("P4", 2), label: "說明方法", topic: "寓言、神話與說明文", question: "「這棵大樹約有五層樓那麼高。」主要運用了甚麼說明方法？", hint: "句子把高度和熟悉的事物作比較。", options: ["作比較", "講故事", "提問題", "寫對話"], correct: 0 },
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
    {selectionGroup:primaryChineseSelectionGroup("P5",3),label:"詞義辨析",topic:"議論與散文閱讀",question:"「校園響起琅琅書聲」中的「書聲」指甚麼？",hint:"想想誰發出讀書聲。",options:["同學朗讀的聲音","書本重量","校鐘聲","風聲"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",4),label:"律詩句數",topic:"律詩格式、文化與內容理解",question:"一首律詩通常有多少句？",hint:"律詩有固定格式。",options:["八句","四句","六句","十句"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",4),label:"律詩對仗",topic:"律詩格式、文化與內容理解",question:"律詩中兩句字數相同、詞性相近，稱為甚麼？",hint:"這是律詩特點。",options:["對仗","設問","敘述","引號"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",4),label:"律詩押韻",topic:"律詩格式、文化與內容理解",question:"詩句末尾讀音相近，主要形成甚麼？",hint:"留意朗讀聲音。",options:["押韻節奏感","改變人物","增加標點","說明地點"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",4),label:"詩歌感情",topic:"律詩格式、文化與內容理解",question:"「感時花濺淚，恨別鳥驚心」襯托甚麼？",hint:"留意「感時」和「恨別」。",options:["憂傷和離別之情","節日熱鬧","田園豐收","遊戲快樂"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P5",4),label:"詩句詞義",topic:"律詩格式、文化與內容理解",question:"「家書抵萬金」最能表現家書怎樣？",hint:"「抵萬金」表示極其珍貴。",options:["十分珍貴","毫無用處","容易取得","只值一元"],correct:0},
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
    {selectionGroup:primaryChineseSelectionGroup("P6",4),label:"宋詞畫面",topic:"古詩宋詞賞析",question:"「明月幾時有？把酒問青天。」最容易想像甚麼？",hint:"找酒和月亮。",options:["舉杯望月問天","雨中跑步","課室看書","海底游泳"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",4),label:"宋詞感情",topic:"古詩宋詞賞析",question:"「但願人長久，千里共嬋娟」表達甚麼願望？",hint:"嬋娟指明月。",options:["彼此平安共賞明月","永不回家","討厭親人","只想金錢"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",4),label:"古詩畫面",topic:"古詩宋詞賞析",question:"「大漠孤煙直，長河落日圓」描寫甚麼？",hint:"留意沙漠、河和落日。",options:["開闊壯麗邊塞景色","熱鬧市集","狹小房間","雨天課室"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",4),label:"表達效果",topic:"古詩宋詞賞析",question:"「孤、直、長、圓」描寫景物有何效果？",hint:"想這些字構成的畫面。",options:["畫面鮮明開闊","人物更多","表示問題","列出時間"],correct:0},
    {selectionGroup:primaryChineseSelectionGroup("P6",4),label:"詩詞意象",topic:"古詩宋詞賞析",question:"古詩詞明月常寄託甚麼？",hint:"結合思念親友作品。",options:["思念和祝福","憤怒打鬥","購物計劃","運動規則"],correct:0},
  ],
};


function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target]!, copy[index]!];
  }
  return copy;
}

function sourceFor(track: TrackId, grade: GradeId): QuestionSeed[] {
  if (track === "chinese-reading") return PRIMARY_CHINESE_READING_BANKS[grade]!;
  if (track === "english") return PRIMARY_ENGLISH_BANKS[grade]!;
  return PRIMARY_MATH_BANKS[grade]!;
}

function selectionGroupForSeed(track: TrackId, seed: QuestionSeed, seedIndex: number) {
  if (seed.selectionGroup) return seed.selectionGroup;
  return `${track}-${Math.floor(seedIndex / 2)}`;
}

export function buildQuestionPool(track: TrackId, grade: GradeId): AssessmentQuestion[] {
  const seeds = sourceFor(track, grade);
  return seeds.map((seed, seedIndex) => {
    const optionShift = (track === "english" || track === "math") ? seedIndex % seed.options.length : 0;
    const options = optionShift ? [...seed.options.slice(optionShift), ...seed.options.slice(0, optionShift)] : [...seed.options];
    return {
      ...seed,
      options,
      correct: (seed.correct - optionShift + seed.options.length) % seed.options.length,
      id: `${track}-${grade}-${seedIndex}-0`,
      grade,
      gradeBand: gradeBand(grade),
      selectionGroup: selectionGroupForSeed(track, seed, seedIndex),
      module: moduleForSeed(track, seed),
      difficulty: seedIndex % 5 === 4 ? "核心" : "基礎",
    };
  });
}

export function randomAssessment(track: TrackId, grade: GradeId) {
  const pool = buildQuestionPool(track, grade);
  const selectionGroups = Array.from(new Set(pool.map((question) => question.selectionGroup)));
  const questionsPerGroup = track === "english" ? 2 : 4;
  const selected = selectionGroups.flatMap((selectionGroup) => shuffle(pool.filter((question) => question.selectionGroup === selectionGroup)).slice(0, questionsPerGroup));
  return shuffle(selected).slice(0, 20);
}

export function trackForGrade(track: TrackId, grade: GradeId) {
  const gradeInfo = GRADES.find((item) => item.id === grade);
  const config = TRACKS.find((item) => item.id === track);
  return Boolean(gradeInfo && config && config.allowedStages.includes(gradeInfo.stage));
}

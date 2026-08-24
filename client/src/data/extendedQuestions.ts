/**
 * Learning Compass / 學習航圖
 * Design reminder: the question bank supports a calm, diagnostic editorial flow.
 * Each item uses a familiar context; scores guide discussion, not student labelling.
 */
export type ExtendedQuestion = {
  label: string;
  topic: string;
  question: string;
  hint: string;
  options: string[];
  correct: number;
};

export const EXTENDED_QUESTIONS: Record<string, ExtendedQuestion[]> = {
  "primary-chinese": [
    { label: "詞語理解", topic: "字詞", question: "「專心致志」最接近哪一個意思？", hint: "想想這個成語形容做事時的態度。", options: ["很有耐性地等待", "集中精神去做", "到處尋找東西", "很快完成工作"], correct: 1 },
    { label: "句子運用", topic: "句子", question: "選出用詞最合適的一句。", hint: "留意前後意思是否能配合。", options: ["天色很黑，所以太陽很猛烈。", "雖然下雨，大家仍然準時到達。", "因為我很累，但是我早睡。", "如果明天是昨天，我會去旅行。"], correct: 1 },
    { label: "標點運用", topic: "句子", question: "「媽媽說今天會很冷記得穿外套」最合適的標點是？", hint: "留意說話內容的開始和結束。", options: ["媽媽說，今天會很冷，記得穿外套。", "媽媽說今天，會很冷記得穿外套。", "媽媽說：今天會很冷，記得穿外套。", "媽媽說今天會，很冷，記得穿外套。"], correct: 2 },
    { label: "閱讀找訊息", topic: "閱讀", question: "「圖書館逢星期一休館，星期二至日開放至晚上八時。」若今天是星期一，你可否晚上去圖書館？", hint: "直接找出開放時間的資料。", options: ["可以，因為開到八時", "不可以，因為星期一休館", "可以，但只可下午去", "不可以，因為星期日才開放"], correct: 1 },
    { label: "閱讀推論", topic: "閱讀", question: "阿欣把水樽放進書包，又帶了一把雨傘才出門。最合理的推論是？", hint: "從她準備的物品推想可能的需要。", options: ["她準備外出一段時間", "她不想上學", "她要去游泳", "她一定會遲到"], correct: 0 },
    { label: "段落組織", topic: "句子", question: "要介紹一次郊遊經驗，哪個次序最合理？", hint: "想想一段經歷通常如何開始、發展和結束。", options: ["感受 → 日期地點 → 活動", "活動 → 結語 → 出發", "日期地點 → 活動經過 → 感受", "結語 → 感受 → 日期地點"], correct: 2 },
    { label: "詞語辨析", topic: "字詞", question: "下列哪一個量詞最適合「雨」？", hint: "想想日常描述雨勢時的說法。", options: ["一陣雨", "一張雨", "一支雨", "一條雨"], correct: 0 },
    { label: "閱讀主旨", topic: "閱讀", question: "一篇文章先寫分類回收方法，再寫減少塑膠使用，最後呼籲大家由生活小事做起。文章主旨最可能是？", hint: "主旨概括整篇文章最想帶出的重點。", options: ["介紹塑膠的製作方法", "呼籲實踐環保生活", "比較不同回收箱顏色", "描述一次旅行"], correct: 1 },
    { label: "句子連接", topic: "句子", question: "「我先完成溫習，____ 去公園跟朋友踢球。」填入哪個詞最通順？", hint: "留意兩個動作的先後關係。", options: ["然後", "雖然", "但是", "因為"], correct: 0 },
    { label: "表達選擇", topic: "句子", question: "要有禮貌地請同學借尺，哪一句最合適？", hint: "請求時要有稱呼和禮貌用語。", options: ["給我你的尺。", "你的尺很差。", "請問可以借你的尺給我用一用嗎？", "你一定要借我。"], correct: 2 },
  ],
  "primary-english": [
    { label: "詞彙", topic: "詞彙", question: "Which word is the opposite of “early”?", hint: "Think about time and arriving. ", options: ["late", "fast", "quiet", "small"], correct: 0 },
    { label: "基本文法", topic: "文法", question: "There ____ three apples on the table.", hint: "The noun is plural.", options: ["is", "are", "was", "be"], correct: 1 },
    { label: "時態", topic: "文法", question: "Last Sunday, Tom ____ to his grandmother’s home.", hint: "The sentence tells us about the past.", options: ["go", "goes", "went", "going"], correct: 2 },
    { label: "閱讀找訊息", topic: "閱讀", question: "“The school picnic starts at 9 a.m. at the playground.” Where should students meet?", hint: "Find the place stated in the sentence.", options: ["At the library", "At the playground", "At the bus stop", "At home"], correct: 1 },
    { label: "閱讀推論", topic: "閱讀", question: "Ben wore a coat and gloves before leaving home. What was the weather probably like?", hint: "Use the clothes as a clue.", options: ["Hot", "Windy and cold", "Very sunny", "Stormy at sea"], correct: 1 },
    { label: "問句組織", topic: "語序", question: "Choose the correct question.", hint: "Questions often begin with a question word or helping verb.", options: ["Where you live?", "Where do you live?", "Where live you?", "Do where you live?"], correct: 1 },
    { label: "詞彙語境", topic: "詞彙", question: "We use a ____ to cut paper.", hint: "Think of a common classroom tool.", options: ["ruler", "scissors", "eraser", "notebook"], correct: 1 },
    { label: "句子連接", topic: "語序", question: "I stayed at home ____ it was raining.", hint: "The second part gives a reason.", options: ["but", "because", "or", "so"], correct: 1 },
    { label: "閱讀主旨", topic: "閱讀", question: "A notice tells students to bring reusable bottles and reduce waste on Sports Day. What is its main purpose?", hint: "Think about what the writer wants students to do.", options: ["Sell new bottles", "Promote an eco-friendly event", "Cancel Sports Day", "Teach a new sport"], correct: 1 },
    { label: "句子準確度", topic: "文法", question: "Choose the correct sentence.", hint: "Check the verb after “can”.", options: ["She can sings well.", "She can sing well.", "She can singing well.", "She can to sing well."], correct: 1 },
  ],
  "primary-math": [
    { label: "數感與運算", topic: "運算", question: "125 − 68 = ?", hint: "You may subtract tens and ones step by step.", options: ["47", "57", "67", "77"], correct: 1 },
    { label: "小數運算", topic: "運算", question: "3.5 + 1.2 = ?", hint: "Line up the decimal points.", options: ["4.7", "4.17", "3.7", "5.2"], correct: 0 },
    { label: "分數比較", topic: "分數", question: "哪一個分數較大？", hint: "分母相同時，可比較分子。", options: ["3/8", "5/8", "兩個一樣", "無法比較"], correct: 1 },
    { label: "量度", topic: "量度", question: "1 小時 35 分鐘共有多少分鐘？", hint: "先把小時轉成分鐘。", options: ["95", "105", "135", "155"], correct: 0 },
    { label: "圖形", topic: "圖形", question: "正方形有幾條相等的邊？", hint: "想想正方形的基本特徵。", options: ["2", "3", "4", "5"], correct: 2 },
    { label: "文字題", topic: "文字題", question: "文具店一支筆 $6，小美買了 4 支，要付多少元？", hint: "先找出每件價錢和數量。", options: ["$10", "$18", "$24", "$30"], correct: 2 },
    { label: "資料處理", topic: "文字題", question: "三天各讀了 12、15、9 頁書，一共讀了多少頁？", hint: "把三天的頁數相加。", options: ["24", "27", "36", "45"], correct: 2 },
    { label: "分數應用", topic: "分數", question: "一個薄餅平均分成 8 份，吃了 3 份，還剩多少份？", hint: "由總份數減去已吃的份數。", options: ["3", "5", "8", "11"], correct: 1 },
    { label: "圖形應用", topic: "圖形", question: "一個三角形有兩個角是 50° 和 60°，第三個角是多少？", hint: "三角形三個內角和是 180°。", options: ["60°", "70°", "80°", "90°"], correct: 1 },
    { label: "多步驟解題", topic: "文字題", question: "有 30 粒糖，平均分給 5 位小朋友後，再剩下 5 粒。每人分到多少粒？", hint: "先扣除剩下的糖，再平均分。", options: ["4", "5", "6", "7"], correct: 1 },
  ],
  "secondary-interview": [
    { label: "自我介紹", topic: "自我介紹", question: "自我介紹時，哪一項資料最值得優先加入？", hint: "選擇能讓別人認識你而又有條理的內容。", options: ["自己最喜歡的零食品牌", "姓名、學校、興趣和一個具體經驗", "所有家人的名字", "背誦一大段網上資料"], correct: 1 },
    { label: "聆聽", topic: "應對", question: "面試官的問題聽不清楚，最合適的做法是？", hint: "有禮地確認問題比猜測答案更好。", options: ["隨便回答", "請對方重複或換個說法", "保持沉默直到結束", "請朋友替你回答"], correct: 1 },
    { label: "表達結構", topic: "表達", question: "回答「你的興趣是甚麼？」時，哪種方法最有條理？", hint: "具體例子能讓答案更完整。", options: ["只說「很多」", "說出興趣、原因和一個例子", "重複問題", "立即轉換話題"], correct: 1 },
    { label: "情境應對", topic: "應對", question: "如果你在小組活動中有不同意見，較合適的做法是？", hint: "想想如何尊重別人同時表達想法。", options: ["大聲打斷所有人", "先聽完，再說明自己的理由", "完全不發言", "離開小組"], correct: 1 },
    { label: "小組協作", topic: "協作", question: "小組要在短時間完成海報，你可以怎樣幫忙？", hint: "好的協作包括分工和互相支援。", options: ["只等別人做完", "提議分工並完成自己負責的部分", "批評每個人的想法", "把材料藏起來"], correct: 1 },
    { label: "學校認識", topic: "應對", question: "面試前了解學校資料，最主要有甚麼幫助？", hint: "想想如何把自己的興趣連結到學校。", options: ["可以背誦校長名字", "可更具體說明自己想參與的學習機會", "不需要準備其他問題", "保證一定被取錄"], correct: 1 },
    { label: "自我反思", topic: "自我介紹", question: "被問到一項需要改善的地方，較好的回答是？", hint: "真誠和提出改善方法同樣重要。", options: ["我沒有任何要改善的地方", "說出一項可改善之處和正在嘗試的方法", "批評其他同學", "拒絕回答所有問題"], correct: 1 },
    { label: "表達禮儀", topic: "表達", question: "以下哪種身體語言較能支持清晰表達？", hint: "選擇自然和尊重的做法。", options: ["自然坐好、望向說話的人", "不停望電話", "交叉雙臂並背向大家", "一直搖頭"], correct: 0 },
    { label: "情境判斷", topic: "協作", question: "隊友提出的想法和你不同，你應先做甚麼？", hint: "先理解對方，再作建設性回應。", options: ["說他的想法一定錯", "問清楚他的理由", "立刻離開討論", "故意不聽"], correct: 1 },
    { label: "回答延伸", topic: "表達", question: "怎樣可把「我喜歡閱讀」變成較完整的面試答案？", hint: "加入具體閱讀類型和個人收穫。", options: ["重複說十次喜歡閱讀", "說明喜歡的書類和從中學到甚麼", "只說「不知道」", "要求轉題"], correct: 1 },
  ],
  "junior-chinese": [
    { label: "字詞辨析", topic: "字詞", question: "「一絲不苟」最接近哪一個意思？", hint: "留意成語形容做事的細緻程度。", options: ["非常隨意", "做事認真細心", "動作很快", "說話很少"], correct: 1 },
    { label: "文言基礎", topic: "文言", question: "「吾日三省吾身」中的「省」最接近哪一個意思？", hint: "放進整句理解。", options: ["節省", "反省", "省略", "省份"], correct: 1 },
    { label: "閱讀找訊息", topic: "閱讀", question: "文章提到學校把午飯廚餘製成堆肥，並用於校園花圃。這項做法主要把甚麼轉化為資源？", hint: "直接找出前後兩項事物。", options: ["紙張和塑膠", "廚餘和花圃養分", "雨水和電力", "書本和文具"], correct: 1 },
    { label: "閱讀推論", topic: "閱讀", question: "一位學生每次小組討論後都記下自己未聽清楚的地方，下一次主動提問。這反映他怎樣的學習態度？", hint: "從行動推想態度。", options: ["逃避問題", "願意反思和改善", "只重視分數", "不喜歡合作"], correct: 1 },
    { label: "修辭", topic: "修辭", question: "「書本是通往世界的窗戶」主要運用了甚麼手法？", hint: "一個事物被比作另一個事物。", options: ["擬人", "比喻", "排比", "設問"], correct: 1 },
    { label: "寫作組織", topic: "寫作", question: "寫議論段落時，哪個次序最清晰？", hint: "留意論點與例子的關係。", options: ["例子 → 不同主題 → 論點", "論點 → 理由或例子 → 小結", "小結 → 新主題 → 問號", "只列出形容詞"], correct: 1 },
    { label: "文言理解", topic: "文言", question: "「不恥下問」表達哪種學習態度？", hint: "「恥」在這裏指覺得羞愧。", options: ["不願提問", "不以向人請教為恥", "只問容易問題", "不需要老師"], correct: 1 },
    { label: "語境運用", topic: "字詞", question: "下列哪個詞最適合形容安排得十分周全？", hint: "選擇有「考慮周到」意思的詞。", options: ["草率", "妥善", "含糊", "急促"], correct: 1 },
    { label: "閱讀主旨", topic: "閱讀", question: "一篇文章比較紙本筆記和電子筆記，最後指出應按需要選擇最適合的工具。主旨是？", hint: "找出作者最終的中心觀點。", options: ["電子工具一定較好", "紙本工具應被淘汰", "應按學習需要選擇工具", "筆記不需要整理"], correct: 2 },
    { label: "段落銜接", topic: "寫作", question: "「閱讀能增加知識。____，它也能培養同理心。」填入哪個連接詞較合適？", hint: "後句補充另一個好處。", options: ["此外", "然而", "因此", "即使"], correct: 0 },
  ],
  "junior-english": [
    { label: "Vocabulary in context", topic: "詞彙", question: "If a task is “challenging”, it is likely to be ____.", hint: "Think about something that needs effort.", options: ["very easy", "difficult but possible", "not important", "already finished"], correct: 1 },
    { label: "Grammar", topic: "文法", question: "Neither Amy nor her friends ____ late for class.", hint: "The verb agrees with the subject closest to it.", options: ["is", "are", "was", "be"], correct: 1 },
    { label: "Tense", topic: "時態", question: "By the time we arrived, the film ____.", hint: "One past action happened before another past action.", options: ["starts", "has started", "had started", "will start"], correct: 2 },
    { label: "Reading detail", topic: "閱讀", question: "A school notice says club registration closes on 15 September. A student applies on 16 September. What is most likely?", hint: "Use the date in the notice. ", options: ["The application is late", "The club has just opened", "The student has two weeks left", "The date does not matter"], correct: 0 },
    { label: "Reading inference", topic: "閱讀", question: "Leo revised his draft after his teacher underlined two unclear sentences. What can we infer?", hint: "Think about why he made changes.", options: ["He wanted to improve clarity", "He had no homework", "He disliked writing", "He changed schools"], correct: 0 },
    { label: "Sentence connection", topic: "連接", question: "Mia brought a jacket, ____ the weather forecast said it might turn cold.", hint: "The second clause gives a reason.", options: ["although", "because", "unless", "while"], correct: 1 },
    { label: "Relative clauses", topic: "文法", question: "The book ____ I borrowed from the library is about space.", hint: "The missing word refers to a thing. ", options: ["who", "which", "where", "when"], correct: 1 },
    { label: "Word choice", topic: "詞彙", question: "A reliable friend is someone you can ____.", hint: "Choose the phrase that means depend on. ", options: ["look after", "count on", "give up", "turn off"], correct: 1 },
    { label: "Reading purpose", topic: "閱讀", question: "An article lists ways to save electricity at home and ends with a checklist. Its main purpose is to ____.", hint: "Think about what the writer encourages readers to do.", options: ["tell a fictional story", "help readers change daily habits", "advertise a game", "describe a holiday"], correct: 1 },
    { label: "Accuracy", topic: "時態", question: "Choose the correct sentence.", hint: "Check the verb after “has”.", options: ["She has finish her project.", "She has finished her project.", "She has finishing her project.", "She has to finished her project."], correct: 1 },
  ],
  "junior-math": [
    { label: "代數", topic: "代數", question: "5x − 7 = 18，x = ?", hint: "先加 7，再除以 5。", options: ["4", "5", "6", "7"], correct: 1 },
    { label: "比例", topic: "分數", question: "把 2:3 化成等值比，哪一個正確？", hint: "兩個數同時乘以相同數。", options: ["4:5", "4:6", "3:5", "6:8"], correct: 1 },
    { label: "幾何", topic: "幾何", question: "一個平行四邊形底為 9 cm、高為 4 cm，面積是多少？", hint: "平行四邊形面積 = 底 × 高。", options: ["13 cm²", "18 cm²", "26 cm²", "36 cm²"], correct: 3 },
    { label: "百分比", topic: "百分比", question: "一件貨品原價 $200，減價 15%，售價是多少？", hint: "先找出減價金額，再由原價扣除。", options: ["$150", "$170", "$185", "$215"], correct: 1 },
    { label: "數據處理", topic: "數據", question: "數據 4、7、7、9、13 的中位數是多少？", hint: "把數據由小至大排列，找中間數。", options: ["4", "7", "8", "9"], correct: 1 },
    { label: "多步驟解題", topic: "代數", question: "某數的兩倍加 6 等於 20。這個數是多少？", hint: "把未知數設為 x，列出方程。", options: ["6", "7", "8", "10"], correct: 1 },
    { label: "分數運算", topic: "分數", question: "3/4 − 1/6 = ?", hint: "先找共同分母。", options: ["5/12", "7/12", "2/8", "1/2"], correct: 1 },
    { label: "幾何推理", topic: "幾何", question: "圓的直徑是 10 cm，半徑是多少？", hint: "半徑是直徑的一半。", options: ["2 cm", "5 cm", "10 cm", "20 cm"], correct: 1 },
    { label: "數據應用", topic: "數據", question: "一班 20 人中有 8 人步行上學，步行的百分比是多少？", hint: "部分 ÷ 總數 × 100%。", options: ["20%", "30%", "40%", "60%"], correct: 2 },
    { label: "代數化簡", topic: "代數", question: "3a + 2a − a 化簡後是？", hint: "合併同類項。", options: ["4a", "5a", "6a", "a²"], correct: 0 },
  ],
  "junior-science": [
    { label: "科學探究", topic: "探究", question: "研究光照時間對植物生長的影響時，應量度哪一項結果？", hint: "找出會隨實驗改變的量。", options: ["植物高度", "花盆顏色", "標籤字體", "觀察者名字"], correct: 0 },
    { label: "生命科學", topic: "生命", question: "細胞膜的主要作用是甚麼？", hint: "想想細胞和外界之間的界面。", options: ["控制物質進出細胞", "製造所有能量", "儲存所有遺傳物質", "使細胞變成骨骼"], correct: 0 },
    { label: "能量", topic: "能量", question: "電燈發亮時，主要把電能轉化成甚麼？", hint: "注意燈泡的主要輸出。", options: ["光能和熱能", "核能和風能", "化學能和位能", "只產生聲能"], correct: 0 },
    { label: "物質", topic: "物質", question: "把鹽加入水中並攪拌，鹽消失在水中，形成的是？", hint: "想想混合後是否均勻。", options: ["溶液", "元素", "金屬", "真空"], correct: 0 },
    { label: "力與運動", topic: "力學", question: "物件受到的合力為零時，最合理的描述是？", hint: "想想平衡力對運動狀態的影響。", options: ["一定加速", "可靜止或保持勻速直線運動", "一定停止", "一定向上移動"], correct: 1 },
    { label: "科學解釋", topic: "探究", question: "要讓實驗結果更可靠，最合適的做法是？", hint: "想想如何減少偶然誤差。", options: ["只做一次就下結論", "重複實驗並比較結果", "改變多個因素", "忽略不符合預期的數據"], correct: 1 },
    { label: "生命科學", topic: "生命", question: "食物鏈中，綠色植物通常是甚麼角色？", hint: "它們能利用光能製造養分。", options: ["生產者", "消費者", "分解者", "捕食者"], correct: 0 },
    { label: "物質量度", topic: "物質", question: "密度相同的物質，體積增加一倍時，質量會怎樣？", hint: "密度 = 質量 ÷ 體積。", options: ["減半", "不變", "增加一倍", "變成零"], correct: 2 },
    { label: "能量應用", topic: "能量", question: "彈弓被拉長後未放手時，主要儲存哪種能量？", hint: "想想物件因形狀改變而儲存的能量。", options: ["彈性勢能", "光能", "聲能", "核能"], correct: 0 },
    { label: "力學應用", topic: "力學", question: "騎單車時按煞車，單車慢下來主要因為甚麼？", hint: "注意接觸面之間的作用。", options: ["摩擦力", "浮力", "磁力", "重力消失"], correct: 0 },
  ],
};

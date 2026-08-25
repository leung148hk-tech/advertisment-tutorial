/** Exam-focused question seeds for Hong Kong junior secondary school assessments. */
export type SecondaryExamTrack = "chinese-reading" | "chinese-writing" | "english-reading" | "english-writing" | "math" | "science";
export type SecondaryExamSeed = { label: string; topic: string; question: string; hint: string; options: string[]; correct: number };
type Level = "S1" | "S2" | "S3";

const chineseLevel = {
  S1: { word: "妥當", meaning: "合適而周全", modern: "班長先聽取同學意見，再安排活動細節。", classical: "學而時習之，不亦說乎", theme: "一次小組合作經驗" },
  S2: { word: "顧及", meaning: "考慮到各方面", modern: "作者比較不同資料後，才提出自己的看法。", classical: "溫故而知新，可以為師矣", theme: "我對校園生活的觀察" },
  S3: { word: "審視", meaning: "仔細檢查和思考", modern: "文章先列出現象，再分析原因和影響。", classical: "三人行，必有我師焉", theme: "一個影響我的選擇" },
} as const;

const englishLevel = {
  S1: { subject: "Alex", verb: "has finished", noun: "school project", adjective: "careful", theme: "a class activity" },
  S2: { subject: "Mia", verb: "had prepared", noun: "presentation", adjective: "responsible", theme: "a community event" },
  S3: { subject: "Jordan", verb: "has evaluated", noun: "proposal", adjective: "effective", theme: "an environmental campaign" },
} as const;

function chineseReading(level: Level): SecondaryExamSeed[] {
  const item = chineseLevel[level];
  return [
    { label: "語基與詞語", topic: "語基與詞語", question: `「${item.word}」最接近下列哪一個意思？`, hint: "從詞語在句子中的作用判斷。", options: [item.meaning, "非常匆忙", "完全忽略", "聲音響亮"], correct: 0 },
    { label: "詞語運用", topic: "語基與詞語", question: `下列哪一句最適合使用「${item.word}」？`, hint: "選擇語意和語境最配合的一句。", options: ["他只憑印象作決定。", "她先了解不同需要，再作出安排。", "雨聲十分響亮。", "操場非常寬闊。"], correct: 1 },
    { label: "現代文理解", topic: "現代文閱讀", question: `${item.modern} 這段文字主要說明人物具備甚麼做事方式？`, hint: "從人物行動歸納態度。", options: ["有條理並重視根據", "只重視速度", "拒絕溝通", "沒有計劃"], correct: 0 },
    { label: "主旨與證據", topic: "現代文閱讀", question: "閱讀說明文時，哪一種做法最能支持「作者重視資料」這個判斷？", hint: "答案應回應作者的寫作方法。", options: ["找出作者引用的例子或數據", "只看篇幅長短", "只數標點符號", "只記人物姓名"], correct: 0 },
    { label: "文言實詞", topic: "文言基礎", question: `「${item.classical}」中的「說」最接近哪一個意思？`, hint: "留意常見文言字在古今的不同用法。", options: ["喜悅", "說話", "解說", "小說"], correct: 0 },
    { label: "文言句意", topic: "文言基礎", question: "「溫故而知新」主要強調哪一種學習方法？", hint: "從『溫故』和『知新』的關係理解。", options: ["複習舊知識以獲得新理解", "只學習新內容", "避免溫習", "只背誦答案"], correct: 0 },
    { label: "修辭與表達", topic: "修辭與表達", question: "「城市在晨光中慢慢醒來」主要運用了甚麼修辭手法？", hint: "留意城市被寫成像人一樣。", options: ["擬人", "反問", "排比", "對偶"], correct: 0 },
    { label: "表達效果", topic: "修辭與表達", question: "運用具體例子來支持觀點，主要有甚麼作用？", hint: "想想讀者如何理解抽象觀點。", options: ["令觀點更具體可信", "令句子更短", "避免說明原因", "取代所有結論"], correct: 0 },
    { label: "篇章整合", topic: "篇章與寫作組織", question: `若以「${item.theme}」為題，哪個段落安排最有條理？`, hint: "留意觀點、例子和反思的關係。", options: ["交代事件、舉例說明、回應感受和反思", "隨意列出詞語", "重複同一句話", "只寫結語"], correct: 0 },
    { label: "觀點回應", topic: "篇章與寫作組織", question: "評論文章時，哪一項最能顯示有根據的回應？", hint: "先提出看法，再引用文中內容解釋。", options: ["說明觀點並連結文本證據", "只說喜歡或不喜歡", "重抄整段文字", "不回應題目"], correct: 0 },
  ];
}

function chineseWriting(level: Level): SecondaryExamSeed[] {
  const item = chineseLevel[level];
  return [
    { label: "語基與詞語", topic: "語基與詞語", question: `要形容做事${item.meaning}，哪個詞最合適？`, hint: "選擇精確描述人物態度的詞。", options: [item.word, "草率", "混亂", "浮誇"], correct: 0 },
    { label: "病句辨識", topic: "語基與詞語", question: "下列哪一句沒有語病？", hint: "留意主語、動詞和賓語是否配合。", options: ["同學們積極討論並提出建議。", "我把意見被老師聽取。", "這個問題十分很複雜。", "我們完成了已經活動。"], correct: 0 },
    { label: "段落組織", topic: "篇章與寫作組織", question: `寫「${item.theme}」時，哪一句最適合作段落中心句？`, hint: "中心句要直接點出段落觀點。", options: [`這次經驗令我重新思考做決定時應重視的原則。`, "那天有很多人。", "我看見一張桌子。", "時間過得很快。"], correct: 0 },
    { label: "例子支援", topic: "篇章與寫作組織", question: "哪一個例子最能支持「溝通有助解決分歧」？", hint: "選擇能直接回應觀點的事例。", options: ["小組先聽取不同意見，再訂出共同方案。", "大家各自離開。", "天氣突然轉冷。", "課室有很多窗。"], correct: 0 },
    { label: "修辭運用", topic: "修辭與表達", question: "哪一句運用了比喻？", hint: "比喻把一樣事物比作另一樣事物。", options: ["記憶像一本隨時可翻閱的書。", "雨下得很大。", "我走進課室。", "同學正在討論。"], correct: 0 },
    { label: "語氣選擇", topic: "修辭與表達", question: "給校長的建議書，哪一種語氣最合適？", hint: "要有禮、清楚並提出理由。", options: ["建議學校考慮增設閱讀時段，讓同學有較穩定的閱讀機會。", "你一定要照做。", "這件事很差。", "我不想解釋。"], correct: 0 },
    { label: "內容發展", topic: "寫作發展", question: "要把「我學會承擔責任」寫得更具體，應加入甚麼？", hint: "具體行動和結果能令內容更有說服力。", options: ["我如何處理困難、作出甚麼行動和從中得到甚麼反思", "只重複題目", "只寫天氣", "只列形容詞"], correct: 0 },
    { label: "觀點深化", topic: "寫作發展", question: "議論段落中，觀點後最適合加入甚麼？", hint: "完整段落通常需要理由或例子支持。", options: ["理由、例子和回扣觀點", "不相關的故事", "完全相反的結論", "空白句子"], correct: 0 },
    { label: "修訂表達", topic: "修訂與應試", question: "完成文章後，哪一項修訂最有助提高考試表現？", hint: "檢查是否回應題目和段落是否連貫。", options: ["檢查中心句、例子、連接詞和結語是否呼應題目", "只數字數", "刪除所有標點", "把每句改成問句"], correct: 0 },
    { label: "應試策略", topic: "修訂與應試", question: "限時寫作前，哪一個步驟最合適？", hint: "先規劃能避免寫作時偏題。", options: ["先列出立場、兩個重點和例子，再分配時間寫作", "立即寫結語", "只背誦題目", "不看題目要求"], correct: 0 },
  ];
}

function englishReading(level: Level): SecondaryExamSeed[] {
  const item = englishLevel[level];
  return [
    { label: "Grammar and tense", topic: "Grammar and tense", question: `${item.subject} ____ the ${item.noun} before the meeting started.`, hint: "Use the tense that matches the completed action.", options: [item.verb, "finish", "finishes", "finishing"], correct: 0 },
    { label: "Grammar and tense", topic: "Grammar and tense", question: "If the evidence ____ clear, the team will revise its conclusion.", hint: "Use the present form in this first conditional clause.", options: ["is not", "will not be", "was not", "not being"], correct: 0 },
    { label: "Vocabulary in context", topic: "Vocabulary and context", question: `A ${item.adjective} student is likely to ____ .`, hint: "Choose the action that matches the adjective.", options: ["complete tasks carefully and reliably", "ignore all instructions", "arrive without preparation", "avoid every responsibility"], correct: 0 },
    { label: "Vocabulary in context", topic: "Vocabulary and context", question: "The word ‘contrast’ in a reading passage is closest in meaning to ____ .", hint: "Think about comparing differences.", options: ["compare differences", "repeat exactly", "hide information", "make smaller"], correct: 0 },
    { label: "Reading detail", topic: "Reading comprehension", question: `A notice says registration for ${item.theme} closes at 3:45 p.m. What should students do?`, hint: "Find the exact required action and time.", options: ["Register by 3:45 p.m.", "Arrive after 4:00 p.m.", "Wait for the next day", "Ignore the notice"], correct: 0 },
    { label: "Reading inference", topic: "Reading comprehension", question: `${item.subject} checked several sources before making a decision. What can we infer?`, hint: "Use the action as evidence.", options: ["The student wanted a well-supported decision", "The student had no interest", "The sources were missing", "The task was cancelled"], correct: 0 },
    { label: "Text connection", topic: "Text organisation", question: "The writer presents a problem, gives two examples, and then suggests a solution. How is the text organised?", hint: "Look at the sequence of ideas.", options: ["Problem–evidence–solution", "Time order only", "A dialogue", "A list of definitions"], correct: 0 },
    { label: "Text connection", topic: "Text organisation", question: "Which connector best completes the sentence? ‘The evidence was limited; ____, the conclusion should be treated carefully.’", hint: "The second clause is a result.", options: ["therefore", "although", "unless", "meanwhile"], correct: 0 },
    { label: "Writer purpose", topic: "Integrated reading", question: `A webpage gives facts, examples and action steps for ${item.theme}. Its main purpose is to ____ .`, hint: "Consider what the writer wants readers to understand or do.", options: ["inform and encourage action", "tell a fictional story", "advertise a uniform", "describe a holiday"], correct: 0 },
    { label: "Evidence selection", topic: "Integrated reading", question: "Which detail best supports the statement that a project was successful?", hint: "Choose evidence, not a general opinion.", options: ["It achieved its planned goal and participants gave specific positive feedback.", "It happened on a Tuesday.", "The room had windows.", "The poster used blue ink."], correct: 0 },
    { label: "Exam technique", topic: "Integrated reading", question: "Before answering an inference question, which strategy is most effective?", hint: "Inference requires evidence from the passage.", options: ["Underline clues and connect them to the question.", "Choose the longest option immediately.", "Ignore the passage.", "Translate every word first."], correct: 0 },
  ];
}

function englishWriting(level: Level): SecondaryExamSeed[] {
  const item = englishLevel[level];
  return [
    { label: "Grammar and tense", topic: "Grammar and tense", question: `${item.subject} ____ the report yesterday.`, hint: "The time marker requires a past-tense verb.", options: ["completed", "complete", "completes", "completing"], correct: 0 },
    { label: "Sentence accuracy", topic: "Grammar and tense", question: "Choose the grammatically correct sentence.", hint: "Check subject–verb agreement.", options: ["Each student has a clear role.", "Each student have a clear role.", "Each students has a clear role.", "Each student having a clear role."], correct: 0 },
    { label: "Word choice", topic: "Vocabulary and context", question: "Which word best completes the sentence? ‘The proposal is ____ because it gives clear steps and evidence.’", hint: "Choose a word that matches the positive context.", options: ["effective", "careless", "silent", "ordinary"], correct: 0 },
    { label: "Register", topic: "Vocabulary and context", question: "Which sentence is most suitable for a formal email to a teacher?", hint: "Use polite, clear language.", options: ["Could you please clarify the deadline for the assignment?", "Tell me the deadline now.", "I do not care about it.", "Your instructions are bad."], correct: 0 },
    { label: "Paragraph organisation", topic: "Paragraph organisation", question: `Which topic sentence best introduces a paragraph about ${item.theme}?`, hint: "The sentence should state the central idea.", options: [`${item.theme} can help students develop responsibility and cooperation.`, "The room has a clock.", "I have a bag.", "Wednesday is a day."], correct: 0 },
    { label: "Supporting detail", topic: "Paragraph organisation", question: "Which sentence best supports the idea that planning improves a project?", hint: "Select a specific supporting example.", options: ["The group assigned roles, set deadlines, and completed each stage on time.", "Planning is important.", "Some projects are difficult.", "Everyone has ideas."], correct: 0 },
    { label: "Cohesion", topic: "Writing expression", question: "I compared the evidence carefully. ____ , I revised my conclusion.", hint: "The second sentence follows from the first.", options: ["As a result", "Although", "Unless", "Instead of"], correct: 0 },
    { label: "Writing expression", topic: "Writing expression", question: "Which revision makes ‘The activity was good’ more precise?", hint: "Use a concrete outcome.", options: ["The activity helped students present evidence and respond to questions confidently.", "The activity was good good.", "The activity happened.", "It was nice."], correct: 0 },
    { label: "Editing", topic: "Editing and exam technique", question: "Which sentence needs correction?", hint: "Check parallel structure.", options: ["Students can research, discuss, and present their findings.", "Students can research, discussing, and present findings.", "Students research the topic carefully.", "Students presented their ideas."], correct: 1 },
    { label: "Exam technique", topic: "Editing and exam technique", question: "Before writing a composition, which step best prevents going off-topic?", hint: "Plan the response around the task requirements.", options: ["List the purpose, audience, key points and supporting examples.", "Write the conclusion first without reading the task.", "Use difficult words only.", "Skip planning completely."], correct: 0 },
  ];
}

const maths: Record<Level, SecondaryExamSeed[]> = {
  S1: [
    { label: "Algebraic terms", topic: "Number and algebra", question: "Simplify 3a + 5a − 2.", hint: "Collect like terms only.", options: ["8a − 2", "8a", "15a − 2", "6a − 2"], correct: 0 }, { label: "Linear equation", topic: "Number and algebra", question: "Solve 4x − 3 = 17.", hint: "Undo subtraction before division.", options: ["4", "5", "7", "20"], correct: 1 },
    { label: "Ratio", topic: "Ratio and percentage", question: "Simplify the ratio 18:24.", hint: "Divide both terms by their highest common factor.", options: ["3:4", "6:8", "9:12", "2:3"], correct: 0 }, { label: "Percentage", topic: "Ratio and percentage", question: "Find 15% of 240.", hint: "Convert the percentage to a decimal or fraction.", options: ["24", "30", "36", "45"], correct: 2 },
    { label: "Angles", topic: "Geometry and measure", question: "Two angles on a straight line are x and 112°. Find x.", hint: "Angles on a straight line add to 180°.", options: ["58°", "68°", "78°", "292°"], correct: 1 }, { label: "Area", topic: "Geometry and measure", question: "Find the area of a triangle with base 12 cm and height 7 cm.", hint: "Use 1/2 × base × height.", options: ["19 cm²", "42 cm²", "84 cm²", "96 cm²"], correct: 1 },
    { label: "Mean", topic: "Statistics and data", question: "Find the mean of 5, 7, 8 and 12.", hint: "Add the values, then divide by the number of values.", options: ["7", "8", "8.5", "32"], correct: 1 }, { label: "Data reading", topic: "Statistics and data", question: "A bar chart shows 18 students chose A and 11 chose B. How many more chose A?", hint: "Find the difference.", options: ["7", "11", "18", "29"], correct: 0 },
    { label: "Word problem", topic: "Multi-step application", question: "A taxi charges $24 plus $6 per kilometre. What is the cost of a 5 km trip?", hint: "Use fixed charge + distance charge.", options: ["$30", "$54", "$120", "$150"], correct: 1 }, { label: "Problem solving", topic: "Multi-step application", question: "A number is doubled and then increased by 7 to give 31. Find the number.", hint: "Work backwards or form an equation.", options: ["10", "12", "15", "19"], correct: 1 },
  ],
  S2: [
    { label: "Expansion", topic: "Number and algebra", question: "Expand (x + 3)(x − 2).", hint: "Multiply each term in the first bracket by each term in the second.", options: ["x² + x − 6", "x² + 5x − 6", "x² − x − 6", "x² − 6"], correct: 0 }, { label: "Simultaneous equations", topic: "Number and algebra", question: "If x + y = 9 and x − y = 3, find x.", hint: "Add the equations to eliminate y.", options: ["3", "4", "6", "12"], correct: 2 },
    { label: "Percentage change", topic: "Ratio and percentage", question: "A price rises from $80 to $92. What is the percentage increase?", hint: "Increase ÷ original × 100%.", options: ["12%", "15%", "20%", "115%"], correct: 1 }, { label: "Direct proportion", topic: "Ratio and percentage", question: "y is directly proportional to x. If y=18 when x=6, find y when x=10.", hint: "Find the constant of proportionality first.", options: ["24", "28", "30", "36"], correct: 2 },
    { label: "Pythagoras", topic: "Geometry and measure", question: "A right-angled triangle has shorter sides 6 cm and 8 cm. Find the hypotenuse.", hint: "Use a² + b² = c².", options: ["10 cm", "12 cm", "14 cm", "48 cm"], correct: 0 }, { label: "Volume", topic: "Geometry and measure", question: "Find the volume of a cuboid 5 cm by 4 cm by 3 cm.", hint: "Multiply length, width and height.", options: ["12 cm³", "20 cm³", "47 cm³", "60 cm³"], correct: 3 },
    { label: "Probability", topic: "Statistics and data", question: "A bag has 3 red and 5 blue counters. Find P(red).", hint: "Favourable outcomes ÷ total outcomes.", options: ["3/5", "3/8", "5/8", "8/3"], correct: 1 }, { label: "Median", topic: "Statistics and data", question: "Find the median of 4, 6, 7, 9, 11.", hint: "Arrange values and find the middle one.", options: ["6", "7", "8", "9"], correct: 1 },
    { label: "Linear model", topic: "Multi-step application", question: "A mobile plan costs $40 plus $0.5 per message. Write an expression for m messages.", hint: "Use fixed cost + variable cost.", options: ["40m + 0.5", "40 + 0.5m", "0.5(40 + m)", "40 − 0.5m"], correct: 1 }, { label: "Problem solving", topic: "Multi-step application", question: "A rectangle has perimeter 34 cm and length 10 cm. Find its width.", hint: "2l + 2w = perimeter.", options: ["5 cm", "7 cm", "12 cm", "17 cm"], correct: 1 },
  ],
  S3: [
    { label: "Factorisation", topic: "Number and algebra", question: "Factorise x² − 9.", hint: "This is a difference of two squares.", options: ["(x − 3)(x + 3)", "(x − 9)(x + 1)", "x(x − 9)", "(x − 3)²"], correct: 0 }, { label: "Quadratic equation", topic: "Number and algebra", question: "Solve x² − 5x = 0.", hint: "Factorise before solving.", options: ["x=0 or 5", "x=−5 only", "x=5 only", "x=25"], correct: 0 },
    { label: "Compound percentage", topic: "Ratio and percentage", question: "A $200 item is reduced by 10%. Find the sale price.", hint: "Find 90% of the original price.", options: ["$20", "$180", "$190", "$220"], correct: 1 }, { label: "Rates", topic: "Ratio and percentage", question: "A car travels 150 km in 2.5 h. Find its average speed.", hint: "Speed = distance ÷ time.", options: ["50 km/h", "60 km/h", "75 km/h", "375 km/h"], correct: 1 },
    { label: "Circle geometry", topic: "Geometry and measure", question: "The angle at the centre is 100°. What is the angle at the circumference standing on the same arc?", hint: "The angle at the centre is twice the angle at the circumference.", options: ["25°", "50°", "100°", "200°"], correct: 1 }, { label: "Trigonometry", topic: "Geometry and measure", question: "In a right triangle, opposite=6 and hypotenuse=10. Find sin θ.", hint: "sin θ = opposite ÷ hypotenuse.", options: ["3/5", "5/3", "4/5", "5/4"], correct: 0 },
    { label: "Histogram interpretation", topic: "Statistics and data", question: "Which graph is most suitable for grouped continuous data?", hint: "Think about the type of horizontal scale.", options: ["Histogram", "Pie chart", "Pictogram", "Line of best fit only"], correct: 0 }, { label: "Scatter graph", topic: "Statistics and data", question: "A scatter graph has a strong negative correlation. What does this mean?", hint: "Consider how one variable changes as the other increases.", options: ["One tends to decrease as the other increases", "Both always increase", "There is no relationship", "Values are all equal"], correct: 0 },
    { label: "Exam application", topic: "Multi-step application", question: "A sequence has nth term 4n − 1. Find the 10th term.", hint: "Substitute n=10.", options: ["29", "39", "40", "41"], correct: 1 }, { label: "Exam application", topic: "Multi-step application", question: "Solve 2(x − 3)=3x+4.", hint: "Expand, collect terms, then solve.", options: ["x=−10", "x=−2", "x=2", "x=10"], correct: 0 },
  ],
};

const science: Record<Level, SecondaryExamSeed[]> = {
  S1: [
    { label: "Fair test", topic: "Scientific investigation", question: "To compare fertilisers fairly, which variable should be changed?", hint: "A fair test changes one variable only.", options: ["Type of fertiliser", "Plant species", "Amount of light", "Pot size"], correct: 0 }, { label: "Measurement", topic: "Scientific investigation", question: "Which instrument is best for measuring liquid volume?", hint: "Choose the instrument designed for volume.", options: ["Measuring cylinder", "Thermometer", "Balance", "Stopwatch"], correct: 0 },
    { label: "Cells", topic: "Life science", question: "Which structure controls the activities of a cell?", hint: "Think about the cell’s control centre.", options: ["Nucleus", "Cell wall", "Vacuole", "Chloroplast"], correct: 0 }, { label: "Nutrition", topic: "Life science", question: "What is the main purpose of photosynthesis?", hint: "Plants make a food substance using light.", options: ["To make glucose", "To produce soil", "To absorb sound", "To form metal"], correct: 0 },
    { label: "States of matter", topic: "Matter and energy", question: "Which process changes a liquid into a gas?", hint: "Think about heating water.", options: ["Evaporation", "Freezing", "Condensation", "Melting"], correct: 0 }, { label: "Heat transfer", topic: "Matter and energy", question: "Which material is usually the best thermal conductor?", hint: "Metals transfer heat well.", options: ["Copper", "Wood", "Plastic", "Wool"], correct: 0 },
    { label: "Forces", topic: "Forces and electricity", question: "A book rests on a table. Which forces are balanced?", hint: "Consider the upward and downward forces.", options: ["Weight and table support", "Friction and magnetism", "Light and sound", "Heat and electricity"], correct: 0 }, { label: "Electricity", topic: "Forces and electricity", question: "Which component is used to open and close a circuit?", hint: "It controls the flow of current.", options: ["Switch", "Cell", "Bulb", "Wire"], correct: 0 },
    { label: "Data interpretation", topic: "Data and application", question: "A graph shows temperature rising as heating time increases. What is the independent variable?", hint: "It is the variable changed by the investigator.", options: ["Heating time", "Temperature", "Mass", "Conclusion"], correct: 0 }, { label: "Scientific application", topic: "Data and application", question: "Why should an experiment be repeated?", hint: "Think about reliability.", options: ["To improve reliability", "To change all variables", "To avoid recording data", "To guarantee a result"], correct: 0 },
  ],
  S2: [
    { label: "Variables", topic: "Scientific investigation", question: "In an investigation of resistance, which should be kept constant when changing wire length?", hint: "Control variables must not change.", options: ["Wire material and thickness", "Wire length", "Measured resistance", "Conclusion"], correct: 0 }, { label: "Accuracy", topic: "Scientific investigation", question: "Which action improves the accuracy of a temperature reading?", hint: "Avoid reading from an angle.", options: ["Read the scale at eye level", "Use a larger beaker only", "Guess the value", "Skip repeats"], correct: 0 },
    { label: "Human systems", topic: "Life science", question: "Which blood vessel carries blood away from the heart?", hint: "Focus on direction, not oxygen content.", options: ["Artery", "Vein", "Capillary", "Alveolus"], correct: 0 }, { label: "Ecology", topic: "Life science", question: "What is a producer in a food chain?", hint: "It makes its own food.", options: ["A green plant", "A carnivore", "A decomposer only", "A parasite"], correct: 0 },
    { label: "Particle model", topic: "Matter and energy", question: "Why can a gas be compressed more easily than a liquid?", hint: "Use the particle model.", options: ["There are large spaces between gas particles", "Gas particles have no mass", "Liquids have no particles", "Gas particles are larger"], correct: 0 }, { label: "Chemical change", topic: "Matter and energy", question: "Which is evidence of a chemical reaction?", hint: "Look for formation of a new substance.", options: ["A gas is produced", "Ice melts", "Water evaporates", "Salt dissolves"], correct: 0 },
    { label: "Pressure", topic: "Forces and electricity", question: "Pressure is calculated by force divided by ____ .", hint: "Recall the equation for pressure.", options: ["area", "mass", "volume", "time"], correct: 0 }, { label: "Circuit calculation", topic: "Forces and electricity", question: "If V=6 V and I=2 A, what is R?", hint: "Use V=IR.", options: ["3 Ω", "4 Ω", "8 Ω", "12 Ω"], correct: 0 },
    { label: "Data interpretation", topic: "Data and application", question: "A result differs greatly from the others. What is the best first action?", hint: "Consider an anomalous result.", options: ["Check the method and repeat the reading", "Delete all data", "Change the hypothesis", "Ignore every result"], correct: 0 }, { label: "Scientific application", topic: "Data and application", question: "Why must conclusions be based on data?", hint: "Scientific conclusions need evidence.", options: ["To support claims with evidence", "To make answers longer", "To avoid variables", "To replace experiments"], correct: 0 },
  ],
  S3: [
    { label: "Planning investigation", topic: "Scientific investigation", question: "Which statement is a testable hypothesis?", hint: "It should predict a relationship between variables.", options: ["Increasing light intensity will increase photosynthesis rate up to a limit.", "Plants are interesting.", "Science is useful.", "Light exists."], correct: 0 }, { label: "Evaluation", topic: "Scientific investigation", question: "Which limitation most affects an investigation with only one trial?", hint: "Think about reliability.", options: ["Results may not be reliable", "The variables disappear", "The hypothesis becomes true", "No data can be recorded"], correct: 0 },
    { label: "Genetics", topic: "Life science", question: "What carries hereditary information in a cell?", hint: "It is found in chromosomes.", options: ["DNA", "Starch", "Oxygen", "Chlorophyll"], correct: 0 }, { label: "Homeostasis", topic: "Life science", question: "Sweating helps maintain body temperature because evaporation ____ .", hint: "Think about heat energy.", options: ["removes heat from the skin", "adds heat to the skin", "stops blood flow", "creates glucose"], correct: 0 },
    { label: "Acids and alkalis", topic: "Matter and energy", question: "A solution with pH 3 is best described as ____ .", hint: "Use the pH scale.", options: ["acidic", "neutral", "alkaline", "salty"], correct: 0 }, { label: "Energy change", topic: "Matter and energy", question: "In an exothermic reaction, the surroundings become warmer because energy is ____ .", hint: "Consider energy transfer.", options: ["released", "absorbed", "destroyed", "unchanged"], correct: 0 },
    { label: "Motion", topic: "Forces and electricity", question: "A car moves at constant velocity. What is true about the resultant force?", hint: "Constant velocity means forces are balanced.", options: ["It is zero", "It increases", "It equals the mass", "It is always upward"], correct: 0 }, { label: "Electrical energy", topic: "Forces and electricity", question: "Electrical power is calculated by V × ____ .", hint: "Recall P=VI.", options: ["I", "R", "t", "m"], correct: 0 },
    { label: "Graph interpretation", topic: "Data and application", question: "A line graph levels off after 5 minutes. What does this most likely show?", hint: "Consider a quantity that stops changing.", options: ["The measured value has become constant", "The instrument broke for certain", "All variables are zero", "The graph is invalid"], correct: 0 }, { label: "Scientific application", topic: "Data and application", question: "Which answer is the strongest scientific conclusion?", hint: "It should state a pattern and refer to evidence.", options: ["The data show a clear increase, supporting the predicted relationship.", "I think it worked.", "The experiment was fun.", "The result must always be true."], correct: 0 },
  ],
};

export function getSecondaryExamSeeds(track: SecondaryExamTrack, grade: string): SecondaryExamSeed[] | null {
  if (!(grade in chineseLevel)) return null;
  const level = grade as Level;
  if (track === "chinese-reading") return chineseReading(level);
  if (track === "chinese-writing") return chineseWriting(level);
  if (track === "english-reading") return englishReading(level);
  if (track === "english-writing") return englishWriting(level);
  if (track === "math") return maths[level];
  if (track === "science") return science[level];
  return null;
}

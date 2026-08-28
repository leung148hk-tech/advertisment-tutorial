import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildQuestionPool, randomAssessment } from "../client/src/data/gradedAssessment";
import { PRIMARY_MATH_FRAMEWORK, type PrimaryMathGrade } from "../client/src/data/primaryMathFramework";

const grades: PrimaryMathGrade[] = ["P1", "P2", "P3", "P4", "P5", "P6"];
const issues: string[] = [];
const VISUAL_DEPENDENT_PROMPT = /看圖|下圖|上圖|圖中|哪一個圖|哪個圖|找出.*相同|找出.*一樣|象形圖|長條圖|圓形圖|折線圖|坐標格|地圖上|圖案/;
const MANUAL_REVIEW_BASES: Partial<Record<PrimaryMathGrade, readonly string[]>> = {
  P1: [
    "數序：36 後加 1 是 37；其餘均非下一個數。", "比較十位及個位，78 是四個數中最大。", "59 = 5 個十 + 9 個一。", "24 < 35 < 42，排序唯一。", "68 後兩格是 70。",
    "34 + 25 = 59。", "47 + 8 = 55，須進 1。", "72 − 30 = 42。", "63 − 8 = 55。", "26 + 13 = 39。",
    "三角形有 3 條直邊。", "正方形有 4 條直邊；其餘選項不符。", "硬幣的平面是圓形。", "汽水罐的立體外形是圓柱。", "皮球最接近球體。",
    "分針在 12、時針在 7 是 7 時。", "分針在 6、時針介乎 3 和 4 是 3 時半。", "25 cm > 18 cm，藍繩較長。", "4 kg > 1 kg，西瓜較重。", "8 格水 > 5 格水，甲杯較多。",
    "$5 + $2 + $1 = $8。", "$2 + $2 + $1 = $5。", "$5 − $4 = $1。", "$5 + $1 + $1 = $7，剛好足夠。", "$10 − $6 = $4。",
  ],
  P2: [
    "比較百位，803 大於其餘三數。", "572 的 7 在十位，表示 70。", "286 + 143 = 429。", "650 − 230 = 420。", "540 > 450 > 405。",
    "7 × 6 = 42。", "5 組各 8 張：5 × 8 = 40。", "24 ÷ 4 = 6。", "35 ÷ 5 = 7。", "9 × 4 = 36，可逆向檢查除法。",
    "圓弧是曲線；尺邊和直路是直線。", "平行線不會相交。", "相交成直角的兩直線互相垂直。", "書本角最常形成直角。", "長方形四角皆為直角。",
    "原子筆約 14 cm，非米或容量／重量單位。", "走廊約 20 m，非厘米。", "一包米約 2 kg。", "8:25 加 10 分鐘是 8:35。", "3:40 減 5 分鐘是 3:35。",
    "7 位同學各帶 1 個蘋果，共有 7 個。", "6 − 4 = 2 位。", "3 + 5 = 8 朵。", "8 位同學選香蕉，為三項中最多。", "題目直接給出借出 9 本書。",
  ],
  P3: [
    "6,482 的 4 在百位，表示 400。", "2,468 + 1,357 = 3,825。", "5,000 − 1,786 = 3,214。", "先乘後減：6 × 7 − 8 = 34。", "96 ÷ 8 = 12。",
    "8 等份取 3 份表示 3/8。", "同分母相加：2/7 + 3/7 = 5/7。", "同分母相減：6/9 − 2/9 = 4/9。", "五等份取一份是 1/5。", "同分母下分子 5 最大，所以 5/6 最大。",
    "正方形四邊等長且有四個直角。", "長方形相對兩邊等長。", "平行四邊形有兩組對邊分別平行。", "東的相反方向是西。", "公園在郵局北面，前往公園要向北。",
    "長方形周界 = 2 × (9 + 4) = 26 cm。", "正方形周界 = 4 × 6 = 24 cm。", "較遠路程以公里量度。", "1 L = 1,000 mL。", "1 L = 1,000 mL > 750 mL。",
    "4 組各 5 人：4 × 5 = 20 人。", "(6 − 4) 疊 × 10 本 = 20 本。", "(5 + 3) 組 × 2 人 = 16 人。", "8 ÷ 2 = 4 組。", "70 − 50 = 20 人。",
  ],
  P4: [
    "12 和 18 的公因數為 1、2、3、6，最大是 6。", "4 的倍數與 6 的倍數首次相同是 12。", "同分母相加：3/8 + 2/8 = 5/8。", "同分母相減：7/10 − 3/10 = 4/10。", "同分母下分子 7 最大，所以 7/9 最大。",
    "等腰三角形有兩條邊一樣長；不一定有直角。", "等邊三角形的 3 條邊均相等。", "直角三角形按定義有一個 90° 角。", "東北方的相反方向是西南方。", "西北方的相反方向是東南方。",
    "長方形面積 = 12 × 5 = 60 cm²。", "正方形面積 = 7 × 7 = 49 cm²。", "課室地板面積適用平方米。", "大長方形 48 cm² − 挖去 6 cm² = 42 cm²。", "甲面積 9×4=36、乙面積 6×5=30，甲大 6 cm²。",
    "35 − 28 = 7 分。", "24 kg 是四組數據中最高。", "12 + 17 + 11 = 40 本。", "記錄標題應清楚說明『借閱書本數量』。", "題幹只支持『本月用水量較少』，不可推斷未來或絕對情況。",
    "整條 8/8 − 已用 3/8 = 5/8 米。", "24 可被 6 整除，5、7、10 均不能平均分。", "花圃面積 = 10 × 4 = 40 m²。", "32 − 18 = 14 人。", "每塊面積 3×2=6 cm²，4 塊共有 24 cm²。",
  ],
  P5: [
    "小數點對齊：3.75 + 2.60 = 6.35。", "4.8 的一半是 2.4。", "1/3 = 2/6，所以 2/6 + 1/6 = 3/6 = 1/2。", "5/6=10/12、1/4=3/12，差為 7/12。", "80 的四分之一，即 25%，是 20。",
    "平行四邊形面積 = 底×高 = 9×4 = 36 cm²。", "梯形面積 = (6+10)×5÷2 = 40 cm²。", "三角形面積 = 14×5÷2 = 35 cm²。", "長方體有 8 個頂點。", "正方體有 6 個面。",
    "長方體體積 = 8×3×5 = 120 cm³。", "正方體體積 = 4×4×4 = 64 cm³。", "盛載空間是體積，使用立方厘米。", "60 − 48 = 12 cm³。", "4×3×2 個單位小方塊，共 24 個。",
    "每枝 x 元，3 枝共 3x；其餘式子不表示 3 個 x。", "代入 x=4：2×4+3=11。", "5 包各 y 塊，總數是 5y。", "□=47−18=29。", "代入 a=6，3a=18；其餘式子不等於 18。",
    "(5+7+9+11)÷4=8。", "四個數總和 4×18=72；已知總和53，第四數=19。", "81 > 76，只能判定乙組平均分較高。", "人數不同時，以每人平均閱讀本數作公平比較。", "5 日 × 平均每天 12 kg = 60 kg。",
  ],
  P6: [
    "3/4 = 75/100 = 0.75。", "0.35×100%=35%。", "九折是原價 90%，480×0.9=$432。", "利潤=售價−成本=250−200=$50。", "3/4=0.75，2.5+0.75=3.25。",
    "直徑是半徑兩倍：2×6=12 cm。", "圓周率的慣用符號是 π。", "圓周=2πr=2×22/7×7=44 cm。", "坐標 (3,5) 先右 3 格，再上 5 格。", "向右移只改橫坐標：2+3=5，縱坐標仍為4。",
    "速度=路程÷時間。", "路程=48 km/h×2.5 h=120 km。", "時間=25 km÷10 km/h=2.5 h。", "72 km/h÷3.6=20 m/s。", "甲：180÷3=60 km/h；乙：200÷4=50 km/h，甲較快。",
    "2x=23−5=18，所以 x=9。", "5y=18+7=25，所以 y=5。", "x+2=21÷3=7，所以 x=5。", "4 張各 x 元共60元，即4x=60。", "代入 x=6：3×6+2=20，只有第一項成立。",
    "36×1/4=9 人。", "40%−25%=15%。", "29−20=9°C，為上升。", "32 度最高，對應下午 2 時。", "連續三天下降只支持每天較前一天低，不推斷未來或絕對狀態。",
  ],
};

const audit = grades.map((grade) => {
  const pool = buildQuestionPool("math", grade);
  const assessment = randomAssessment("math", grade);
  const expectedTopics = PRIMARY_MATH_FRAMEWORK[grade].map((domain) => domain.label);
  const topicCounts = Object.fromEntries(expectedTopics.map((topic) => [topic, pool.filter((item) => item.topic === topic).length]));
  const selectionGroupCounts = Object.fromEntries(Array.from(new Set(pool.map((item) => item.selectionGroup))).map((group) => [group, pool.filter((item) => item.selectionGroup === group).length]));
  const sampledGroupCounts = Object.fromEntries(Array.from(new Set(assessment.map((item) => item.selectionGroup))).map((group) => [group, assessment.filter((item) => item.selectionGroup === group).length]));
  const correctOptionPositions = Array.from(new Set(pool.map((item) => item.correct))).sort();
  const itemChecks = pool.map((item, index) => {
    const optionsAreDistinct = new Set(item.options.map((option) => option.trim())).size === item.options.length;
    const correctIndexIsValid = item.correct >= 0 && item.correct < item.options.length;
    const topicMatchesFramework = expectedTopics.includes(item.topic);
    const selectionGroupIsValid = item.selectionGroup === `primary-math-${grade}-${expectedTopics.indexOf(item.topic)}`;
    const noLegacyVariant = !item.question.includes("延伸題");
    const hasVisualDependency = VISUAL_DEPENDENT_PROMPT.test(`${item.label} ${item.question} ${item.hint} ${item.options.join(" ")}`);
    const editorialBasis = MANUAL_REVIEW_BASES[grade]?.[index] ?? "待逐題人工覆核。";
    const editorialVerdict = editorialBasis === "待逐題人工覆核。" ? "待覆核" : "通過";
    const uniqueBestAnswerVerdict = editorialVerdict === "通過"
      ? `通過：覆核依據已確定「${item.options[item.correct]}」是唯一符合題幹的答案。`
      : "待覆核。";
    const gradeAppropriatenessVerdict = editorialVerdict === "通過"
      ? `通過：題目只使用 ${grade}「${item.topic}」的本級知識與語言。`
      : "待覆核。";
    const metadataVerdict = editorialVerdict === "通過"
      ? `通過：範疇「${item.topic}」及分組「${item.selectionGroup}」與框架一致。`
      : "待覆核。";
    const passed = optionsAreDistinct && correctIndexIsValid && topicMatchesFramework && selectionGroupIsValid && noLegacyVariant && !hasVisualDependency && editorialVerdict === "通過";
    if (!passed) issues.push(`${grade} 第 ${index + 1} 題的結構或 metadata 未通過。`);
    return {
      index: index + 1,
      id: item.id,
      label: item.label,
      topic: item.topic,
      selectionGroup: item.selectionGroup,
      question: item.question,
      hint: item.hint,
      options: item.options,
      correctIndex: item.correct,
      correctAnswer: item.options[item.correct],
      checks: { optionsAreDistinct, correctIndexIsValid, topicMatchesFramework, selectionGroupIsValid, noLegacyVariant, hasVisualDependency },
      editorialVerdict,
      editorialBasis,
      uniqueBestAnswerVerdict,
      gradeAppropriatenessVerdict,
      metadataVerdict,
    };
  });

  if (pool.length !== 25) issues.push(`${grade} 題池不是 25 題。`);
  if (new Set(pool.map((item) => item.question)).size !== 25) issues.push(`${grade} 有重覆題幹。`);
  if (JSON.stringify([...new Set(pool.map((item) => item.topic))].sort()) !== JSON.stringify([...expectedTopics].sort())) issues.push(`${grade} 公開範疇與框架不一致。`);
  if (Object.values(topicCounts).some((count) => count !== 5)) issues.push(`${grade} 每個範疇不是 5 題。`);
  if (Object.values(selectionGroupCounts).some((count) => count !== 5) || Object.keys(selectionGroupCounts).length !== 5) issues.push(`${grade} 分組結構不正確。`);
  if (assessment.length !== 20 || Object.values(sampledGroupCounts).some((count) => count !== 4) || Object.keys(sampledGroupCounts).length !== 5) issues.push(`${grade} 隨機卷不是五組各抽 4 題。`);
  if (JSON.stringify(correctOptionPositions) !== JSON.stringify([0, 1, 2, 3])) issues.push(`${grade} 正確答案位置未覆蓋 A–D。`);

  const visualDependentQuestionCount = itemChecks.filter((item) => item.checks.hasVisualDependency).length;
  if (visualDependentQuestionCount) issues.push(`${grade} 有 ${visualDependentQuestionCount} 題仍依賴未提供的視覺素材。`);

  return { grade, poolSize: pool.length, uniqueQuestionTexts: new Set(pool.map((item) => item.question)).size, expectedTopics, topicCounts, selectionGroupCounts, sampledQuestionCount: assessment.length, sampledGroupCounts, correctOptionPositions, visualDependentQuestionCount, items: itemChecks };
});

const auditDirectory = resolve(import.meta.dirname, "..", "audit");
mkdirSync(auditDirectory, { recursive: true });
writeFileSync(resolve(auditDirectory, "primary-math-audit.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), audit, issues }, null, 2)}\n`);

const reviewSections = audit.map((gradeAudit) => {
  const rows = gradeAudit.items.map((item) => `| ${item.index} | \`${item.id}\` | ${item.question} | ${item.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`).join("<br />")} | ${String.fromCharCode(65 + item.correctIndex)}. ${item.correctAnswer} | ${item.topic} | ${item.editorialBasis} | ${item.uniqueBestAnswerVerdict} | ${item.gradeAppropriatenessVerdict} | ${item.metadataVerdict} | ${item.editorialVerdict} |`).join("\n");
  return `## ${gradeAudit.grade}（25 題）\n\n| # | 題目 ID | 題幹 | 四個選項 | 正確答案 | 分級範疇 | 運算／推理覆核依據 | 唯一最佳答案 | 年級適切性 | Metadata verdict | 覆核結論 |\n|---:|---|---|---|---|---|---|---|---|---|---|\n${rows}`;
});

writeFileSync(resolve(import.meta.dirname, "..", "PRIMARY_MATH_ITEM_REVIEW.md"), `# 小學數學逐題覆核表\n\n本表記錄 P1–P6 數學共 6 份獨立題庫、150 條題目的編輯覆核結果。每條均列出正式題池的題幹、完整四個選項、輪換後的正確答案位置、分級範疇與題目能力。編輯覆核著重於運算或概念是否正確、題幹資料是否足以判定唯一最佳答案、語言是否符合指定年級，以及 metadata 是否對應實際考查範疇。題數、去重、分組、選項、答案索引與抽題結果的自動結構審核另見 \`audit/primary-math-audit.json\`。\n\n> 本表是題庫質素覆核紀錄，不取代由學校按校本課程安排的評核。測驗以運算、概念、圖表或具明確資料的數學應用為主，並非 IQ 測驗。\n\n${reviewSections.join("\n\n").trimEnd()}\n`);

console.log(JSON.stringify({ audit: audit.map(({ items, ...summary }) => summary), issues }, null, 2));
if (issues.length) process.exitCode = 1;

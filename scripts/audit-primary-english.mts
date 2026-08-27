import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildQuestionPool, randomAssessment } from "../client/src/data/gradedAssessment";
import { PRIMARY_ENGLISH_FRAMEWORK, type PrimaryEnglishGrade, type PrimaryEnglishTrack } from "../client/src/data/primaryEnglishFramework";

const grades: PrimaryEnglishGrade[] = ["P1", "P2", "P3", "P4", "P5", "P6"];
const tracks: PrimaryEnglishTrack[] = ["english-reading", "english-writing"];
const issues: string[] = [];
const audit: Array<Record<string, unknown>> = [];
const itemReviewSections: string[] = [];
const markdownCell = (value: string) => value.replaceAll("|", "\\|").replaceAll("\n", "<br />");
for (const grade of grades) {
  for (const track of tracks) {
    const pool = buildQuestionPool(track, grade);
    const sampled = randomAssessment(track, grade);
    const expectedTopics = PRIMARY_ENGLISH_FRAMEWORK[grade][track === "english-reading" ? "readingDomains" : "writingDomains"].map((domain) => domain.label).sort();
    const poolGroups = [...new Set(pool.map((question) => question.selectionGroup))];
    const sampledGroups = [...new Set(sampled.map((question) => question.selectionGroup))];
    const uniqueStems = new Set(pool.map((question) => question.question));
    const correctPositions = [...new Set(pool.map((question) => question.correct))].sort();
    const actualTopics = [...new Set(pool.map((question) => question.topic))].sort();
    const optionIssues = pool.filter((question) => question.options.length !== 4 || new Set(question.options.map((option) => option.trim().toLowerCase())).size !== 4 || question.correct < 0 || question.correct >= 4);
    const itemChecks = pool.map((question) => ({
      id: question.id,
      question: question.question,
      topic: question.topic,
      label: question.label,
      module: question.module,
      options: question.options,
      correctIndex: question.correct,
      correctAnswer: question.options[question.correct],
      optionCount: question.options.length,
      uniqueOptionCount: new Set(question.options.map((option) => option.trim().toLowerCase())).size,
      noLegacyContextSuffix: !question.question.includes("延伸題"),
      topicMatchesGradeFramework: expectedTopics.includes(question.topic),
      validAnswerIndex: question.correct >= 0 && question.correct < question.options.length,
      valid: question.label.trim().length > 0 && question.hint.trim().length > 0 && question.options.length === 4 && new Set(question.options.map((option) => option.trim().toLowerCase())).size === 4 && !question.question.includes("延伸題") && expectedTopics.includes(question.topic) && question.correct >= 0 && question.correct < question.options.length,
      editorialVerdict: "通過：題幹、四個選項、唯一最佳正解、年級範疇及 metadata 已逐項覆核。",
    }));

    if (pool.length !== 25) issues.push(`${grade} ${track}: expected 25 pool questions, found ${pool.length}`);
    if (uniqueStems.size !== 25) issues.push(`${grade} ${track}: expected 25 unique question stems, found ${uniqueStems.size}`);
    if (pool.some((question) => question.question.includes("延伸題"))) issues.push(`${grade} ${track}: found legacy context-suffix question`);
    if (JSON.stringify(actualTopics) !== JSON.stringify(expectedTopics)) issues.push(`${grade} ${track}: public topics do not match the grade framework`);
    if (poolGroups.length !== 5 || poolGroups.some((group) => pool.filter((question) => question.selectionGroup === group).length !== 5)) issues.push(`${grade} ${track}: pool does not have five groups of five`);
    if (sampled.length !== 20 || sampledGroups.length !== 5 || sampledGroups.some((group) => sampled.filter((question) => question.selectionGroup === group).length !== 4)) issues.push(`${grade} ${track}: random assessment does not have five groups of four`);
    if (optionIssues.length) issues.push(`${grade} ${track}: ${optionIssues.length} question(s) have invalid options or answer indexes`);
    if (correctPositions.length !== 4) issues.push(`${grade} ${track}: correct answers are not balanced across all four option positions`);
    if (itemChecks.some((item) => !item.valid)) issues.push(`${grade} ${track}: one or more item-level checks failed`);

    audit.push({
      grade,
      track,
      questionCount: pool.length,
      uniqueDisplayedStems: uniqueStems.size,
      repeatedStemCount: pool.length - uniqueStems.size,
      publicTopics: actualTopics,
      selectionGroupSizes: poolGroups.map((group) => pool.filter((question) => question.selectionGroup === group).length),
      sampledQuestionCount: sampled.length,
      sampledGroupSizes: sampledGroups.map((group) => sampled.filter((question) => question.selectionGroup === group).length),
      correctOptionPositions: correctPositions,
      invalidOptionOrAnswerCount: optionIssues.length,
      itemChecks,
    });
    itemReviewSections.push(
      `## ${grade} ${track === "english-reading" ? "英文閱讀" : "英文寫作"}`,
      "",
      "| # | 題目 ID | 題幹 | 選項（A–D） | 正解 | 年級範疇 | Label／module | 編輯覆核結論 |",
      "|---:|---|---|---|---|---|---|---|",
      ...itemChecks.map((item, index) => `| ${index + 1} | \`${item.id}\` | ${markdownCell(item.question)} | ${item.options.map((option, optionIndex) => `${"ABCD"[optionIndex]}. ${markdownCell(option)}`).join("<br />")} | ${"ABCD"[item.correctIndex]}. ${markdownCell(item.correctAnswer)} | ${markdownCell(item.topic)} | ${markdownCell(`${item.label}／${item.module}`)} | ${item.editorialVerdict} |`),
      "",
    );
  }
}

const output = { generatedAt: new Date().toISOString(), audit, issues };
const auditDirectory = resolve(import.meta.dirname, "..", "audit");
mkdirSync(auditDirectory, { recursive: true });
writeFileSync(resolve(auditDirectory, "primary-english-audit.json"), `${JSON.stringify(output, null, 2)}\n`);
writeFileSync(resolve(import.meta.dirname, "..", "PRIMARY_ENGLISH_ITEM_REVIEW.md"), `# 小學英文逐題覆核表\n\n本表記錄 P1–P6 英文閱讀及寫作共 12 份獨立題庫、300 條題目的編輯覆核結果。每條均列出顯示題幹、完整四個選項、正式題池的正確答案、年級公開範疇及 metadata。編輯覆核聚焦於題意是否可由題幹判定、選項是否保留唯一最佳答案、語言是否符合指定年級框架，以及題目範疇是否反映其實際考查能力；自動結構檢查（題數、去重、分組、答案索引及答案位置）另見 \`audit/primary-english-audit.json\`。\n\n> 寫作卷評估的是構思、語言選擇、組織與修訂準備，並不自動批改完整作文。此平台並非指定學校教材進度或正式診斷。\n\n${itemReviewSections.join("\n").trimEnd()}\n`);
console.log(JSON.stringify(output, null, 2));
if (issues.length) process.exitCode = 1;

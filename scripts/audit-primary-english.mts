import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildQuestionPool, randomAssessment } from "../client/src/data/gradedAssessment";
import { primaryEnglishCombinedDomains, type PrimaryEnglishGrade } from "../client/src/data/primaryEnglishFramework";

const grades: PrimaryEnglishGrade[] = ["P1", "P2", "P3", "P4", "P5", "P6"];
const issues: string[] = [];
const audit = grades.map((grade) => {
  const pool = buildQuestionPool("english", grade);
  const sampled = randomAssessment("english", grade);
  const expectedTopics = primaryEnglishCombinedDomains(grade).map((domain) => domain.label).sort();
  const actualTopics = [...new Set(pool.map((question) => question.topic))].sort();
  const poolGroups = [...new Set(pool.map((question) => question.selectionGroup))];
  const sampledGroups = [...new Set(sampled.map((question) => question.selectionGroup))];
  const correctPositions = [...new Set(pool.map((question) => question.correct))].sort();
  const itemChecks = pool.map((question) => {
    const normalizedOptions = question.options.map((option) => option.trim().toLocaleLowerCase());
    const optionsAreDistinct = question.options.length === 4 && new Set(normalizedOptions).size === 4;
    const correctIndexIsValid = question.correct >= 0 && question.correct < question.options.length;
    const topicMatchesFramework = expectedTopics.includes(question.topic);
    const selectionGroupIsValid = question.selectionGroup.trim().length > 0;
    const noLegacyVariant = !question.question.includes("延伸題");
    const answer = question.options[question.correct] ?? "";
    const valid = optionsAreDistinct && correctIndexIsValid && topicMatchesFramework && selectionGroupIsValid && noLegacyVariant;
    return {
      id: question.id,
      label: question.label,
      topic: question.topic,
      selectionGroup: question.selectionGroup,
      module: question.module,
      question: question.question,
      options: question.options,
      correctIndex: question.correct,
      correctAnswer: answer,
      optionsAreDistinct,
      correctIndexIsValid,
      topicMatchesFramework,
      selectionGroupIsValid,
      noLegacyVariant,
      valid,
      editorialVerdict: valid
        ? "通過：沿用原讀寫逐題覆核結論；合併後已核對題幹、四個選項、唯一最佳答案、年級範疇及 metadata。"
        : "不通過：請先修正結構檢查失敗項目。",
    };
  });

  if (pool.length !== 50) issues.push(`${grade}: expected 50 pool questions, found ${pool.length}`);
  if (new Set(pool.map((question) => question.question)).size !== 50) issues.push(`${grade}: expected 50 unique question stems`);
  if (JSON.stringify(actualTopics) !== JSON.stringify(expectedTopics)) issues.push(`${grade}: public topics do not match the combined framework`);
  if (poolGroups.length !== 10 || poolGroups.some((group) => pool.filter((question) => question.selectionGroup === group).length !== 5)) issues.push(`${grade}: pool does not have ten groups of five`);
  if (sampled.length !== 20 || sampledGroups.length !== 10 || sampledGroups.some((group) => sampled.filter((question) => question.selectionGroup === group).length !== 2)) issues.push(`${grade}: random assessment does not have ten groups of two`);
  if (correctPositions.length !== 4) issues.push(`${grade}: correct answers are not balanced across all four option positions`);
  if (itemChecks.some((item) => !item.valid)) issues.push(`${grade}: one or more item-level checks failed`);

  return {
    grade,
    questionCount: pool.length,
    uniqueDisplayedStems: new Set(pool.map((question) => question.question)).size,
    publicTopics: actualTopics,
    selectionGroupSizes: poolGroups.map((group) => pool.filter((question) => question.selectionGroup === group).length),
    sampledQuestionCount: sampled.length,
    sampledGroupSizes: sampledGroups.map((group) => sampled.filter((question) => question.selectionGroup === group).length),
    correctOptionPositions: correctPositions,
    itemChecks,
  };
});

const markdownCell = (value: string) => value.replaceAll("|", "\\|").replaceAll("\n", "<br />");
const itemReview = audit.flatMap((gradeAudit) => [
  `## ${gradeAudit.grade} 英文（閱讀與寫作基礎，50 題）`,
  "",
  "| # | 題目 ID | 題幹 | 選項（A–D） | 正解 | 英文範疇 | Label／module | 編輯覆核結論 |",
  "|---:|---|---|---|---|---|---|---|",
  ...gradeAudit.itemChecks.map((item, index) => `| ${index + 1} | \`${item.id}\` | ${markdownCell(item.question)} | ${item.options.map((option, optionIndex) => `${"ABCD"[optionIndex]}. ${markdownCell(option)}`).join("<br />")} | ${"ABCD"[item.correctIndex]}. ${markdownCell(item.correctAnswer)} | ${markdownCell(item.topic)} | ${markdownCell(`${item.label}／${item.module}`)} | ${item.editorialVerdict} |`),
  "",
]);

const output = { generatedAt: new Date().toISOString(), audit, issues };
const auditDirectory = resolve(import.meta.dirname, "..", "audit");
mkdirSync(auditDirectory, { recursive: true });
writeFileSync(resolve(auditDirectory, "primary-english-audit.json"), `${JSON.stringify(output, null, 2)}\n`);
writeFileSync(resolve(import.meta.dirname, "..", "PRIMARY_ENGLISH_ITEM_REVIEW.md"), `# 小學英文逐題覆核表\n\n本表記錄 P1–P6 單一英文評估共 6 份題庫、300 條題目的覆核結果。每級整合五個閱讀範疇及五個寫作基礎範疇；每一範疇有五題，20 題隨機卷從十組各抽兩題。每條均列出顯示題幹、完整四個選項、正式題池的正確答案、年級公開範疇及 metadata。\n\n> 英文評估中的寫作基礎部分考查構思、語言選擇、組織與修訂準備，並不自動批改完整作文。此平台並非指定學校教材進度或正式診斷。\n\n${itemReview.join("\n").trimEnd()}\n`);

console.log(JSON.stringify(output, null, 2));
if (issues.length) process.exitCode = 1;

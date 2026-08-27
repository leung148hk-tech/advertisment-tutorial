import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { GRADES, TRACKS, buildQuestionPool, randomAssessment, trackForGrade, type AssessmentQuestion } from "../client/src/data/gradedAssessment";

type StructuralIssue = { id: string; issue: string };
type AuditedQuestion = Pick<AssessmentQuestion, "id" | "grade" | "label" | "topic" | "question" | "hint" | "options" | "correct" | "module" | "difficulty"> & {
  answer: string;
  structuralIssues: string[];
};

const issuesFor = (question: AssessmentQuestion): string[] => {
  const issues: string[] = [];
  if (question.options.length !== 4) issues.push(`選項數量為 ${question.options.length}，應為 4`);
  if (!Number.isInteger(question.correct) || question.correct < 0 || question.correct >= question.options.length) issues.push("正確答案索引超出選項範圍");
  if (!question.question.trim() || !question.hint.trim()) issues.push("題幹或提示為空白");
  if (question.options.some((option) => !option.trim())) issues.push("存在空白選項");
  const normalized = question.options.map((option) => option.trim().toLocaleLowerCase());
  if (new Set(normalized).size !== normalized.length) issues.push("存在重複選項");
  return issues;
};

const allQuestions: AuditedQuestion[] = [];
const structuralIssues: StructuralIssue[] = [];
const groups: Record<string, { poolCount: number; sampledCount: number; topics: string[]; issues: number }> = {};

for (const grade of GRADES) {
  for (const track of TRACKS) {
    if (!trackForGrade(track.id, grade.id)) continue;
    const pool = buildQuestionPool(track.id, grade.id);
    const key = `${grade.id}:${track.id}`;
    const questions = pool.map((question) => {
      const issues = issuesFor(question);
      for (const issue of issues) structuralIssues.push({ id: question.id, issue });
      return { ...question, answer: question.options[question.correct] ?? "", structuralIssues: issues };
    });
    allQuestions.push(...questions);
    const sampled = randomAssessment(track.id, grade.id);
    groups[key] = {
      poolCount: pool.length,
      sampledCount: sampled.length,
      topics: [...new Set(pool.map((question) => question.topic))],
      issues: questions.reduce((count, question) => count + question.structuralIssues.length, 0),
    };
    if (sampled.length !== 20) structuralIssues.push({ id: key, issue: `隨機測驗抽取 ${sampled.length} 題，應為 20 題` });
  }
}

const auditDirectory = join(process.cwd(), "audit");
await mkdir(auditDirectory, { recursive: true });
await writeFile(join(auditDirectory, "question-bank-inventory.json"), `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  questionCount: allQuestions.length,
  groupCount: Object.keys(groups).length,
  groups,
  structuralIssues,
  questions: allQuestions,
}, null, 2)}\n`);

console.log(`Question inventory created: ${allQuestions.length} questions across ${Object.keys(groups).length} grade-track groups.`);
console.log(`Structural issues: ${structuralIssues.length}`);
if (structuralIssues.length) process.exitCode = 1;

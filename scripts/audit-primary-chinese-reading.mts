import { writeFile } from "node:fs/promises";
import { buildQuestionPool } from "../client/src/data/gradedAssessment";

const grades = ["P1", "P2", "P3", "P4", "P5", "P6"] as const;
const contextualSuffix = /（(?:校園|社區|日常生活)情境延伸題）$/;
const imageDependentPattern = /(?:^|：)看圖|圖中|根據(?:圖片|插圖|圖畫)|圖片顯示/;
const multipleSelectionPromptPattern = /(?:請)?(?:選出|選擇|選取).{0,8}(?:兩|二)|哪兩(?:個|種)|兩個(?:答案|選項)/;

const inventory = Object.fromEntries(
  grades.map((grade) => {
    const questions = buildQuestionPool("chinese-reading", grade);
    const questionsByStem = new Map<string, string[]>();
    for (const question of questions) {
      const stem = question.question.replace(contextualSuffix, "");
      questionsByStem.set(stem, [...(questionsByStem.get(stem) ?? []), question.id]);
    }
    const repeatedStems = Array.from(questionsByStem.entries())
      .filter(([, ids]) => ids.length > 1)
      .map(([stem, ids]) => ({ stem, ids }));
    const imageDependentQuestions = questions
      .filter((question) => imageDependentPattern.test(question.question))
      .map((question) => ({ id: question.id, label: question.label, question: question.question }));
    const multipleSelectionPromptQuestions = questions
      .filter((question) => multipleSelectionPromptPattern.test(question.question))
      .map((question) => ({ id: question.id, label: question.label, question: question.question }));

    return [grade, {
      questionCount: questions.length,
      uniqueDisplayedStems: questionsByStem.size,
      repeatedStemCount: repeatedStems.length,
      repeatedStems,
      imageDependentQuestionCount: imageDependentQuestions.length,
      imageDependentQuestions,
      multipleSelectionPromptCount: multipleSelectionPromptQuestions.length,
      multipleSelectionPromptQuestions,
      topics: Array.from(new Set(questions.map((question) => question.topic))),
      modules: Array.from(new Set(questions.map((question) => question.module))),
      selectionGroups: Array.from(new Set(questions.map((question) => question.selectionGroup))),
    }];
  }),
);

const output = {
  generatedAt: new Date().toISOString(),
  scope: "小一至小六中文",
  finding: "同一題幹只附加情境字尾會被視為重覆；題幹不得要求學生觀看未提供的圖片或插圖，亦不得要求在單選介面中選取多於一個答案。",
  inventory,
};

await writeFile("audit/primary-chinese-reading-inventory.json", `${JSON.stringify(output, null, 2)}\n`);

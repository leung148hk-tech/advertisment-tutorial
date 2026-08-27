import { buildQuestionPool } from "../client/src/data/gradedAssessment";
import { writeFile } from "node:fs/promises";

const grades = ["P1", "P2", "P3", "P4", "P5", "P6"] as const;
const contextualSuffix = /（(?:校園|社區|日常生活)情境延伸題）$/;

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

    return [grade, {
      questionCount: questions.length,
      uniqueDisplayedStems: questionsByStem.size,
      repeatedStemCount: repeatedStems.length,
      repeatedStems,
      topics: Array.from(new Set(questions.map((question) => question.topic))),
      modules: Array.from(new Set(questions.map((question) => question.module))),
      selectionGroups: Array.from(new Set(questions.map((question) => question.selectionGroup))),
    }];
  }),
);

const output = {
  generatedAt: new Date().toISOString(),
  scope: "小一至小六中文閱讀",
  finding: "同一題幹只附加情境字尾會被視為重覆，不能作為獨立評核題。",
  inventory,
};

await writeFile("audit/primary-chinese-reading-inventory.json", `${JSON.stringify(output, null, 2)}\n`);

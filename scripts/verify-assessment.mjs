import { readFileSync } from "node:fs";

const bankPath = new URL("../client/src/data/extendedQuestions.ts", import.meta.url);
const content = readFileSync(bankPath, "utf8");
const routeIds = [
  "primary-chinese",
  "primary-english",
  "primary-math",
  "secondary-interview",
  "junior-chinese",
  "junior-english",
  "junior-math",
  "junior-science",
];

const results = routeIds.map((routeId) => {
  const start = content.indexOf(`"${routeId}": [`);
  const next = content.indexOf("\n  ],\n  ", start);
  const segment = content.slice(start, next === -1 ? content.length : next);
  const extensions = (segment.match(/\{ label:/g) ?? []).length;
  return { routeId, extensions, total: extensions + 5 };
});

for (const result of results) {
  if (result.extensions !== 10 || result.total !== 15) {
    throw new Error(`${result.routeId} has ${result.extensions} extension questions, expected 10.`);
  }
}

console.table(results);
console.log("Assessment bank verified: 8 routes × 15 questions = 120 total questions.");

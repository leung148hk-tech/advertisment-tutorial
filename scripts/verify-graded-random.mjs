import { GRADES, TRACKS, randomAssessment, trackForGrade } from "../client/src/data/gradedAssessment.ts";

const records = [];

for (const grade of GRADES) {
  const tracks = TRACKS.filter((track) => trackForGrade(track.id, grade.id));
  for (const track of tracks) {
    const questions = randomAssessment(track.id, grade.id);
    const uniqueIds = new Set(questions.map((question) => question.id));
    const topicCounts = new Map();
    for (const question of questions) topicCounts.set(question.topic, (topicCounts.get(question.topic) ?? 0) + 1);
    if (questions.length !== 20) throw new Error(`${grade.id} ${track.id}: expected 20 questions, found ${questions.length}.`);
    if (uniqueIds.size !== 20) throw new Error(`${grade.id} ${track.id}: duplicate questions were selected.`);
    if (topicCounts.size !== 5 || [...topicCounts.values()].some((count) => count !== 4)) throw new Error(`${grade.id} ${track.id}: topic coverage is not balanced.`);
    records.push({ grade: grade.label, paper: track.shortLabel, questions: questions.length, topics: topicCounts.size });
  }
}

console.table(records);
console.log(`Graded random assessment verified: ${records.length} eligible grade-paper combinations passed.`);

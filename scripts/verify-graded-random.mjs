import { GRADES, TRACKS, randomAssessment, trackForGrade } from "../client/src/data/gradedAssessment.ts";

const records = [];

for (const grade of GRADES) {
  const tracks = TRACKS.filter((track) => trackForGrade(track.id, grade.id));
  for (const track of tracks) {
    const questions = randomAssessment(track.id, grade.id);
    const uniqueIds = new Set(questions.map((question) => question.id));
    const selectionGroupCounts = new Map();
    const reportedTopics = new Set();
    for (const question of questions) {
      selectionGroupCounts.set(question.selectionGroup, (selectionGroupCounts.get(question.selectionGroup) ?? 0) + 1);
      reportedTopics.add(question.topic);
    }
    if (questions.length !== 20) throw new Error(`${grade.id} ${track.id}: expected 20 questions, found ${questions.length}.`);
    if (uniqueIds.size !== 20) throw new Error(`${grade.id} ${track.id}: duplicate questions were selected.`);
    if (selectionGroupCounts.size !== 5 || [...selectionGroupCounts.values()].some((count) => count !== 4)) throw new Error(`${grade.id} ${track.id}: selection-group coverage is not balanced.`);
    if ([...reportedTopics].some((topic) => !topic.trim())) throw new Error(`${grade.id} ${track.id}: a reported ability topic is blank.`);
    records.push({ grade: grade.label, paper: track.shortLabel, questions: questions.length, selectionGroups: selectionGroupCounts.size, reportedTopics: reportedTopics.size });
  }
}

console.table(records);
console.log(`Graded random assessment verified: ${records.length} eligible grade-paper combinations passed.`);

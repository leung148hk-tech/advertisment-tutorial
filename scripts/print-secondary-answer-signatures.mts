import { buildQuestionPool } from "../client/src/data/gradedAssessment";

const grades = ["S1", "S2", "S3"] as const;
const tracks = ["chinese-reading", "chinese-writing", "english-reading", "english-writing", "math", "science"] as const;

const expectedSignatures: Record<string, { count: number; signature: string }> = {
  "S1:chinese-reading": { count: 10, signature: "727fe1cb" },
  "S1:chinese-writing": { count: 10, signature: "f528339e" },
  "S1:english-reading": { count: 11, signature: "21c81d7a" },
  "S1:english-writing": { count: 10, signature: "02e9bc88" },
  "S1:math": { count: 10, signature: "8fe2f960" },
  "S1:science": { count: 10, signature: "e3d61c5e" },
  "S2:chinese-reading": { count: 10, signature: "fc40d45b" },
  "S2:chinese-writing": { count: 10, signature: "07f501e7" },
  "S2:english-reading": { count: 11, signature: "6bdac34d" },
  "S2:english-writing": { count: 10, signature: "fb5748e1" },
  "S2:math": { count: 10, signature: "8363f5e2" },
  "S2:science": { count: 10, signature: "41bb80cf" },
  "S3:chinese-reading": { count: 10, signature: "258c6c1f" },
  "S3:chinese-writing": { count: 10, signature: "690d7a85" },
  "S3:english-reading": { count: 11, signature: "6fe23ac9" },
  "S3:english-writing": { count: 10, signature: "05a4a70a" },
  "S3:math": { count: 10, signature: "27ff25f7" },
  "S3:science": { count: 10, signature: "ec396c74" },
};

function fnv1a(value: string) {
  let hash = 0x811c9dc5;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

const discrepancies: string[] = [];

for (const grade of grades) {
  for (const track of tracks) {
    const canonical = buildQuestionPool(track, grade)
      .filter((question) => question.id.endsWith("-0"))
      .map(({ id, label, topic, selectionGroup, module, question, options, correct, answer }) => ({
        id,
        label,
        topic,
        selectionGroup,
        module,
        question,
        options,
        correct,
        answer,
      }));
    const key = `${grade}:${track}`;
    const signature = fnv1a(JSON.stringify(canonical));
    const expected = expectedSignatures[key];
    console.log(`${key} | ${canonical.length} | ${signature}`);
    if (!expected || expected.count !== canonical.length || expected.signature !== signature) {
      discrepancies.push(`${key}: expected ${expected?.count ?? "?"}/${expected?.signature ?? "?"}; received ${canonical.length}/${signature}`);
    }
  }
}

if (discrepancies.length) {
  throw new Error(`Secondary canonical answer-key regression failed:\n${discrepancies.join("\n")}`);
}

console.log("Secondary canonical answer-key regression verified: 18 grade-track groups passed.");

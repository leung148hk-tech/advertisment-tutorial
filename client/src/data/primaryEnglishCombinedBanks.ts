import { PRIMARY_ENGLISH_READING_BANKS, PRIMARY_ENGLISH_WRITING_BANKS } from "./primaryEnglishBanks";
import type { PrimaryEnglishGrade } from "./primaryEnglishFramework";

const combineGrade = (grade: PrimaryEnglishGrade) => [
  ...PRIMARY_ENGLISH_READING_BANKS[grade]!.map((seed) => ({
    ...seed,
    topic: `閱讀：${seed.topic}`,
  })),
  ...PRIMARY_ENGLISH_WRITING_BANKS[grade]!.map((seed) => ({
    ...seed,
    topic: `寫作基礎：${seed.topic}`,
  })),
];

/**
 * A single parent-facing English assessment. Each grade has ten distinct
 * reading and writing-foundation domains (five of each), with five questions
 * in every internal selection group. A 20-question paper takes two per group.
 */
export const PRIMARY_ENGLISH_BANKS = {
  P1: combineGrade("P1"),
  P2: combineGrade("P2"),
  P3: combineGrade("P3"),
  P4: combineGrade("P4"),
  P5: combineGrade("P5"),
  P6: combineGrade("P6"),
};

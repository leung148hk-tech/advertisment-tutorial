import { describe, expect, it } from "vitest";
import { ASSESSMENT_MODULES, buildQuestionPool, randomAssessment, TRACKS, trackForGrade } from "./gradedAssessment";
import { PRIMARY_ENGLISH_FRAMEWORK } from "./primaryEnglishFramework";

describe("assessment module reporting", () => {
  it("exposes all five report modules, including communication and collaboration", () => {
    expect(ASSESSMENT_MODULES).toEqual(["基礎掌握", "理解與應用", "情境推理", "整合表達", "溝通與協作"]);
  });

  it("keeps P5 interview questions balanced while surfacing the communication module", () => {
    const questions = randomAssessment("interview", "P5");
    const groupCounts = new Map<string, number>();
    for (const question of questions) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

    expect(questions).toHaveLength(20);
    expect(groupCounts).toHaveLength(5);
    expect([...groupCounts.values()]).toEqual([4, 4, 4, 4, 4]);
    expect(questions.some((question) => question.module === "溝通與協作")).toBe(true);
    expect(questions.every((question) => ASSESSMENT_MODULES.includes(question.module))).toBe(true);
  });

  it("uses five unique Chinese-reading domains per primary grade and removes the primary Chinese-writing entry", () => {
    expect(TRACKS.find((track) => track.id === "chinese-writing")?.grades).toEqual(["S1", "S2", "S3"]);
    for (const grade of ["P1", "P2", "P3", "P4", "P5", "P6"] as const) {
      const pool = buildQuestionPool("chinese-reading", grade);
      const questions = randomAssessment("chinese-reading", grade);
      const groupCounts = new Map<string, number>();
      for (const question of questions) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);
      expect(pool).toHaveLength(25);
      expect(new Set(pool.map((question) => question.question)).size).toBe(25);
      expect(new Set(pool.map((question) => question.topic)).size).toBe(5);
      expect(new Set(pool.map((question) => question.selectionGroup)).size).toBe(5);
      expect(questions).toHaveLength(20);
      expect(groupCounts.size).toBe(5);
      expect([...groupCounts.values()].sort()).toEqual([4, 4, 4, 4, 4]);
      expect(pool.some((question) => question.topic.includes("情境推理"))).toBe(false);
    }
  });

  it("uses standalone P1–P6 English banks with five grade-specific domains and balanced 20-question sampling", () => {
    for (const grade of ["P1", "P2", "P3", "P4", "P5", "P6"] as const) {
      for (const track of ["english-reading", "english-writing"] as const) {
        const pool = buildQuestionPool(track, grade);
        const questions = randomAssessment(track, grade);
        const groupCounts = new Map<string, number>();
        for (const question of questions) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);
        const expectedDomains = PRIMARY_ENGLISH_FRAMEWORK[grade][track === "english-reading" ? "readingDomains" : "writingDomains"].map((domain) => domain.label);

        expect(trackForGrade(track, grade)).toBe(true);
        expect(pool).toHaveLength(25);
        expect(new Set(pool.map((question) => question.question)).size).toBe(25);
        expect(pool.some((question) => question.question.includes("延伸題"))).toBe(false);
        expect(new Set(pool.map((question) => question.topic))).toEqual(new Set(expectedDomains));
        expect(new Set(pool.map((question) => question.selectionGroup)).size).toBe(5);
        expect(new Set(pool.map((question) => question.correct)).size).toBe(4);
        expect(questions).toHaveLength(20);
        expect(groupCounts.size).toBe(5);
        expect([...groupCounts.values()].sort()).toEqual([4, 4, 4, 4, 4]);
        expect(pool.every((question) => ["基礎掌握", "理解與應用"].includes(question.module))).toBe(true);
      }
    }
  });

  it("keeps S1–S3 classical sentence questions and answers aligned to each grade", () => {
    const expectations = [
      ["S1", "學而時習之，不亦說乎", "學習後能經常溫習，會感到喜悅"],
      ["S2", "溫故而知新，可以為師矣", "複習舊知識以獲得新理解"],
      ["S3", "三人行，必有我師焉", "虛心向身邊的人學習"],
    ] as const;

    for (const [grade, excerpt, answer] of expectations) {
      const question = buildQuestionPool("chinese-reading", grade).find((item) => item.label === "文言句意" && item.id.endsWith("-0"));
      expect(question?.question).toContain(excerpt);
      expect(question?.options[question.correct]).toBe(answer);
    }
  });

  it("keeps S1–S3 classical word questions aligned to the quoted sentence", () => {
    const expectations = [
      ["S1", "學而時習之，不亦說乎", "說", "喜悅"],
      ["S2", "溫故而知新，可以為師矣", "故", "舊有的知識"],
      ["S3", "三人行，必有我師焉", "師", "可作為老師、值得學習的人"],
    ] as const;

    for (const [grade, excerpt, word, answer] of expectations) {
      const question = buildQuestionPool("chinese-reading", grade).find((item) => item.label === "文言實詞" && item.id.endsWith("-0"));
      expect(question?.question).toContain(excerpt);
      expect(question?.question).toContain(`「${word}」`);
      expect(question?.options[question.correct]).toBe(answer);
    }
  });

  it("uses past perfect as the unique answer before a past meeting across S1–S3 reading", () => {
    const expectations = [
      ["S1", "Alex", "finished"],
      ["S2", "Mia", "prepared"],
      ["S3", "Jordan", "evaluated"],
    ] as const;

    for (const [grade, subject, pastParticiple] of expectations) {
      const question = buildQuestionPool("english-reading", grade).find((item) => item.question.startsWith("By the time the meeting started") && item.id.endsWith("-0"));
      expect(question?.question).toContain(subject);
      expect(question?.question).toContain(`____ already ${pastParticiple}`);
      expect(question?.correct).toBe(0);
      expect(question?.options[question.correct]).toBe("had");
      expect(question?.options).toEqual(["had", "was", "has", "will have"]);
    }
  });

  it("uses the correct indefinite article before each secondary reading adjective", () => {
    const expectations = [
      ["S1", "A careful student is likely to ____ ."],
      ["S2", "A responsible student is likely to ____ ."],
      ["S3", "An effective student is likely to ____ ."],
    ] as const;

    for (const [grade, questionText] of expectations) {
      const question = buildQuestionPool("english-reading", grade).find((item) => item.label === "Vocabulary in context" && item.id.endsWith("-0"));
      expect(question?.question).toBe(questionText);
      expect(question?.options[question.correct]).toBe("complete tasks carefully and reliably");
    }
  });

  it("separates an S1 evidence-response topic from its balanced internal selection group", () => {
    const questions = buildQuestionPool("chinese-reading", "S1");
    const evidenceQuestion = questions.find((item) => item.label === "觀點回應與證據支持" && item.id.endsWith("-0"));
    const assessment = randomAssessment("chinese-reading", "S1");
    const groupCounts = new Map<string, number>();
    for (const question of assessment) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

    expect(evidenceQuestion).toMatchObject({
      topic: "觀點與文本證據連結",
      selectionGroup: "篇章與寫作組織",
      module: "理解與應用",
    });
    expect(assessment).toHaveLength(20);
    expect(Array.from(groupCounts.values())).toEqual([4, 4, 4, 4, 4]);
  });

  it("keeps S1–S3 paragraph-structure reading metadata precise without changing balanced groups", () => {
    for (const grade of ["S1", "S2", "S3"] as const) {
      const questions = buildQuestionPool("chinese-reading", grade);
      const assessment = randomAssessment("chinese-reading", grade);
      const structureQuestion = questions.find((item) => item.label === "段落組織／篇章結構" && item.id.endsWith("-0"));
      const groupCounts = new Map<string, number>();
      for (const question of assessment) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

      expect(structureQuestion).toMatchObject({
        topic: "段落與篇章組織",
        selectionGroup: "篇章與寫作組織",
        module: "理解與應用",
      });
      expect(assessment).toHaveLength(20);
      expect(Array.from(groupCounts.values())).toEqual([4, 4, 4, 4, 4]);
    }
  });

  it("keeps S1 writing metadata precise without changing its five balanced selection groups", () => {
    const questions = buildQuestionPool("chinese-writing", "S1");
    const assessment = randomAssessment("chinese-writing", "S1");
    const expectedItems = [
      ["病句辨識", "句子結構與語法", "語基與詞語", "基礎掌握"],
      ["觀點深化", "觀點發展與論證", "寫作發展", "整合表達"],
      ["應試策略", "寫作規劃與應試準備", "修訂與應試", "整合表達"],
    ] as const;
    const groupCounts = new Map<string, number>();
    for (const question of assessment) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

    for (const [label, topic, selectionGroup, module] of expectedItems) {
      expect(questions.find((item) => item.label === label && item.id.endsWith("-0"))).toMatchObject({ topic, selectionGroup, module });
    }
    expect(assessment).toHaveLength(20);
    expect(Array.from(groupCounts.values())).toEqual([4, 4, 4, 4, 4]);
  });

  it("keeps S1 reading metadata precise without changing its five balanced selection groups", () => {
    const questions = buildQuestionPool("english-reading", "S1");
    const assessment = randomAssessment("english-reading", "S1");
    const expectedItems = [
      ["Text structure (organisation) identification", "Text organisation", "Text organisation", "理解與應用"],
      ["Connector choice (linking words)", "Cohesive devices and connectors", "Text organisation", "理解與應用"],
      ["Writer purpose", "Identifying writer's purpose", "Integrated reading", "理解與應用"],
      ["Evidence selection", "Selecting textual evidence and supporting details", "Integrated reading", "理解與應用"],
      ["Test-taking strategy", "Inference strategies (reading comprehension)", "Integrated reading", "理解與應用"],
    ] as const;
    const groupCounts = new Map<string, number>();
    for (const question of assessment) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

    for (const [label, topic, selectionGroup, module] of expectedItems) {
      expect(questions.find((item) => item.label === label && item.id.endsWith("-0"))).toMatchObject({ topic, selectionGroup, module });
    }
    expect(assessment).toHaveLength(20);
    expect(Array.from(groupCounts.values())).toEqual([4, 4, 4, 4, 4]);
  });

  it("keeps S1 algebra application metadata precise without changing balanced groups", () => {
    const questions = buildQuestionPool("math", "S1");
    const assessment = randomAssessment("math", "S1");
    const expectedItems = [
      ["Word problem", "Number and algebra — evaluate linear expressions", "Multi-step application", "基礎掌握"],
      ["Problem solving", "Number and algebra — solve simple linear equations", "Multi-step application", "基礎掌握"],
    ] as const;
    const groupCounts = new Map<string, number>();
    for (const question of assessment) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

    for (const [label, topic, selectionGroup, module] of expectedItems) {
      expect(questions.find((item) => item.label === label && item.id.endsWith("-0"))).toMatchObject({ topic, selectionGroup, module });
    }
    expect(assessment).toHaveLength(20);
    expect(Array.from(groupCounts.values())).toEqual([4, 4, 4, 4, 4]);
  });

  it("keeps S2 proportion, linear-model and perimeter metadata precise without changing balanced groups", () => {
    const questions = buildQuestionPool("math", "S2");
    const assessment = randomAssessment("math", "S2");
    const expectedItems = [
      ["Direct proportion", "Ratio and proportion", "Ratio and percentage", "基礎掌握"],
      ["Linear expression (cost model)", "Forming linear expressions and cost models", "Multi-step application", "基礎掌握"],
      ["Perimeter of rectangle / find width", "Perimeter: finding a missing dimension", "Multi-step application", "基礎掌握"],
    ] as const;
    const groupCounts = new Map<string, number>();
    for (const question of assessment) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

    for (const [label, topic, selectionGroup, module] of expectedItems) {
      expect(questions.find((item) => item.label === label && item.id.endsWith("-0"))).toMatchObject({ topic, selectionGroup, module });
    }
    expect(assessment).toHaveLength(20);
    expect(Array.from(groupCounts.values())).toEqual([4, 4, 4, 4, 4]);
  });

  it("keeps S3 percentage, graph, sequence and equation metadata precise without changing balanced groups", () => {
    const questions = buildQuestionPool("math", "S3");
    const assessment = randomAssessment("math", "S3");
    const expectedItems = [
      ["Percentage discount (percentage decrease)", "Ratio and percentage", "Ratio and percentage", "基礎掌握"],
      ["Choosing a graph for grouped continuous data", "Statistics and data", "Statistics and data", "基礎掌握"],
      ["Evaluate a sequence formula", "Sequence term evaluation", "Multi-step application", "基礎掌握"],
      ["Algebraic manipulation", "Solve one-variable linear equations", "Multi-step application", "基礎掌握"],
    ] as const;
    const groupCounts = new Map<string, number>();
    for (const question of assessment) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

    for (const [label, topic, selectionGroup, module] of expectedItems) {
      expect(questions.find((item) => item.label === label && item.id.endsWith("-0"))).toMatchObject({ topic, selectionGroup, module });
    }
    expect(assessment).toHaveLength(20);
    expect(Array.from(groupCounts.values())).toEqual([4, 4, 4, 4, 4]);
  });

  it("keeps S1 experiment-reliability metadata precise without changing balanced groups", () => {
    const questions = buildQuestionPool("science", "S1");
    const assessment = randomAssessment("science", "S1");
    const reliabilityQuestion = questions.find((item) => item.label === "Experimental design (reliability)" && item.id.endsWith("-0"));
    const groupCounts = new Map<string, number>();
    for (const question of assessment) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

    expect(reliabilityQuestion).toMatchObject({
      topic: "Experimental design and reliability",
      selectionGroup: "Data and application",
      module: "情境推理",
    });
    expect(assessment).toHaveLength(20);
    expect(Array.from(groupCounts.values())).toEqual([4, 4, 4, 4, 4]);
  });

  it("keeps S2 evidence-based reasoning metadata precise without changing balanced groups", () => {
    const questions = buildQuestionPool("science", "S2");
    const assessment = randomAssessment("science", "S2");
    const conclusionQuestion = questions.find((item) => item.label === "Drawing conclusions from data" && item.id.endsWith("-0"));
    const groupCounts = new Map<string, number>();
    for (const question of assessment) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

    expect(conclusionQuestion).toMatchObject({
      topic: "Evidence-based reasoning",
      selectionGroup: "Data and application",
      module: "理解與應用",
    });
    expect(assessment).toHaveLength(20);
    expect(Array.from(groupCounts.values())).toEqual([4, 4, 4, 4, 4]);
  });

  it("labels the S3 P=VI formula item as electrical power", () => {
    const questions = buildQuestionPool("science", "S3");
    const question = questions.find((item) => item.question.startsWith("Electrical power is calculated") && item.id.endsWith("-0"));
    const motionQuestion = questions.find((item) => item.question.startsWith("A car moves at constant velocity") && item.id.endsWith("-0"));

    expect(question).toMatchObject({
      label: "Electrical power",
      topic: "Forces and electricity",
      module: "理解與應用",
      correct: 0,
    });
    expect(question?.options[question.correct]).toBe("I");
    expect(motionQuestion?.options[motionQuestion.correct]).toBe("It is zero");
    expect(questions).toHaveLength(30);
  });

  it("keeps S1–S3 English writing grammar and register metadata precise without changing balanced groups", () => {
    const expectedItems = [
      ["Subject–verb agreement", "Subject–verb agreement", "Grammar and tense", "基礎掌握"],
      ["Register", "Register and tone (formality and audience)", "Vocabulary and context", "基礎掌握"],
      ["Precision and specificity (revising vague statements)", "Sentence specificity and precision in writing", "Writing expression", "理解與應用"],
      ["Editing", "Sentence structure — parallelism (editing)", "Editing and exam technique", "理解與應用"],
      ["Supporting detail", "Identifying supporting details", "Paragraph organisation", "理解與應用"],
      ["Writing planning (pre-writing) strategy", "Pre-writing planning and composition planning", "Editing and exam technique", "理解與應用"],
    ] as const;

    for (const grade of ["S1", "S2", "S3"] as const) {
      const questions = buildQuestionPool("english-writing", grade);
      const assessment = randomAssessment("english-writing", grade);
      const groupCounts = new Map<string, number>();
      for (const question of assessment) groupCounts.set(question.selectionGroup, (groupCounts.get(question.selectionGroup) ?? 0) + 1);

      for (const [label, topic, selectionGroup, module] of expectedItems) {
        expect(questions.find((item) => item.label === label && item.id.endsWith("-0"))).toMatchObject({ topic, selectionGroup, module });
      }
      expect(assessment).toHaveLength(20);
      expect(Array.from(groupCounts.values())).toEqual([4, 4, 4, 4, 4]);
    }
  });
});

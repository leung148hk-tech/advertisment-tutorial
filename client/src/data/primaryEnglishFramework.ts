export type PrimaryEnglishGrade = "P1" | "P2" | "P3" | "P4" | "P5" | "P6";
export type PrimaryEnglishTrack = "english-reading" | "english-writing";

export type PrimaryEnglishDomain = {
  label: string;
  focus: string;
};

export type PrimaryEnglishGradeFramework = {
  keyStage: "Key Stage 1" | "Key Stage 2";
  readingDomains: readonly PrimaryEnglishDomain[];
  writingDomains: readonly PrimaryEnglishDomain[];
  writingOutputTarget: string;
  progression: string;
};

/**
 * Parent-facing English assessment framework for P1–P6.
 * It translates the user-provided spiral curriculum into five balanced,
 * grade-specific domains for each assessed skill. Word-count ranges are
 * teaching targets; the multiple-choice writing paper assesses preparation,
 * language choices and revision rather than marking a full composition.
 */
export const PRIMARY_ENGLISH_FRAMEWORK: Record<PrimaryEnglishGrade, PrimaryEnglishGradeFramework> = {
  P1: {
    keyStage: "Key Stage 1",
    readingDomains: [
      { label: "字母音素與生活詞彙", focus: "Consonant and short-vowel sounds; self, family, school and daily routines." },
      { label: "名詞、代名詞與現在式", focus: "Singular/plural nouns, I/you/he/she/it, and simple present forms of be and have." },
      { label: "兒歌與圖畫故事", focus: "Short rhymes and highly illustrated stories." },
      { label: "人物、場景與明示訊息", focus: "Identify characters, settings and directly stated details." },
      { label: "句首大寫與句末標點", focus: "Capital letters, full stops and question marks in short texts." },
    ],
    writingDomains: [
      { label: "句型範本與語序", focus: "Build short subject–verb sentences, including “This is a …”." },
      { label: "名詞、代名詞與 be／have", focus: "Choose accurate simple forms for people, things and possession." },
      { label: "大寫、句號與問號", focus: "Apply basic sentence conventions." },
      { label: "生活詞彙與拼讀線索", focus: "Use familiar self, family, school and routine words with sound–letter awareness." },
      { label: "看圖短句規劃", focus: "Select relevant details for a short illustrated response." },
    ],
    writingOutputTarget: "10–20 words",
    progression: "以音素、常用詞與完整短句建立英文讀寫起點。",
  },
  P2: {
    keyStage: "Key Stage 1",
    readingDomains: [
      { label: "長元音、 magic e 與主題詞彙", focus: "Long-vowel patterns and vocabulary for hobbies, weather, food and animals." },
      { label: "進行式、 can 與位置介詞", focus: "Present continuous, can/cannot, and in/on/under/next to." },
      { label: "寓言與步驟文本", focus: "Simple fables and procedural texts." },
      { label: "明示訊息與步驟次序", focus: "Extract stated information and order simple steps." },
      { label: "and／but 連接想法", focus: "Understand how and and but join related or contrasting ideas." },
    ],
    writingDomains: [
      { label: "描述句與句子連接", focus: "Expand descriptions using and and but." },
      { label: "進行式、 can 與位置介詞", focus: "Use growing grammar resources in short sentences." },
      { label: "興趣、天氣、食物與動物詞彙", focus: "Choose precise familiar vocabulary." },
      { label: "簡短日記與描述目的", focus: "Recognise useful content for a basic description or diary entry." },
      { label: "句子檢查與看圖組織", focus: "Review simple sentences for clarity and relevance." },
    ],
    writingOutputTarget: "30–50 words",
    progression: "由單句擴展至以連接詞表達的簡短描述及日記。",
  },
  P3: {
    keyStage: "Key Stage 1",
    readingDomains: [
      { label: "子音群、二合字母與主題詞彙", focus: "Consonant blends, digraphs, and vocabulary for jobs, community places and health." },
      { label: "過去式與頻率副詞", focus: "Regular/common irregular past tense and always/sometimes/never." },
      { label: "because 因果連接", focus: "Understand and choose cause–reason links." },
      { label: "圖畫書、圖表與餐牌閱讀", focus: "Read multi-page picture books, simple charts and menus." },
      { label: "事件次序與段落重點", focus: "Sequence events and identify the focus of a short text." },
    ],
    writingDomains: [
      { label: "完整段落與句子銜接", focus: "Group connected sentences into one cohesive paragraph." },
      { label: "過去式、頻率副詞與 because", focus: "Use new grammar to explain events and routines." },
      { label: "社區、職業與健康詞彙", focus: "Choose topic-appropriate vocabulary." },
      { label: "寓言、書信與明信片", focus: "Recognise the purpose and core parts of target text types." },
      { label: "次序與內容檢查", focus: "Plan and revise for a clear beginning, sequence and ending." },
    ],
    writingOutputTarget: "60–80 words",
    progression: "由句子群過渡到有次序、能表達因果的單段文字。",
  },
  P4: {
    keyStage: "Key Stage 2",
    readingDomains: [
      { label: "搭配、片語動詞與主題詞彙", focus: "Collocations, phrasal verbs, idioms, environment and world-culture vocabulary." },
      { label: "未來式、比較級與時間介詞", focus: "Will versus be going to, comparatives/superlatives, and at/on/in." },
      { label: "資訊文章與新聞報道", focus: "Read informational articles and simple news reports." },
      { label: "多段故事與主旨", focus: "Follow text structure and identify main ideas in multi-paragraph stories." },
      { label: "段落結構與訊息組織", focus: "Recognise introduction, supporting information and conclusion signals." },
    ],
    writingDomains: [
      { label: "三段結構規劃", focus: "Plan an introduction, body and conclusion." },
      { label: "未來式、比較級與時間介詞", focus: "Use grade-appropriate grammar accurately." },
      { label: "環境與世界文化詞彙", focus: "Select suitable vocabulary, collocations and phrasal verbs." },
      { label: "日誌與簡單資訊報告", focus: "Match organisation and content to the target form." },
      { label: "段落銜接與修訂", focus: "Check logical order and clear links between paragraphs." },
    ],
    writingOutputTarget: "80–100 words",
    progression: "閱讀由短篇過渡至多段文本；寫作開始使用完整三段結構。",
  },
  P5: {
    keyStage: "Key Stage 2",
    readingDomains: [
      { label: "字首字尾與專題詞彙", focus: "Prefixes, suffixes, technology/disaster vocabulary and emotional adjectives." },
      { label: "完成式、副詞與第一條件句", focus: "Present perfect, adverbs of manner and first conditional." },
      { label: "傳記、詩歌與意見文本", focus: "Read biographies, poems and opinion pieces." },
      { label: "推論與文本證據", focus: "Infer meaning and viewpoint from language and supporting details." },
      { label: "觀點、理由與情感", focus: "Identify claims, reasons and feelings in increasingly varied texts." },
    ],
    writingDomains: [
      { label: "故事高潮與敘事結構", focus: "Plan a narrative with a clear build-up and climax." },
      { label: "完成式、副詞與第一條件句", focus: "Apply grade-appropriate grammar in context." },
      { label: "科技、災害與情感詞彙", focus: "Use word parts and precise topic vocabulary." },
      { label: "正式書信與評論", focus: "Recognise purpose, audience and key conventions for letters and reviews." },
      { label: "觀點、證據與修訂", focus: "Strengthen a response with relevant details and a focused final check." },
    ],
    writingOutputTarget: "100–120 words",
    progression: "從找明示訊息提升至以文本證據作推論，並以目的與讀者意識發展寫作。",
  },
  P6: {
    keyStage: "Key Stage 2",
    readingDomains: [
      { label: "同反義詞與進階連接詞", focus: "Synonyms, antonyms, however, therefore and furthermore." },
      { label: "被動語態、轉述與情態動詞", focus: "Passive voice, reported speech, obligation and advice." },
      { label: "論說文、複雜新聞與文學節選", focus: "Read argumentative essays, complex news reports and abridged classics." },
      { label: "語氣、事實意見與偏見", focus: "Identify tone; distinguish fact, opinion and possible bias." },
      { label: "論點、證據與批判閱讀", focus: "Evaluate how evidence supports a claim before secondary school." },
    ],
    writingDomains: [
      { label: "多段論證與創意結構", focus: "Plan well-reasoned leaflets, magazine articles and creative stories." },
      { label: "被動語態、轉述與情態動詞", focus: "Use new grammar for formality, reporting and advice." },
      { label: "同反義詞與進階連接", focus: "Choose precise vocabulary and logical transitions." },
      { label: "傳單、校刊與創意故事", focus: "Match language, content and organisation to genre and audience." },
      { label: "論證、語氣與全篇修訂", focus: "Check reasoning, audience fit, coherence and accuracy." },
    ],
    writingOutputTarget: "120–150+ words",
    progression: "以批判閱讀與有理據的多段寫作銜接初中英文。",
  },
};

export function primaryEnglishSelectionGroup(grade: PrimaryEnglishGrade, track: PrimaryEnglishTrack, domainIndex: number) {
  return `primary-${grade.toLowerCase()}-${track}-${domainIndex}`;
}

export function primaryEnglishDomains(grade: PrimaryEnglishGrade, track: PrimaryEnglishTrack) {
  return PRIMARY_ENGLISH_FRAMEWORK[grade][track === "english-reading" ? "readingDomains" : "writingDomains"];
}

export function primaryEnglishCombinedDomains(grade: PrimaryEnglishGrade) {
  const framework = PRIMARY_ENGLISH_FRAMEWORK[grade];
  return [
    ...framework.readingDomains.map((domain) => ({ ...domain, label: `閱讀：${domain.label}` })),
    ...framework.writingDomains.map((domain) => ({ ...domain, label: `寫作基礎：${domain.label}` })),
  ];
}

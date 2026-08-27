export type PrimaryChineseGrade = "P1" | "P2" | "P3" | "P4" | "P5" | "P6";

export type PrimaryChineseReadingDomain = {
  id: string;
  label: string;
  focus: string;
};

type PrimaryChineseReadingFramework = {
  stage: "初小" | "高小";
  description: string;
  domains: readonly [
    PrimaryChineseReadingDomain,
    PrimaryChineseReadingDomain,
    PrimaryChineseReadingDomain,
    PrimaryChineseReadingDomain,
    PrimaryChineseReadingDomain,
  ];
};

/**
 * 小學中文閱讀的公開評核範疇。
 * 此為本平台依家長提供的螺旋式進階要求設計的參考框架，不代表個別學校教科書的編排。
 */
export const PRIMARY_CHINESE_READING_FRAMEWORK: Record<PrimaryChineseGrade, PrimaryChineseReadingFramework> = {
  P1: {
    stage: "初小",
    description: "識字與基本閱讀起步：以字形、字詞、基本句子、淺易篇章及誦讀感受為主。",
    domains: [
      { id: "literacy", label: "字形、筆畫與部首", focus: "筆畫順序、部首及象形／指事初步辨識" },
      { id: "words-sentences", label: "字詞與基本句子", focus: "常用字詞、誰＋做甚麼句式及人物／時間訊息" },
      { id: "punctuation", label: "基本標點與句式", focus: "逗號、句號、問號、感嘆號及簡單句意" },
      { id: "early-reading", label: "兒歌與童話閱讀", focus: "兒歌、童話短文的主要角色、時間及直接訊息" },
      { id: "literature", label: "簡單修辭與古詩", focus: "淺易比喻／擬人及五言絕句誦讀感受" },
    ],
  },
  P2: {
    stage: "初小",
    description: "字詞積累與看圖閱讀：由句子理解延展到段落大意、順敘與五言絕句。",
    domains: [
      { id: "vocabulary", label: "詞義辨析與查字典", focus: "近義詞、反義詞、詞語分類及按部首／筆畫查字典" },
      { id: "sentence-punctuation", label: "句式與標點運用", focus: "陳述、疑問、祈使句及冒號、引號" },
      { id: "paragraph", label: "段落大意與順敘", focus: "簡淺敘述段落大意及事情先後" },
      { id: "narrative", label: "看圖與敘事閱讀", focus: "人物、地點、事件和順敘線索" },
      { id: "literature", label: "修辭與五言絕句", focus: "排比、反覆的初步辨識及《靜夜思》等誦讀理解" },
    ],
  },
  P3: {
    stage: "初小",
    description: "由讀句過渡至讀段：詞彙擴展、複句、中心句、實用文及七言絕句。",
    domains: [
      { id: "vocabulary", label: "詞彙、成語與字詞辨錯", focus: "簡單成語運用、常見錯別字及詞義" },
      { id: "sentence-punctuation", label: "複句、標點與專名", focus: "因果、承接複句及頓號、專名號、書名號" },
      { id: "paragraph", label: "中心句與段落組織", focus: "中心句、段落重點和直接支持細節" },
      { id: "text-types", label: "倒敘與實用文閱讀", focus: "倒敘線索及便條、通知、書信的基本資訊" },
      { id: "literature", label: "修辭與七言絕句", focus: "對偶、疊字及七言絕句的字面理解" },
    ],
  },
  P4: {
    stage: "高小",
    description: "文體多元與篇章分層：把字詞、複句、說明文及詩歌感受連結起來。",
    domains: [
      { id: "vocabulary", label: "字形、字音與詞義辨析", focus: "同音字、形近字、近義詞差異及較複雜成語的意思和搭配" },
      { id: "sentence-punctuation", label: "轉折複句與進階標點", focus: "雖然……但是……、分號及省略號" },
      { id: "text-structure", label: "寓言、神話與說明文", focus: "文體特徵、段落層意及說明方法" },
      { id: "rhetoric", label: "修辭與篇章結構", focus: "擬物、誇張及開頭、正文、結尾的作用" },
      { id: "literature", label: "七言絕句與文學感受", focus: "古詩畫面、感情及常見表達手法" },
    ],
  },
  P5: {
    stage: "高小",
    description: "深層理解與修辭進階：閱讀議論、抒情散文，歸納要點並感受思想感情。",
    domains: [
      { id: "vocabulary", label: "詞語感情色彩與詞義", focus: "褒義、貶義、中性詞及語境詞義" },
      { id: "sentence-punctuation", label: "條件假設複句與破折號", focus: "條件、假設複句及破折號的作用" },
      { id: "reading-strategy", label: "要點歸納與思想感情", focus: "內容要點、借景抒情及作者情感" },
      { id: "text-types", label: "議論與散文閱讀", focus: "觀點、理由、設問、反問及借代" },
      { id: "literature", label: "律詩格式、文化與內容理解", focus: "對仗、押韻、文化背景及詩歌內容感受" },
    ],
  },
  P6: {
    stage: "高小",
    description: "升中銜接與綜合理解：比較觀點、認識文言，並賞析古詩宋詞的語言和感情。",
    domains: [
      { id: "vocabulary", label: "熟語與多義詞運用", focus: "成語、諺語、俗語、歇後語及語境辨析" },
      { id: "sentence-punctuation", label: "讓步遞進複句與標點", focus: "讓步、遞進複句及綜合標點運用" },
      { id: "comparative-reading", label: "比較閱讀與觀點證據", focus: "比較不同篇章觀點及找出文本證據" },
      { id: "classical", label: "淺易文言與進階修辭", focus: "《論語》選段、寓言、雙關及頂真初步理解" },
      { id: "literature", label: "古詩宋詞賞析", focus: "古體詩、宋詞選段的畫面、感情和表達效果" },
    ],
  },
};

export function primaryChineseSelectionGroup(grade: PrimaryChineseGrade, domainIndex: number) {
  return `primary-chinese-reading-${grade}-${domainIndex}`;
}

# 小學英文題庫整合審核紀錄

**更新範圍：** P1–P6 單一「英文」評估。每級把原先已逐題覆核的閱讀及寫作基礎內容整合為同一份題池；此文件不聲稱與任何指定學校教材進度完全一致，亦不構成校內考試或專業診斷。

## 結構與抽題

| 項目 | 現行規則 |
|---|---|
| 題庫規模 | 每級 50 條獨立題幹；P1–P6 共 300 條題目 |
| 範疇 | 5 個閱讀範疇 + 5 個寫作基礎範疇，以「英文」統稱 |
| 隨機抽題 | 10 個內部分組各抽 2 題，共 20 題 |
| 重覆控制 | 不使用「校園／社區／日常生活延伸題」字尾；每級 50 條顯示題幹均不同 |
| 選項品質 | 每題 4 個非重覆選項、有效答案索引；每級正式題池均涵蓋 A、B、C、D 正確位置 |
| 報告呈現 | 顯示「英文範疇（閱讀與寫作基礎）」及 10 張範疇卡，不顯示分開的英文閱讀／英文寫作卷 |

## 分級範圍

各級保留原有螺旋式框架：P1–P3 聚焦 phonics、生活詞彙、基本文法、短文本及句子／段落準備；P4–P6 逐步加入多段文本、資訊與文學文體、進階文法、觀點證據及多段寫作規劃。寫作字數仍只屬教學目標；選擇題只評估構思、語言選擇、組織與修訂準備。

## 覆核與可重複驗證

`PRIMARY_ENGLISH_ITEM_REVIEW.md` 列出六級共 300 條題目的題幹、四個選項、正式答案、英文範疇、label／module 及覆核結論。執行 `pnpm audit:primary-english` 會輸出 `audit/primary-english-audit.json`，檢查每級 50 題、50 條不同題幹、10 組各 5 題、抽題 10 組各 2 題、答案索引與位置平衡。

香港教育局的[英文語文教育課程文件入口](https://www.edb.gov.hk/en/curriculum-development/kla/eng-edu/curriculum-documents.html)僅作公開課程取向參考。[1]

[1]: https://www.edb.gov.hk/en/curriculum-development/kla/eng-edu/curriculum-documents.html "Education Bureau — English Language Education Curriculum Documents"

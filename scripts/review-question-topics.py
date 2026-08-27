#!/usr/bin/env python3
"""Independently review whether question labels, topics and modules match each item's skill."""

from __future__ import annotations

import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


if len(sys.argv) != 3:
    raise SystemExit("Usage: python3 scripts/review-question-topics.py <grade> <track>")

grade, track = sys.argv[1], sys.argv[2]
root = Path(__file__).resolve().parents[1]
inventory_path = root / "audit" / "question-bank-inventory.json"
if not inventory_path.exists():
    raise SystemExit("Missing audit/question-bank-inventory.json. Run pnpm audit:questions first.")

inventory = json.loads(inventory_path.read_text())
all_questions = [
    item
    for item in inventory["questions"]
    if item["grade"] == grade and item["id"].startswith(f"{track}-{grade}-")
]
questions = [
    item
    for item in all_questions
    if item["id"].endswith("-0")
]

if not questions:
    raise SystemExit(f"No canonical items found for {grade} {track}.")
has_context_variants = len(all_questions) > len(questions)
variant_instruction = (
    "Each listed canonical item has context-only variants with identical metadata, so your finding applies to all stored variants."
    if has_context_variants
    else "Each listed item is an independent standalone question; assess its metadata independently."
)

model = os.environ.get("REVIEW_MODEL", "gpt-5-mini")
chunk_size = max(1, int(os.environ.get("REVIEW_CHUNK_SIZE", "2")))

schema = {
    "name": "question_topic_review",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "batchSummary": {"type": "string"},
            "reviews": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "verdict": {"type": "string", "enum": ["PASS", "REVISE", "ESCALATE"]},
                        "topicMatches": {"type": "boolean"},
                        "labelMatches": {"type": "boolean"},
                        "moduleMatches": {"type": "boolean"},
                        "reason": {"type": "string"},
                        "recommendedTopic": {"type": "string"},
                        "recommendedLabel": {"type": "string"},
                        "recommendedModule": {"type": "string"},
                    },
                    "required": [
                        "id",
                        "verdict",
                        "topicMatches",
                        "labelMatches",
                        "moduleMatches",
                        "reason",
                        "recommendedTopic",
                        "recommendedLabel",
                        "recommendedModule",
                    ],
                    "additionalProperties": False,
                },
            },
        },
        "required": ["batchSummary", "reviews"],
        "additionalProperties": False,
    },
}

system = """You are a meticulous Hong Kong primary and junior-secondary assessment moderator.
Review each multiple-choice item's metadata independently. Decide the actual skill the question measures from its stem, hint and options, then assess whether supplied topic, label and module accurately name that skill. Do not treat a broad module as wrong merely because it is not maximally specific; it must still be educationally coherent. A topic such as 'Reading details', 'Vocabulary', 'Sentence structure', 'Paragraph organisation', 'Number and algebra', 'Data handling', 'Interview communication', or 'Science inquiry' should match what students must actually do.

For P1-P6 Chinese reading only, the topic intentionally names one of five parent-report domains for that grade, while the label names the precise subskill (for example '人物辨識', '時間訊息', '古詩動物', or '擬聲詞辨識'). The user-specified parent domains are authoritative for this review: P1 uses 字形、筆畫與部首／字詞與基本句子／基本標點與句式／兒歌與童話閱讀／簡單修辭與古詩; P2 uses 詞義辨析與查字典／句式與標點運用／段落大意與順敘／看圖與敘事閱讀／修辭與五言絕句; P3 uses 詞彙、成語與字詞辨錯／複句、標點與專名／中心句與段落組織／倒敘與實用文閱讀／修辭與七言絕句; P4 uses 字形、字音與詞義辨析／轉折複句與進階標點／寓言、神話與說明文／修辭與篇章結構／七言絕句與文學感受; P5 uses 詞語感情色彩與詞義／條件假設複句與破折號／要點歸納與思想感情／議論與散文閱讀／律詩格式、文化與內容理解; P6 uses 熟語與多義詞運用／讓步遞進複句與標點／比較閱讀與觀點證據／淺易文言與進階修辭／古詩宋詞賞析. A parent domain can explicitly join two curriculum elements with 「與」: an item that genuinely tests either named element is correctly classified. Do not substitute a different grade's topic or require a new one-item topic merely because the label is more specific or only one joined domain element appears in the stem. Mark REVISE only where a metadata field is substantively misleading, and give precise replacement names without modifying the question itself. Return JSON only."""

if grade.startswith("P") and track in {"english-reading", "english-writing"}:
    system += """

For P1-P6 English reading and English writing only, the topic intentionally names one of five user-authorised, grade-specific parent-report domains. The domain labels are written in Traditional Chinese for parents but name English-language skills such as phonics/vocabulary, grammar, text types and reading strategies, writing purpose, organisation, and revision. Treat the five topic labels present in the supplied items as authoritative parent domains: do not reject a topic merely because it is bilingual, broad, or combines two related curriculum elements. The precise item label identifies the narrower subskill. English writing is a selected-response writing-preparation paper that checks planning, language choices and revision; it does not claim to auto-mark a full composition. Mark REVISE only where a metadata field is substantively misleading. Return JSON only."""


def review_chunk(items: list[dict], part: int, total_parts: int) -> dict:
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "task": f"Review metadata alignment for every canonical item. {variant_instruction}",
                        "grade": grade,
                        "track": track,
                        "part": f"{part} of {total_parts}",
                        "items": [
                            {
                                "id": item["id"],
                                "label": item["label"],
                                "topic": item["topic"],
                                "module": item["module"],
                                "difficulty": item["difficulty"],
                                "question": item["question"],
                                "hint": item["hint"],
                                "options": item["options"],
                                "correctAnswer": item["answer"],
                            }
                            for item in items
                        ],
                    },
                    ensure_ascii=False,
                ),
            },
        ],
        "response_format": {"type": "json_schema", "json_schema": schema},
        "max_completion_tokens": 5000,
        "reasoning": {"effort": "high"},
    }
    request = urllib.request.Request(
        f"{os.environ['OPENAI_API_BASE'].rstrip('/')}/chat/completions",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=300) as response:
        result = json.loads(response.read())
    if "choices" not in result:
        raise RuntimeError(f"LLM metadata review request did not return choices: {json.dumps(result, ensure_ascii=False)}")
    reviewed = json.loads(result["choices"][0]["message"]["content"])
    found_ids = {item["id"] for item in reviewed["reviews"]}
    expected_ids = {item["id"] for item in items}
    if found_ids != expected_ids:
        raise RuntimeError(f"Metadata review did not cover exactly the requested IDs. Missing={expected_ids - found_ids}; extra={found_ids - expected_ids}")
    return reviewed


chunks = [questions[index:index + chunk_size] for index in range(0, len(questions), chunk_size)]
chunk_reviews = [review_chunk(chunk, index + 1, len(chunks)) for index, chunk in enumerate(chunks)]
review = {
    "batchSummary": "\n\n".join(f"Part {index + 1}/{len(chunk_reviews)}: {entry['batchSummary']}" for index, entry in enumerate(chunk_reviews)),
    "reviews": [entry for chunk in chunk_reviews for entry in chunk["reviews"]],
}
output = {
    "generatedAt": datetime.now(timezone.utc).isoformat(),
    "grade": grade,
    "track": track,
    "canonicalQuestionCount": len(questions),
    "variantQuestionCount": len(all_questions),
    "model": model,
    "review": review,
}
output_path = root / "audit" / f"topic-review-{grade}-{track}.json"
output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
print(f"Wrote {output_path.relative_to(root)}")
print(f"Reviewed metadata for {len(questions)} canonical items / {len(all_questions)} stored questions.")

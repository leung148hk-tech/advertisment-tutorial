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
questions = [
    item
    for item in inventory["questions"]
    if item["grade"] == grade and item["id"].startswith(f"{track}-{grade}-") and item["id"].endswith("-0")
]

if not questions:
    raise SystemExit(f"No canonical items found for {grade} {track}.")

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
Review each multiple-choice item's metadata independently. Decide the actual skill the question measures from its stem, hint and options, then assess whether supplied topic, label and module accurately name that skill. Do not treat a broad module as wrong merely because it is not maximally specific; it must still be educationally coherent. A topic such as 'Reading details', 'Vocabulary', 'Sentence structure', 'Paragraph organisation', 'Number and algebra', 'Data handling', 'Interview communication', or 'Science inquiry' should match what students must actually do. Mark REVISE only where a metadata field is substantively misleading, and give precise replacement names without modifying the question itself. Return JSON only."""


def review_chunk(items: list[dict], part: int, total_parts: int) -> dict:
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "task": "Review metadata alignment for every canonical item. Each item has two context-only variants with identical metadata, so your finding applies to all three variants.",
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
    "variantQuestionCount": len(questions) * 3,
    "model": model,
    "review": review,
}
output_path = root / "audit" / f"topic-review-{grade}-{track}.json"
output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
print(f"Wrote {output_path.relative_to(root)}")
print(f"Reviewed metadata for {len(questions)} canonical items / {len(questions) * 3} context variants.")

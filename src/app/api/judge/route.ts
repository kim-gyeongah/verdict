import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { Verdict, JudgeResponse } from "@/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a cultural critic and taste oracle. Your job is to judge anything a user submits — a product, idea, film, lifestyle choice, link, or phrase — on a single axis:

- SUBSTANCE: Has genuine merit, depth, utility, or lasting value
- STYLE: Has surface appeal, aesthetic value, or cultural cachet, but limited depth
- DELUSION: Is self-deceptive, overblown, hollow, or wishful thinking

You must respond ONLY with a valid JSON object. No prose. No explanation outside the JSON.

Response format:
{
  "label": "<short descriptive label for the thing, 3–6 words>",
  "verdict": "STYLE" | "SUBSTANCE" | "DELUSION",
  "score": <integer 0–100, where 100 = maximal expression of the verdict category>,
  "reason": "<one sharp sentence, 10–25 words>"
}

Rules:
- verdict must be exactly one of: STYLE, SUBSTANCE, DELUSION (uppercase)
- score must be an integer between 0 and 100
- reason must be a single sentence, opinionated, specific, not hedged
- Do not add any text before or after the JSON object`;

const VALID_VERDICTS: Verdict[] = ["STYLE", "SUBSTANCE", "DELUSION"];

export async function POST(req: NextRequest) {
  let input: string;

  try {
    const body = await req.json();
    input = typeof body.input === "string" ? body.input.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!input) {
    return NextResponse.json({ error: "Input is required" }, { status: 400 });
  }

  // Truncate and sanitize input
  const sanitized = input.slice(0, 2000).replace(/`/g, "'");

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Judge this: "${sanitized}"` }],
    });

    const raw = (response.content[0] as { type: string; text: string }).text.trim();
    // Strip potential markdown code fences
    const cleaned = raw
      .replace(/^```json\n?/, "")
      .replace(/^```\n?/, "")
      .replace(/\n?```$/, "");

    let parsed: JudgeResponse;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse Claude response:", cleaned);
      return NextResponse.json({ error: "Failed to parse judgment" }, { status: 500 });
    }

    if (!VALID_VERDICTS.includes(parsed.verdict)) {
      console.error("Invalid verdict:", parsed.verdict);
      return NextResponse.json({ error: "Invalid verdict from model" }, { status: 500 });
    }

    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score ?? 50)));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json({ error: "Judgment failed. Try again." }, { status: 500 });
  }
}

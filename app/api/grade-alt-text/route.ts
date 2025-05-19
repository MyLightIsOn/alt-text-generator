import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const prompt = `
You are an expert alt text evaluator. Analyze the following alt text and grade it from 0.0 to 5.0 based on clarity, completeness, relevance, and conciseness.

Alt Text:
"${text}"

Respond with a JSON object like this:
{
  "score": 4.5,
  "issues": [
    { "severity": "Minor", "message": "Avoid using 'image of' at the start." },
    { "severity": "Enhancement", "message": "Could include the setting for more context." }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const result = completion.choices[0]?.message?.content?.trim();
    const json = JSON.parse(result || "{}");
    return NextResponse.json(json);
  } catch (error) {
    console.error("[grade-alt-text API ERROR]", error);
    return NextResponse.json(
      { error: "Failed to grade alt text" },
      { status: 500 },
    );
  }
}

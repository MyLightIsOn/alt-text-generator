import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in writing concise, descriptive, and accessible alt text for images.",
        },
        {
          role: "user",
          content: `Based on the following description so far:\n\n"${description}"\n\nWrite a clear and effective alt text (max 150 characters).`,
        },
      ],
      temperature: 0.5,
    });

    const altText = completion.choices[0]?.message?.content?.trim();
    return NextResponse.json({ altText });
  } catch (error) {
    console.error("[generate-alt-text API ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate alt text" },
      { status: 500 },
    );
  }
}

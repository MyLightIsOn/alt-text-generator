import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const { altTextSoFar } = await req.json();
    console.log(process.env);
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `You are helping someone write high-quality alternative text for an image.\n\nBased on the current description: "${altTextSoFar}", suggest ONE follow-up question that would help make the description more complete, vivid, or accessible.\n\nJust return the question without any extra commentary.`,
        },
      ],
      temperature: 0.7,
    });

    const question = completion.choices[0]?.message?.content?.trim();
    return NextResponse.json({ question });
  } catch (error) {
    console.error("[next-question API ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate follow-up question" },
      { status: 500 },
    );
  }
}

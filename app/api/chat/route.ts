import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeechWithVisemes } from "../../lib/ttsService";
import fetch from "node-fetch";

export async function POST(req: NextRequest) {
  const { message, personalityId, sessionId } = await req.json();

  try {
    const response = await fetch(
      "https://jpspeak0316.app.n8n.cloud/webhook/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          personalityId,
          sessionId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send request");
    }

    const { output } = await response.json();

    const { audioBuffer, visemes } = await synthesizeSpeechWithVisemes(output);

    return NextResponse.json({
      personalityId,
      message: output,
      audioBase64: audioBuffer.toString("base64"),
      visemes,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

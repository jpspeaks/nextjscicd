import { NextRequest, NextResponse } from "next/server";
import { getGPTResponse } from "../../lib/gptService";
import { synthesizeSpeechWithVisemes } from "../../lib/ttsService";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const text = await getGPTResponse(message);
    const { audioBuffer, visemes } = await synthesizeSpeechWithVisemes(text);

    return NextResponse.json({
      text,
      audioBase64: audioBuffer.toString("base64"),
      visemes,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

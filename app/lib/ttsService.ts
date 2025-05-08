import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export const synthesizeSpeechWithVisemes = (
  text: string
): Promise<{
  audioBuffer: Buffer;
  visemes: { visemeId: number; audioOffset: number }[];
}> => {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_KEY!,
      process.env.AZURE_REGION!
    );

    speechConfig.speechSynthesisVoiceName = "en-US-GuyNeural";
    speechConfig.requestWordLevelTimestamps();
    speechConfig.setProperty("SpeechServiceResponse_RequestViseme", "true");

    const visemes: { visemeId: number; audioOffset: number }[] = [];

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.visemeReceived = (s, e) => {
      visemes.push({
        visemeId: e.visemeId,
        audioOffset: e.audioOffset,
      });
    };

    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const buffer = Buffer.from(result.audioData);
          resolve({ audioBuffer: buffer, visemes: visemes });
        } else {
          reject(new Error("Synthesis failed"));
        }
        synthesizer.close();
      },
      (error) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
};

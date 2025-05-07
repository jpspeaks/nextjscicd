import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getGPTResponse = async (message: string): Promise<string> => {
  const chat = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: message }],
  });

  return chat.choices[0]?.message.content || "";
};

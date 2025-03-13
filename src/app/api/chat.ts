import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

interface Message {
  sender: string;
  text: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  let conversation: Message[] = [];
  conversation.push({ sender: "User", text: prompt });

  for (let i = 0; i < 10; i++) {
    const sender = i % 2 === 0 ? "Bot A" : "Bot B";

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    conversation.push({ sender, text: response.data.choices[0].message?.content || "Error generating response" });
  }

  res.status(200).json({ conversation });
}

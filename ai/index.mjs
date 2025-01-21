import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4-turbo");

export const answerMyQuestion = async (prompt) => {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
};

const answer = await answerMyQuestion(
  "what is the chemical formula for dihydrogen monoxide?",
);

console.log(answer);

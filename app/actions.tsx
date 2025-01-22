import { ReactNode } from "react";
import { getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(
  input: string,
): Promise<ClientMessage[]> {
  "use server";
  const history = getMutableAIState();

  const result = await streamUI({
    model: openai("gpt-4-turbo"),
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages:ServerMessage[]) =>
          messages.push({ role: "assistant", content }),
        );
      }
    },
  });
}

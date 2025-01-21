/* "use client";

import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";

export default function Page() {
  const { messages, input, setInput, append } = useChat({
    api: "/api/completion",
  });

  return (
    <div className="p-4">
      <Input
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            append({ content: input, role: "user" });
          }
        }}
      />

      {messages.map((message, index) => (
        <div key={index}>{message.content}</div>
      ))}
    </div>
  );
}
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

function Page() {
  const [generation, setGeneration] = useState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-5 p-4">
      <Button
        onClick={async () => {
          setIsLoading(true);

          await fetch("/api/completion", {
            method: "POST",
            body: JSON.stringify({
              prompt:
                "Create a new scene with a gradient background. Add one text as well",
            }),
          }).then((response) => {
            response.json().then((json) => {
              setGeneration(json);
              setIsLoading(false);
            });
          });
        }}
      >
        Generate
      </Button>
      <Card>
        <CardContent className="p-2">
          {isLoading ? "Loading..." : <pre>{JSON.stringify(generation)}</pre>}
        </CardContent>
      </Card>
    </div>
  );
}

const PageWrapper = () => {
  return (
    <section className="p-10">
      <Page />
    </section>
  );
};
export default PageWrapper;

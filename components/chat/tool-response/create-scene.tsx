import type {
  BaseSceneConfigSchemaWithIds,
  BaseSceneConfigSchemaWithoutIds,
} from "@/app/api/chat-claude/shared-types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ToolInvocation } from "ai";
import { ArrowUp } from "lucide-react";
import React, { useState } from "react";
import type { z } from "zod";

const SceneRenderer = ({
  scene,
}: {
  scene: z.infer<typeof BaseSceneConfigSchemaWithIds>;
}) => {
  return (
    <div className="relative rounded-[4px] bg-neutral-900/50 p-2 text-sm">
      <pre>{JSON.stringify(scene, null, 2)}</pre>
    </div>
  );
};

const CreateScene = ({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation;
}) => {
  const [selectedTab, setSelectedTab] = useState<"preview" | "text">("text");

  if (toolInvocation.state !== "result") {
    return <div>{toolInvocation.state}</div>;
  }

  const { scenes, suggestedImprovements } = toolInvocation.result as {
    scenes: Array<z.infer<typeof BaseSceneConfigSchemaWithIds>>;
    suggestedImprovements: string[];
  };

  return (
    <section className="relative">
      <div className="absolute -right-2 -top-2 z-10 max-w-fit rounded-full border border-neutral-900 bg-black text-sm">
        <Button
          variant="secondary"
          className={cn("rounded-full bg-transparent px-4", {
            "bg-primary/70": selectedTab === "text",
          })}
          size="sm"
          onClick={() => setSelectedTab("text")}
        >
          Text
        </Button>
        <Button
          variant="secondary"
          className={cn("rounded-full bg-transparent px-4", {
            "bg-primary/70": selectedTab === "preview",
          })}
          size="sm"
          onClick={() => setSelectedTab("preview")}
        >
          Preview
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        <div className="mt-2 flex flex-col gap-4 rounded-sm border border-neutral-900 p-2">
          {scenes.map((scene) => {
            return <SceneRenderer key={scene.id} scene={scene} />;
          })}
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <p>Suggested Improvements ✨</p>
          <div className="flex flex-col gap-2 text-sm">
            {suggestedImprovements.map((suggestion) => {
              return (
                <Button variant="outline" className="flex justify-between">
                  <div>✨ {suggestion}</div>
                  <ArrowUp className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateScene;

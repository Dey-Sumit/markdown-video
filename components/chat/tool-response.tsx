import SceneConfigDisplay from "@/app/ai/chat-v3/scene-config-display";
import type { ToolInvocation } from "ai";
import { Loader2 } from "lucide-react";
import { memo } from "react";
import type { ChatAppend } from ".";

const ToolResponse = memo(
  ({
    toolInvocation,

    append,
  }: {
    append: ChatAppend;
    toolInvocation: ToolInvocation;
    // addToolResult: (result: { toolCallId: string; result: any }) => void;
  }) => {
    console.log({ toolInvocation });

    const handleAppend = (message: string, data?: any) => {
      append({
        role: "user",
        content: message,
        data,

        // toolInvocations: [{}],
      });
    };

    if (!("result" in toolInvocation)) {
      return (
        <div className="ml-8 flex items-center gap-2 text-xs text-gray-400">
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing...
        </div>
      );
    }

    switch (toolInvocation.toolName) {
      case "createScene":
        return (
          <SceneConfigDisplay
            handleAppend={handleAppend}
            sceneCreateToolResult={toolInvocation.result}
          />
        );

      default:
        return null;
    }
  },
);
ToolResponse.displayName = "ToolResponse";

export default ToolResponse;

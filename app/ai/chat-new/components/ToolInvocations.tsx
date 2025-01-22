import type { ToolInvocation } from "ai";

interface ToolInvocationsProps {
  toolInvocations: ToolInvocation[];
}

export function ToolInvocations({ toolInvocations }: ToolInvocationsProps) {
  return (
    <div className="space-y-4">
      {toolInvocations.map((invocation) => (
        <div key={invocation.toolCallId} className="rounded-lg bg-gray-800 p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-200">
            {invocation.toolName}
          </h3>
          {/* {invocation.state === "called" && (
            <div className="animate-pulse">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-700"></div>
              <div className="h-4 w-1/2 rounded bg-gray-700"></div>
            </div>
          )}
          {invocation.state === "executing" && (
            <div className="text-blue-400">Executing...</div>
          )}
          {invocation.state === "completed" && (
            <pre className="overflow-x-auto rounded bg-gray-900 p-2">
              {JSON.stringify(invocation.result, null, 2)}
            </pre>
          )}
          {invocation.state === "error" && (
            <div className="text-red-400">Error: {invocation.error}</div>
          )} */}
        </div>
      ))}
    </div>
  );
}

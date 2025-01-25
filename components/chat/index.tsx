"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScrollArea } from "../ui/scroll-area";
import ToolResponseRenderer from "./tool-response-rederer";
import type { ChatRequestOptions, CreateMessage, ToolInvocation } from "ai";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Loader2, Square, Send } from "lucide-react";
import { Button } from "../ui/button";
import { type Message, useChat } from "ai/react";
import ChatMessage from "./chat-message";
const MESSAGES = [
  {
    id: "nF6Y97KIeQXn1fVr",
    createdAt: "2025-01-23T23:10:39.780Z",
    role: "user",
    content: "create a scene with red background and hello world text",
  },
  {
    id: "KUZMzfF0KQQND7ci",
    role: "assistant",
    content: "",
    createdAt: "2025-01-23T23:10:46.522Z",
    toolInvocations: [
      {
        state: "result",
        toolCallId: "call_9IhxC2cYKZkkpG1z62GQFuDZ",
        toolName: "createScene",
        args: {
          id: "unique_scene_id_001",
          sceneProps: {
            duration: 5,
            background: "red",
          },
          components: {
            text: [
              {
                content: "Hello World",
                animation: "fadeIn",
                id: "text_component_001",
              },
            ],
          },
          suggestedImprovements: [
            "Consider adding an image for visual interest.",
            "Experiment with a slideIn animation for the text to enhance entry effect.",
            "Adjust the scene duration to better fit the content if necessary.",
          ],
        },
        result: {
          sceneId: "unique_scene_id_001",
          sceneConfig: {
            id: "unique_scene_id_001",
            sceneProps: {
              duration: 5,
              background: "red",
            },
            components: {
              text: [
                {
                  content: "Hello World",
                  animation: "fadeIn",
                  id: "text_component_001",
                },
              ],
            },
          },
          suggestedImprovements: [
            "Consider adding an image for visual interest.",
            "Experiment with a slideIn animation for the text to enhance entry effect.",
            "Adjust the scene duration to better fit the content if necessary.",
          ],
        },
      },
    ],
    revisionId: "8xiCW1DEbRFt13J9",
  },
  {
    id: "TxiMk9CkfnUux8jn",
    role: "assistant",
    content:
      'Created scene with red background and centered text saying "Hello World". Here are some suggestions for improvement:\n1. Consider adding an image for visual interest.\n2. Experiment with a slideIn animation for the text to enhance the entry effect.\n3. Adjust the scene duration to better fit the content if necessary.',
    createdAt: "2025-01-23T23:10:47.722Z",
    revisionId: "556gSR65kc18FbjW",
  },
];

const MESSAGES_2 = [
  {
    id: "aAsJ9wlm2KpEUeAd",
    createdAt: "2025-01-25T13:33:50.719Z",
    role: "user",
    content:
      'create a video of 6 scenes of "top 5 hollywood horror movies" with it\'s title and dummy images with proper transition',
  },
  {
    id: "msg-ZiSLM6jmTa0fHYq5nyHpOmGE",
    role: "assistant",
    content: "",
    createdAt: "2025-01-25T13:33:53.020Z",
    toolInvocations: [
      {
        state: "result",
        toolCallId: "call_0_e94ac9be-ec1e-476b-8ba9-8a9022201fd2",
        toolName: "createScene",
        args: {
          scenes: [
            {
              sceneProps: {
                duration: 5,
                name: "Scene 1",
              },
              components: {
                text: [
                  {
                    content: "Top 5 Hollywood Horror Movies",
                    animation: "fadeIn",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                  },
                ],
              },
            },
            {
              sceneProps: {
                duration: 5,
                name: "Scene 2",
              },
              components: {
                text: [
                  {
                    content: "1. The Exorcist",
                    animation: "fadeIn",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                  },
                ],
              },
            },
            {
              sceneProps: {
                duration: 5,
                name: "Scene 3",
              },
              components: {
                text: [
                  {
                    content: "2. The Shining",
                    animation: "fadeIn",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                  },
                ],
              },
            },
            {
              sceneProps: {
                duration: 5,
                name: "Scene 4",
              },
              components: {
                text: [
                  {
                    content: "3. Psycho",
                    animation: "fadeIn",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                  },
                ],
              },
            },
            {
              sceneProps: {
                duration: 5,
                name: "Scene 5",
              },
              components: {
                text: [
                  {
                    content: "4. Halloween",
                    animation: "fadeIn",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                  },
                ],
              },
            },
            {
              sceneProps: {
                duration: 5,
                name: "Scene 6",
              },
              components: {
                text: [
                  {
                    content: "5. A Nightmare on Elm Street",
                    animation: "fadeIn",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                  },
                ],
              },
            },
          ],
          suggestedImprovements: [
            "Consider adding background music to enhance the horror atmosphere.",
            "Use more dynamic text animations like slideIn or zoomIn for better visual impact.",
            "Incorporate movie clips or posters instead of placeholder images for authenticity.",
          ],
        },
        result: {
          scenes: [
            {
              sceneProps: {
                duration: 5,
                name: "Scene 1",
              },
              components: {
                text: [
                  {
                    content: "Top 5 Hollywood Horror Movies",
                    animation: "fadeIn",
                    id: "0d89aa12-8384-409c-aaba-d322bfd3e38f",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                    id: "994c5099-bbc6-4046-8ba8-31d3a5a32b27",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                    id: "cfb41262-98d2-452b-9b62-d8c69387b8bd",
                  },
                ],
              },
              id: "a3a69747-2d23-4afe-af16-17f9828afed2",
            },
            {
              sceneProps: {
                duration: 5,
                name: "Scene 2",
              },
              components: {
                text: [
                  {
                    content: "1. The Exorcist",
                    animation: "fadeIn",
                    id: "93872473-966b-44a2-8406-7e8c13a81587",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                    id: "49b7f850-15fc-43ce-afce-024b46a35254",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                    id: "b782fdf5-f385-4d1d-9091-da02b1ed760c",
                  },
                ],
              },
              id: "25148146-fbba-47ed-9839-6ce602efa8d0",
            },
            {
              sceneProps: {
                duration: 5,
                name: "Scene 3",
              },
              components: {
                text: [
                  {
                    content: "2. The Shining",
                    animation: "fadeIn",
                    id: "9c2d6b50-2b78-4559-a2d7-fe5fee22d097",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                    id: "d7bffe36-e4be-4d9a-ab62-e2216705ff4a",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                    id: "d7346f88-0bbf-4ad8-967b-c5b22e28e779",
                  },
                ],
              },
              id: "baae5a2d-72d1-4f78-b26b-81b8884cf8d6",
            },
            {
              sceneProps: {
                duration: 5,
                name: "Scene 4",
              },
              components: {
                text: [
                  {
                    content: "3. Psycho",
                    animation: "fadeIn",
                    id: "afb87be2-08d5-44c3-a936-ddcbf9eac3cd",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                    id: "111d3f02-116e-459b-bf5c-c60d41c9afd2",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                    id: "b8e614aa-b0ab-4eea-ae40-122c00379e23",
                  },
                ],
              },
              id: "bfe201ab-326e-4752-a864-cfd84ca93477",
            },
            {
              sceneProps: {
                duration: 5,
                name: "Scene 5",
              },
              components: {
                text: [
                  {
                    content: "4. Halloween",
                    animation: "fadeIn",
                    id: "0377a385-f1bd-4764-98b0-4e89a58af585",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                    id: "6fc7301f-fad6-473b-bcc7-c20445521f40",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                    id: "abb7ec2c-b95c-4be1-b62f-48974bfb6b36",
                  },
                ],
              },
              id: "a48b553b-678a-4077-a7e6-52ffcf4d80d7",
            },
            {
              sceneProps: {
                duration: 5,
                name: "Scene 6",
              },
              components: {
                text: [
                  {
                    content: "5. A Nightmare on Elm Street",
                    animation: "fadeIn",
                    id: "4f186f2f-c5a1-4079-a229-1d012528c191",
                  },
                ],
                image: [
                  {
                    src: "https://via.placeholder.com/150",
                    animation: "fadeIn",
                    id: "058a9a15-61d9-4802-ac80-d63c66942684",
                  },
                ],
                transition: [
                  {
                    type: "fade",
                    duration: 0.5,
                    id: "26abe5d4-e2c2-4bd5-ada6-b93b21abbf62",
                  },
                ],
              },
              id: "c73141a8-bbbc-4a05-b864-cc7ef41ec868",
            },
          ],
          suggestedImprovements: [
            "Consider adding background music to enhance the horror atmosphere.",
            "Use more dynamic text animations like slideIn or zoomIn for better visual impact.",
            "Incorporate movie clips or posters instead of placeholder images for authenticity.",
          ],
        },
      },
    ],
    revisionId: "DAx1AevdhkurNSVq",
  },
];
export type ChatAppend = (
  message: Message | CreateMessage,
  chatRequestOptions?: ChatRequestOptions,
) => Promise<string | null | undefined>;

const AIChat = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [hardMessages, setHardMessages] = useState(MESSAGES_2);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    isLoading,
    stop,
    append,
  } = useChat({
    api: "/api/chat-claude",
    onToolCall: async ({ toolCall }) => {
      console.log("Tool Call", toolCall.toolName);
    },
    maxSteps: 2,
    onFinish: () => setIsStreaming(false),
  });
  console.log({ messages });

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsStreaming(true);
      handleSubmit(e);
    },
    [handleSubmit],
  );

  

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [hardMessages]);

  return (
    <section className="relative h-full w-full flex-grow rounded-lg border-neutral-800 bg-neutral-950 shadow-sm">
      <div
        className="h-full max-w-full overflow-y-scroll p-4 pb-24"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {hardMessages.map((m: Message) => (
            <div key={m.id} className="space-y-2">
              <ChatMessage message={m} append={append} />
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="absolute bottom-0 w-full border-t border-neutral-800 bg-black p-4"
      >
        <div className="flex items-center gap-2">
          <Input
            className="flex-1 text-sm"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <Button
            type={isStreaming ? "button" : "submit"}
            onClick={isStreaming ? stop : undefined}
            disabled={isLoading || !input}
            className={cn(
              "transition-all duration-200 ease-in-out",
              isStreaming ? "bg-red-500 hover:bg-red-600" : "",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isStreaming ? (
              <Square className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
          {/* <button
            onClick={() => setHardMessages([...hardMessages, ...MESSAGES_2])}
            className="absolute bottom-0 right-0 rounded-bl-lg bg-neutral-800 p-2 text-neutral-200"
          >
            ADD MESSAGES
          </button> */}
        </div>
      </form>
    </section>
  );
};

export default AIChat;

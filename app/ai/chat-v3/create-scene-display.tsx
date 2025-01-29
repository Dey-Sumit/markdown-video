"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, Plus } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { sceneReverseParser } from "@/parsers/reverseParser";
import { useShikiHighlighter } from "react-shiki";

interface SceneConfigDisplayProps {
  sceneCreateToolResult: {
    sceneId: string;
    sceneConfig: Omit<SceneSchemaType["sceneConfig"], "suggestedImprovements">;
    suggestedImprovements: string[];
  };
  handleAppend: (message: string, data?: any) => void;
}

const SceneConfigDisplay: React.FC<SceneConfigDisplayProps> = React.memo(
  ({ sceneCreateToolResult, handleAppend }) => {
    const [activeTab, setActiveTab] = useState<string>("text");

    const { insertScene } = useProjectStore();

    const markdownContent = useMemo(() => {
      const r = sceneReverseParser.parse(sceneCreateToolResult.sceneConfig);
      return r;
    }, [sceneCreateToolResult.sceneConfig]);
    const highlightedCode = useShikiHighlighter(
      markdownContent,
      "tsx",
      "ayu-dark",
    );

    const handleInsert = () => {
      console.log("Inserting scene", markdownContent);

      insertScene({
        content: markdownContent,
        position: "end", // or 'start'
      });
    };

    const { sceneConfig, suggestedImprovements } = sceneCreateToolResult;

    return (
      <div className="">
        <Card className="relative mt-4 border-neutral-900">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="absolute -top-6 right-2 rounded-full py-0 shadow-xl">
                <TabsTrigger value="text" className="rounded-full px-4">
                  Text
                </TabsTrigger>
                <TabsTrigger value="preview" className="rounded-full px-4">
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="p-4">
                <div className="bg-[#0c0e13] p-3 text-sm">
                  {highlightedCode}
                </div>
              </TabsContent>
              <TabsContent value="preview" className="p-4">
                <div
                  className="h-40 w-full rounded"
                  style={{ background: sceneConfig.sceneProps.background }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <Button
            onClick={handleInsert}
            className="absolute -bottom-4 right-0 rounded-full transition-transform duration-150 hover:scale-95"
            variant="bezel"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Insert
          </Button>
        </Card>
        {suggestedImprovements && suggestedImprovements.length > 0 && (
          <Card className="mt-8 border-neutral-900 p-4">
            <div className="flex flex-col gap-2 text-xs font-medium">
              {suggestedImprovements?.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto w-full justify-start px-3 py-3 text-left text-xs transition-colors duration-200"
                  onClick={() =>
                    handleAppend(
                      `Update the scene with: ${suggestion} `,
                      sceneConfig,
                    )
                  }
                >
                  {suggestion}
                  <ArrowUp className="ml-auto h-4 w-4" />
                </Button>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  },
);

SceneConfigDisplay.displayName = "SceneConfigDisplay";

export default SceneConfigDisplay;

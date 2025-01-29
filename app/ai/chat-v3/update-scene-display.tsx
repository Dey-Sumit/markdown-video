"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectStore } from "@/store/project-store";
import { useShikiHighlighter } from "react-shiki";

interface SceneConfigDisplayProps {
  sceneCreateToolResult: {
    sceneId: string;
    sceneConfig: Omit<SceneSchemaType["sceneConfig"], "suggestedImprovements">;
    suggestedImprovements: string[];
  };
  handleAppend: (message: string, data?: any) => void;
}

const UpdateSceneDisplay: React.FC<SceneConfigDisplayProps> = React.memo(
  ({ sceneCreateToolResult, handleAppend }) => {
    const [activeTab, setActiveTab] = useState<string>("text");

    const { insertScene } = useProjectStore();

    const markdownContent = useMemo(() => {
      const r = "SCENE UPDATED";
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
        </Card>
      </div>
    );
  },
);

UpdateSceneDisplay.displayName = "SceneConfigDisplay";

export default UpdateSceneDisplay;

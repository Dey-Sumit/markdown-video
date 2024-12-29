"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor, type OnMount } from "@monaco-editor/react";
import { monacoCustomOptions } from "./x-editor/editor-config";
import { monacoCustomTheme } from "./x-editor/theme";

const CSSModifyTabs = () => {
  const handleEditorMount: OnMount = (editor, monaco) => {
    monaco.editor.defineTheme("custom", monacoCustomTheme);
    monaco.editor.setTheme("custom");
  };

  return (
    <Tabs defaultValue="account" className="h-full w-[400px] border">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="h-full">
        <Editor
          height="100%"
          defaultLanguage="css"
          options={monacoCustomOptions}
          onMount={handleEditorMount}
        />
      </TabsContent>
      <TabsContent value="password" className="h-full">
        <Editor
          height="100%"
          defaultLanguage="css"
          options={monacoCustomOptions}
          onMount={handleEditorMount}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CSSModifyTabs;

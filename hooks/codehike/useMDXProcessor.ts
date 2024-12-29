// Update imports
import { useProjectStore } from "@/store/project-store";
import { compile, run } from "@mdx-js/mdx";
import { validateMarkdown } from "@/components/x-editor/utils";
import { chConfig } from "@/lib/config/config.codehike";
import { toast } from "sonner";
import { z } from "zod";
import { useCallback, useEffect } from "react";
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";
import { editor } from "monaco-editor";
import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks";
import { SceneSchema } from "@/video/compositions/code-video-composition/types.composition";
export const useMdxProcessor = () => {
  const {
    currentProject: { content },
    updateScenes,
    isLoading,
    error,
  } = useProjectStore();

  const compileAndRun = useCallback(async (mdxContent: string) => {
    try {
      const runtime = await import("react/jsx-runtime");
      const compiled = await compile(mdxContent, {
        outputFormat: "function-body",
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [[recmaCodeHike, chConfig]],
      });
      const result = await run(String(compiled), runtime);
      return { content: result.default, error: undefined };
    } catch (e) {
      return { content: undefined, error: (e as Error).message };
    }
  }, []);

  useEffect(() => {
    if (!content) return;

    let cancelled = false;
    const model = editor.createModel(content, "markdown");

    const processContent = async () => {
      try {
        const { hasErrors, issues } = validateMarkdown(model);
        if (hasErrors) {
          toast.error("Invalid markdown content");
          return;
        }

        const { content: compiledContent, error: compileError } =
          await compileAndRun(content);
        if (compileError) throw new Error(compileError);

        const { scene: scenes } = parseRoot(
          compiledContent!,
          Block.extend({
            scene: z.array(SceneSchema),
          }),
        );

        if (!cancelled) {
          updateScenes(scenes);
        }
      } catch (err) {
        console.error("Error processing content", err);
      }
    };

    const debounceTimer = setTimeout(processContent, 500);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
      model.dispose();
    };
  }, [content, updateScenes]);
};

// Update imports
import { mergeContent, useProjectStore } from "@/store/project-store";
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
import { EDITOR_LANGUAGE } from "@/components/x-editor/const";

export const useMdxProcessor = () => {
  const { currentProject, updateScenes, isLoading, error } = useProjectStore();

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
    if (
      !currentProject.config.content.global &&
      !currentProject.config.content.sceneLevel
    )
      return;

    let cancelled = false;
    // const model = editor.createModel(content.sceneLevel, EDITOR_LANGUAGE);

    const processContent = async () => {
      try {
        // const { hasErrors, issues } = validateMarkdown(model);
        // if (hasErrors) {
        //   toast.error("Invalid markdown content");
        //   return;
        // }

        const combinedContent = mergeContent(
          currentProject.config.content.global,
          currentProject.config.content.sceneLevel,
        );

        const { content: compiledContent, error: compileError } =
          await compileAndRun(combinedContent);
        if (compileError) throw new Error(compileError);
        console.log({ compiledContent });

        const { scene: scenes } = parseRoot(
          compiledContent!,
          Block.extend({
            scene: z.array(SceneSchema),
            /*   global: z
              .object({
                title: z.array(z.string()).optional(),
                scene: z.array(z.string()).optional(),
              })
              .optional(), */
          }),
        );
        console.log({ scenes });

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
      // model.dispose();
    };
  }, [
    currentProject.config.content.global,
    currentProject.config.content.sceneLevel,
    updateScenes,
  ]);
};

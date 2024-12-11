import { validateMarkdown } from "@/components/x-editor/utils";
import { chConfig } from "@/lib/config/config.codehike";
import useCompositionStore from "@/store/composition-store";
import { SceneSchema } from "@/video/compositions/code-video-composition/types.composition";
import { compile, run } from "@mdx-js/mdx";
import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks";
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";
import { editor } from "monaco-editor";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const useMdxProcessor = () => {
  const { content, setScenes, setLoading, setError } = useCompositionStore();

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
      console.error("Error compiling and running", e);
      return { content: undefined, error: (e as Error).message };
    }
  }, []);

  useEffect(() => {
    if (!content) return;

    let cancelled = false;
    const model = editor.createModel(content, "markdown");
    setLoading(true);

    const processContent = async () => {
      try {
        const { hasErrors, issues } = validateMarkdown(model);
        if (hasErrors) {
          toast.error("Invalid markdown content");
          console.error("Validation errors:", Array.from(issues.values()));
          return;
        }

        const { content: compiledContent, error: compileError } =
          await compileAndRun(content);

        if (compileError) throw new Error(compileError);

        const { scene: scenes, title } = parseRoot(
          compiledContent!,
          Block.extend({
            scene: z.array(SceneSchema),
          }),
        );

        console.log("parsed steps", scenes, { title });

        if (!cancelled) {
          setScenes(scenes);
          setError(null);
        }
      } catch (err) {
        console.log("Error processing content", err);

        if (!cancelled) {
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(processContent, 500);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
      model.dispose();
    };
  }, [content, setScenes, setLoading, setError, compileAndRun]);
};

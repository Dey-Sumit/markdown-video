import { validateMarkdown } from "@/components/x-editor/utils";
import { chConfig } from "@/lib/config/config.codehike";
import useCompositionStore from "@/store/composition-store";
import { StepSchema } from "@/video/compositions/code-video-composition/types.composition";
import { compile, run } from "@mdx-js/mdx";
import { Block, parseRoot } from "codehike/blocks";
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";
import { editor } from "monaco-editor";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const useMdxProcessor = () => {
  const { content, setSteps, setLoading, setError } = useCompositionStore();

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

        const { steps } = parseRoot(
          compiledContent!,
          Block.extend({
            steps: z.array(StepSchema),
          }),
        );

        if (!cancelled) {
          setSteps(steps);
          setError(null);
        }
      } catch (err) {
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
  }, [content, setSteps, setLoading, setError, compileAndRun]);
};

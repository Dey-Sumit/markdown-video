import { validateMarkdown } from "@/components/x-editor/utils";
import { chConfig } from "@/lib/config/config.codehike";
import useCompositionStore from "@/store/composition-store";
import {
  StepSchema,
  type Step,
} from "@/video/compositions/code-video-composition/types.composition";
import { compile, run } from "@mdx-js/mdx";
import { Block, parseRoot } from "codehike/blocks";
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";
import { editor } from "monaco-editor";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const useMdxProcessor = () => {
  const { content, setSteps, setLoading, setError } = useCompositionStore();

  useEffect(() => {
    let cancelled = false;
    let effectId = 0;
    const currentEffectId = effectId;

    const compileAndRun = async (mdxContent: string) => {
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
    };

    const processContent = async () => {
      if (!content) return;

      setLoading(true);

      try {
        // Check validation first
        const model = editor.createModel(content, "markdown");
        const { hasErrors, issues } = validateMarkdown(model);
        model.dispose();
        console.log("ISSUES", issues, hasErrors);

        if (hasErrors) {
          toast.error("Invalid markdown content");
          console.log("ERRORS", issues.values());
          return;
        }

        // First try to compile the MDX
        const { content: compiledContent, error: compileError } =
          await compileAndRun(content);

        if (compileError) throw new Error(compileError);

        // Then try to parse the compiled content
        let parsedSteps: Step[];
        try {
          const { steps } = parseRoot(
            compiledContent!,
            Block.extend({
              steps: z.array(StepSchema),
            }),
          );
          parsedSteps = steps;
          console.log("successfully parsed steps", steps);
        } catch (parseError) {
          console.log("parseError", parseError);

          // If there's a parsing error, throw it to be caught by the outer try-catch
          throw new Error(`Parsing error: ${(parseError as Error).message}`);
        }

        // Only update states if we have valid parsed steps and the effect hasn't been cancelled
        if (!cancelled && currentEffectId === effectId && parsedSteps) {
          setSteps(parsedSteps);
          setError(null);
        }
      } catch (err) {
        if (!cancelled && currentEffectId === effectId) {
          // Only set the error message, don't clear the steps
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled && currentEffectId === effectId) {
          setLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(processContent, 500);

    return () => {
      cancelled = true;
      effectId++;
      clearTimeout(debounceTimer);
    };
  }, [content, setSteps, setLoading, setError]);
};

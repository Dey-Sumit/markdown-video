import { cn } from "@/lib/utils";
import { fontFamily } from "@remotion/google-fonts/FiraCode";
import { type HighlightedCode, Pre, highlight } from "codehike/code";
import { tokenTransitions } from "../annotations/token-transitions";
import codeParser from "@/components/x-editor/plugins/code/code.parser";

const CodeBlockRenderer = ({
  code,
  codeRef,
  meta,
}: {
  code: HighlightedCode;
  codeRef: React.RefObject<any> | null;
  meta: string;
}) => {
  const { data } = codeParser.parse(meta);
  const { align, fontSize, theme } = data;
  return (
    <div
      className={cn("w-full flex-1 p-4", "flex items-center justify-center", {
        "items-start justify-start": align === "top",
        "items-center justify-center": align === "center",
      })}
    >
      <Pre
        ref={codeRef}
        code={code}
        handlers={[tokenTransitions, highlight]}
        className="w-max leading-[3.5rem]"
        style={{
          fontFamily,
          fontFeatureSettings: '"liga" 1, "calt" 1',
          WebkitFontFeatureSettings: '"liga" 1, "calt" 1',
          fontVariantLigatures: "contextual",
          fontSize: fontSize,
        }}
      />
    </div>
  );
};

export default CodeBlockRenderer;

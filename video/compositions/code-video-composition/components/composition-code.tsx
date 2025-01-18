import { cn } from "@/lib/utils";
import { fontFamily } from "@remotion/google-fonts/FiraCode";
import { type HighlightedCode, Pre, highlight } from "codehike/code";
import { tokenTransitions } from "../annotations/token-transitions";

const CodeBlockRenderer = ({
  code,
  codeRef,
}: {
  code: HighlightedCode;
  codeRef: React.RefObject<any> | null;
}) => {
  return (
    <div
      className={cn(
        "w-full flex-1 border border-red-600",
        "flex items-center justify-center",
      )}
    >
      <Pre
        ref={codeRef}
        code={code}
        handlers={[tokenTransitions, highlight]}
        className="w-max border-2 border-blue-400 text-4xl leading-[3.5rem]"
        style={{
          fontFamily,
          fontFeatureSettings: '"liga" 1, "calt" 1',
          WebkitFontFeatureSettings: '"liga" 1, "calt" 1',
          fontVariantLigatures: "contextual",
        }}
      />
    </div>
  );
};

export default CodeBlockRenderer;

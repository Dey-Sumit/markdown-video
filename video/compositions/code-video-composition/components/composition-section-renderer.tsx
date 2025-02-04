// import sectionParser from "@/components/x-editor/plugins/section/section.parser";
import React from "react";
import CompositionTextRenderer, { CompositionText } from "./composition-text";
import CompositionImageRenderer from "./composition-image";
import type { SectionOutputProps } from "@/components/x-editor/plugins/section/section.types";
import parseCustomMarkup from "@/components/x-editor/plugins/section/section.parser-new";
import sectionWrapperParser from "@/components/x-editor/plugins/section/section.parser-new";

const CompositionSectionRenderer = ({
  value,
  sceneDurationInFrames,
}: {
  value: string[] | undefined;
  sceneDurationInFrames: number;
}) => {
  if (!value) return null;

  const data = sectionWrapperParser.parse(`!section ${value[0]}`);
  if (!data) return null;
  return <Section sectionData={data} />;
};

export default CompositionSectionRenderer;

const Section = ({ sectionData }: { sectionData: SectionOutputProps }) => {
  const { cols, rows, footer, header, gap = 0, items = [] } = sectionData;

  return (
    <div
      className="h-full w-full"
      style={{
        display: "grid",
        gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : "auto",
        gridTemplateRows: rows ? `repeat(${rows}, 1fr)` : "auto",
        gap: `${gap}px`,
      }}
    >
      {items.map((item, index) => {
        switch (item.type) {
          case "section": {
            return (
              <Section
                key={index}
                //@ts-ignore  : id is missing in nested section | TODO : fix this
                sectionData={item}

                // value={item.data}
                // sceneDurationInFrames={sceneDurationInFrames}
              />
            );
          }
          case "text": {
            // const textProps = item.data;

            return (
              <div className="relative border-2 border-red-800" key={index}>
                <CompositionText
                  text={item.content}
                  color={item.color}
                  animationType={item.animation}
                  delay={item.delay}
                />
              </div>
            );
          }
          // case "image":
          //   return (
          //     <CompositionImageRenderer
          //       key={index}
          //       sceneDurationInFrames={sceneDurationInFrames}
          //     />
          //   );
          default:
            return null;
        }
      })}
    </div>
  );
};

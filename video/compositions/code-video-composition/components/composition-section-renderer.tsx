import sectionParser from "@/components/x-editor/plugins/section/section.parser";
import React from "react";
import CompositionTextRenderer, { CompositionText } from "./composition-text";
import CompositionImageRenderer from "./composition-image";
import type { Section } from "@/components/x-editor/plugins/section/section.types";

const CompositionSectionRenderer = ({
  value,
  sceneDurationInFrames,
}: {
  value: string[];
  sceneDurationInFrames: number;
}) => {
  console.log("SectionRenderer : ", value, sceneDurationInFrames);
  const { data: sectionData } = sectionParser.parse(value[0]);
  console.log("SectionRendererParsedProps : ", sectionData);
  if (!sectionData) return null;

  return <Section sectionData={sectionData} />;
};

export default CompositionSectionRenderer;

const Section = ({ sectionData }: { sectionData: Section }) => {
  const { cols, rows, footer, header, gap = 0, items } = sectionData.data;

  return (
    <div
      className="h-full w-full border-8"
      style={{
        display: "grid",
        gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : "auto",
        gridTemplateRows: rows ? `repeat(${rows}, 1fr)` : "auto",
        gap: `${gap}px`,
      }}
    >
      {items.map((item, index) => {
        switch (item.type) {
          case "section":
            return (
              <Section
                key={index}
                //@ts-ignore  : id is missing in nested section | TODO : fix this
                sectionData={item}

                // value={item.data}
                // sceneDurationInFrames={sceneDurationInFrames}
              />
            );
          case "text": {
            const textProps = item.data;

            return (
              <div className="relative border-8 border-red-800" key={index}>
                <CompositionText
                  text={textProps.content}
                  color={textProps.color}
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

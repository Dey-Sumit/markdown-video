// import sectionParser from "@/components/x-editor/plugins/section/section.parser";
import React from "react";
import { CompositionText } from "./composition-text";
import type { SectionOutputProps } from "@/components/x-editor/plugins/section/section.types";
import sectionWrapperParser from "@/components/x-editor/plugins/section/section.parser-new";
import { getDerivedBackground } from "@/lib/utils";
import { useAnimatedProperties } from "../../hooks/use-animated-properties";

const CompositionSectionRenderer = ({
  value,
  sceneDurationInFrames,
}: {
  value: string[] | undefined;
  sceneDurationInFrames: number;
}) => {
  if (!value) return null;

  const data = sectionWrapperParser.parse(`!section ${value[0]}`);
  console.log("CompositionSectionRenderer", { data });

  if (!data) return null;
  return (
    <Section sectionData={data} sceneDurationInFrames={sceneDurationInFrames} />
  );
};

export default CompositionSectionRenderer;

const Section = ({
  sectionData,
  sceneDurationInFrames,
}: {
  sectionData: SectionOutputProps;

  sceneDurationInFrames: number;
}) => {
  const {
    cols,
    rows,
    footer,
    header,
    gap = 0,
    items = [],
    background,
    order,
  } = sectionData;

  const { opacity, transform } = useAnimatedProperties({
    delay: 2,
    sceneDurationInFrames,
    animation: "fadeInSlideDown",
    withMotion: false,
  });

  return (
    <div
      className="h-full w-full"
      style={{
        display: "grid",
        gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : "auto",
        gridTemplateRows: rows ? `repeat(${rows}, 1fr)` : "auto",
        gap: `${gap}px`,
        background: getDerivedBackground(background),
        // animation properties
        opacity,
        transform,
        zIndex: order,
      }}
    >
      {items.map((item, index) => {
        switch (item.type) {
          case "section": {
            return (
              <Section
                key={index}
                //@ts-expect-error  : id is missing in nested section | // TODO : fix this
                sectionData={item}
                sceneDurationInFrames={sceneDurationInFrames}
                // value={item.data}
                // sceneDurationInFrames={sceneDurationInFrames}
              />
            );
          }
          case "text": {
            // const textProps = item.data;

            const props: React.ComponentProps<typeof CompositionText> = {
              data: item,
            };

            return (
              <div className="relative" key={index}>
                <CompositionText {...props} />
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

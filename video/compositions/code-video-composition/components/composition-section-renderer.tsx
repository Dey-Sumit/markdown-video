// import sectionParser from "@/components/x-editor/plugins/section/section.parser";
import React from "react";
import { CompositionText } from "./composition-text";
import type { SectionOutputProps } from "@/components/x-editor/plugins/section/section.types";
import sectionWrapperParser from "@/components/x-editor/plugins/section/section.parser-new";
import { useAnimatedProperties } from "../../hooks/use-animated-properties";
import CompositionImageRenderer, {
  CompositionImage,
} from "./composition-image";

const CompositionSectionRenderer = ({
  value,
  sceneDurationInFrames,
}: {
  value: string[] | undefined;
  sceneDurationInFrames: number;
}) => {
  if (!value) return null;

  const data = sectionWrapperParser.parse(`!section ${value[0]}`);
  console.log({ v: `!section ${value[0]}` }, { data });

  if (!data) return null;
  return <Section sectionData={data} />;
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
    delay: 0,
    sceneDurationInFrames,
    animation: "fadeInSlideDown",
    withMotion: false,
  });

  return (
    <div
      className="relative h-full w-full"
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
          case "image": {
            const props: React.ComponentProps<typeof CompositionImage> = item;
            console.log("Image Props", props);

            return (
              <div className="relative" key={index}>
                <CompositionImage
                  key={index}
                  {...props}
                  sceneDurationInFrames={sceneDurationInFrames}
                />
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
};

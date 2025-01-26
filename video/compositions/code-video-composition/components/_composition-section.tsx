import { useVideoConfig } from "remotion";
import { convertSecondsToFramerate } from "../../composition.utils";
import CompositionText from "./composition-text";

interface SectionProps {
  type: "section";
  data: {
    cols?: number;
    rows?: number;
    direction?: "row" | "column";
    gap?: number;
    items: Array<{
      type: "section" | "text" | "image";
      data: any;
    }>;
  };
}

const Section = ({ data }: SectionProps) => {
  const { fps } = useVideoConfig();

  const { cols, rows, direction, gap = 0, items } = data;

  return (
    <div
      className="h-full w-full"
      style={{
        display: "grid",
        gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : "auto",
        gridTemplateRows: rows ? `repeat(${rows}, 1fr)` : "auto",
        flexDirection: direction,
        gap: `${gap}px`,
      }}
    >
      {items.map((item, index) => {
        switch (item.type) {
          case "section":
            return <Section key={index} type="section" data={item.data} />;
          case "text": {
            return (
              <div
                className="relative rounded-md border border-gray-100/20"
                key={index}
              >
                <CompositionText
                  text={item.data.content}
                  delay={convertSecondsToFramerate(item.data.delay || 0, fps)}
                  fontSize={item.data.fontSize}
                  // fontWeight={textProps.fontWeight}
                  color={item.data.color}
                  animationType={item.data.animation}
                />
              </div>
            );
          }
          //   case "image":
          //     return <Image key={index} {...item.data} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default Section;

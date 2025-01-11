import { useEditingStore } from "../store/editing.store";
import type { LiteSequenceItemType, LayerId } from "../timeline.types";
import { useTimeline } from "../video-timeline-context";

// TODO : work on this
const TransitionItem = ({
  item,
  layerId,
}: {
  item: LiteSequenceItemType;
  layerId: LayerId;
}) => {
  const setActiveItem = useEditingStore((state) => state.setActiveSeqItem);
  const activeItem = useEditingStore((state) => state.activeSeqItem);
  const { pixelsPerFrame } = useTimeline();

  const isActive = activeItem?.itemId === item.id;

  return (
    <div
      className={`absolute h-full cursor-pointer ${isActive ? "border-blue-400" : ""}`}
      style={{
        left:
          (item.startFrame - (item.transition?.incoming?.duration || 0)) *
          pixelsPerFrame,
        width: (item.transition?.incoming?.duration || 0) * pixelsPerFrame,
        background:
          "linear-gradient(to right, transparent, rgba(255,255,255,0.3))",
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveItem(layerId, item.id, "transition");
      }}
    >
      <div className="absolute right-0 top-0 p-1">
        <TransitionIcon />
      </div>
    </div>
  );
};

const TransitionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3v18" />
    <path d="M16 7v10" />
    <path d="M12 3v18" />
    <path d="M18 7v10" />
  </svg>
);

export default TransitionItem;

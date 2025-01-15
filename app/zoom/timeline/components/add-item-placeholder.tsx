import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditingStore } from "../store/editing.store";
import type { ContentType } from "../timeline.types";

interface AddItemPlaceholderProps {
  startX: number;
  width: number;
  overrideType?: ContentType;
}

const PLACEHOLDER_ITEM_TYPE_TO_STYLES_MAP: Record<string, string> = {
  zoom: "bg-gradient-to-b from-yellow-700 to-yellow-600 text-yellow-200 border-yellow-600",
  text: "bg-gradient-to-b from-green-700 to-green-600 text-green-200 border-green-600",
  image:
    "bg-gradient-to-b from-purple-700 to-purple-600 text-purple-200 border-purple-600",
  video:
    " bg-gradient-to-b from-pink-700 to-pink-600 text-pink-200 border-pink-600",
  audio:
    "bg-gradient-to-b from-orange-700 to-orange-600 text-orange-200  border-orange-600",
};

const AddItemPlaceholder: React.FC<AddItemPlaceholderProps> = ({
  startX,
  width,
  overrideType,
}) => {
  const selectedContentType = useEditingStore(
    (store) => store.selectedContentType,
  );
  const contentType = overrideType || selectedContentType;
  return (
    <div
      className={cn(
        `pointer-events-none absolute left-0 top-0 flex h-full items-center justify-center rounded-md border border-solid shadow-xl`,

        PLACEHOLDER_ITEM_TYPE_TO_STYLES_MAP[contentType],
        " ",
      )}
      style={{
        left: `${startX}px`,
        width: `${width}px`,
      }}
    >
      <Plus strokeWidth={2} size={22} />
    </div>
  );
};

export default AddItemPlaceholder;

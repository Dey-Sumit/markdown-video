import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditingStore } from "../store/editing.store";

interface AddItemPlaceholderProps {
  startX: number;
  width: number;
}

const PLACEHOLDER_ITEM_TYPE_TO_STYLES_MAP: Record<string, string> = {
  text: "bg-green-600/30 text-green-600 border-green-700 ",
  image: "bg-purple-600/30 text-purple-600 border-purple-600 ",
  video: "bg-pink-600/30 text-pink-600 border-pink-600 ",
  audio: "bg-orange-600/30 text-orange-600 border-orange-600 ",
};

const AddItemPlaceholder: React.FC<AddItemPlaceholderProps> = ({
  startX,
  width,
}) => {
  const selectedContentType = useEditingStore(
    (store) => store.selectedContentType,
  );
  return (
    <div
      className={cn(
        `pointer-events-none absolute left-0 top-0 flex h-full items-center justify-center rounded-[2px] border-[1.5px] border-dashed`,
        // "border-blue-500 bg-blue-700/40",
        PLACEHOLDER_ITEM_TYPE_TO_STYLES_MAP[selectedContentType],
      )}
      style={{
        left: `${startX}px`,
        width: `${width}px`,
      }}
    >
      <Plus className="stroke-2" size={18} />
    </div>
  );
};

export default AddItemPlaceholder;

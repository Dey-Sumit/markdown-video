import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-separator";

const SidebarBlock = ({
  children,
  label,
  containerClassName,
}: {
  children: React.ReactNode;
  label: string;
  containerClassName?: string;
}) => (
  <div className={cn("flex flex-col gap-3.5", containerClassName)}>
    <div className="flex items-center gap-2">
      <Label className="shrink-0 text-sm">{label}</Label>
      <Separator className="flex-1" />
    </div>
    {children}
  </div>
);

export default SidebarBlock;

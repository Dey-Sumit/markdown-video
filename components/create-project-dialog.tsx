import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "Tutorial",
  "Product Demo",
  "Code Walkthrough",
  "Presentation",
  "Other",
];

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;

    try {
      const db = (await import("../lib/dexie-db")).db;
      console.log("db -> ", db);

      const projectId = await db.createProject(title, description, category);
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="group flex h-full min-h-52 w-full gap-y-2 rounded-lg border border-dashed border-gray-300 bg-gray-100 p-1 hover:border-gray-400 focus:border-gray-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:focus:border-neutral-600">
          <div className="flex h-full min-h-40 w-full flex-col items-center justify-center rounded-md bg-white shadow-sm dark:bg-neutral-900">
            <svg
              className="size-7 shrink-0 text-primary dark:text-primary"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <span className="text-sm text-primary dark:text-primary">
              Create new project
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new video project from markdown
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Enter project title"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Brief description of your project"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required defaultValue={CATEGORIES[0]}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

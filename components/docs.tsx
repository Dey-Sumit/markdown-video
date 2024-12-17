import Content from "../app/poc/markdown/docs.mdx";
import {
  SidebarContent,
  SidebarHeader,
  SidebarInput,
} from "../components/ui/sidebar";
const Docs = () => {
  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-3">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Docs</div>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>
      <SidebarContent className="w-[calc(var(--sidebar-width)_-var(--sidebar-width-icon))] p-3">
        <article className="prose prose-sm prose-invert prose-h1:text-xl">
          <Content />
        </article>
      </SidebarContent>
    </>
  );
};

export default Docs;

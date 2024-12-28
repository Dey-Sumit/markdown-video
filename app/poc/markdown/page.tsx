// page.tsx
import Content from "../markdown/new-docs.mdx";

const Page = () => {
  return (
    <article className="prose prose-lg prose-invert mx-auto max-w-4xl px-8 py-10 prose-code:before:content-none prose-code:after:content-none">
      <Content />
    </article>
  );
};

export default Page;

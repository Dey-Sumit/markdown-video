// page.tsx
import Content from "../markdown/docs.mdx";

const Page = () => {
  return (
    <article className="prose prose-lg prose-invert mx-auto max-w-4xl py-10 prose-code:before:hidden prose-code:after:hidden">
      <Content />
    </article>
  );
};

export default Page;

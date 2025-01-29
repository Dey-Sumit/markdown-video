import React from "react";
import Content from "../app/minimal-docs.mdx";
// import Content from "../app/poc/markdown/new-docs.mdx";
const MinimalDocs = () => {
  return (
    <article className="prose prose-invert mx-auto max-w-4xl p-4">
      <p className="text-center text-primary">
        Minimal Docs |{" "}
        <span className="text-primary">Writing a detailed docs : WIP</span>
      </p>
      <Content />
    </article>
  );
};

export default MinimalDocs;

import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import { Callout } from "./components/mdx/callout";

import { Pre, type RawCode, highlight } from "codehike/code";

export async function MyCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark");
  return <Pre code={highlighted} />;
}
// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),
    callout: Callout,
    pre: ({ children, className, ...props }) => {
      // Check if it's a scene block
      const isScene = className?.includes("language-markdown");

      return (
        <pre
          className={`relative rounded-lg !bg-[#161a1e] p-4 ${isScene ? "scene-block" : ""}`}
          {...props}
        >
          {children}
        </pre>
      );
    },

    ...components,
  };
}

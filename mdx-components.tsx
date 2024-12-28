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

const InlineCode = ({ children }: { children: React.ReactNode }) => {
  console.log("inline code children", children);

  return (
    <code className="rounded bg-[#161a1e] px-1.5 py-0.5 text-sm font-medium text-white">
      {children}
    </code>
  );
};
const CustomCode = ({ children }: { children: React.ReactNode }) => {
  // If children is an array of spans (as shown in your data structure)
  if (Array.isArray(children)) {
    return (
      <>
        {children.map((child, index) => {
          console.log("child", child);

          console.log(
            "child.props.children?.toString()",
            child.props?.children?.toString(),
          );

          if (
            typeof child === "object" &&
            "props" in child &&
            child.props.children?.toString().startsWith("`")
          ) {
            console.log("here", child);

            // This is the backtick-wrapped content
            const content = child.props.children.slice(1, -1);
            return (
              <code
                key={index}
                className="rounded bg-[#161a1e] px-1.5 py-0.5 text-sm font-medium text-white"
              >
                {content}
              </code>
            );
          }
          // Return other spans as-is
          return child;
        })}
      </>
    );
  }

  // Return as-is if not an array
  return children;
};
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),
    callout: Callout,
    // Handle code blocks (with triple backticks)
    pre: ({ children, className, ...props }) => {
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
    // code: (props) => {
    //   // if there are backticks in the content, extract and style only that part
    //   const content = String(props.children);

    //   if (content.includes("`")) {
    //     // Match content between backticks
    //     const parts = content.split(/(`.*?`)/).map((part, index) => {
    //       if (part.startsWith("`") && part.endsWith("`")) {
    //         // Remove backticks and style the content
    //         const codeContent = part.slice(1, -1);
    //         return (
    //           <code
    //             key={index}
    //             className="rounded bg-[red] px-1.5 py-0.5 text-sm font-medium text-white"
    //           >
    //             {codeContent}
    //           </code>
    //         );
    //       }
    //       return part;
    //     });

    //     return <>{parts}</>;
    //   }

    //   // Regular code block or inline code without surrounding text
    //   return (
    //     <code
    //       className="rounded bg-[#161a1e] px-1.5 py-0.5 text-sm font-medium text-white"
    //       {...props}
    //     />
    //   );
    // },
    // code: ({ children }) => <CustomCode>{children}</CustomCode>,
    ...components,
  };
}

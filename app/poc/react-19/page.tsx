"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect } from "react";

const Page = () => {
  const [name, setName] = useState("Memoized");
  const myRef = useRef<HTMLDivElement>(null);

  // Effect to demonstrate ref updates
  useEffect(() => {
    if (myRef.current) {
      console.log("Ref value updated:", myRef.current.textContent);
    }
  }, [name]);

  return (
    <div className="flex flex-col gap-4">
      <p>Hello {name}!</p>
      <NotMemoized name={name} ref={myRef} />
      <Dummy />
      <Button
        onClick={() => setName((prev) => (prev === "Memoized" ? "Not Memoized" : "Memoized"))}
      >
        Toggle Name
      </Button>
    </div>
  );
};

export default Page;

// Using forwardRef to properly type the ref
const NotMemoized = (props: { name: string; ref: React.Ref<HTMLDivElement> }) => {
  console.log("NotMemoized rendered at:", new Date().toISOString());
  return (
    <div ref={props.ref} className="p-4 border rounded">
      {props.name}
    </div>
  );
};
// const NotMemoized = React.forwardRef<HTMLDivElement, { name: string }>((props, ref) => {
//   console.log("NotMemoized rendered at:", new Date().toISOString());
//   return (
//     <div ref={ref} className="p-4 border rounded">
//       {props.name}
//     </div>
//   );
// });

// Adding display name for better debugging
NotMemoized.displayName = "NotMemoized";

const Dummy = () => {
  console.log("Dummy rendered at:", new Date().toISOString());
  return <div>dummy</div>;
};

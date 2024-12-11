"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect } from "react";

const Page = () => {
  const [name, setName] = useState("Memoized");
  const myRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <p>Hello {name}!</p>
      <NotMemoized name={name} ref={myRef} />
      <Dummy />
      <Button
        onClick={() =>
          setName((prev) => (prev === "Memoized" ? "Not Memoized" : "Memoized"))
        }
      >
        Toggle Name
      </Button>
    </div>
  );
};

export default Page;

// Using forwardRef to properly type the ref
const NotMemoized = (props: {
  name: string;
  ref: React.Ref<HTMLDivElement>;
}) => {
  console.log("NotMemoized rendered at:", new Date().toISOString());
  return (
    <div ref={props.ref} className="rounded border p-4">
      {props.name}
    </div>
  );
};

// Adding display name for better debugging
NotMemoized.displayName = "NotMemoized";

const Dummy = () => {
  return <div>dummy</div>;
};

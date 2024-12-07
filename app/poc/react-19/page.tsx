"use client";

import React, { useState } from "react";

const Page = () => {
  const [name, setName] = useState("Memoized");
  return (
    <div className="flex flex-col gap-4">
      <p>Hello {name}!</p>
      <NotMemoized name={name} />
      <Dummy />
      <button
        onClick={() => setName((prev) => (prev === "Memoized" ? "Not Memoized" : "Memoized"))}
      >
        Toggle Name
      </button>
    </div>
  );
};

export default Page;

const NotMemoized = ({ name }: { name: string }) => {
  console.log("NotMemoized rendered at:", new Date().toISOString());
  return <div>{name}</div>;
};

const Dummy = () => {
  console.log("Dummy rendered at:", new Date().toISOString());

  return <div>dummy</div>;
};

"use client";

import { PlaceholdersAndVanishInput } from "../placeholders-and-vanish-input";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = ["Enter your email (valid one :D)"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div
      id="waitlist"
      className="mx-auto mt-10 flex h-[30rem] scroll-mt-14 flex-col items-center justify-center gap-y-6 rounded-xl border bg-black px-4"
    >
      <div className="flex flex-col items-center justify-center gap-y-2">
        <h2 className="text-center text-xl font-bold text-black dark:text-white sm:text-6xl">
          Join the waitlist
        </h2>
        <h3 className="text-xl">
          <span className="text-gray-300">Get early access to </span>
          <span className="text-indigo-600">markdownvideo</span>
        </h3>
      </div>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

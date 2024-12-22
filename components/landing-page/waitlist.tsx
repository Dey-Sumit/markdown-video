"use client";
import React from "react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight, MoveRight } from "lucide-react";
import { toast } from "sonner";
import GridPattern from "../grid-pattern";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import Form from "next/form";
import { useFormState } from "react-dom";
export function Waitlist() {
  const [email, setEmail] = useState("");
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      console.log("Invalid email", email);

      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("/api/add-to-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const parsedError = await response.json();
        return toast.error(parsedError.message);
      }

      setEmail(""); // Clear input on success
      toast.success("Successfully joined the waitlist!");
    } catch (error) {
      console.error("Failed to join the waitlist", error);
      toast.error("Failed to join the waitlist. Please try again.");
    }
  };

  return (
    <section
      id="waitlist"
      className="relative scroll-mt-10 overflow-hidden rounded-xl border border-gray-500/30 shadow"
    >
      <div className="mx-auto flex flex-col items-center justify-center gap-y-10 px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white sm:text-7xl">
            Join the waitlist
          </h2>
          <h3 className="text-base text-gray-300 md:text-lg">
            Get early access to{" "}
            <span className="text-indigo-600">markdownvideo</span>
          </h3>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-xl flex-col items-start gap-y-2"
        >
          <div className="group flex w-full flex-col items-center gap-2 rounded-[8px] border border-gray-800 p-1.5 focus-within:border-primary sm:flex-row">
            <Input
              className="w-full border-none bg-transparent outline-none focus:outline-none focus-visible:ring-0"
              inputMode="email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button className="w-full rounded-[5px] px-4 md:w-max">
              Join
              <MoveRight size={16} strokeWidth={3} className="ml-2" />
            </Button>
          </div>

          <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
            Give a valid email. It's win-win for both of us.
          </p>
        </form>
      </div>
      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
        )}
      />
    </section>
  );
}

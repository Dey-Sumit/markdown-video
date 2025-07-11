"use client";
import React from "react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MoveRight } from "lucide-react";
import { toast } from "sonner";
import GridPattern from "../grid-pattern";
import { cn } from "@/lib/utils";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export function Waitlist() {
  const [email, setEmail] = useState("");
  const [isMutating, setIsMutating] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      console.log("Invalid email", email);

      toast.error("Please enter a valid email address.");
      return;
    }
    setIsMutating(true);
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
    } finally {
      setIsMutating(false);
    }
  };

  return (
    // <section
    //   id="waitlist"
    //   className="relative scroll-my-20 overflow-hidden rounded-xl border border-gray-600/30 shadow"
    // >

    <section className="relative mt-12 h-[38vh] md:h-[50vh]" id="waitlist">
      <div className="absolute -inset-x-4 h-px bg-border md:-inset-x-10" />
      <div className="absolute -inset-y-4 w-px bg-border md:-inset-y-10" />
      <div className="absolute -inset-x-4 top-full h-px bg-border md:-inset-x-10" />
      <div className="absolute -inset-y-4 left-full w-px bg-border md:-inset-y-10" />

      <div className="absolute inset-0">
        <div className="relative z-20 mx-auto flex flex-col items-center justify-center gap-y-10 px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-4xl font-bold text-black sm:text-7xl dark:text-white">
              Join the waitlist
            </h2>
            <h3 className="text-base text-gray-300 md:text-lg">
              Get early access to{" "}
              <span className="text-indigo-600">markdown video</span>
            </h3>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex w-full max-w-xl flex-col items-start gap-y-2"
          >
            <div className="group flex w-full flex-col items-center gap-2 rounded-[8px] border border-gray-800 p-1.5 focus-within:border-primary sm:flex-row">
              <Input
                className="peer w-full border-none bg-transparent outline-none focus:outline-none focus-visible:ring-0"
                inputMode="email"
                type="email"
                placeholder="Enter your email"
                name="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                className="w-full rounded-[5px] px-4 peer-invalid:bg-gray-600 md:w-max"
                disabled={isMutating}
              >
                {isMutating ? (
                  "Joining..."
                ) : (
                  <>
                    Join
                    <MoveRight size={16} strokeWidth={3} className="ml-2" />
                  </>
                )}
              </Button>
            </div>

            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
              Give a valid email. It&lsquo;s win-win for both of us.
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
      </div>
    </section>

    // </section>
  );
}

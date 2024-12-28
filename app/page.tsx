import React from "react";
import ContainerScroll from "./landing-2/container-scroll";
import Particles from "@/components/magicui/particles";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { cn } from "@/lib/utils";
import { Link, ChevronRight } from "lucide-react";

import { Waitlist } from "@/components/landing-page/waitlist";
import SparklesText from "@/components/sparkle-text";
import Playground from "@/components/playground";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0e0d0d]">
      <section
        id="hero"
        className="relative h-max bg-gradient-to-t from-primary to-transparent p-4 md:min-h-screen md:p-8"
      >
        <div className="fixed inset-x-0 top-20 h-[40vh] md:top-20 md:h-[60vh]">
          <Particles
            className="h-full w-full"
            quantity={150}
            color="#ffffff"
            ease={200}
            refresh
          />
        </div>

        <div className="mb-16 mt-20 flex flex-col items-center justify-center gap-y-6 text-center md:mb-20 md:mt-36">
          <h1 className="relative text-4xl font-bold text-white md:text-5xl lg:text-6xl xl:text-[7rem]">
            Markdown to Video
            <div
              className={cn(
                "absolute -right-4 bottom-[140%] flex rotate-12 items-center justify-center gap-2 rounded-full border border-gray-400/40 bg-gray-100/20 px-3 py-1 md:-bottom-10 md:-right-20 md:-rotate-12 md:px-4 md:py-2",
                "font-mono text-sm font-normal md:text-base",
              )}
            >
              <p className="inline-block bg-white bg-clip-text text-transparent">
                as simple as that
              </p>
              <span>✨</span>
            </div>
          </h1>

          <p className="mx-auto max-w-xl text-sm text-gray-300 sm:max-w-2xl md:text-base">
            Make code walkthrough videos just by writing a simple markdown. It's
            magic (not really, just some coding you know) . No need to learn
            complex video editing tools.
          </p>

          <div className="relative w-full sm:w-auto">
            <a href="#waitlist">
              <AnimatedGradientText className="flex items-center justify-center rounded-full bg-white px-3 py-2 sm:py-3 md:px-4">
                🧑‍🍳 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
                <span
                  className={cn(
                    `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-sm text-transparent sm:text-lg`,
                  )}
                >
                  Join the waitlist
                </span>
                <ChevronRight className="ml-1 size-5 text-[#ffaa40] transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 sm:size-6" />
              </AnimatedGradientText>
            </a>
          </div>
        </div>
        <ContainerScroll />
      </section>
      {/* <section className="h-screen bg-black p-10"></section> */}
      <div className="flex flex-col gap-y-20 px-4 py-16 md:px-20">
        <Waitlist />

        <Playground />
        <div className="py-20">
          <SparklesText text="Markdown Video" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

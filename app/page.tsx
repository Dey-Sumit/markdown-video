import React from "react";
import ContainerScroll from "./landing-2/container-scroll";
import Particles from "@/components/magicui/particles";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

import { Waitlist } from "@/components/landing-page/waitlist";
import SparklesText from "@/components/sparkle-text";
import Playground from "@/components/playground";

import { Caveat } from "next/font/google";
import { RainbowButton } from "@/components/ui/rainbow-button";

// If loading a variable font, you don't need to specify the font weight
const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
});

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0e0d0d]">
      {/* ----------------------------- Fixed Particles ----------------------------  */}
      <div className="fixed inset-x-0 top-32 h-[40vh] md:top-20 md:h-[60vh]">
        <Particles
          className="h-full w-full"
          quantity={150}
          color="#ffffff"
          ease={200}
          refresh
        />
      </div>
      {/* ----------------------------- Fixed Particles ----------------------------  */}

      {/* hero section starts */}
      <section id="hero" className="relative h-max p-4 md:min-h-screen md:p-8">
        <div className="absolute inset-x-0 z-0 h-[75vh] bg-gradient-to-t from-primary to-transparent md:h-screen"></div>

        <div className="relative z-10">
          <div className="mb-16 mt-20 flex flex-col items-center justify-center gap-y-6 text-center md:mb-8 md:mt-36">
            <h1 className="relative text-4xl font-bold tracking-wide md:text-5xl lg:text-6xl xl:text-[7rem]">
              Markdown to Video
              <div
                className={cn(
                  "flex items-center justify-center",
                  "font-mono text-base font-normal md:text-2xl",
                  `${caveat.className}`,
                  "absolute -right-4 bottom-[110%] rotate-12 md:-bottom-6 md:-right-20 md:-rotate-12",
                  "",
                )}
              >
                <p className="inline-block pr-3 tracking-normal text-transparent text-white">
                  as simple as that
                </p>
                <span className="md:text-lg">✨</span>
              </div>
            </h1>

            <p className="mx-auto max-w-xl text-sm text-gray-300 sm:max-w-3xl md:text-base">
              Focus on your content—we’ll handle the rest. No need to learn
              complex video editing tools. Make stunning code walkthrough videos
              just by writing a simple markdown. It's magic .
            </p>

            <a href="#waitlist">
              <RainbowButton className="flex items-center justify-center rounded-full bg-white px-3 py-2 text-primary sm:py-3 md:px-5">
                🧑‍🍳 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" /> Join
                the waitlist
                <ChevronRight className="ml-1 size-5 text-primary transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 sm:size-6" />
              </RainbowButton>
            </a>
          </div>
          <ContainerScroll />
        </div>
      </section>
      {/* hero section ends */}

      {/* <section className="h-screen bg-black p-10"></section> */}
      <div className="flex flex-col gap-y-16 px-4 py-16 md:gap-y-36 md:px-20">
        <Waitlist />

        <Playground />
        <div className="pb-10">
          <SparklesText text="Markdown Video" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

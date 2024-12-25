import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import Particles from "@/components/magicui/particles";
import { Compare } from "../compare";

export default function Hero() {
  return (
    <div className="hero-bg relative w-full px-4 pt-0 md:px-10 md:pt-16">
      {/* ---------------------------- particles wrapper --------------------------- */}
      <div className="fixed inset-x-0 top-8 h-[60vh] md:top-20 md:h-[80vh]">
        <Particles
          className="h-full w-full"
          quantity={100}
          color="#ffffff"
          ease={100}
          refresh
        />
      </div>
      <div className="container mx-auto flex flex-col items-center justify-start gap-12 px-2 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-y-4 text-center sm:gap-y-8">
          <div className="flex flex-col gap-y-3">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl xl:text-[5rem]">
              Markdown to Video. That's it
            </h1>

            <p className="mx-auto max-w-xl text-sm font-light text-gray-300 sm:max-w-2xl md:text-xl">
              Make code walkthrough videos just by writing a simple markdown. As
              simple as that. No need to learn complex video editing tools.
            </p>
          </div>

          <Link href="#waitlist">
            <div className="relative z-10 w-full sm:w-auto">
              <AnimatedGradientText className="flex items-center justify-center rounded-full bg-white px-4 py-2 sm:py-3">
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
            </div>
          </Link>
        </div>

        <div className="relative h-[210px] w-full md:h-[700px]">
          <div
            className={cn(
              "relative flex h-full flex-col items-center justify-center rounded-xl backdrop-blur-lg",
              "before:pointer-events-none before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-full before:border-2 before:[filter:blur(200px)]",
              "before:[background:purple] md:before:[background-image:linear-gradient(to_bottom,#7a34f2,#7a34f2)]",
            )}
          >
            <div className="h-full w-full rounded-xl">
              <Compare
                firstElement={
                  <img
                    src="/landing-page/compare-markdown.png"
                    alt="first"
                    className="max-h-full"
                  />
                }
                secondElement={
                  <div className="h-full w-full">
                    <video
                      src="/landing-page/compare-video.mp4"
                      autoPlay
                      muted
                      loop
                      className="max-h-full"
                    />
                  </div>
                }
                className="rounded-xl border border-indigo-800 bg-black"
                slideMode="drag"
                autoplay
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

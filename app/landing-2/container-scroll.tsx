"use client";
import { BorderBeam } from "@/components/magicui/border-beam";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  useScroll,
  useTransform,
  motion,
  useMotionValueEvent,
} from "framer-motion";
import { Play, PlayCircle } from "lucide-react";
import React, { useRef, useState } from "react";

const ContainerScroll = () => {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 200px"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log({ latest });
  });

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.25, 1];
  };
  // Adjust perspective range for more dramatic effect
  const perspective = useTransform(scrollYProgress, [0, 1], [2000, 1000]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());

  return (
    <section ref={containerRef} className="pb-[100px]">
      <motion.div
        className="relative h-[40rem] w-full"
        style={{ perspective: perspective, transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="relative mx-auto h-full w-max overflow-hidden rounded-3xl border-0 border-purple-600"
          style={{
            transformStyle: "preserve-3d",
            rotateX: rotateX,
            scale: scale,
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
          }}
        >
          <HeroVideoDialog
            className="hidden dark:block"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/Um66g-byRLU?si=ErsH451IxqSa4lXM"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Hero Video"
          />
          {/* <video
            src="/landing-page/compare-video.mp4"
            autoPlay
            muted
            loop
            className="max-h-full"
          />

          <div className="group absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <button
              onClick={() => setIsOpen(true)}
              className="flex size-28 scale-95 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md group-hover:scale-100"
            >
              <div
                className={`relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b from-primary/30 to-primary shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}
              >
                <Play
                  className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                  style={{
                    filter:
                      "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                  }}
                />
              </div>
            </button>
          </div> */}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContainerScroll;

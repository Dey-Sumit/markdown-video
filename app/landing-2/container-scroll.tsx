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
  console.log({ isMobile });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 200px"],
  });

  const scaleDimensions = () => {
    return isMobile ? [1.1, 1] : [1, 0.9];
  };
  // Adjust perspective range for more dramatic effect
  const perspective = useTransform(scrollYProgress, [0, 1], [2000, 1000]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());

  return (
    <section ref={containerRef} className="">
      <motion.div
        className="relative mx-auto h-[12rem] w-full md:h-[38rem] md:w-[80%]"
        style={{ perspective: perspective, transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="relative mx-auto h-full max-w-full overflow-hidden rounded-xl bg-gray-500/20 p-1 md:rounded-3xl md:p-3"
          style={{
            transformStyle: "preserve-3d",
            rotateX: rotateX,
            scale: scale,
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
          }}
        >
          <div className="h-full w-full">
            <HeroVideoDialog
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/Um66g-byRLU?si=ErsH451IxqSa4lXM"
              thumbnailSrc="/landing-page/image.png"
              thumbnailAlt="Hero Video"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContainerScroll;

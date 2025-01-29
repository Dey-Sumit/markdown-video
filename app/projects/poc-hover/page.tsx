"use client";
import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";

const DragHandle = ({ vertical = false }) => (
  <div
    className={`flex items-center justify-center ${
      vertical ? "h-2 w-full cursor-row-resize" : "h-full w-2 cursor-col-resize"
    } bg-border hover:bg-accent`}
  >
    <div
      className={`${
        vertical ? "h-1 w-8" : "h-8 w-1"
      } rounded-full bg-muted-foreground`}
    />
  </div>
);

const RndComplexLayout = () => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [leftWidth, setLeftWidth] = useState(0);
  const [topHeight, setTopHeight] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
        setLeftWidth(width * 0.5);
        setTopHeight(height * 0.65);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div ref={containerRef} className="relative flex h-screen w-full">
      {/* Left Panel */}
      <Rnd
        size={{ width: leftWidth, height: "100%" }}
        position={{ x: 0, y: 0 }}
        minWidth={300}
        maxWidth={containerSize.width * 0.8}
        enableResizing={{
          right: true,
          top: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        disableDragging={true}
        onResize={(e, direction, ref) => {
          setLeftWidth(ref.offsetWidth);
        }}
        className="border-r border-border"
      >
        <div className="h-full w-full bg-red-600">
          <div className="h-full w-full">Left Panel</div>
        </div>
      </Rnd>

      {/* Right Section */}
      <div
        className="relative flex-1 bg-blue-600"
        style={{ marginLeft: "2px" }}
      >
        {/* Top Panel */}
        <Rnd
          size={{ width: "100%", height: topHeight }}
          position={{ x: 0, y: 0 }}
          enableResizing={{
            bottom: true,
            top: false,
            left: false,
            right: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          disableDragging={true}
          onResize={(e, direction, ref) => {
            setTopHeight(ref.offsetHeight);
          }}
          className="border-b border-border"
        >
          <div className="h-full w-full overflow-hidden bg-zinc-900">
            <div className="h-full w-full">Top Right Panel</div>
          </div>
        </Rnd>

        {/* Bottom Panel */}
        <div
          className="absolute w-full bg-green-700"
          style={{
            top: topHeight + 2,
            height: `calc(100% - ${topHeight + 2}px)`,
          }}
        >
          <div className="h-full w-full">Bottom Right Panel</div>
        </div>
      </div>

      {/* Handles */}
      <div
        className="absolute z-10"
        style={{
          left: leftWidth,
          height: "100%",
        }}
      >
        <DragHandle />
      </div>

      <div
        className="absolute z-10 w-full"
        style={{
          left: leftWidth + 2,
          top: topHeight,
          width: `calc(100% - ${leftWidth + 2}px)`,
        }}
      >
        <DragHandle vertical />
      </div>
    </div>
  );
};

export default RndComplexLayout;

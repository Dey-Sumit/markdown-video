"use client";

import dynamic from "next/dynamic";

const DynamicProjectsList = dynamic(
  () => import("@/components/projects-list"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center">Loading...</div>
    ),
  },
);

export default DynamicProjectsList;

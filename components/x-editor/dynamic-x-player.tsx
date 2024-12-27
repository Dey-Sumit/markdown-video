"use client";
import dynamic from "next/dynamic";

const ClientXPlayer = dynamic(() => import("@/components/x-player"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">Loading...</div>
  ),
});

export default ClientXPlayer;

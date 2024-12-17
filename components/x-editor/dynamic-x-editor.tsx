"use client";
import dynamic from "next/dynamic";

const ClientSideEditor = dynamic(() => import("@/components/x-editor"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">Loading...</div>
  ),
});

export default ClientSideEditor;

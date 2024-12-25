import Hero from "@/components/landing-page/hero";
import { Waitlist } from "@/components/landing-page/waitlist";
import SparklesText from "@/components/sparkle-text";

export default async function Index() {
  return (
    <div className="mb-[20vh] flex flex-col gap-y-16">
      <Hero />
      <div className="flex flex-col gap-y-16 px-4 py-4 md:px-10">
        <Waitlist />
        <SparklesText text="Markdown Video" />
      </div>
    </div>
  );
}

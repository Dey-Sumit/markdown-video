import Hero from "@/components/landing-page/hero";
import { PlaceholdersAndVanishInputDemo } from "@/components/landing-page/waitlist";

export default async function Index() {
  return (
    <div className="mb-[50vh] px-10 py-4">
      <Hero />
      <PlaceholdersAndVanishInputDemo />
    </div>
  );
}

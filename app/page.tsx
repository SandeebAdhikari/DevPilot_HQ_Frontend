import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import WaterRippleBackground from "@/components/Animation/WaterRippleBackground";
import WindowShowcase from "@/components/WindowShowcase";
import TerminalWorkflow from "@/components/TerminalWorkflow";
import ProductIllustration from "@/components/ProductIllustration";
import AdoptionScenarios from "@/components/AdoptionScenarios";

export default function Home() {
  return (
    <>
      <WaterRippleBackground />
      <div className="relative z-10">
        <div className="fixed z-50 w-full">
          <Navbar />
        </div>

        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <Hero />
          <WindowShowcase />
          <TerminalWorkflow />
          <ProductIllustration />
          <AdoptionScenarios />
        </div>
      </div>
    </>
  );
}

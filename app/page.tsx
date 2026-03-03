
import BlurDivIn from "@/components/Animation/BlurDivIn";
import GradualSpacing from "@/components/Animation/GradualSpacing";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import RippleCursor from "@/components/Animation/RippleCursor";

export default function Home() {
  return (
    <>
      <RippleCursor />
      <div className="">
        <Navbar />
        <div className="mx-16">
          <Hero />
          <div className="w-full justify-center text-6xl text-primary font-extrabold mt-26 mb-32 flex">
            <BlurDivIn>
              <GradualSpacing text="COMING SOON..." />
            </BlurDivIn>
          </div>
        </div>
      </div>
    </>
  );
}

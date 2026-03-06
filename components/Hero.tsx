import BlurDivIn from "./Animation/BlurDivIn";

import React from "react";

const Hero = () => {
  return (
    <BlurDivIn>
      <div className="relative flex w-full gap-8 pt-36">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_46%_at_50%_10%,rgba(148,163,184,0.12),transparent_70%)]" />
        <div className="w-3/4">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.02em] text-primary md:text-6xl">
            The code understanding system for teams and AI agents.
          </h1>
          <p className="mt-6 max-w-2xl text-secondary">
            Built to onboard, refactor, and scale software faster.
          </p>
        </div>
        <div className="relative w-1/4">
          <a
            href=""
            className="absolute left-8 top-46 rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-secondary transition hover:-translate-y-0.5 hover:border-[rgba(165,180,252,0.36)] hover:bg-[rgba(165,180,252,0.12)] hover:text-primary"
          >
            <span className="font-bold text-primary">New</span> DevPilot Review
            →
          </a>
        </div>
      </div>
    </BlurDivIn>
  );
};

export default Hero;

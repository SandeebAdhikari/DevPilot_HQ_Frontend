import BlurDivIn from "./Animation/BlurDivIn";

import React from "react";

const Hero = () => {
  return (
    <BlurDivIn>
      <div className="flex w-full">
        <div className="w-3/4">
          <h1 className="mt-56 font-bold text-5xl">
            The code understanding system for teams and AI agents.
          </h1>
          <p className="mt-4 text-secondary">
            Built to onboard, refactor, and scale software faster.
          </p>
        </div>
        <div className="relative w-1/4 ">
          <a
            href=""
            className="absolute text-secondary hover:text-primary top-84 left-35"
          >
            <span className="text-primary hover:text-white font-bold">New</span>{" "}
            DevPilot Review →
          </a>
        </div>
      </div>
    </BlurDivIn>
  );
};

export default Hero;

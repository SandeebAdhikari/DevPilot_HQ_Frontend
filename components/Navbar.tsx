"use client";
import React, { useState } from "react";
import NavCard from "./NavCard";

const NAV_ITEMS = [
  {
    label: "Product",
    items: [
      {
        heading: "Intake",
        summary: "Make your product operation self-driving.",
      },
      { heading: "Build", summary: "Move work forward with teams and agent." },
      { heading: "Monitor", summary: "Understand progress at scale." },
    ],
  },
  {
    label: "Resources",
    items: [
      { heading: "Docs", summary: "Read our documentation." },
      { heading: "API", summary: "Explore our API." },
      { heading: "Guides", summary: "Step-by-step guides." },
    ],
  },
  {
    label: "Customers",
    items: [
      { heading: "Case Studies", summary: "See how others use us." },
      { heading: "Testimonials", summary: "Hear from our customers." },
    ],
  },
  {
    label: "Pricing",
    items: [
      { heading: "Plans", summary: "Choose your plan." },
      { heading: "Enterprise", summary: "Custom solutions." },
    ],
  },
  {
    label: "Now",
    items: [{ heading: "Updates", summary: "Latest news and features." }],
  },
  {
    label: "Contact",
    items: [
      { heading: "Support", summary: "Get help." },
      { heading: "Sales", summary: "Talk to sales." },
    ],
  },
];

const Navbar = () => {
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const handleMouseEnter = (idx: number) => setDropdownIndex(idx);
  const handleMouseLeave = () => setDropdownIndex(null);
  return (
    <div className="relative border-b border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(8,10,15,0.9),rgba(7,9,13,0.72))] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.06),transparent)] opacity-30" />
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 text-secondary md:px-10">
        <h1 className="font-semibold tracking-[-0.01em] text-primary">
          DevPilot-HQ
        </h1>
        <div className="flex gap-5 text-sm">
          {NAV_ITEMS.map((nav, idx) => (
            <div
              key={nav.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href=""
                className="rounded-md px-2 py-1 transition hover:bg-[rgba(255,255,255,0.05)] hover:text-primary"
              >
                {nav.label}
              </a>
              {dropdownIndex === idx && (
                <div
                  className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50"
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavCard items={nav.items} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 text-sm">
          <button className="cursor-pointer rounded-md px-3 py-1 transition hover:bg-[rgba(255,255,255,0.05)] hover:text-primary">
            Log in
          </button>
          <button className="cursor-pointer rounded-full border border-[rgba(165,180,252,0.34)] bg-[rgba(165,180,252,0.1)] px-3 py-1 text-primary transition hover:border-[rgba(165,180,252,0.5)] hover:bg-[rgba(165,180,252,0.16)]">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

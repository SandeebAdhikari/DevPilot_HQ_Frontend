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
    <div className="border-b border-border relative">
      <div className="flex justify-between items-center h-16 mx-16 text-secondary">
        <h1 className="font-bold text-primary">DevPilot-HQ</h1>
        <div className="flex gap-5 text-sm">
          {NAV_ITEMS.map((nav, idx) => (
            <div
              key={nav.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              <a href="" className="hover:scale-105 hover:transition-transform">
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
        <div className="flex text-sm gap-3">
          <button className="cursor-pointer">Log in</button>
          <button className="border border-secondary rounded-md px-2 py-1  hover:scale-105 cursor-pointer hover:text-primary hover:border-none">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

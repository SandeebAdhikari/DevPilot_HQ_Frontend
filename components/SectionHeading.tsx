import React from "react";

type SectionHeadingProps = {
  title: string;
  description: string;
  stepLabel?: string;
  className?: string;
};

const SectionHeading = ({
  title,
  description,
  stepLabel,
  className,
}: SectionHeadingProps) => {
  return (
    <div
      className={`mb-12 grid items-start gap-y-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-x-16 ${className ?? ""}`}
    >
      <h2 className="max-w-[640px] text-[44px] font-semibold leading-[1.05] tracking-[-0.025em] text-primary md:text-[60px]">
        {title}
      </h2>
      <div className="pt-1 lg:pt-2">
        <p className="max-w-[620px] text-[20px] leading-[1.48] text-[#b8becb] md:text-[22px]">
          {description}
        </p>
        {stepLabel ? (
          <p className="mt-8 text-sm font-medium tracking-[0.02em] text-muted">
            {stepLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default SectionHeading;

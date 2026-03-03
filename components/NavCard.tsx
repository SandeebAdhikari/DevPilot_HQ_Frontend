import React from "react";

interface NavCardItem {
  heading: string;
  summary: string;
}

interface NavCardProps {
  items: NavCardItem[];
}

const defaultProductItems: NavCardItem[] = [
  { heading: "Intake", summary: "Make your product operation self-driving." },
  { heading: "Build", summary: "Move work forward with teams and agent." },
  { heading: "Monitor", summary: "Understand progress at scale." },
  { heading: "Intake", summary: "Make your product operation self-driving." },
  { heading: "Build", summary: "Move work forward with teams and agent." },
  { heading: "Monitor", summary: "Understand progress at scale." },
];

const NavCard: React.FC<NavCardProps> = ({ items }) => {
  const cardItems = items && items.length > 0 ? items : defaultProductItems;

  const columns =
    cardItems.length <= 3
      ? 3
      : cardItems.length <= 6
        ? 3
        : Math.ceil(cardItems.length / 2);
  const rows = Math.ceil(cardItems.length / columns);
  return (
    <div className="w-200 border border-teal-950 rounded-md p-1">
      <div className="border border-teal-950 rounded-md bg-surface p-2">
        <div className={`grid w-full grid-cols-${columns} grid-rows-${rows}`}>
          {cardItems.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-surface border-r border-teal-950 hover:bg-border cursor-pointer rounded-l-lg"
            >
              <div>
                <h1 className="text-secondary">{item.heading}</h1>
                <p className="text-primary text-sm">{item.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavCard;

"use client";

import { useState } from "react";
import { Iconify } from "../ui/iconify";

interface TryItNowButtonProps {
  href: string;
}

export default function TryItNowButton({ href }: TryItNowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className="inline-flex will-change-contents items-center px-10 py-3 text-lg font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Try it now
      <Iconify
        icon="solar:arrow-right-bold-duotone"
        className={`ml-2 transition-transform duration-300 ${
          isHovered ? "translate-x-1" : ""
        }`}
      />
    </a>
  );
}

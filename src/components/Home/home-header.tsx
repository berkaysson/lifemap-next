"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import ThemeToggle from "../ui/Buttons/theme-toggle";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="hover:opacity-80 transition-colors"
    >
      {children}
    </Link>
  );
}

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative z-20 w-full py-4 px-4 sm:px-6 text-fore">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Habivita" width={28} height={28} />
          <span className="text-secondary text-lg sm:text-xl font-bold">
            Habivita
          </span>
        </Link>
        <div className="hidden md:flex space-x-6 items-center text-back dark:text-fore">
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <NavLink href="/login">Sign In</NavLink>
          <ThemeToggle />
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden text-back dark:text-fore"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-back border-t border-shade py-4">
          <div className="container mx-auto flex flex-col space-y-4 px-4">
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/signin">Sign In</NavLink>
            <span>
              <ThemeToggle />
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}

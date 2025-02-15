"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

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
      className="text-white/80 hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative z-20 w-full py-4 px-4 sm:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Habivita"
            width={28}
            height={28}
          />
          <span className="text-white text-lg sm:text-xl font-bold">
            Habivita
          </span>
        </Link>
        <div className="hidden md:flex space-x-6">
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <NavLink href="/signin">Sign In</NavLink>
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#030303] border-t border-white/10 py-4">
          <div className="container mx-auto flex flex-col space-y-4 px-4">
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/signin">Sign In</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

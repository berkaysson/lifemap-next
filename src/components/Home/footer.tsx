import type React from "react";
import Image from "next/image";
import Link from "next/link";

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

export function Footer() {
  return (
    <footer className="relative z-10 bg-[#030303] border-t border-white/10 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Habivita"
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="text-white font-semibold">Habivita</span>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
            <NavLink href="/privacy">Privacy Policy</NavLink>
            <NavLink href="/terms">Terms of Service</NavLink>
            <NavLink href="/contact">Contact Us</NavLink>
          </div>
          <div className="text-white/60 text-xs sm:text-sm">
            © {new Date().getFullYear()} Habivita. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

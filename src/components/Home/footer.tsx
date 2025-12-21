import type React from "react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative z-10 bg-back py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <Image
              quality={100}
              src="/logo.png"
              alt="Habivita"
              width={32}
              height={32}
              priority
              unoptimized
              loading="eager"
              className="mr-2"
            />
            <span className="text-secondary font-semibold">Habivita</span>
          </div>
          <div className="text-shade text-xs sm:text-sm">
            © {new Date().getFullYear()} Habivita. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

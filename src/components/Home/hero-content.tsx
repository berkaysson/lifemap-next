"use client";

import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

interface HeroContentProps {
  badge: string;
  title1: string;
  title2: string;
}

export function HeroContent({ badge, title1, title2 }: HeroContentProps) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6 sm:mb-8 md:mb-12"
        >
          <Image
            src="/logo.svg"
            alt="Habivita"
            width={16}
            height={16}
          />
          <span className="text-xs sm:text-sm text-secondary tracking-wide">
            {badge}
          </span>
        </motion.div>

        <motion.div
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-secondary to-white/80">
              {title1}
            </span>
            <br />
            <span
              className={cn(
                "bg-clip-text text-transparent bg-gradient-to-r from-primary via-white/90 to-secondary ",
                poppins.className
              )}
            >
              {title2}
            </span>
          </h1>
        </motion.div>

        <motion.div
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-secondary mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-2 sm:px-4">
            Empower your aspirations, foster productivity, and cultivate
            meaningful habits. Navigate life&apos;s complexities and journey towards
            success and fulfillment.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

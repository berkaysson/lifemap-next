"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  CheckSquare,
  Calendar,
  Repeat,
  FolderKanban,
  Menu,
} from "lucide-react";
import { useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

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

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 flex flex-col items-center text-center h-full">
      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-teal-400 mb-3 sm:mb-4" />
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-white/60">{description}</p>
    </div>
  );
}

export default function HeroGeometric({
  badge = "Habivita",
  title1 = "Your Personal",
  title2 = "Journey Companion",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-[#030303]">
      {/* Navigation Bar */}
      <nav className="relative z-20 w-full py-4 px-4 sm:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/habivita-logo.svg"
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
            aria-label="Toggle Menu"
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

      {/* Hero Content */}
      <div className="flex-grow flex items-center justify-center py-12 sm:py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.05] via-transparent to-purple-500/[0.05] blur-3xl" />

        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-teal-500/[0.15]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />

          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-purple-500/[0.15]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />

          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-emerald-500/[0.15]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />

          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            gradient="from-indigo-500/[0.15]"
            className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />

          <ElegantShape
            delay={0.7}
            width={150}
            height={40}
            rotate={-25}
            gradient="from-blue-500/[0.15]"
            className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
        </div>

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
                src="/habivita-logo.svg"
                alt="Habivita"
                width={16}
                height={16}
              />
              <span className="text-xs sm:text-sm text-white/60 tracking-wide">
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
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  {title1}
                </span>
                <br />
                <span
                  className={cn(
                    "bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-white/90 to-purple-300 ",
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
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-2 sm:px-4">
                Empower your aspirations, foster productivity, and cultivate
                meaningful habits. Navigate life&apos;s complexities and journey
                towards success and fulfillment.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
      </div>

      {/* Features Section */}
      <section className="relative z-10 py-16 sm:py-20 md:py-24 bg-[#030303]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 sm:mb-12 md:mb-16">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={ClipboardList}
              title="Activity Logging"
              description="Log your activities, track duration, and gain insights for goal setting."
            />
            <FeatureCard
              icon={CheckSquare}
              title="To-Do Management"
              description="Create and manage one-time actions or reminders with simple completion tracking."
            />
            <FeatureCard
              icon={Calendar}
              title="Tasks"
              description="Set specific objectives with deadlines and track progress through activity logging."
            />
            <FeatureCard
              icon={Repeat}
              title="Habits"
              description="Foster positive habits with recurring activities and guided behavior changes."
            />
            <FeatureCard
              icon={FolderKanban}
              title="Project Management"
              description="Organize related tasks and to-dos effectively with project-based structuring."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#030303] border-t border-white/10 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <Image
                src="/habivita-logo.svg"
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
    </div>
  );
}

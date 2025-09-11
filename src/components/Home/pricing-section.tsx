"use client";

import TryItNowButton from "./try-it-button";

export function PricingSection() {
  return (
    <section className="relative z-10 py-16 sm:py-20 md:py-24 bg-back border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-back via-transparent to-[#13053860] dark:to-[#1c0f3b88] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3">
            Pricing
          </h2>
          <p className="text-sm text-fore mb-8">
            Beta Access: <span className="font-semibold light:text-primary dark:text-secondary">Completely Free</span>
          </p>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur p-6 sm:p-8 max-w-xl mx-auto">
            <div className="mb-4">
              <span className="inline-flex items-center rounded-full bg-green-500/15 light:text-green-900 dark:text-green-100 px-3 py-1 text-xs font-medium border border-green-400/20">
                Limited-time beta
              </span>
            </div>

            <div className="flex items-end justify-center gap-2 mb-4">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                $0
              </span>
              <span className="text-primary text-sm mb-1">/ month</span>
            </div>
            <p className="text-fore text-sm sm:text-base mb-6">
              Enjoy all core features for free while we&apos;re in beta. No credit card required.
            </p>

            <div className="flex justify-center">
              <TryItNowButton href="/auth/register" />
            </div>

            <ul className="mt-6 text-left text-sm light:text-primary dark:text-secondary grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-fore" />
                Activity tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-fore" />
                Tasks and to-dos
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-fore" />
                Habit builder
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-fore" />
                Projects
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;



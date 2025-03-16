import { CheckCircle } from "lucide-react";
import TryItNowButton from "@/components/Home/try-it-button";
import { Footer } from "@/components/Home/footer";
import { HomeHeader } from "@/components/Home/home-header";

export default function AboutPage() {
  return (
    <div className="text-fore bg-back">
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#1405388e] dark:to-[#3e335a88] pointer-events-none" />
      <HomeHeader />
      <div className="container mx-auto px-4 pt-4 sm:pt-8 sm:px-6 md:px-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-8">About Habivita</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Your Personal Journey Companion
          </h2>
          <p className="text-lg mb-4">
            Habivita is more than just a task manager; it&apos;s a holistic
            platform meticulously crafted to guide you through the complexities
            of life, helping you navigate towards success and fulfillment.
          </p>
          <p className="text-lg">
            We empower you to achieve your aspirations, foster productivity, and
            cultivate meaningful habits and projects. With Habivita, you&apos;re
            not just managing tasks - you&apos;re mapping out your life&apos;s
            journey.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <ul className="space-y-4">
            {[
              "Comprehensive Dashboard",
              "Activity Logging",
              "To-Do Management",
              "Task Tracking",
              "Habit Formation",
              "Project Management",
            ].map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
          <p className="text-lg mb-4">
            We&apos;ve built Habivita using cutting-edge technologies to ensure
            a smooth, responsive, and powerful user experience:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Frontend: Next.js, Tanstack Query, Tailwind CSS, Material UI and
              shadcn-ui
            </li>
            <li>Backend: Supabase, PostgreSQL, Prisma, and Vercel</li>
          </ul>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Join the Habivita Community
          </h2>
          <p className="text-lg mb-6">
            Embark on your journey towards personal growth and productivity with
            Habivita. Join a community of individuals committed to thriving in
            every aspect of life.
          </p>

          <TryItNowButton href="/auth/register" />
        </section>
      </div>
      <Footer />
    </div>
  );
}

import { HomeHeader } from "@/components/Home/home-header";
import { Button } from "@/components/ui/Buttons/button";
import { MapPin, Compass, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-foreground text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                Map Your Life&apos;s Journey
              </h1>
              <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
                Visualize, plan, and achieve your life goals with LifeMap
              </p>
              <div className="mt-10 flex justify-center">
                <Button size="lg" className="mr-4">
                  Get Started
                </Button>
                <Button size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Why Choose LifeMap?
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Empower your journey with our innovative features
              </p>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">
                  Visual Goal Mapping
                </h3>
                <p className="mt-2 text-base text-gray-600 text-center">
                  Create interactive maps of your life goals and aspirations
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white">
                  <Compass className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">
                  Guided Planning
                </h3>
                <p className="mt-2 text-base text-gray-600 text-center">
                  Get personalized advice and strategies to achieve your goals
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">
                  Progress Tracking
                </h3>
                <p className="mt-2 text-base text-gray-600 text-center">
                  Monitor your achievements and adjust your path in real-time
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Ready to Start Your Journey?
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Join thousands of users who have transformed their lives with
                LifeMap
              </p>
              <div className="mt-10">
                <Button size="lg">Sign Up Now</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm">© 2023 LifeMap. All rights reserved.</div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-gray-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

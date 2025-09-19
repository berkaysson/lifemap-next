"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ExampleHabit from "./example-habit";
import ExampleTask from "./example-task";
import TryItNowButton from "./try-it-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";

const queryClient = new QueryClient();

export function ExamplesSection() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const pages = [0, 1, 2, 3];
  return (
    <QueryClientProvider client={queryClient}>
      <section className="z-10 py-16 sm:py-20 md:py-24 bg-back">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-primary text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8">
            How habivita Works
          </h2>
          <Carousel
            setApi={setApi}
            className="max-w-xl mx-auto shadow-md p-2 sm:p-4 rounded-lg"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <CarouselPrevious className="static transform-none text-gray-400" />
              <div className="flex gap-1">
                {pages.map((idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      current === idx ? "bg-primary" : "bg-muted"
                    }`}
                    onClick={() => api?.scrollTo(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <CarouselNext className="static transform-none text-gray-400" />
            </div>
            <CarouselContent>
              <CarouselItem>
                <div className="flex flex-col items-center min-h-[300px] justify-center">
                  <ExampleHabit />
                </div>
              </CarouselItem>

              <CarouselItem>
                <div className="flex flex-col items-center min-h-[300px] justify-center">
                  <ExampleTask />
                </div>
              </CarouselItem>

              <CarouselItem>
                <h2 className="text-xl font-semibold text-primary">Add new activities</h2>
                <p className="text-sm text-muted-foreground">
                  Add new activities with modern ui and track your progress.
                </p>
                <div className="flex flex-col items-center min-h-[300px] justify-center w-full h-[70vh]">
                  <div className="relative w-full h-full aspect-[9/16]">
                    <Image
                      src="/assets/images/home/home-activity-drawer.webp"
                      alt="Activity drawer example"
                      fill
                      className="object-contain mx-auto"
                      sizes="(max-width: 768px) 80vw, 60vw"
                      priority
                      style={{
                        objectFit: "contain",
                        maxWidth: "min(90vw, 400px)",
                      }}
                    />
                  </div>
                </div>
              </CarouselItem>

              <CarouselItem>
                <h2 className="text-xl font-semibold text-primary">Follow Your Progress</h2>
                <p className="text-sm text-muted-foreground">
                  Visualize your weekly activity summaries and stay motivated
                  with habivita.
                </p>
                <div className="flex flex-col items-center min-h-[300px] justify-center w-full h-[70vh]">
                  <div className="relative w-full h-full aspect-[9/16]">
                    <Image
                      src="/assets/images/home/home-weekly-summary.webp"
                      alt="Activity drawer example"
                      fill
                      className="object-contain mx-auto rounded-lg"
                      style={{
                        objectFit: "contain",
                        maxWidth: "min(90vw, 400px)",
                      }}
                    />
                  </div>
                </div>
              </CarouselItem>

              <CarouselItem>
                <div className="flex flex-col items-center min-h-[300px] justify-center">
                  <div className="flex flex-col items-center gap-4 mt-2 sm:mt-4">
                    <h3 className="text-lg font-semibold">
                      Explore More by Yourself
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      There&apos;s so much more to do with habivita.
                    </p>
                    <TryItNowButton href="/auth/register" />
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>

            <div className="flex items-center justify-center gap-2 mt-6">
              <CarouselPrevious className="static transform-none text-gray-400" />
              <div className="flex gap-1">
                {pages.map((idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      current === idx ? "bg-primary" : "bg-muted"
                    }`}
                    onClick={() => api?.scrollTo(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <CarouselNext className="static transform-none text-gray-400" />
            </div>
          </Carousel>
        </div>
      </section>
    </QueryClientProvider>
  );
}

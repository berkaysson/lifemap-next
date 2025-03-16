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
  return (
    <QueryClientProvider client={queryClient}>
      <section className="z-10 py-16 sm:py-20 md:py-24 bg-back">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-4 sm:mb-6 md:mb-8">
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
              <CarouselPrevious className="static transform-none" />
              <div className="flex gap-1">
                {[0, 1, 2].map((idx) => (
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
              <CarouselNext className="static transform-none" />
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
              <CarouselPrevious className="static transform-none" />
              <div className="flex gap-1">
                {[0, 1, 2].map((idx) => (
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
              <CarouselNext className="static transform-none" />
            </div>
          </Carousel>
        </div>
      </section>
    </QueryClientProvider>
  );
}

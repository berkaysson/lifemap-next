"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyItemsCarousel from "./DailyItemsCaraousel";
import UpcomingItemsCarousel from "./UpcomingItemsCarousel";
import { Iconify } from "../ui/iconify";

export default function DashboardCarouselTabs() {
  return (
    <Tabs defaultValue="today" className="w-full">
      <div className="flex items-center justify-between mb-4 px-2 sm:px-4">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Iconify icon="solar:calendar-date-bold" width={16} />
            Today
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Iconify icon="solar:calendar-add-bold" width={16} />
            In 7 Days
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="today" className="space-y-4">
        <DailyItemsCarousel />
      </TabsContent>
      
      <TabsContent value="upcoming" className="space-y-4">
        <UpcomingItemsCarousel />
      </TabsContent>
    </Tabs>
  );
}

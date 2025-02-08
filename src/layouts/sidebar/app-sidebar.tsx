"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/layouts/sidebar/sidebar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Iconify } from "@/components/ui/iconify";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "solar:home-angle-2-bold",
    activeIcon: "solar:home-angle-2-bold-duotone",
  },
  {
    title: "Activities",
    url: "/dashboard/activity",
    icon: "solar:bolt-bold",
    activeIcon: "solar:bolt-bold-duotone",
  },
  {
    title: "ToDos",
    url: "/dashboard/todo",
    icon: "solar:checklist-minimalistic-bold",
    activeIcon: "solar:checklist-minimalistic-bold-duotone",
  },
  {
    title: "Tasks",
    url: "/dashboard/task",
    icon: "solar:check-read-bold",
    activeIcon: "solar:check-read-bold-duotone",
  },
  {
    title: "Habits",
    url: "/dashboard/habit",
    icon: "ph:plant-bold",
    activeIcon: "ph:plant-duotone",
  },
  {
    title: "Projects",
    url: "/dashboard/project",
    icon: "solar:folder-with-files-bold",
    activeIcon: "solar:folder-with-files-bold-duotone",
  },
  {
    title: "Categories",
    url: "/dashboard/category",
    icon: "solar:hashtag-square-bold",
    activeIcon: "solar:hashtag-square-bold-duotone",
  },
];

const footerItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: "solar:settings-bold",
    activeIcon: "solar:settings-bold-duotone",
  },
  // {
  //   title: "Profile",
  //   url: "/dashboard/profile",
  //   icon: "solar:user-rounded-bold",
  //   activeIcon: "solar:user-rounded-bold-duotone",
  // },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isLinkActive = (url: string) => pathname === url;

  return (
    <Sidebar variant="floating" collapsible="icon" className="group-data-[collapsible=icon]:w-[70px]">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-1">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={50}
            height={50}
          />
          <span className="text-lg font-bold text-themeAlt dark:text-theme group-data-[collapsible=icon]:hidden">
            lifemap
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = isLinkActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        isActive && "bg-primary text-primary-foreground",
                        "transition-colors hover:bg-primary/90 hover:text-primary-foreground"
                      )}
                    >
                      <Link href={item.url}>
                        <Iconify
                          icon={isActive ? item.activeIcon : item.icon}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {footerItems.map((item) => {
            const isActive = isLinkActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    isActive && "bg-primary text-primary-foreground",
                    "transition-colors hover:bg-primary/90 hover:text-primary-foreground w-full justify-start"
                  )}
                >
                  <Link href={item.url}>
                    <Iconify icon={isActive ? item.activeIcon : item.icon} />
                    {item.title === "Profile" ? session?.user.name : item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

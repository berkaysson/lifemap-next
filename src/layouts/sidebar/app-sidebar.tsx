import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Activities",
    url: "/dashboard/activity",
  },
  {
    title: "ToDos",
    url: "/dashboard/todo",
  },
  {
    title: "Tasks",
    url: "/dashboard/task",
  },
  {
    title: "Habits",
    url: "/dashboard/habit",
  },
  {
    title: "Projects",
    url: "/dashboard/project",
  },
  {
    title: "Categories",
    url: "/dashboard/category",
  },
];

const footerItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: null,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isLinkActive = (url: string) => pathname === url;

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="text-lg font-bold">lifemap</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
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
            const Icon = item.icon;
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
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
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

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

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

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
                const isActive = pathname === item.url;
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
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            {session?.user.name}
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

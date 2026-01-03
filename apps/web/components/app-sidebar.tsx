"use client";

import * as React from "react";
import Image from "next/image";
import logo from "@workspace/ui/images/logo-taskflow.png";
import Link from "next/link";

import { Map, Calendar1, ListChecks, Inbox, CalendarDays } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { AnimatedThemeToggler } from "@workspace/ui/components/animated-theme-toggler";
import { NavCustom } from "./nav-custom";

const data = {
  projects: [
    {
      name: "Inbox",
      url: "/dashboard",
      icon: Inbox,
    },
    {
      name: "Todays",
      url: "/dashboard/todays",
      icon: Calendar1,
    },
    {
      name: "Upcoming",
      url: "/dashboard/upcoming",
      icon: CalendarDays,
    },
    {
      name: "Completed",
      url: "/dashboard/completed",
      icon: ListChecks,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/">
          <Image src={logo} width={100} height={40} alt="logo" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavCustom projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

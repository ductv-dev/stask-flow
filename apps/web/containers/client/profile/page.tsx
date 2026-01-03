"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/actions/auth";
import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

type Tuser = {
  name: string;
  email: string;
  avatar: string;
};
type Props = {};

export const ProfileClient: React.FC<Props> = () => {
  const [user, setUser] = useState<Tuser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getProfile();
      if (profile) {
        setUser({
          name: profile.fullName,
          email: profile.email,
          avatar: profile.avatar || "",
        });
      }
    };
    fetchUser();
  }, []);
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1  p-4 pt-0">
        {user && (
          <div>
            <h1>Photo</h1>
            <div className="flex gap-2.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-15 w-15 rounded-full object-cover"
              />
              <Button variant={"outline"}>Change Photo</Button>
              <Button
                variant={"outline"}
                className="text-red-500 border-red-500 hover:bg-red-500/10 hover:text-red-600"
              >
                Remove Photo
              </Button>
            </div>

            <h1>Name</h1>
            <Input value={user.name} />
            <h1>Email</h1>
            <p>{user.email}</p>
          </div>
        )}
      </div>
    </SidebarInset>
  );
};

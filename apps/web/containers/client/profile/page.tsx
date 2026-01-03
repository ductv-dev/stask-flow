/* eslint-disable @next/next/no-img-element */
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
          <div className="flex flex-col gap-6 w-full ">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Photo</label>
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar || "https://github.com/shadcn.png"}
                  alt={user?.name}
                  className="h-16 w-16 rounded-full object-cover border border-slate-200"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-600 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    Remove Photo
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Display Name</label>
              <Input defaultValue={user?.name} className="max-w-md" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Email</label>
              <div className="flex  max-w-md   text-sm ">{user?.email}</div>
              <Button variant="outline" className="max-w-md ">
                Change Email
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Password</label>
              <Button variant="outline" className="max-w-md ">
                Change Password
              </Button>
            </div>
            <hr />
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-red-600">
                Delete Account
              </label>
              <p className="text-sm text-muted-foreground max-w-md">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <Button
                variant="outline"
                className="max-w-md text-red-600 border-red-200 hover:bg-red-50 hover:border-red-600 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                Delete Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </SidebarInset>
  );
};

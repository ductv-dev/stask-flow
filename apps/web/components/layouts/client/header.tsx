"use client";

import { AnimatedThemeToggler } from "@workspace/ui/components/animated-theme-toggler";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import Image from "next/image";
import logo from "@workspace/ui/images/logo-taskflow.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"; // Nhớ cài component này
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"; // Nhớ cài component này
import { logoutAction } from "@/actions/auth";

type User = {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
} | null;

type Props = {
  user: User;
};

export const HeaderClient: React.FC<Props> = ({ user }) => {
  const handleLogout = async () => {
    await logoutAction();
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  return (
    <div className="justify-between flex items-center p-5 bg-amber-500 ">
      <Link href="/">
        <Image src={logo} width={100} height={40} alt="logo" />
      </Link>
      <Button onClick={handleLogout}>hihi</Button>

      <div className="flex gap-4 items-center">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.fullName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard">
                <DropdownMenuItem className="cursor-pointer">
                  Dashboard
                </DropdownMenuItem>
              </Link>
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  Hồ sơ cá nhân
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer focus:text-red-600"
                onClick={handleLogout}
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href={"/auth/sign-in"}>
              <Button variant={"ghost"} className="font-bold">
                Sign in
              </Button>
            </Link>
            <Link href={"/auth/sign-up"}>
              <Button className="bg-orange-600 hover:bg-orange-700 font-bold text-white">
                Try for free !!!
              </Button>
            </Link>
          </>
        )}
        <AnimatedThemeToggler />
      </div>
    </div>
  );
};

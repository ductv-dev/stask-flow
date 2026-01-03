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

type Props = {};

export const HeaderClient: React.FC<Props> = ({}) => {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="justify-between flex items-center p-5  ">
      <Link href="/">
        <Image src={logo} width={100} height={40} alt="logo" />
      </Link>
      <Button onClick={handleLogout}>hihi</Button>

      <div className="flex gap-4 items-center">
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

        <AnimatedThemeToggler />
      </div>
    </div>
  );
};

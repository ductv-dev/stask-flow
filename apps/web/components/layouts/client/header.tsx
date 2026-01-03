"use client";

import { AnimatedThemeToggler } from "@workspace/ui/components/animated-theme-toggler";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import Image from "next/image";
import logo from "@workspace/ui/images/logo-taskflow.png";

import { logoutAction } from "@/actions/auth";

type Props = {};

export const HeaderClient: React.FC<Props> = ({}) => {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="  dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="justify-between max-w-7xl mx-auto flex items-center p-4  ">
        <Link href="/">
          <Image src={logo} width={100} height={40} alt="logo" />
        </Link>

        <div className="flex gap-4 items-center">
          <>
            <Link href={"/auth/sign-in"}>
              <Button
                variant={"ghost"}
                className="font-bold dark:text-white dark:hover:bg-slate-800"
              >
                Sign in
              </Button>
            </Link>
            <Link href={"/auth/sign-up"}>
              <Button className="bg-orange-600 hover:bg-orange-700 font-bold text-white">
                Try for free !!!
              </Button>
            </Link>
          </>

          <AnimatedThemeToggler duration={600} />
        </div>
      </div>
    </div>
  );
};

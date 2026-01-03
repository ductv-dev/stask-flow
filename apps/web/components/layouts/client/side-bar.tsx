"use client";

import { getProfile } from "@/actions/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { useState, useEffect } from "react";

type Props = {
  user?: Tuser | null;
};
type Tuser = {
  name: string;
  email: string;
  avatar: string;
};
export const SideBarClient: React.FC<Props> = ({}) => {
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
  return <>{user && <AppSidebar />}</>;
};

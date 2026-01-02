import { getProfile } from "@/actions/auth";
import { HeaderClient } from "./header";

export const Header = async () => {
  const user = await getProfile();

  return (
    <>
      <HeaderClient user={user} />
    </>
  );
};

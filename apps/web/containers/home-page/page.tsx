import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

type Props = {};

export const HomePage: React.FC<Props> = () => {
  return (
    <div className="max-w-7xl  mx-auto min-h-screen">
      <div className="justify-between flex items-center p-5">
        <h1 className="text-orange-600 text-3xl font-bold">Logo</h1>
        <div>menu bar</div>
      </div>

      <div className="p-10 w-full items-center flex justify-center">
        <Link href={"/auth/login"}>
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  );
};

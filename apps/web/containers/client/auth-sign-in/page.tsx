"use client";
import { loginAction } from "@/actions/auth";
import { LoginForm } from "@workspace/ui/components/login-form";
import { toast } from "@workspace/ui/lib/toast";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { loginWithGoogleAction } from "@/actions/auth";

type Props = {};
export const AuthSignIn: React.FC<Props> = () => {
  const sp = useSearchParams();
  useEffect(() => {
    if (sp.get("toast") === "signup_success")
      toast.success("Tạo tài khoản thành công! Mời bạn đăng nhập.");
  }, [sp]);
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          action={loginAction}
          loginWithGoogleAction={loginWithGoogleAction}
        />
      </div>
    </div>
  );
};

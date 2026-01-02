import { handleGoogleCallback } from "@/actions/auth"; // Đường dẫn tới file action của bạn
import { redirect } from "next/navigation";

export const GoogleCallbackPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) => {
  const params = await searchParams;
  const code = params.code;
  const error = params.error;

  if (error) {
    return <div>Đăng nhập thất bại: {error}</div>;
  }

  if (!code) {
    redirect("/auth/sign-in"); // Không có code thì quay về login
  }

  // Gọi Server Action để xử lý code
  const result = await handleGoogleCallback(code);

  // Nếu action trả về lỗi (do hàm redirect trong action chưa chạy kịp hoặc có lỗi api)
  if (result?.error) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
        <p className="text-red-500 font-bold">Lỗi: {result.error}</p>
        <a href="/auth/sign-in" className="underline">
          Quay lại đăng nhập
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Đang xử lý đăng nhập...</p>
    </div>
  );
};

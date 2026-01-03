import { HeaderClient } from "@/components/layouts/client/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderClient />
      <div className="flex-1">{children}</div>
    </>
  );
}

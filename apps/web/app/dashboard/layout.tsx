import { SideBarClient } from "@/components/layouts/client/side-bar";
import { SidebarProvider } from "@workspace/ui/components/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <SideBarClient />
        <div className="flex-1">{children}</div>
      </SidebarProvider>
    </>
  );
}

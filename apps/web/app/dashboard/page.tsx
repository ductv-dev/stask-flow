import { SplashOverlay } from "@/components/splash-overlay";
import { DashboardPage } from "@/containers/dashboard-page/page";

export default function Dashboard() {
  return (
    <div className="relative">
      <SplashOverlay durationMs={3000} />

      <DashboardPage />
    </div>
  );
}

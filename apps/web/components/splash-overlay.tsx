"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@workspace/ui/images/logo-taskflow.png";
import Image from "next/image";

type Props = {
  durationMs?: number; // mặc định 2000
  storageKey?: string; // để chỉ hiện 1 lần mỗi session (tuỳ chọn)
};

export function SplashOverlay({
  durationMs = 2000,
  storageKey = "dashboard_splash_shown",
}: Props) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(true);
    const t = window.setTimeout(() => setOpen(false), durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Logo */}
            <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <Image src={logo} alt="logo" className="h-10 w-10" />
            </div>

            {/* Spinner */}
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

            {/* Text nhỏ (tuỳ chọn) */}
            <div className="text-xs text-white/70">Đang tải...</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

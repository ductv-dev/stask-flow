"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PlayCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/ui/button";

export const Hero = () => {
  const [titleNumber, setTitleNumber] = useState(0);

  const titles = useMemo(
    () => ["organized", "fast", "clear", "focused", "smart"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [titles.length]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-10 lg:py-20">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              Read the Tasklow launch story <MoveRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-center text-5xl font-regular tracking-tighter md:text-7xl">
              <span className="text-spektr-cyan-50">
                Tasklow makes planning
              </span>

              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="max-w-2xl text-center text-lg leading-relaxed tracking-tight text-muted-foreground md:text-xl">
              Your tasks shouldn’t live in your head. Tasklow helps you capture
              to-dos in seconds, prioritize what matters, and track progress
              with a simple, delightful workflow—so you finish more and stress
              less.
            </p>
          </div>

          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline">
              Watch a quick demo <PlayCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

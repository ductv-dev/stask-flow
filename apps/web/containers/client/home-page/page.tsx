"use client";

import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/ui/button";
import { MoveRight, PlayCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { HeroGeometricBackground } from "@workspace/ui/components/ui/background-custom";

type Props = {};

export const HomePage: React.FC<Props> = () => {
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
    <HeroGeometricBackground>
      <div className="w-full">
        {/* FIX 1: Thêm px-4 để nội dung không dính sát mép màn hình mobile */}
        <div className="container mx-auto px-4 md:px-0">
          <div className="flex flex-col items-center justify-center gap-8 py-10 lg:py-20">
            <div>
              <Button
                variant="secondary"
                size="sm"
                className="gap-4 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                Read the Tasklow launch story <MoveRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-4 items-center">
              {/* FIX 2: Giảm cỡ chữ mobile (text-4xl), tăng dần lên (md:text-6xl, lg:text-7xl) */}
              <h1 className="max-w-2xl text-center text-4xl md:text-6xl lg:text-7xl font-regular tracking-tighter text-slate-900 dark:text-white">
                <span className="">Tasklow makes planning</span>

                <span className="relative flex w-full justify-center overflow-hidden text-center pb-2 md:pb-4 md:pt-1">
                  &nbsp;
                  {titles.map((title, index) => (
                    <motion.span
                      key={index}
                      className="absolute font-semibold text-slate-900 dark:text-white"
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

              <p className="max-w-2xl text-center text-lg leading-relaxed tracking-tight text-muted-foreground md:text-xl dark:text-slate-400">
                Your tasks shouldn’t live in your head. Tasklow helps you
                capture to-dos in seconds, prioritize what matters, and track
                progress with a simple, delightful workflow.
              </p>
            </div>

            {/* FIX 3: Layout nút bấm 
                - flex-col: Xếp dọc trên mobile
                - sm:flex-row: Xếp ngang trên màn hình lớn hơn
                - w-full sm:w-auto: Mobile nút dài 100%, Desktop nút tự động co lại
            */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                size="lg"
                className="gap-4 w-full sm:w-auto dark:text-white dark:border-slate-700 dark:hover:bg-slate-800"
                variant="outline"
              >
                Watch a quick demo <PlayCircle className="h-4 w-4" />
              </Button>

              <Link href={"/auth/sign-in"} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="gap-4 w-full bg-orange-600 hover:bg-orange-700 text-white dark:text-white"
                >
                  Get started <MoveRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </HeroGeometricBackground>
  );
};

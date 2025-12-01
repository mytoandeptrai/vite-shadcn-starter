"use client";

import { motion } from "framer-motion";
import type { FCC } from "@/types";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  reverse?: boolean;
}

export const AnimationContainer: FCC<Props> = ({
  children,
  delay,
  reverse,
  className,
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reverse ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{
        duration: 0.2,
        delay: delay,
        ease: "easeInOut",
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};


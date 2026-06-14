"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

const variantsEnter: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 1 },
};
export default function MotionMain({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.main
            className={className}
            variants={variantsEnter}
            initial={"initial"}
            animate={"animate"}
            exit={"exit"}
        >
            {children}
        </motion.main>
    );
}

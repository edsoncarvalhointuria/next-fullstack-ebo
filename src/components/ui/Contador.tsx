"use client";

import {
    animate,
    Easing,
    motion,
    useMotionValue,
    useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ContadorProps {
    tempo?: number;
    onEnd?: () => void;
    redirect?: string;
    ease?: Easing;
}
export default function Contador({
    tempo = 10,
    ease = "linear",
    onEnd,
    redirect,
}: ContadorProps) {
    const count = useMotionValue(tempo);
    const value = useTransform(count, (v) => Math.round(v));
    const router = useRouter();

    useEffect(() => {
        const animar = async () => {
            await animate(count, 0, { duration: tempo - 1, ease });

            if (redirect) router.replace(redirect);
            else if (onEnd) onEnd();
        };

        animar();
    }, []);
    return <motion.span>{value}</motion.span>;
}

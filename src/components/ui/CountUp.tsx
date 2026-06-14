"use client";

import { toCurrency } from "@/lib/toCurrency";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface CountUpProps {
    valor: number;
    type?: "currency" | "round" | "toFixed";
    duration?: number;
}
export default function CountUp({ valor, type, duration = 1 }: CountUpProps) {
    const value = useMotionValue(0);
    const valorTransformado = useTransform(value, (v) => {
        let valor;
        switch (type) {
            case "currency":
                valor = toCurrency(v);
                break;
            case "round":
                valor = Math.round(v);
                break;
            case "toFixed":
                valor = v.toFixed(2);
                break;
            default:
                valor = v;
        }

        return String(valor);
    });

    useEffect(() => {
        const animation = animate(value, valor, { duration });

        return () => animation.stop();
    }, [valor]);
    return <motion.span>{valorTransformado}</motion.span>;
}

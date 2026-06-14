"use client";

import {
    animate,
    motion,
    useMotionTemplate,
    useMotionValue,
    useTransform,
} from "framer-motion";
import { memo, useEffect } from "react";
import "./grafico-rosca.scss";

const GraficoRosca = memo(
    ({
        porcentagem,
        cor = "#3b82f6",
    }: {
        porcentagem: number | string;
        cor?: string;
    }) => {
        const porcento = useMotionValue(0);
        const porcentoValue = useTransform(porcento, (v) => v.toFixed(0));
        const background = useMotionTemplate`conic-gradient(${cor} ${porcento}%, color-mix(in srgb, var(--text-primary) 10%, transparent) 0%)`;

        useEffect(() => {
            const anim = animate(porcento, Number(porcentagem), {
                duration: 0.99,
                ease: "easeOut",
            });

            return () => anim.stop();
        }, [porcento, porcentoValue]);
        return (
            <motion.div className="grafico-rosca" style={{ background }}>
                <span className="grafico-rosca__texto">
                    <motion.span>{porcentoValue}</motion.span>%
                </span>
            </motion.div>
        );
    },
);

export default GraficoRosca;

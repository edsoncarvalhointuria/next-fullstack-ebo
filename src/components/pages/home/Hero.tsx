"use client";

import { motion, useAnimate, useScroll, useTransform } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import BotaoComprar from "../../ui/btns/BotaoComprar";
import { eventDetails } from "../../../../config/eventDetails";

export function Hero({ children }: { children: ReactNode }) {
    const [scope, animate] = useAnimate();
    const sectRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectRef,
        offset: ["end end", "end start"],
    });
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
    const y = useTransform(scrollYProgress, [0, 1], [0, -180]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

    useEffect(() => {
        const animar = async () => {
            await animate(
                ".title-animate",
                { opacity: 1, y: 0 },
                { duration: 0.8 },
            );

            // await new Promise((resolve) => setTimeout(resolve, 500));

            animate(
                ".subtitle-animate",
                { opacity: 1, y: 0 },
                { duration: 0.7, ease: "easeOut" },
            );
            animate(
                ".comprar-animate",
                { opacity: 1, y: 0 },
                { duration: 0.7, delay: 0.5, ease: "easeOut" },
            );
        };

        animar();
    }, [animate]);
    return (
        <motion.section className="home-hero" ref={sectRef} style={{ opacity }}>
            {children}

            <motion.div
                className="home-hero__infos"
                ref={scope}
                style={{ scale, y }}
            >
                <div className="home-hero__title-container">
                    <motion.h1
                        className="home-hero__title title-animate"
                        initial={{ opacity: 0, y: "100%" }}
                    >
                        19º EBO
                    </motion.h1>
                </div>

                <motion.p
                    className="home-hero__subtitle subtitle-animate"
                    initial={{ opacity: 0, y: -10 }}
                >
                    {/* Escola Bíblica de Obreiros.{" "} */}
                    <data value={eventDetails.data.toISOString()}>
                        {eventDetails.dia}
                    </data>
                </motion.p>
                <motion.div
                    className="comprar-animate"
                    initial={{ opacity: 0, y: 10 }}
                >
                    <BotaoComprar />
                </motion.div>
            </motion.div>
        </motion.section>
    );
}

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface DiaProps {
    img: string;
    nome: string;
    dia: number;
}

export function Dia({ img, nome, dia }: DiaProps) {
    const secaoRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: secaoRef,
        offset: ["center end", "end center"],
    });

    const xSombra1 = useTransform(scrollYProgress, [0, 1], [0, -25]);
    const xSombra2 = useTransform(scrollYProgress, [0, 1], [0, 25]);

    const ySombra1 = useTransform(scrollYProgress, [0, 1], [0, -8]);
    const ySombra2 = useTransform(scrollYProgress, [0, 1], [0, 20]);

    return (
        <section className="home-dia" ref={secaoRef}>
            <div className="home-dia__infos">
                <h2 className="home-dia__title">Dia {dia}</h2>
                <p className="home-dia__subtitle">{nome}</p>
                <div className="home-dia__theme__infos">
                    <p className="home-dia__theme">
                        Tema: O obreiro e os desafios da atualidade.
                    </p>
                    <span className="home-dia__versicle">2 Timoteo 4:5</span>
                </div>
            </div>

            <div className="home-dia__imgs">
                <motion.div
                    className="home-dia__img home-dia__img-placeholder"
                    style={{ x: xSombra1, y: ySombra1 }}
                >
                    <img src={img} alt={`imagem ${nome}`} />
                </motion.div>
                <motion.div
                    className="home-dia__img home-dia__img-placeholder"
                    style={{ x: xSombra2, y: ySombra2 }}
                >
                    <img src={img} alt={`imagem ${nome}`} />
                </motion.div>
                <div className="home-dia__img">
                    <img src={img} alt={`imagem ${nome}`} />
                </div>
            </div>
        </section>
    );
}

"use client";

import Link from "next/link";
import "./ingresso.scss";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MouseEvent, TouchEvent } from "react";
import isMobileDevice from "@/lib/isMobile";

export default function Ingresso({
    descricao,
    preco,
    quantidade_pessoas,
    nome_tipo,
    observacao,
    id,
}: IngressosInterface) {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const rotateX = useTransform(x, [0, 1], [5, -5]);
    const rotateY = useTransform(y, [0, 1], [-5, 5]);

    const setMotion = (e: MouseEvent | TouchEvent) => {
        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();

        const posX = ("touches" in e ? e.touches[0].clientX : e.clientX) - left;
        const posY = ("touches" in e ? e.touches[0].clientY : e.clientY) - top;

        const proporcaoX = posX * (1 / width);
        const proporcaoY = posY * (1 / height);

        x.set(proporcaoY);
        y.set(proporcaoX);
    };
    const resetMotion = () => {
        x.set(0.5);
        y.set(0.5);
    };

    return (
        <motion.div
            className="ingressos__ingresso"
            onMouseMove={!isMobileDevice() ? setMotion : undefined}
            onMouseLeave={!isMobileDevice() ? resetMotion : undefined}
            onTouchMove={setMotion}
            onTouchStart={setMotion}
            onTouchEnd={resetMotion}
            style={{ rotateY, rotateX, transformPerspective: 1000 }}
        >
            <span className="ingressos__ingresso-circle"></span>

            <div className="ingressos__ingresso-infos">
                <h2 className="ingressos__ingresso-title">{nome_tipo}</h2>

                <div className="ingressos__ingresso-body">
                    <h3 className="ingressos__ingresso-desc">{descricao}</h3>
                    <p>
                        Válido para <span>{quantidade_pessoas}</span> pessoa(s)
                    </p>
                </div>

                <div className="ingressos__ingresso-footer">
                    <strong className="ingressos__ingresso-price">
                        {preco.toLocaleString("pt-BR", {
                            currency: "BRL",
                            style: "currency",
                        })}
                    </strong>
                    {observacao && (
                        <p className="ingressos__ingresso-obs">{observacao}</p>
                    )}
                </div>
            </div>

            <Link
                href={`/checkout/${id}`}
                className="ingressos__ingresso-comprar"
            >
                Comprar
            </Link>
        </motion.div>
    );
}

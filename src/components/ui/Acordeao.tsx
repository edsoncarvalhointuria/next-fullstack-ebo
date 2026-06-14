"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React, { ReactNode, useState } from "react";
import "./acordeao.scss";

const variantsAcordeao: Variants = {
    initial: { height: 0 },
    animate: { height: "auto" },
    exit: { height: 0 },
};

const variantsArrow: Variants = {
    initial: { rotate: 0 },
    animate: (isOpen) => (isOpen ? { rotate: 180 } : { rotate: 0 }),
};

function Acordeao({
    className,
    pergunta,
    resposta,
}: {
    className?: string;
    pergunta: string;
    resposta: string | ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`${className} acordeao`}>
            <div
                className="acordeao__pergunta"
                onClick={() => setIsOpen((v) => !v)}
            >
                <h3>{pergunta}</h3>

                <motion.i
                    custom={isOpen}
                    variants={variantsArrow}
                    initial="initial"
                    animate="animate"
                >
                    <ChevronDown size={24} />
                </motion.i>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key={pergunta}
                        variants={variantsAcordeao}
                        onClick={(evt) => evt.stopPropagation()}
                        style={{ overflow: "hidden" }}
                        initial={"initial"}
                        animate="animate"
                        exit={"exit"}
                    >
                        <div className="acordeao__resposta">
                            {typeof resposta === "string" ? (
                                <p>{resposta}</p>
                            ) : (
                                resposta
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default React.memo(Acordeao);
